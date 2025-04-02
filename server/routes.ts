import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import { z } from "zod";
import { insertUserSchema, insertTransactionSchema, insertActivitySchema } from "@shared/schema";
import MemoryStore from "memorystore";

const SessionStore = MemoryStore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session
  app.use(
    session({
      store: new SessionStore({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
      secret: process.env.SESSION_SECRET || "nepal-pay-secret",
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
  app.post("/api/auth/register", async (req, res) => {
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

  app.post("/api/auth/login", async (req, res) => {
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

  app.post("/api/auth/logout", requireAuth, (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", requireAuth, async (req, res) => {
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

  const httpServer = createServer(app);
  return httpServer;
}
