import express, { Express, Request, Response } from "express";
import { createServer, Server as HttpServer } from "http";
import { WebSocketServer } from "ws";
import Stripe from "stripe";
import { storage } from "./storage";
import { setupAuth, requireAuth, requireAdmin, requireSuperadmin } from "./auth";
import { eq } from "drizzle-orm";
import { ethers } from "ethers";
import { transactions, users, wallets } from "../shared/schema";
import { randomBytes } from "crypto";

// Check for Stripe API key
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("Warning: STRIPE_SECRET_KEY is not set. Stripe payment features will not work.");
}

// Initialize Stripe with fallback for development
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" })
  : undefined;

export function registerRoutes(app: Express): HttpServer {
  // Set up authentication routes
  setupAuth(app);

  // Initialize demo data
  app.get("/api/init-demo", async (req: Request, res: Response) => {
    try {
      await storage.initializeDemoData();
      return res.status(200).json({ message: "Demo data initialized successfully" });
    } catch (error: any) {
      console.error("Error initializing demo data:", error);
      return res.status(500).json({ error: "Failed to initialize demo data: " + error.message });
    }
  });

  // === User API ===
  
  // Get user profile
  app.get("/api/profile", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Remove sensitive data
      const { password, ...userProfile } = user;
      
      return res.status(200).json(userProfile);
    } catch (error: any) {
      console.error("Error fetching user profile:", error);
      return res.status(500).json({ error: "Failed to fetch profile: " + error.message });
    }
  });
  
  // Update user profile
  app.patch("/api/profile", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const { password, role, ...updateData } = req.body; // Prevent changing sensitive fields
      
      const updatedUser = await storage.updateUser(userId, updateData);
      
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Remove sensitive data
      const { password: _, ...userProfile } = updatedUser;
      
      return res.status(200).json(userProfile);
    } catch (error: any) {
      console.error("Error updating user profile:", error);
      return res.status(500).json({ error: "Failed to update profile: " + error.message });
    }
  });

  // === Wallet API ===
  
  // Get user wallet
  app.get("/api/wallet", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const wallet = await storage.getWalletByUserId(userId);
      
      if (!wallet) {
        // Create a new wallet if not exists
        const newWallet = ethers.Wallet.createRandom();
        
        const createdWallet = await storage.createWallet({
          userId,
          address: newWallet.address,
          encryptedPrivateKey: "encrypted", // In a real app, we would encrypt this properly
          balance: "0",
        });
        
        return res.status(200).json(createdWallet);
      }
      
      // Remove sensitive data
      const { encryptedPrivateKey, ...safeWallet } = wallet;
      
      return res.status(200).json(safeWallet);
    } catch (error: any) {
      console.error("Error fetching wallet:", error);
      return res.status(500).json({ error: "Failed to fetch wallet: " + error.message });
    }
  });

  // === Transaction API ===
  
  // Get user transactions
  app.get("/api/transactions", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const userTransactions = await storage.getUserTransactions(userId);
      
      return res.status(200).json(userTransactions);
    } catch (error: any) {
      console.error("Error fetching transactions:", error);
      return res.status(500).json({ error: "Failed to fetch transactions: " + error.message });
    }
  });
  
  // Create a new transaction (transfer)
  app.post("/api/transactions/transfer", requireAuth, async (req: Request, res: Response) => {
    try {
      const { recipientAddress, amount, description } = req.body;
      
      if (!recipientAddress || !amount) {
        return res.status(400).json({ error: "Recipient address and amount are required" });
      }
      
      // Get sender wallet
      const senderId = req.user!.id;
      const senderWallet = await storage.getWalletByUserId(senderId);
      
      if (!senderWallet) {
        return res.status(404).json({ error: "Sender wallet not found" });
      }
      
      // Check if sender has enough balance
      if (parseFloat(senderWallet.balance.toString()) < parseFloat(amount)) {
        return res.status(400).json({ error: "Insufficient balance" });
      }
      
      // Find recipient user by wallet address
      const recipientUser = await storage.getAllUsers().then(users => 
        users.find(user => user.walletAddress === recipientAddress)
      );
      
      if (!recipientUser) {
        return res.status(404).json({ error: "Recipient not found" });
      }
      
      // Get recipient wallet
      const recipientWallet = await storage.getWalletByUserId(recipientUser.id);
      
      if (!recipientWallet) {
        return res.status(404).json({ error: "Recipient wallet not found" });
      }
      
      // Create transaction
      const newTransaction = await storage.createTransaction({
        senderId,
        receiverId: recipientUser.id,
        amount: amount.toString(),
        type: "transfer",
        status: "completed",
        description: description || "Transfer",
        txHash: `0x${randomBytes(32).toString("hex")}`, // In a real app, this would be a real blockchain transaction hash
      });
      
      // Update sender balance
      const newSenderBalance = (parseFloat(senderWallet.balance.toString()) - parseFloat(amount)).toString();
      await storage.updateWallet(senderWallet.id, { balance: newSenderBalance });
      
      // Update recipient balance
      const newRecipientBalance = (parseFloat(recipientWallet.balance.toString()) + parseFloat(amount)).toString();
      await storage.updateWallet(recipientWallet.id, { balance: newRecipientBalance });
      
      // Record activity
      await storage.createActivity({
        userId: senderId,
        action: "transfer",
        details: `Transferred ${amount} NPT to ${recipientAddress}`,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"] || "",
      });
      
      return res.status(201).json(newTransaction);
    } catch (error: any) {
      console.error("Error creating transfer:", error);
      return res.status(500).json({ error: "Failed to create transfer: " + error.message });
    }
  });

  // === Stripe Integration ===
  
  // Create a payment intent for purchasing NPT tokens
  app.post("/api/create-payment-intent", requireAuth, async (req: Request, res: Response) => {
    try {
      if (!stripe) {
        return res.status(500).json({ error: "Stripe is not configured" });
      }
      
      const { amount } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Valid amount is required" });
      }
      
      // Calculate fees (in a real app, this would be more sophisticated)
      const nptPrice = 1; // 1 USD per NPT
      const gasFee = 0.5; // $0.50 gas fee
      const serviceFee = amount * 0.02; // 2% service fee
      
      const totalAmount = amount * nptPrice + gasFee + serviceFee;
      
      // Create a payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalAmount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          userId: req.user!.id.toString(),
          nptAmount: amount.toString(),
          gasFee: gasFee.toString(),
          serviceFee: serviceFee.toString(),
        },
      });
      
      // Return client secret
      return res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        amount: totalAmount,
        nptAmount: amount,
        gasFee,
        serviceFee,
      });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      return res.status(500).json({ error: "Failed to create payment intent: " + error.message });
    }
  });
  
  // Webhook for Stripe events
  app.post("/api/stripe-webhook", express.raw({ type: "application/json" }), async (req: Request, res: Response) => {
    if (!stripe) {
      return res.status(500).json({ error: "Stripe is not configured" });
    }
    
    const sig = req.headers["stripe-signature"] as string;
    
    if (!sig) {
      return res.status(400).json({ error: "Missing Stripe signature" });
    }
    
    // In a real app, this would be a secret from your environment
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "whsec_test";
    
    let event;
    
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (error: any) {
      console.error("Webhook signature verification failed:", error.message);
      return res.status(400).json({ error: `Webhook Error: ${error.message}` });
    }
    
    // Handle the event
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      
      // Get user ID from metadata
      const userId = parseInt(paymentIntent.metadata.userId || "0");
      const nptAmount = parseFloat(paymentIntent.metadata.nptAmount || "0");
      
      if (userId && nptAmount) {
        try {
          // Get treasury wallet (superadmin's wallet)
          const superadmin = await storage.getAllUsers().then(users => 
            users.find(user => user.role === "superadmin")
          );
          
          if (!superadmin) {
            console.error("Superadmin not found for token transfer");
            return res.status(500).json({ error: "Superadmin not found" });
          }
          
          const treasuryWallet = await storage.getWalletByUserId(superadmin.id);
          
          if (!treasuryWallet) {
            console.error("Treasury wallet not found");
            return res.status(500).json({ error: "Treasury wallet not found" });
          }
          
          // Get user wallet
          const userWallet = await storage.getWalletByUserId(userId);
          
          if (!userWallet) {
            console.error(`User wallet not found for user ID ${userId}`);
            return res.status(404).json({ error: "User wallet not found" });
          }
          
          // Create a transaction record
          await storage.createTransaction({
            senderId: superadmin.id,
            receiverId: userId,
            amount: nptAmount.toString(),
            type: "deposit",
            status: "completed",
            description: "Token purchase",
            stripePaymentId: paymentIntent.id,
            txHash: `0x${randomBytes(32).toString("hex")}`, // In a real app, this would be a real blockchain transaction hash
          });
          
          // Update treasury wallet balance
          const newTreasuryBalance = (parseFloat(treasuryWallet.balance.toString()) - nptAmount).toString();
          await storage.updateWallet(treasuryWallet.id, { balance: newTreasuryBalance });
          
          // Update user wallet balance
          const newUserBalance = (parseFloat(userWallet.balance.toString()) + nptAmount).toString();
          await storage.updateWallet(userWallet.id, { balance: newUserBalance });
          
          // Record activity
          await storage.createActivity({
            userId,
            action: "purchase",
            details: `Purchased ${nptAmount} NPT tokens`,
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"] || "",
          });
          
          console.log(`Successfully processed payment for ${nptAmount} NPT tokens for user ${userId}`);
        } catch (error: any) {
          console.error("Error processing payment:", error.message);
          return res.status(500).json({ error: `Error processing payment: ${error.message}` });
        }
      }
    }
    
    // Return a response to acknowledge receipt of the event
    return res.status(200).json({ received: true });
  });

  // === Admin API ===
  
  // Get all users (admin only)
  app.get("/api/admin/users", requireAdmin, async (req: Request, res: Response) => {
    try {
      const allUsers = await storage.getAllUsers();
      
      // Remove sensitive data
      const safeUsers = allUsers.map(user => {
        const { password, ...safeUser } = user;
        return safeUser;
      });
      
      return res.status(200).json(safeUsers);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ error: "Failed to fetch users: " + error.message });
    }
  });
  
  // Get all transactions (admin only)
  app.get("/api/admin/transactions", requireAdmin, async (req: Request, res: Response) => {
    try {
      const allTransactions = await storage.getAllTransactions();
      return res.status(200).json(allTransactions);
    } catch (error: any) {
      console.error("Error fetching transactions:", error);
      return res.status(500).json({ error: "Failed to fetch transactions: " + error.message });
    }
  });
  
  // Approve or reject a transaction (admin only)
  app.patch("/api/admin/transactions/:id/status", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status || !["pending", "completed", "failed"].includes(status)) {
        return res.status(400).json({ error: "Valid status is required" });
      }
      
      const transaction = await storage.getTransaction(parseInt(id));
      
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      
      // Update transaction status
      const updatedTransaction = await storage.updateTransaction(parseInt(id), { status });
      
      return res.status(200).json(updatedTransaction);
    } catch (error: any) {
      console.error("Error updating transaction status:", error);
      return res.status(500).json({ error: "Failed to update transaction status: " + error.message });
    }
  });

  // === SuperAdmin API ===
  
  // Mint new NPT tokens (superadmin only)
  app.post("/api/superadmin/mint", requireSuperadmin, async (req: Request, res: Response) => {
    try {
      const { amount } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Valid amount is required" });
      }
      
      // Get treasury wallet (superadmin's wallet)
      const superadminId = req.user!.id;
      const treasuryWallet = await storage.getWalletByUserId(superadminId);
      
      if (!treasuryWallet) {
        return res.status(404).json({ error: "Treasury wallet not found" });
      }
      
      // Update treasury wallet balance
      const newBalance = (parseFloat(treasuryWallet.balance.toString()) + parseFloat(amount)).toString();
      const updatedWallet = await storage.updateWallet(treasuryWallet.id, { balance: newBalance });
      
      // Create a mint transaction
      const mintTransaction = await storage.createTransaction({
        senderId: null,
        receiverId: superadminId,
        amount: amount.toString(),
        type: "mint",
        status: "completed",
        description: "Token minting",
        txHash: `0x${randomBytes(32).toString("hex")}`, // In a real app, this would be a real blockchain transaction hash
      });
      
      // Record activity
      await storage.createActivity({
        userId: superadminId,
        action: "mint",
        details: `Minted ${amount} NPT tokens`,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"] || "",
      });
      
      return res.status(200).json({
        transaction: mintTransaction,
        wallet: updatedWallet,
      });
    } catch (error: any) {
      console.error("Error minting tokens:", error);
      return res.status(500).json({ error: "Failed to mint tokens: " + error.message });
    }
  });

  // === WebSocket Server ===
  const httpServer = createServer(app);
  
  // Create WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });
  
  wss.on("connection", (socket) => {
    console.log("WebSocket client connected");
    
    // Send initial data
    socket.send(JSON.stringify({ type: "connected", message: "Connected to NepaliPay WebSocket" }));
    
    // Handle messages
    socket.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log("Received message:", data);
        
        // Echo back the message for testing
        if (socket.readyState === socket.OPEN) {
          socket.send(JSON.stringify({ type: "echo", data }));
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    });
    
    // Handle close
    socket.on("close", () => {
      console.log("WebSocket client disconnected");
    });
  });

  return httpServer;
}