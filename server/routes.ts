import { Express } from "express";
import { Server, createServer } from "http";
import { WebSocketServer } from "ws";
import Stripe from "stripe";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isAdmin, isSuperAdmin } from "./auth";
import { transactions, tokenPurchases, users } from "../shared/schema";
import { eq } from "drizzle-orm";
import { db } from "./db";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Missing Stripe secret key, Stripe integration will not work');
}

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export function registerRoutes(app: Express): Server {
  // Set up authentication routes
  setupAuth(app);

  // Create HTTP server
  const httpServer = createServer(app);

  // Create WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // Handle WebSocket connections
  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received message:', data);
        
        // Handle different message types
        if (data.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });
  });

  // Function to broadcast updates to all connected clients
  const broadcastUpdate = (data: any) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  };

  // User routes
  app.get("/api/wallets/:userId", isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Users can only access their own wallet
      if (req.user.id !== userId && req.user.role !== 'admin' && req.user.role !== 'superadmin') {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const wallet = await storage.getWalletByUserId(userId);
      
      if (!wallet) {
        return res.status(404).json({ message: "Wallet not found" });
      }
      
      res.json(wallet);
    } catch (error) {
      console.error('Error fetching wallet:', error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/transactions/:userId", isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Users can only access their own transactions
      if (req.user.id !== userId && req.user.role !== 'admin' && req.user.role !== 'superadmin') {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const transactions = await storage.getTransactionsByUserId(userId, limit);
      
      res.json(transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/activities/:userId", isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Users can only access their own activities
      if (req.user.id !== userId && req.user.role !== 'admin' && req.user.role !== 'superadmin') {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const activities = await storage.getActivitiesByUserId(userId, limit);
      
      res.json(activities);
    } catch (error) {
      console.error('Error fetching activities:', error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/loans/:userId", isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Users can only access their own loans
      if (req.user.id !== userId && req.user.role !== 'admin' && req.user.role !== 'superadmin') {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const loans = await storage.getLoansByUserId(userId);
      
      res.json(loans);
    } catch (error) {
      console.error('Error fetching loans:', error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/collaterals/:userId", isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Users can only access their own collaterals
      if (req.user.id !== userId && req.user.role !== 'admin' && req.user.role !== 'superadmin') {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const collaterals = await storage.getCollateralsByUserId(userId);
      
      res.json(collaterals);
    } catch (error) {
      console.error('Error fetching collaterals:', error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/ads", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const ads = await storage.getActiveAds(limit);
      
      res.json(ads);
    } catch (error) {
      console.error('Error fetching ads:', error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/user-ads/:userId", isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Users can only access their own ads
      if (req.user.id !== userId && req.user.role !== 'admin' && req.user.role !== 'superadmin') {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const ads = await storage.getAdsByUserId(userId);
      
      res.json(ads);
    } catch (error) {
      console.error('Error fetching user ads:', error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Stripe integration for buying tokens
  
  app.get("/api/transaction-fee", async (req, res) => {
    try {
      const fee = await storage.getTransactionFee();
      
      if (!fee) {
        return res.status(404).json({ message: "Transaction fee not configured" });
      }
      
      res.json(fee);
    } catch (error) {
      console.error('Error fetching transaction fee:', error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/calculate-token-price", async (req, res) => {
    try {
      const { tokenAmount } = req.body;
      
      if (!tokenAmount || typeof tokenAmount !== 'number' || tokenAmount <= 0) {
        return res.status(400).json({ message: "Invalid token amount" });
      }
      
      const fee = await storage.getTransactionFee();
      
      if (!fee) {
        return res.status(404).json({ message: "Transaction fee not configured" });
      }
      
      // Calculate fiat amount based on exchange rate
      const fiatAmount = tokenAmount * fee.exchangeRate;
      
      // Calculate gas fee in fiat currency
      const gasFeeAmount = fee.gasFeeUSD;
      
      // Calculate service fee (percentage of fiat amount)
      const serviceFeeAmount = fiatAmount * (fee.serviceFeePercent / 100);
      
      // Calculate total amount
      const totalAmount = fiatAmount + gasFeeAmount + serviceFeeAmount;
      
      res.json({
        tokenAmount,
        fiatAmount,
        gasFeeAmount,
        serviceFeePercent: fee.serviceFeePercent,
        serviceFeeAmount,
        totalAmount,
        currency: fee.fiatCurrency,
        exchangeRate: fee.exchangeRate
      });
    } catch (error) {
      console.error('Error calculating token price:', error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/create-payment-intent", isAuthenticated, async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ message: "Stripe is not configured" });
      }
      
      const { tokenAmount } = req.body;
      
      if (!tokenAmount || typeof tokenAmount !== 'number' || tokenAmount <= 0) {
        return res.status(400).json({ message: "Invalid token amount" });
      }
      
      const fee = await storage.getTransactionFee();
      
      if (!fee) {
        return res.status(404).json({ message: "Transaction fee not configured" });
      }
      
      // Calculate fiat amount based on exchange rate
      const fiatAmount = tokenAmount * fee.exchangeRate;
      
      // Calculate gas fee in fiat currency
      const gasFeeAmount = fee.gasFeeUSD;
      
      // Calculate service fee (percentage of fiat amount)
      const serviceFeeAmount = fiatAmount * (fee.serviceFeePercent / 100);
      
      // Calculate total amount in cents
      const amountInCents = Math.round((fiatAmount + gasFeeAmount + serviceFeeAmount) * 100);
      
      // Create a PaymentIntent with the calculated amount
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: fee.fiatCurrency.toLowerCase(),
        metadata: {
          userId: req.user.id.toString(),
          tokenAmount: tokenAmount.toString(),
          fiatAmount: fiatAmount.toString(),
          gasFeeAmount: gasFeeAmount.toString(),
          serviceFeeAmount: serviceFeeAmount.toString()
        }
      });
      
      // Create a token purchase record
      await storage.createTokenPurchase({
        userId: req.user.id,
        tokenAmount,
        fiatAmount,
        fiatCurrency: fee.fiatCurrency,
        stripePaymentIntentId: paymentIntent.id,
        status: 'pending',
        gasFee: gasFeeAmount,
        serviceFee: serviceFeeAmount
      });
      
      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error) {
      console.error('Error creating payment intent:', error);
      res.status(500).json({ message: "Failed to create payment intent" });
    }
  });
  
  // Stripe webhook handler
  app.post("/api/stripe-webhook", async (req, res) => {
    let event;
    
    try {
      if (!stripe) {
        return res.status(500).json({ message: "Stripe is not configured" });
      }
      
      const payload = req.body;
      const signature = req.headers['stripe-signature'] as string;
      
      if (!process.env.STRIPE_WEBHOOK_SECRET) {
        return res.status(500).json({ message: "Stripe webhook secret is not configured" });
      }
      
      try {
        event = stripe.webhooks.constructEvent(
          payload,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return res.status(400).send('Webhook signature verification failed');
      }
      
      // Handle the event
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          const { userId, tokenAmount } = paymentIntent.metadata;
          
          // Update token purchase status
          const purchase = await storage.getTokenPurchaseByPaymentIntent(paymentIntent.id);
          
          if (purchase) {
            // Update purchase status
            await storage.updateTokenPurchaseStatus(purchase.id, 'completed');
            
            // Get user's wallet
            const wallet = await storage.getWalletByUserId(parseInt(userId));
            
            if (wallet) {
              // Update wallet balance
              const newBalance = wallet.balance + parseFloat(tokenAmount);
              await storage.updateWalletBalance(wallet.id, newBalance);
              
              // Create a transaction record
              const transaction = await storage.createTransaction({
                senderId: null, // system/treasury
                receiverId: parseInt(userId),
                amount: parseFloat(tokenAmount),
                type: 'deposit',
                status: 'completed',
                description: 'Token purchase via Stripe',
                fee: purchase.serviceFee + purchase.gasFee
              });
              
              // Broadcast update to WebSocket clients
              broadcastUpdate({
                type: 'transaction',
                userId: parseInt(userId),
                transaction
              });
            }
          }
          
          break;
          
        case 'payment_intent.payment_failed':
          const failedPaymentIntent = event.data.object;
          
          // Update token purchase status
          const failedPurchase = await storage.getTokenPurchaseByPaymentIntent(failedPaymentIntent.id);
          
          if (failedPurchase) {
            await storage.updateTokenPurchaseStatus(failedPurchase.id, 'failed');
          }
          
          break;
          
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
      
      res.json({ received: true });
    } catch (error) {
      console.error('Error handling Stripe webhook:', error);
      res.status(500).json({ message: 'Webhook handler failed' });
    }
  });

  // Admin routes
  app.get("/api/admin/users", isAdmin, async (req, res) => {
    try {
      // For a real app, we would add pagination
      const usersList = await db.select().from(users);
      res.json(usersList);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.get("/api/admin/transactions", isAdmin, async (req, res) => {
    try {
      // For a real app, we would add pagination
      const transactionsList = await db.select().from(transactions);
      res.json(transactionsList);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/admin/transaction-fee", isAdmin, async (req, res) => {
    try {
      const { 
        tokenAmount, 
        fiatAmount, 
        gasFeeUSD,
        serviceFeePercent,
        totalFiatAmount,
        exchangeRate,
        fiatCurrency
      } = req.body;
      
      // Validate required fields
      if (!tokenAmount || !fiatAmount || !gasFeeUSD || !totalFiatAmount || !exchangeRate || !fiatCurrency) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const fee = await storage.upsertTransactionFee({
        tokenAmount,
        fiatAmount,
        gasFeeUSD,
        serviceFeePercent: serviceFeePercent || 2,
        totalFiatAmount,
        exchangeRate,
        fiatCurrency
      });
      
      res.json(fee);
    } catch (error) {
      console.error('Error updating transaction fee:', error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // SuperAdmin routes
  app.get("/api/superadmin/token-purchases", isSuperAdmin, async (req, res) => {
    try {
      const purchases = await db.select().from(tokenPurchases);
      res.json(purchases);
    } catch (error) {
      console.error('Error fetching token purchases:', error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Return the HTTP server
  return httpServer;
}