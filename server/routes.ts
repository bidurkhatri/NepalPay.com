import { Express, Request, Response } from 'express';
import { createServer, Server } from 'http';
import Stripe from 'stripe';
import { WebSocketServer } from 'ws';
import { db } from './db';
import { setupAuth, isAuthenticated, isAdmin, isSuperAdmin } from './auth';
import { eq } from 'drizzle-orm';
import { users, wallets, transactions, activities, tokenPurchases, transactionFees } from '@shared/schema';

// Initialize Stripe
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, { apiVersion: '2023-10-16' }) : null;

export function registerRoutes(app: Express): Server {
  // Set up authentication routes
  setupAuth(app);

  // Create HTTP server
  const httpServer = createServer(app);

  // Create WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // WebSocket connection handler
  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');

    // Send a welcome message
    ws.send(JSON.stringify({
      type: 'connection',
      message: 'Connected to NepaliPay WebSocket server',
    }));

    // Handle messages from client
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received message:', data);
        
        // Handle message types
        switch (data.type) {
          case 'ping':
            ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
            break;
          default:
            ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }));
        }
      } catch (error) {
        console.error('WebSocket error:', error);
        ws.send(JSON.stringify({ type: 'error', message: 'Failed to process message' }));
      }
    });

    // Handle disconnection
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  // Broadcast to all connected clients
  function broadcast(data: any) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }

  // Helper function to validate UUID
  function isValidUUID(uuid: string) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  // ----- API Routes -----

  // Get wallet balance
  app.get('/api/wallet', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userWallets = await db
        .select()
        .from(wallets)
        .where(eq(wallets.userId, req.user.id));

      res.json(userWallets);
    } catch (error) {
      console.error('Error getting wallet:', error);
      res.status(500).json({ message: 'Failed to get wallet information' });
    }
  });

  // Get transaction history
  app.get('/api/transactions', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userTransactions = await db
        .select()
        .from(transactions)
        .where(eq(transactions.senderId, req.user.id))
        .orderBy((transactions) => [transactions.createdAt]);

      res.json(userTransactions);
    } catch (error) {
      console.error('Error getting transactions:', error);
      res.status(500).json({ message: 'Failed to get transaction history' });
    }
  });

  // Create Stripe Payment Intent for buying NPT tokens
  app.post('/api/create-payment-intent', isAuthenticated, async (req: Request, res: Response) => {
    if (!stripe) {
      return res.status(500).json({ message: 'Stripe is not configured' });
    }

    try {
      const { amount } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: 'Invalid amount' });
      }

      // Calculate fees
      const tokenPrice = 1; // 1 NPT = 1 NPR (pegged)
      const gasFee = 0.05; // $0.05 gas fee (this would be dynamic in a real application)
      const serviceFee = amount * 0.02; // 2% service fee
      const totalAmount = amount + gasFee + serviceFee;
      
      // Create a payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalAmount * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          userId: req.user.id.toString(),
          tokenAmount: amount.toString(),
        },
      });

      // Create a pending token purchase record
      await db.insert(tokenPurchases).values({
        userId: req.user.id,
        amount,
        tokenPrice,
        gasFee,
        serviceFee,
        totalAmount,
        stripePaymentId: paymentIntent.id,
        status: 'pending',
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
        amount,
        gasFee,
        serviceFee,
        totalAmount,
      });
    } catch (error) {
      console.error('Error creating payment intent:', error);
      res.status(500).json({ message: 'Failed to create payment' });
    }
  });

  // Stripe webhook
  app.post('/api/webhook', async (req: Request, res: Response) => {
    if (!stripe) {
      return res.status(500).json({ message: 'Stripe is not configured' });
    }

    const sig = req.headers['stripe-signature'] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!endpointSecret) {
      return res.status(500).json({ message: 'Webhook secret is not configured' });
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        
        try {
          // Update the token purchase record
          const purchases = await db
            .select()
            .from(tokenPurchases)
            .where(eq(tokenPurchases.stripePaymentId, paymentIntent.id));
          
          if (purchases.length === 0) {
            console.error('Token purchase not found for payment:', paymentIntent.id);
            return res.status(400).json({ message: 'Token purchase not found' });
          }
          
          const purchase = purchases[0];
          
          // Update purchase status
          await db
            .update(tokenPurchases)
            .set({ status: 'completed', updatedAt: new Date() })
            .where(eq(tokenPurchases.id, purchase.id));
          
          // Add tokens to user's wallet
          const userWallets = await db
            .select()
            .from(wallets)
            .where(eq(wallets.userId, purchase.userId))
            .where(eq(wallets.currency, 'NPT'));
          
          if (userWallets.length === 0) {
            // Create a new wallet if the user doesn't have one
            await db.insert(wallets).values({
              userId: purchase.userId,
              currency: 'NPT',
              address: `npt_${purchase.userId}_${Date.now()}`, // Generate a simple wallet address
              balance: purchase.amount,
              isPrimary: true,
            });
          } else {
            // Update existing wallet
            const wallet = userWallets[0];
            const newBalance = Number(wallet.balance) + Number(purchase.amount);
            
            await db
              .update(wallets)
              .set({ balance: newBalance.toString(), updatedAt: new Date() })
              .where(eq(wallets.id, wallet.id));
          }
          
          // Record transaction
          const [transaction] = await db
            .insert(transactions)
            .values({
              type: 'deposit',
              receiverId: purchase.userId,
              amount: purchase.amount,
              currency: 'NPT',
              status: 'completed',
              stripePaymentId: paymentIntent.id,
              description: 'Token purchase via Stripe',
            })
            .returning();
          
          // Record transaction fee
          await db.insert(transactionFees).values({
            transactionId: transaction.id,
            amount: purchase.serviceFee,
            currency: 'USD',
            receivedBy: 'NepaliPay', // Platform
          });
          
          // Record activity
          await db.insert(activities).values({
            userId: purchase.userId,
            type: 'payment',
            details: `Purchased ${purchase.amount} NPT tokens`,
          });
          
          // Notify connected clients about the successful purchase
          broadcast({
            type: 'token_purchase',
            userId: purchase.userId,
            amount: purchase.amount,
            status: 'completed',
          });
        } catch (error) {
          console.error('Error processing payment success:', error);
        }
        break;
        
      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object;
        
        try {
          // Update the token purchase record
          await db
            .update(tokenPurchases)
            .set({ status: 'failed', updatedAt: new Date() })
            .where(eq(tokenPurchases.stripePaymentId, failedPaymentIntent.id));
        } catch (error) {
          console.error('Error processing payment failure:', error);
        }
        break;
        
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.json({ received: true });
  });

  // ----- Admin Routes -----
  
  // Admin: Get all users
  app.get('/api/admin/users', isAdmin, async (req: Request, res: Response) => {
    try {
      const allUsers = await db
        .select({
          id: users.id,
          username: users.username,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          role: users.role,
          createdAt: users.createdAt,
        })
        .from(users)
        .orderBy(users.id);
      
      res.json(allUsers);
    } catch (error) {
      console.error('Error getting users:', error);
      res.status(500).json({ message: 'Failed to get users' });
    }
  });

  // Admin: Get all transactions
  app.get('/api/admin/transactions', isAdmin, async (req: Request, res: Response) => {
    try {
      const allTransactions = await db
        .select()
        .from(transactions)
        .orderBy((transactions) => [transactions.createdAt]);
      
      res.json(allTransactions);
    } catch (error) {
      console.error('Error getting transactions:', error);
      res.status(500).json({ message: 'Failed to get transactions' });
    }
  });

  // ----- Super Admin Routes -----
  
  // Super Admin: Update user role
  app.patch('/api/superadmin/users/:id/role', isSuperAdmin, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const { role } = req.body;
      
      if (!role || !['user', 'admin', 'superadmin'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
      }
      
      const [updatedUser] = await db
        .update(users)
        .set({ role, updatedAt: new Date() })
        .where(eq(users.id, userId))
        .returning();
      
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json(updatedUser);
    } catch (error) {
      console.error('Error updating user role:', error);
      res.status(500).json({ message: 'Failed to update user role' });
    }
  });

  return httpServer;
}