import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import { z } from "zod";
import { insertUserSchema, insertTransactionSchema, insertActivitySchema } from "@shared/schema";
import MemoryStore from "memorystore";
import Stripe from "stripe";

// Extend Express.Session to include userId
declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}

const SessionStore = MemoryStore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session
  app.use(
    session({
      store: new SessionStore({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
      secret: process.env.SESSION_SECRET || "nepali-pay-secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  // Authentication middleware
  const requireAuth = (req: Request, res: Response, next: Function) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // Auth routes
  app.post("/api/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(validatedData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      // Create user
      const user = await storage.createUser(validatedData);
      
      // Create wallet for user
      await storage.createWallet({
        userId: user.id,
        balance: "0",
        currency: "NPR"
      });
      
      // Create activity log
      await storage.createActivity({
        userId: user.id,
        action: "REGISTER",
        details: "Account created",
        ipAddress: req.ip
      });
      
      // Set session
      req.session.userId = user.id;
      
      // Return user data (excluding password)
      const { password, ...userData } = user;
      res.status(201).json(userData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        // Log failed login attempt
        if (user) {
          await storage.createActivity({
            userId: user.id,
            action: "FAILED_LOGIN",
            details: "Failed login attempt",
            ipAddress: req.ip
          });
        }
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Set session
      req.session.userId = user.id;
      
      // Log successful login
      await storage.createActivity({
        userId: user.id,
        action: "LOGIN",
        details: "User logged in",
        ipAddress: req.ip
      });
      
      // Return user data (excluding password)
      const { password: _, ...userData } = user;
      res.json(userData);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/logout", requireAuth, (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/user", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Return user data (excluding password)
      const { password, ...userData } = user;
      res.json(userData);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Wallet routes
  app.get("/api/wallet", requireAuth, async (req, res) => {
    try {
      const wallet = await storage.getWalletByUserId(req.session.userId!);
      
      if (!wallet) {
        return res.status(404).json({ message: "Wallet not found" });
      }
      
      res.json(wallet);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/wallet", requireAuth, async (req, res) => {
    try {
      // Check if a wallet already exists for this user
      const existingWallet = await storage.getWalletByUserId(req.session.userId!);
      
      if (existingWallet) {
        return res.status(400).json({ message: "User already has a wallet" });
      }
      
      // Create wallet
      const walletData = {
        userId: req.session.userId!,
        balance: req.body.balance || "0",
        currency: req.body.currency || "NPR"
      };
      
      const wallet = await storage.createWallet(walletData);
      
      // Log activity
      await storage.createActivity({
        userId: req.session.userId!,
        action: "WALLET_CREATED",
        details: "Wallet was initialized",
        ipAddress: req.ip
      });
      
      res.status(201).json(wallet);
    } catch (error) {
      console.error("Error creating wallet:", error);
      res.status(500).json({ message: "Failed to create wallet" });
    }
  });

  // Transaction routes
  app.get("/api/transactions", requireAuth, async (req, res) => {
    try {
      const transactions = await storage.getUserTransactions(req.session.userId!);
      
      // Enrich transactions with user data
      const enrichedTransactions = await Promise.all(
        transactions.map(async (transaction) => {
          let sender = null;
          let receiver = null;
          
          if (transaction.senderId) {
            const senderData = await storage.getUser(transaction.senderId);
            if (senderData) {
              const { password, ...userData } = senderData;
              sender = userData;
            }
          }
          
          if (transaction.receiverId) {
            const receiverData = await storage.getUser(transaction.receiverId);
            if (receiverData) {
              const { password, ...userData } = receiverData;
              receiver = userData;
            }
          }
          
          return {
            ...transaction,
            sender,
            receiver
          };
        })
      );
      
      res.json(enrichedTransactions);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/transactions", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      
      // Validate transaction data
      const transactionData = {
        ...req.body,
        senderId: userId,
      };
      
      const validatedData = insertTransactionSchema.parse(transactionData);
      
      // Check sender wallet
      const senderWallet = await storage.getWalletByUserId(userId);
      if (!senderWallet) {
        return res.status(404).json({ message: "Sender wallet not found" });
      }
      
      // Check balance for sufficient funds
      const amount = parseFloat(validatedData.amount.toString());
      const senderBalance = parseFloat(senderWallet.balance.toString());
      
      if (senderBalance < amount && validatedData.type !== 'TOPUP') {
        return res.status(400).json({ message: "Insufficient funds" });
      }
      
      // If receiver exists, check if receiver wallet exists
      if (validatedData.receiverId) {
        const receiverWallet = await storage.getWalletByUserId(validatedData.receiverId);
        if (!receiverWallet) {
          return res.status(404).json({ message: "Receiver wallet not found" });
        }
      }
      
      // Create transaction
      const transaction = await storage.createTransaction(validatedData);
      
      // Log activity
      await storage.createActivity({
        userId,
        action: `TRANSACTION_${validatedData.type}`,
        details: `${validatedData.type} transaction of ${validatedData.amount} NPR`,
        ipAddress: req.ip
      });
      
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  // Activity routes
  app.get("/api/activities", requireAuth, async (req, res) => {
    try {
      const activities = await storage.getUserActivities(req.session.userId!);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // User routes (for finding users to send money to)
  app.get("/api/users", requireAuth, async (req, res) => {
    try {
      const users = Array.from(await (async () => {
        const allUsers = [];
        for (let i = 1; i < 100; i++) {
          const user = await storage.getUser(i);
          if (user && user.id !== req.session.userId) {
            allUsers.push(user);
          }
        }
        return allUsers;
      })());
      
      // Filter out passwords from the results
      const filteredUsers = users.map(({ password, ...user }) => user);
      
      res.json(filteredUsers);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Stripe payment routes
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  app.post("/api/create-payment-intent", requireAuth, async (req, res) => {
    try {
      const { amount } = req.body;
      
      if (!amount || amount < 1) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      // Amount in cents
      const amountInCents = Math.round(amount * 100);
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'usd',
        metadata: {
          userId: req.session.userId!.toString(),
          tokenAmount: (amount * 2).toString(), // $0.50 per token, so $1 = 2 tokens
        },
      });

      // Log the payment intent creation
      await storage.createActivity({
        userId: req.session.userId!,
        action: "PAYMENT_INTENT_CREATED",
        details: `Created payment intent for $${amount} (${amount * 2} NPT tokens)`,
        ipAddress: req.ip
      });
      
      res.json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error: any) {
      console.error("Stripe error:", error);
      res.status(500).json({ message: "Payment processing error" });
    }
  });

  // Stripe webhook to handle successful payments
  app.post("/api/webhook", async (req, res) => {
    const payload = req.body;
    const sig = req.headers['stripe-signature'];

    let event;

    try {
      // Verify the webhook signature
      if (process.env.STRIPE_WEBHOOK_SECRET && sig) {
        event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET);
      } else {
        // For development, we'll just use the payload directly
        event = payload;
      }

      // Handle the event
      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        
        // Extract metadata
        const userId = parseInt(paymentIntent.metadata.userId);
        const tokenAmount = parseInt(paymentIntent.metadata.tokenAmount);
        
        if (userId && tokenAmount) {
          // Handle token purchase success
          // In a real app, this would mint the tokens to the user's address
          // For now, let's just log an activity
          await storage.createActivity({
            userId,
            action: "TOKEN_PURCHASE",
            details: `Purchased ${tokenAmount} NPT tokens`,
            ipAddress: req.ip || "webhook"
          });

          // Here you would trigger your blockchain function to mint tokens
          // For now, let's just log it
          console.log(`User ${userId} purchased ${tokenAmount} NPT tokens`);
        }
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error('Webhook error:', error);
      res.status(400).send(`Webhook Error: ${error.message}`);
      return;
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}