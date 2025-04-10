import type { Express } from 'express';
import { createServer, type Server } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import Stripe from 'stripe';
import { setupAuth } from './auth';
import { storage } from './storage';
import { log } from './vite';

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  log('Warning: STRIPE_SECRET_KEY not found in environment variables');
}

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16' as any,
    })
  : null;

// Store connected WebSocket clients
const clients: Set<WebSocket> = new Set();

/**
 * Register API routes and create HTTP server
 */
export function registerRoutes(app: Express): Server {
  // Setup auth routes (/api/register, /api/login, /api/logout, /api/user)
  setupAuth(app);

  // Get user wallet
  app.get('/api/wallet', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
      const wallet = await storage.getWalletByUserId(req.user.id);
      if (!wallet) {
        return res.status(404).json({ error: 'Wallet not found' });
      }
      return res.json(wallet);
    } catch (error) {
      log(`Error fetching wallet: ${error instanceof Error ? error.message : String(error)}`);
      return res.status(500).json({ error: 'Failed to fetch wallet' });
    }
  });

  // Get user loans
  app.get('/api/loans', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
      const loans = await storage.getUserLoans(req.user.id);
      return res.json(loans);
    } catch (error) {
      log(`Error fetching loans: ${error instanceof Error ? error.message : String(error)}`);
      return res.status(500).json({ error: 'Failed to fetch loans' });
    }
  });

  // Create a new loan
  app.post('/api/loans', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
      const loanData = {
        userId: req.user.id,
        amount: req.body.amount,
        interestRate: req.body.interestRate,
        termDays: req.body.termDays,
        status: 'pending',
        originationFee: '0',
        repaidAmount: '0',
        collateralRequired: req.body.collateralRequired,
      };

      const loan = await storage.createLoan(loanData);
      
      // Broadcast loan application via WebSocket
      broadcast({
        type: 'loan_application',
        data: {
          loanId: loan.id,
          userId: req.user.id,
          username: req.user.username,
          amount: loan.amount,
        },
      });
      
      return res.status(201).json(loan);
    } catch (error) {
      log(`Error creating loan: ${error instanceof Error ? error.message : String(error)}`);
      return res.status(500).json({ error: 'Failed to create loan' });
    }
  });

  // Get user collaterals
  app.get('/api/collaterals', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
      const collaterals = await storage.getUserCollaterals(req.user.id);
      return res.json(collaterals);
    } catch (error) {
      log(`Error fetching collaterals: ${error instanceof Error ? error.message : String(error)}`);
      return res.status(500).json({ error: 'Failed to fetch collaterals' });
    }
  });

  // Create a new collateral
  app.post('/api/collaterals', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
      // Get the loan to check ownership
      const loan = await storage.getLoan(req.body.loanId);
      
      if (!loan) {
        return res.status(404).json({ error: 'Loan not found' });
      }
      
      if (loan.userId !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized to add collateral to this loan' });
      }
      
      const collateralData = {
        userId: req.user.id,
        loanId: req.body.loanId,
        collateralType: req.body.collateralType,
        amount: req.body.amount,
        valueInNpt: req.body.valueInNpt,
        valueToLoanRatio: req.body.valueToLoanRatio,
        status: 'locked',
      };

      const collateral = await storage.createCollateral(collateralData);
      
      // Broadcast collateral creation via WebSocket
      broadcast({
        type: 'collateral_locked',
        data: {
          collateralId: collateral.id,
          loanId: collateral.loanId,
          userId: req.user.id,
          collateralType: collateral.collateralType,
          amount: collateral.amount,
        },
      });
      
      return res.status(201).json(collateral);
    } catch (error) {
      log(`Error creating collateral: ${error instanceof Error ? error.message : String(error)}`);
      return res.status(500).json({ error: 'Failed to create collateral' });
    }
  });

  // Get user transactions
  app.get('/api/transactions', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
      const transactions = await storage.getUserTransactions(req.user.id);
      return res.json(transactions);
    } catch (error) {
      log(`Error fetching transactions: ${error instanceof Error ? error.message : String(error)}`);
      return res.status(500).json({ error: 'Failed to fetch transactions' });
    }
  });

  // Get user activities
  app.get('/api/activities', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
      const activities = await storage.getUserActivities(req.user.id);
      return res.json(activities);
    } catch (error) {
      log(`Error fetching activities: ${error instanceof Error ? error.message : String(error)}`);
      return res.status(500).json({ error: 'Failed to fetch activities' });
    }
  });

  // These were duplicated - routes already defined above

  // Get active ads
  app.get('/api/ads', async (req, res) => {
    try {
      const ads = await storage.getActiveAds();
      return res.json(ads);
    } catch (error) {
      log(`Error fetching ads: ${error instanceof Error ? error.message : String(error)}`);
      return res.status(500).json({ error: 'Failed to fetch ads' });
    }
  });

  // Ad impression endpoint
  app.post('/api/ads/:id/impression', async (req, res) => {
    try {
      const adId = parseInt(req.params.id, 10);
      if (isNaN(adId)) {
        return res.status(400).json({ error: 'Invalid ad ID' });
      }

      const ad = await storage.incrementAdImpressions(adId);
      if (!ad) {
        return res.status(404).json({ error: 'Ad not found' });
      }

      return res.json({ success: true, impressions: ad.impressions });
    } catch (error) {
      log(`Error recording ad impression: ${error instanceof Error ? error.message : String(error)}`);
      return res.status(500).json({ error: 'Failed to record impression' });
    }
  });

  // Ad click endpoint
  app.post('/api/ads/:id/click', async (req, res) => {
    try {
      const adId = parseInt(req.params.id, 10);
      if (isNaN(adId)) {
        return res.status(400).json({ error: 'Invalid ad ID' });
      }

      const ad = await storage.incrementAdClicks(adId);
      if (!ad) {
        return res.status(404).json({ error: 'Ad not found' });
      }

      return res.json({ success: true, clicks: ad.clicks });
    } catch (error) {
      log(`Error recording ad click: ${error instanceof Error ? error.message : String(error)}`);
      return res.status(500).json({ error: 'Failed to record click' });
    }
  });

  // Create Stripe payment intent for purchasing NPT tokens
  app.post('/api/create-payment-intent', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!stripe) {
      return res.status(500).json({ error: 'Stripe not configured' });
    }

    try {
      const { amount, currency = 'usd' } = req.body;
      
      if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
      }

      // Create a PaymentIntent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(parseFloat(amount) * 100), // Convert to cents
        currency: currency.toLowerCase(),
        metadata: { 
          userId: req.user.id.toString(),
          tokenAmount: amount,
          type: 'token_purchase'
        },
      });

      // Create a pending transaction
      const transaction = await storage.createTransaction({
        senderId: null, // System/treasury
        receiverId: req.user.id,
        amount: amount.toString(),
        currency: 'NPT',
        type: 'deposit',
        status: 'pending',
        txHash: null,
        description: 'NPT token purchase via Stripe',
        note: `Purchase of ${amount} NPT tokens via Stripe`,
        stripePaymentId: paymentIntent.id,
      });

      // Record activity
      await storage.createActivity({
        userId: req.user.id,
        action: 'transaction',
        description: 'Started NPT token purchase',
        ipAddress: null,
        userAgent: null,
      });

      // Return client secret to complete payment on the client
      return res.json({ 
        clientSecret: paymentIntent.client_secret,
        transactionId: transaction.id
      });
    } catch (error) {
      log(`Error creating payment intent: ${error instanceof Error ? error.message : String(error)}`);
      return res.status(500).json({ error: 'Failed to create payment intent' });
    }
  });

  // Webhook endpoint to handle Stripe events
  app.post('/api/webhook/stripe', async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ error: 'Stripe not configured' });
    }

    const sig = req.headers['stripe-signature'];
    if (!sig || typeof sig !== 'string') {
      return res.status(400).json({ error: 'Missing stripe-signature header' });
    }

    // Stripe webhook secret should be set in environment variables
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!endpointSecret) {
      return res.status(500).json({ error: 'Stripe webhook secret not configured' });
    }

    try {
      // Verify and extract the event
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        endpointSecret
      );

      // Handle the event
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          await handleSuccessfulPayment(paymentIntent);
          break;
        
        case 'payment_intent.payment_failed':
          const failedPayment = event.data.object;
          await handleFailedPayment(failedPayment);
          break;
        
        // Add more event handlers as needed
        
        default:
          log(`Unhandled Stripe event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      log(`Stripe webhook error: ${error instanceof Error ? error.message : String(error)}`);
      return res.status(400).json({ error: 'Webhook error' });
    }
  });

  // These routes are already defined above

  // Create HTTP server
  const httpServer = createServer(app);

  // Create WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws) => {
    // Add client to set
    clients.add(ws);
    log('WebSocket client connected');

    // Handle messages from client
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        log(`Received WebSocket message: ${JSON.stringify(data)}`);
        
        // Handle different message types
        if (data.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
        }
      } catch (error) {
        log(`WebSocket message error: ${error instanceof Error ? error.message : String(error)}`);
      }
    });

    // Handle client disconnect
    ws.on('close', () => {
      clients.delete(ws);
      log('WebSocket client disconnected');
    });

    // Send welcome message
    ws.send(JSON.stringify({ type: 'welcome', message: 'Connected to NepaliPay WebSocket server' }));
  });

  return httpServer;
}

/**
 * Broadcast a message to all connected WebSocket clients
 */
function broadcast(data: any): void {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

/**
 * Handle successful Stripe payment
 */
async function handleSuccessfulPayment(paymentIntent: any): Promise<void> {
  try {
    const { userId, tokenAmount, type } = paymentIntent.metadata || {};
    
    if (!userId || !tokenAmount || type !== 'token_purchase') {
      log(`Invalid payment intent metadata: ${JSON.stringify(paymentIntent.metadata)}`);
      return;
    }

    // Find pending transaction
    const transactions = await storage.getUserTransactions(parseInt(userId, 10));
    const transaction = transactions.find(
      (t) => t.status === 'pending' && 
             t.stripePaymentId === paymentIntent.id
    );

    if (!transaction) {
      log(`No matching transaction found for payment intent: ${paymentIntent.id}`);
      return;
    }

    // Update transaction status
    await storage.updateTransaction(transaction.id, {
      status: 'completed',
      txHash: paymentIntent.id,  // Use Stripe payment ID as tx hash
    });

    // Update wallet balance
    const wallet = await storage.getWalletByUserId(parseInt(userId, 10));
    if (wallet) {
      await storage.updateWalletBalance(
        parseInt(userId, 10),
        'NPT',
        parseFloat(tokenAmount)
      );
    }

    // Record activity
    await storage.createActivity({
      userId: parseInt(userId, 10),
      action: 'transaction',
      description: 'NPT token purchase completed',
      ipAddress: null,
      userAgent: null,
    });

    // Broadcast to WebSocket clients
    broadcast({
      type: 'transaction_completed',
      data: { 
        transactionId: transaction.id,
        userId: parseInt(userId, 10)
      },
    });

    log(`Successfully processed payment for token purchase: ${paymentIntent.id}`);
  } catch (error) {
    log(`Error handling successful payment: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Handle failed Stripe payment
 */
async function handleFailedPayment(paymentIntent: any): Promise<void> {
  try {
    const { userId, type } = paymentIntent.metadata || {};
    
    if (!userId || type !== 'token_purchase') {
      log(`Invalid payment intent metadata: ${JSON.stringify(paymentIntent.metadata)}`);
      return;
    }

    // Find pending transaction
    const transactions = await storage.getUserTransactions(parseInt(userId, 10));
    const transaction = transactions.find(
      (t) => t.status === 'pending' && 
             t.stripePaymentId === paymentIntent.id
    );

    if (!transaction) {
      log(`No matching transaction found for failed payment intent: ${paymentIntent.id}`);
      return;
    }

    // Update transaction status
    await storage.updateTransaction(transaction.id, {
      status: 'failed',
    });

    // Record activity
    await storage.createActivity({
      userId: parseInt(userId, 10),
      action: 'transaction',
      description: 'NPT token purchase failed',
      ipAddress: null,
      userAgent: null,
    });

    // Broadcast to WebSocket clients
    broadcast({
      type: 'transaction_failed',
      data: { 
        transactionId: transaction.id,
        userId: parseInt(userId, 10),
        error: paymentIntent.last_payment_error?.message || 'Payment failed'
      },
    });

    log(`Processed failed payment: ${paymentIntent.id}`);
  } catch (error) {
    log(`Error handling failed payment: ${error instanceof Error ? error.message : String(error)}`);
  }
}