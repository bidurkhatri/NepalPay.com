import { Express } from "express";
import { createServer, Server } from "http";
import { setupAuth, isAuthenticated, isAdmin, isSuperAdmin } from "./auth";
import { storage } from "./storage";
import Stripe from "stripe";
import { WebSocketServer } from "ws";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";
import * as crypto from "crypto";
import { users, wallets, transactions, activities, collaterals, loans, ads } from "../shared/schema";

// Check for Stripe API key
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("Warning: STRIPE_SECRET_KEY not provided. Stripe payments will not work.");
}

// Initialize Stripe if API key is available
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" as any })
  : null;

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);
  
  // Create HTTP server
  const httpServer = createServer(app);
  
  // Create WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });
  
  // Handle WebSocket connections
  wss.on("connection", (ws) => {
    console.log("WebSocket client connected");
    
    // Send initial connection message
    ws.send(JSON.stringify({ type: "connection", message: "Connected to NepaliPay server" }));
    
    // Handle messages from clients
    ws.on("message", async (message) => {
      try {
        // Parse incoming message
        const data = JSON.parse(message.toString());
        
        // Handle different message types
        switch (data.type) {
          case "ping":
            ws.send(JSON.stringify({ type: "pong", timestamp: Date.now() }));
            break;
            
          default:
            ws.send(JSON.stringify({ type: "error", message: "Unknown message type" }));
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
        ws.send(JSON.stringify({ type: "error", message: "Invalid message format" }));
      }
    });
    
    // Handle connection close
    ws.on("close", () => {
      console.log("WebSocket client disconnected");
    });
  });
  
  // Broadcast to all connected clients
  function broadcastToAll(data: any) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }
  
  // API routes
  
  // Wallet routes
  app.get("/api/wallet", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.id;
      const wallet = await storage.getWalletByUserId(userId);
      
      if (!wallet) {
        return res.status(404).json({ message: "Wallet not found" });
      }
      
      res.status(200).json(wallet);
    } catch (error) {
      console.error("Error fetching wallet:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Create wallet
  app.post("/api/wallet", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.id;
      
      // Check if user already has a wallet
      const existingWallet = await storage.getWalletByUserId(userId);
      if (existingWallet) {
        return res.status(400).json({ message: "User already has a wallet" });
      }
      
      // Generate wallet address
      const address = crypto.randomBytes(20).toString("hex");
      
      // Create wallet
      const wallet = await storage.createWallet({
        userId,
        address,
        balance: "0",
        privateKey: null
      });
      
      // Log activity
      await storage.createActivity({
        userId,
        action: "wallet_created",
        details: "Wallet created",
        ipAddress: req.ip || null,
        userAgent: req.headers["user-agent"] || null
      });
      
      res.status(201).json(wallet);
    } catch (error) {
      console.error("Error creating wallet:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Transaction routes
  app.get("/api/transactions", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.id;
      const transactions = await storage.getTransactionsByUserId(userId);
      
      res.status(200).json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Activity routes
  app.get("/api/activities", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.id;
      const activities = await storage.getActivitiesByUserId(userId);
      
      res.status(200).json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Collateral routes
  app.get("/api/collaterals", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.id;
      const collaterals = await storage.getCollateralsByUserId(userId);
      
      res.status(200).json(collaterals);
    } catch (error) {
      console.error("Error fetching collaterals:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Loan routes
  app.get("/api/loans", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.id;
      const loans = await storage.getLoansByUserId(userId);
      
      res.status(200).json(loans);
    } catch (error) {
      console.error("Error fetching loans:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Ad routes (p2p marketplace)
  app.get("/api/ads", async (req, res) => {
    try {
      // Public endpoint to get all active ads
      const ads = await storage.getActiveAds();
      
      res.status(200).json(ads);
    } catch (error) {
      console.error("Error fetching ads:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/ads/my", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.id;
      const ads = await storage.getAdsByUserId(userId);
      
      res.status(200).json(ads);
    } catch (error) {
      console.error("Error fetching user ads:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Create ad
  app.post("/api/ads", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.id;
      const { type, assetType, amount, price, paymentMethod, title, description, location } = req.body;
      
      // Set expiration date (7 days from now)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      
      // Create ad
      const ad = await storage.createAd({
        userId,
        type,
        assetType,
        amount,
        price,
        paymentMethod,
        title,
        description: description || null,
        location: location || null,
        status: 'active',
        expiresAt
      });
      
      // Log activity
      await storage.createActivity({
        userId,
        action: "ad_created",
        details: `Created ${type} ad for ${amount} ${assetType}`,
        ipAddress: req.ip || null,
        userAgent: req.headers["user-agent"] || null
      });
      
      res.status(201).json(ad);
    } catch (error) {
      console.error("Error creating ad:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Stripe payment integration
  if (stripe) {
    // Create payment intent for token purchase
    app.post("/api/create-payment-intent", isAuthenticated, async (req, res) => {
      try {
        const { amount, currency = "usd" } = req.body;
        
        if (!amount || isNaN(parseFloat(amount))) {
          return res.status(400).json({ message: "Invalid amount" });
        }
        
        // Convert to cents for Stripe
        const amountInCents = Math.round(parseFloat(amount) * 100);
        
        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amountInCents,
          currency,
          metadata: {
            userId: req.user?.id.toString(),
            purpose: "token_purchase"
          }
        });
        
        res.status(200).json({
          clientSecret: paymentIntent.client_secret
        });
      } catch (error) {
        console.error("Error creating payment intent:", error);
        res.status(500).json({ message: "Error creating payment intent" });
      }
    });
    
    // Webhook for handling Stripe events
    app.post("/api/stripe-webhook", async (req, res) => {
      const signature = req.headers["stripe-signature"];
      
      if (!process.env.STRIPE_WEBHOOK_SECRET || !signature) {
        return res.status(400).json({ message: "Missing Stripe webhook secret or signature" });
      }
      
      try {
        const event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET
        );
        
        // Handle different event types
        switch (event.type) {
          case "payment_intent.succeeded": {
            const paymentIntent = event.data.object;
            const userId = parseInt(paymentIntent.metadata.userId);
            const purpose = paymentIntent.metadata.purpose;
            
            if (purpose === "token_purchase" && !isNaN(userId)) {
              // Process token purchase
              const amountInDollars = paymentIntent.amount / 100;
              
              // Get user wallet
              const wallet = await storage.getWalletByUserId(userId);
              
              if (wallet) {
                // Update wallet balance (simplified - in real world would involve blockchain transaction)
                const newBalance = (parseFloat(wallet.balance) + amountInDollars).toString();
                await storage.updateWalletBalance(wallet.id, newBalance);
                
                // Create transaction record
                const transaction = await storage.createTransaction({
                  userId,
                  type: "deposit",
                  amount: amountInDollars.toString(),
                  hash: paymentIntent.id,
                  status: "completed",
                  fromAddress: "stripe",
                  toAddress: wallet.address,
                  fee: "0",
                  description: "Token purchase via Stripe"
                });
                
                // Log activity
                await storage.createActivity({
                  userId,
                  action: "token_purchase",
                  details: `Purchased tokens worth $${amountInDollars}`,
                  ipAddress: null,
                  userAgent: null
                });
                
                // Notify connected clients via WebSocket
                broadcastToAll({
                  type: "transaction",
                  data: transaction
                });
              }
            }
            break;
          }
          
          // Handle other event types as needed
        }
        
        res.status(200).json({ received: true });
      } catch (error) {
        console.error("Stripe webhook error:", error);
        res.status(400).json({ message: "Webhook error" });
      }
    });
  }
  
  // Admin routes
  // Get all users
  app.get("/api/admin/users", isAdmin, async (req, res) => {
    try {
      // This would normally use a paginated query
      const userList = await db.select().from(users);
      res.status(200).json(userList);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get user details
  app.get("/api/admin/users/:id", isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Update user status
  app.patch("/api/admin/users/:id", isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { isActive, kycStatus } = req.body;
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Update user
      const updatedUser = await storage.updateUser(userId, {
        isActive: isActive !== undefined ? isActive : user.isActive,
        kycStatus: kycStatus || user.kycStatus,
        updatedAt: new Date()
      });
      
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // SuperAdmin routes
  // System status
  app.get("/api/superadmin/system", isSuperAdmin, async (req, res) => {
    try {
      // Get total user count
      const userCount = await db.select({ count: sql`count(*)` }).from(users);
      
      // Get total transaction count
      const txCount = await db.select({ count: sql`count(*)` }).from(transactions);
      
      // Get active loan count
      const activeLoanCount = await db.select({ count: sql`count(*)` }).from(loans).where(eq(loans.status, 'active'));
      
      // Get today's new users
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const newUserCount = await db.select({ count: sql`count(*)` })
        .from(users)
        .where(sql`created_at >= ${today.toISOString()}`);
      
      res.status(200).json({
        userCount: userCount[0].count,
        transactionCount: txCount[0].count,
        activeLoanCount: activeLoanCount[0].count,
        newUsersToday: newUserCount[0].count,
        serverUptime: process.uptime()
      });
    } catch (error) {
      console.error("Error getting system status:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Return the HTTP server
  return httpServer;
}