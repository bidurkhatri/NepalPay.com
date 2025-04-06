import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserSchema, insertTransactionSchema, insertActivitySchema, User } from "@shared/schema";
import Stripe from "stripe";
import { setupAuth } from "./auth";

// Type declaration for Express Request with User
declare global {
  namespace Express {
    // Note: The User type is already declared in auth.ts
    // We're just adding a reference here for clarity
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication with Passport.js
  setupAuth(app);

  // Authentication middleware
  const requireAuth = (req: Request, res: Response, next: Function) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };
  
  // Type assertion for req.user is defined at the top of the file

  // Auth routes are now handled by the auth.ts module
  
  // Additional user-related routes
  app.get("/api/user", requireAuth, async (req, res) => {
    try {
      // With Passport.js, the user is already in req.user
      // Return user data (without password)
      if (!req.user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...userData } = req.user;
      res.json(userData);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Wallet routes
  app.get("/api/wallet", requireAuth, async (req, res) => {
    try {
      // After requireAuth middleware, req.user is guaranteed to exist
      const userId = req.user!.id;
      const wallet = await storage.getWalletByUserId(userId);
      
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
      const userId = req.user!.id;
      
      // Check if a wallet already exists for this user
      const existingWallet = await storage.getWalletByUserId(userId);
      
      if (existingWallet) {
        return res.status(400).json({ message: "User already has a wallet" });
      }
      
      // Create wallet
      const walletData = {
        userId,
        balance: req.body.balance || "0",
        currency: req.body.currency || "NPR"
      };
      
      const wallet = await storage.createWallet(walletData);
      
      // Log activity
      await storage.createActivity({
        userId,
        action: "WALLET_CREATED",
        details: "Wallet was initialized",
        ipAddress: req.ip || ""
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
      const userId = req.user!.id;
      const transactions = await storage.getUserTransactions(userId);
      
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
      const userId = req.user!.id;
      
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
        ipAddress: req.ip || ""
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
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }
      const activities = await storage.getUserActivities(req.user.id);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // User routes (for finding users to send money to)
  app.get("/api/users", requireAuth, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }
      
      const users = Array.from(await (async () => {
        const allUsers = [];
        for (let i = 1; i < 100; i++) {
          const user = await storage.getUser(i);
          if (user && user.id !== req.user.id) {
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
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }
      
      const { amount } = req.body;
      
      if (!amount || amount < 1) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      // Amount in cents - 1 NPT = 1 NPR = ~$0.0075 USD
      // Convert NPR to USD at roughly 1:0.0075 rate
      const amountInUsd = amount * 0.0075;
      const amountInCents = Math.round(amountInUsd * 100);
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'usd',
        metadata: {
          userId: req.user.id.toString(),
          tokenAmount: amount.toString(), // 1:1 NPR to NPT
          walletAddress: req.body.walletAddress || ""
        },
      });

      // Log the payment intent creation
      await storage.createActivity({
        userId: req.user.id,
        action: "PAYMENT_INTENT_CREATED",
        details: `Created payment intent for NPR ${amount} (${amount} NPT tokens)`,
        ipAddress: req.ip || ""
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
        const walletAddress = paymentIntent.metadata.walletAddress;
        
        if (userId && tokenAmount) {
          // Handle token purchase success
          // In a real app, this would mint the tokens to the user's address
          await storage.createActivity({
            userId,
            action: "TOKEN_PURCHASE",
            details: `Purchased ${tokenAmount} NPT tokens to wallet ${walletAddress || "unknown"}`,
            ipAddress: req.ip || "webhook"
          });

          // Here you would trigger your blockchain function to mint/transfer tokens
          // For a real implementation, you would:
          // 1. Connect to the blockchain using a backend wallet
          // 2. Call the NepaliPayToken contract's transfer or mint function
          // 3. Send the tokens to the user's wallet address
          console.log(`User ${userId} purchased ${tokenAmount} NPT tokens to wallet ${walletAddress || "unknown"}`);
        }
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error('Webhook error:', error);
      res.status(400).send(`Webhook Error: ${error.message}`);
      return;
    }
  });

  // Bank Account routes have been removed

  const httpServer = createServer(app);
  return httpServer;
}
