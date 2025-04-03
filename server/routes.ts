import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import { z } from "zod";
import { insertUserSchema, insertTransactionSchema, insertActivitySchema, insertBankAccountSchema } from "@shared/schema";
import MemoryStore from "memorystore";
import Stripe from "stripe";
import { finAPIService } from "./services/finapi";

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

  // FinAPI routes
  // Create FinAPI user profile
  app.post("/api/finapi/users", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if user already has a FinAPI profile
      if (user.finApiUserId) {
        return res.status(400).json({ 
          message: "User already has a FinAPI profile",
          finApiUserId: user.finApiUserId
        });
      }
      
      let finApiUser;
      
      // Development mode - mock FinAPI for testing when the real service is not available
      const isDevelopmentMode = process.env.NODE_ENV !== 'production';
      
      if (isDevelopmentMode) {
        console.log('Using development mode for FinAPI (mocked integration)');
        // Create a mock FinAPI user response
        finApiUser = {
          id: `finapi-dev-user-${userId}`,
          email: user.email,
          phone: user.phoneNumber || '',
          createdAt: new Date().toISOString(),
          status: 'ACTIVE'
        };
      } else {
        // Production mode - use the real FinAPI service
        finApiUser = await finAPIService.createUser(
          userId, 
          user.email, 
          user.phoneNumber || ""
        );
      }
      
      // Update user with FinAPI ID
      const updatedUser = await storage.updateUser(userId, {
        finApiUserId: finApiUser.id,
        kycStatus: "PENDING"
      });
      
      // Log activity
      await storage.createActivity({
        userId,
        action: "FINAPI_USER_CREATED",
        details: isDevelopmentMode 
          ? "Mock FinAPI profile created (development mode)" 
          : "FinAPI profile created",
        ipAddress: req.ip
      });
      
      // Return user data (excluding password)
      const { password, ...userData } = updatedUser!;
      res.status(201).json({
        ...userData,
        isDevelopmentMode
      });
    } catch (error: any) {
      console.error("FinAPI error:", error);
      res.status(500).json({ message: "Error creating FinAPI user" });
    }
  });
  
  // Initiate KYC verification
  app.post("/api/finapi/kyc/initiate", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if user has a FinAPI profile
      if (!user.finApiUserId) {
        return res.status(400).json({ 
          message: "User needs to create a FinAPI profile first" 
        });
      }
      
      // Check if user already completed KYC
      if (user.kycStatus === "VERIFIED") {
        return res.status(400).json({ 
          message: "User KYC already verified" 
        });
      }
      
      // Development mode - mock FinAPI for testing when the real service is not available
      const isDevelopmentMode = process.env.NODE_ENV !== 'production';
      
      let verification;
      
      if (isDevelopmentMode) {
        console.log('Using development mode for FinAPI KYC (mocked integration)');
        // Create a mock verification response
        verification = {
          id: `finapi-kyc-${userId}-${Date.now()}`,
          url: `https://example.com/mock-kyc-verification/${userId}`,
          status: 'INITIATED',
          createdAt: new Date().toISOString()
        };
      } else {
        // Production mode - use the real FinAPI service
        verification = await finAPIService.initiateKycVerification(user.finApiUserId);
      }
      
      // Update user with verification ID
      await storage.updateUser(userId, {
        kycVerificationId: verification.id,
        kycStatus: "IN_PROGRESS"
      });
      
      // Log activity
      await storage.createActivity({
        userId,
        action: "KYC_INITIATED",
        details: isDevelopmentMode 
          ? "Mock KYC verification process initiated (development mode)" 
          : "KYC verification process initiated",
        ipAddress: req.ip
      });
      
      res.json({
        verificationId: verification.id,
        verificationUrl: verification.url,
        isDevelopmentMode
      });
    } catch (error: any) {
      console.error("FinAPI KYC error:", error);
      res.status(500).json({ message: "Error initiating KYC verification" });
    }
  });
  
  // Check KYC verification status
  app.get("/api/finapi/kyc/status", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if user has a KYC verification ID
      if (!user.kycVerificationId) {
        return res.status(400).json({ 
          message: "No KYC verification in progress" 
        });
      }
      
      // Development mode - mock FinAPI for testing when the real service is not available
      const isDevelopmentMode = process.env.NODE_ENV !== 'production';
      
      let verification;
      
      if (isDevelopmentMode) {
        console.log('Using development mode for FinAPI KYC status (mocked integration)');
        
        // Mock implementation to automatically approve KYC after 5 seconds in development
        const verificationStartTime = parseInt(user.kycVerificationId.split('-').pop() || '0');
        const elapsedTime = Date.now() - verificationStartTime;
        const isVerified = elapsedTime > 5000; // Auto-approve after 5 seconds
        
        verification = {
          id: user.kycVerificationId,
          status: isVerified ? "COMPLETED" : "IN_PROGRESS",
          details: isVerified 
            ? { message: "Verification completed successfully (development mode)" }
            : { message: "Verification in progress (development mode)" }
        };
      } else {
        // Production mode - use the real FinAPI service
        verification = await finAPIService.getKycVerificationStatus(user.kycVerificationId);
      }
      
      // Update user status if verification is complete
      if (verification.status === "COMPLETED") {
        await storage.updateUser(userId, {
          kycStatus: "VERIFIED",
          kycVerifiedAt: new Date()
        });
        
        // Log activity
        await storage.createActivity({
          userId,
          action: "KYC_VERIFIED",
          details: isDevelopmentMode
            ? "Mock KYC verification completed successfully (development mode)"
            : "KYC verification completed successfully",
          ipAddress: req.ip
        });
      }
      
      res.json({
        status: verification.status,
        details: verification.details || {},
        isDevelopmentMode
      });
    } catch (error: any) {
      console.error("FinAPI KYC status error:", error);
      res.status(500).json({ message: "Error checking KYC verification status" });
    }
  });
  
  // FinAPI callback endpoint (webhook)
  app.post("/api/finapi/callback", async (req, res) => {
    try {
      const { verificationId, status, details } = req.body;
      
      if (!verificationId) {
        return res.status(400).json({ message: "Missing verification ID" });
      }
      
      // Find user by verification ID
      const users = Array.from(await (async () => {
        const allUsers = [];
        for (let i = 1; i < 100; i++) {
          const user = await storage.getUser(i);
          if (user && user.kycVerificationId === verificationId) {
            allUsers.push(user);
          }
        }
        return allUsers;
      })());
      
      if (users.length === 0) {
        return res.status(404).json({ message: "No user found with this verification ID" });
      }
      
      const user = users[0];
      
      // Update user status if verification is complete
      if (status === "COMPLETED") {
        await storage.updateUser(user.id, {
          kycStatus: "VERIFIED",
          kycVerifiedAt: new Date()
        });
        
        // Log activity
        await storage.createActivity({
          userId: user.id,
          action: "KYC_VERIFIED",
          details: "KYC verification completed via callback",
          ipAddress: req.ip || "webhook"
        });
      }
      
      res.json({ received: true });
    } catch (error: any) {
      console.error("FinAPI callback error:", error);
      res.status(500).json({ message: "Error processing FinAPI callback" });
    }
  });
  
  // Import bank connection
  app.post("/api/finapi/bank-connections", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if user has a FinAPI profile
      if (!user.finApiUserId) {
        return res.status(400).json({ 
          message: "User needs to create a FinAPI profile first" 
        });
      }
      
      // Check if user is KYC verified
      if (user.kycStatus !== "VERIFIED") {
        return res.status(400).json({ 
          message: "User needs to complete KYC verification first" 
        });
      }
      
      const { bankId, loginCredentials } = req.body;
      
      if (!bankId || !loginCredentials) {
        return res.status(400).json({ 
          message: "Bank ID and login credentials are required" 
        });
      }
      
      // Development mode - mock FinAPI for testing when the real service is not available
      const isDevelopmentMode = process.env.NODE_ENV !== 'production';
      
      let connection;
      
      if (isDevelopmentMode) {
        console.log('Using development mode for FinAPI bank connection (mocked integration)');
        // Create a mock bank connection response
        connection = {
          id: `finapi-bank-connection-${userId}-${Date.now()}`,
          bankId,
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          accounts: [
            {
              id: `finapi-account-${userId}-1`,
              name: 'Mock Checking Account',
              type: 'CHECKING',
              balance: 1250000,
              currency: 'NPR',
              iban: `NP${Math.floor(10000000000 + Math.random() * 90000000000)}`
            },
            {
              id: `finapi-account-${userId}-2`,
              name: 'Mock Savings Account',
              type: 'SAVINGS',
              balance: 5430000,
              currency: 'NPR',
              iban: `NP${Math.floor(10000000000 + Math.random() * 90000000000)}`
            }
          ]
        };
      } else {
        // Production mode - use the real FinAPI service
        connection = await finAPIService.importBankConnection(
          user.finApiUserId,
          bankId,
          loginCredentials
        );
      }
      
      // Log activity
      await storage.createActivity({
        userId,
        action: "BANK_CONNECTION_IMPORTED",
        details: isDevelopmentMode
          ? `Mock bank connection imported for bank ID ${bankId} (development mode)`
          : `Bank connection imported for bank ID ${bankId}`,
        ipAddress: req.ip
      });
      
      res.json({
        ...connection,
        isDevelopmentMode
      });
    } catch (error: any) {
      console.error("FinAPI bank connection error:", error);
      res.status(500).json({ message: "Error importing bank connection" });
    }
  });
  
  // Get bank accounts
  app.get("/api/finapi/bank-accounts", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if user has a FinAPI profile
      if (!user.finApiUserId) {
        return res.status(400).json({ 
          message: "User needs to create a FinAPI profile first" 
        });
      }
      
      // Development mode - mock FinAPI for testing when the real service is not available
      const isDevelopmentMode = process.env.NODE_ENV !== 'production';
      
      let accounts;
      
      if (isDevelopmentMode) {
        console.log('Using development mode for FinAPI bank accounts (mocked integration)');
        // Create mock bank accounts
        accounts = [
          {
            id: `finapi-account-${userId}-1`,
            name: 'Mock Checking Account',
            type: 'CHECKING',
            balance: 1250000,
            currency: 'NPR',
            iban: `NP${Math.floor(10000000000 + Math.random() * 90000000000)}`,
            bankName: 'Nepal National Bank'
          },
          {
            id: `finapi-account-${userId}-2`,
            name: 'Mock Savings Account',
            type: 'SAVINGS',
            balance: 5430000,
            currency: 'NPR',
            iban: `NP${Math.floor(10000000000 + Math.random() * 90000000000)}`,
            bankName: 'Global IME Bank'
          }
        ];
      } else {
        // Production mode - use the real FinAPI service
        accounts = await finAPIService.getBankAccounts(user.finApiUserId);
      }
      
      res.json({
        accounts,
        isDevelopmentMode
      });
    } catch (error: any) {
      console.error("FinAPI bank accounts error:", error);
      res.status(500).json({ message: "Error getting bank accounts" });
    }
  });
  
  // Add a bank account to our system
  app.post("/api/bank-accounts", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Validate bank account data
      const accountData = {
        ...req.body,
        userId,
      };
      
      const validatedData = insertBankAccountSchema.parse(accountData);
      
      // Create bank account
      const bankAccount = await storage.createBankAccount(validatedData);
      
      // Log activity
      await storage.createActivity({
        userId,
        action: "BANK_ACCOUNT_ADDED",
        details: `Bank account ${bankAccount.accountName} added`,
        ipAddress: req.ip
      });
      
      res.status(201).json(bankAccount);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Get user's bank accounts from our system
  app.get("/api/bank-accounts", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      
      // Get bank accounts
      const bankAccounts = await storage.getUserBankAccounts(userId);
      
      res.json(bankAccounts);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Get bank transactions
  app.get("/api/finapi/transactions", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if user has a FinAPI profile
      if (!user.finApiUserId) {
        return res.status(400).json({ 
          message: "User needs to create a FinAPI profile first" 
        });
      }
      
      const { accountId, from, to } = req.query;
      
      if (!accountId) {
        return res.status(400).json({ message: "Account ID is required" });
      }
      
      // Development mode - mock FinAPI for testing when the real service is not available
      const isDevelopmentMode = process.env.NODE_ENV !== 'production';
      
      let transactions;
      
      if (isDevelopmentMode) {
        console.log('Using development mode for FinAPI transactions (mocked integration)');
        
        // Generate a set of mock transactions based on the account ID
        const isCheckingAccount = (accountId as string).includes("-1");
        const transactionTypes = isCheckingAccount 
          ? ['PAYMENT', 'DIRECT_DEBIT', 'TRANSFER', 'SALARY'] 
          : ['INTEREST', 'TRANSFER', 'DEPOSIT'];
        
        // Generate 10-20 mock transactions
        const count = Math.floor(10 + Math.random() * 10);
        transactions = Array(count).fill(0).map((_, index) => {
          const isOutgoing = Math.random() > 0.5;
          const typeIndex = Math.floor(Math.random() * transactionTypes.length);
          const date = new Date();
          date.setDate(date.getDate() - Math.floor(Math.random() * 30)); // Random date within last 30 days
          
          const amount = Math.floor(1000 + Math.random() * 50000) * 100; // Amount in paisa (1,000 - 50,000 NPR)
          
          return {
            id: `finapi-txn-${accountId}-${index}`,
            accountId: accountId,
            date: date.toISOString(),
            type: transactionTypes[typeIndex],
            amount: isOutgoing ? -amount : amount,
            currency: 'NPR',
            description: `${isOutgoing ? 'Payment to' : 'Payment from'} ${['Merchant', 'Company', 'Person', 'Service'][Math.floor(Math.random() * 4)]} ${Math.floor(Math.random() * 100)}`,
            status: 'BOOKED'
          };
        });
        
        // Sort by date descending
        transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      } else {
        // Production mode - use the real FinAPI service
        transactions = await finAPIService.getTransactions(
          user.finApiUserId,
          accountId as string,
          from as string | undefined,
          to as string | undefined
        );
      }
      
      res.json({
        transactions,
        isDevelopmentMode
      });
    } catch (error: any) {
      console.error("FinAPI transactions error:", error);
      res.status(500).json({ message: "Error getting transactions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
