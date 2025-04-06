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
          if (user && req.user && user.id !== req.user.id) {
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
      
      const { tokenAmount, walletAddress } = req.body;
      
      if (!tokenAmount || tokenAmount < 1) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
        return res.status(400).json({ message: "Invalid wallet address" });
      }

      // Get current BSC gas price
      const { ethers } = require("ethers");
      const provider = new ethers.JsonRpcProvider("https://bsc-dataseed.binance.org/");
      
      // Calculate gas fee for a token transfer
      const gasPrice = await provider.getFeeData();
      const gasLimit = 65000; // Standard gas limit for ERC20 transfers
      const gasFeeBNB = gasPrice.gasPrice * BigInt(gasLimit);
      
      // Get BNB/USD price
      // In production, you should use a reliable price oracle API
      // For simplicity, we'll use a hardcoded rate here (1 BNB = $250 USD example)
      const bnbUsdRate = 250;
      
      // Calculate gas fee in USD
      const gasFeeUSD = Number(ethers.formatEther(gasFeeBNB)) * bnbUsdRate;
      
      // Add a 10% buffer to account for price fluctuations
      const gasFeeWithBuffer = gasFeeUSD * 1.1;
      
      // Calculate token price (1 NPT = 1 NPR = ~$0.0075 USD)
      const tokenPriceUSD = tokenAmount * 0.0075;
      
      // Service fee (2% of token price)
      const serviceFeeUSD = tokenPriceUSD * 0.02;
      
      // Total amount in USD
      const totalAmountUSD = tokenPriceUSD + gasFeeWithBuffer + serviceFeeUSD;
      
      // Convert to cents for Stripe
      const amountInCents = Math.round(totalAmountUSD * 100);
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'usd',
        metadata: {
          userId: req.user.id.toString(),
          tokenAmount: tokenAmount.toString(),
          walletAddress: walletAddress,
          gasFeeUSD: gasFeeWithBuffer.toFixed(4),
          serviceFeeUSD: serviceFeeUSD.toFixed(4),
          tokenPriceUSD: tokenPriceUSD.toFixed(4)
        },
      });

      // Log the payment intent creation with detailed breakdown
      await storage.createActivity({
        userId: req.user.id,
        action: "PAYMENT_INTENT_CREATED",
        details: `Created payment intent for ${tokenAmount} NPT tokens ($$${tokenPriceUSD.toFixed(2)}), gas fee: $${gasFeeWithBuffer.toFixed(2)}, service fee: $${serviceFeeUSD.toFixed(2)}`,
        ipAddress: req.ip || ""
      });
      
      res.json({
        clientSecret: paymentIntent.client_secret,
        breakdown: {
          tokenAmount,
          tokenPriceUSD: tokenPriceUSD.toFixed(4),
          gasFeeUSD: gasFeeWithBuffer.toFixed(4),
          serviceFeeUSD: serviceFeeUSD.toFixed(4),
          totalUSD: totalAmountUSD.toFixed(4)
        }
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
        const gasFeeUSD = parseFloat(paymentIntent.metadata.gasFeeUSD || "0");
        const serviceFeeUSD = parseFloat(paymentIntent.metadata.serviceFeeUSD || "0");
        
        if (userId && tokenAmount && walletAddress) {
          try {
            // Import required libraries
            const { ethers } = require("ethers");
            const NepaliPayTokenABI = require("../client/src/contracts/NepaliPayTokenABI.json");
            
            // Blockchain configuration
            const NEPALIPAY_TOKEN_ADDRESS = "0x69d34B25809b346702C21EB0E22EAD8C1de58D66";
            
            // Create a Binance Smart Chain provider
            const provider = new ethers.JsonRpcProvider("https://bsc-dataseed.binance.org/");

            // Hot wallet configuration (used for regular transfers)
            // This is the wallet that will interact with users directly
            // IMPORTANT: In production, you should NEVER hardcode private keys
            // The private key should be in an environment variable and properly secured
            const hotWallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY || "", provider);
            
            // Create a contract instance connected to the hot wallet
            const tokenContract = new ethers.Contract(
              NEPALIPAY_TOKEN_ADDRESS,
              NepaliPayTokenABI,
              hotWallet
            );
            
            // Parse the amount to wei (1 NPT = 10^18 wei)
            const amountWei = ethers.parseEther(tokenAmount.toString());
            
            // Check hot wallet balance first
            const hotWalletBalance = await tokenContract.balanceOf(hotWallet.address);
            
            // If hot wallet balance is insufficient, record for manual processing
            if (hotWalletBalance < amountWei) {
              throw new Error(`Hot wallet balance insufficient. Has: ${ethers.formatEther(hotWalletBalance)} NPT, Needs: ${tokenAmount} NPT`);
            }
            
            // Transfer tokens from hot wallet to user's wallet
            // Using the transfer method as we determined the contract has this function
            const tx = await tokenContract.transfer(walletAddress, amountWei);
            
            // Wait for transaction confirmation
            const receipt = await tx.wait();
            
            // Log successful transaction
            await storage.createActivity({
              userId,
              action: "TOKEN_PURCHASE_SUCCESS",
              details: `Successfully transferred ${tokenAmount} NPT tokens from treasury to wallet ${walletAddress}. Transaction hash: ${receipt.hash}`,
              ipAddress: req.ip || "webhook"
            });
            
            console.log(`[SUCCESS] User ${userId} purchased ${tokenAmount} NPT tokens. Tokens transferred to wallet ${walletAddress}. Gas fee: $${gasFeeUSD}, Service fee: $${serviceFeeUSD}. Tx hash: ${receipt.hash}`);
          } catch (error: any) {
            console.error("Error transferring tokens:", error);
            
            // Log the failure
            await storage.createActivity({
              userId,
              action: "TOKEN_PURCHASE_FAILED",
              details: `Failed to transfer ${tokenAmount} NPT tokens to wallet ${walletAddress}. Error: ${error.message}`,
              ipAddress: req.ip || "webhook"
            });
            
            // Still record the purchase for manual processing later
            await storage.createActivity({
              userId,
              action: "TOKEN_PURCHASE",
              details: `Purchased ${tokenAmount} NPT tokens to wallet ${walletAddress} - NEEDS MANUAL PROCESSING`,
              ipAddress: req.ip || "webhook"
            });
          }
        } else {
          // Log incomplete metadata
          console.error(`Incomplete metadata for payment intent ${paymentIntent.id}. userId: ${userId}, tokenAmount: ${tokenAmount}, walletAddress: ${walletAddress || "missing"}`);
          
          // Create activity for manual handling
          if (userId) {
            await storage.createActivity({
              userId,
              action: "TOKEN_PURCHASE_INCOMPLETE",
              details: `Payment received but incomplete metadata. Amount: ${tokenAmount || "unknown"}, Wallet: ${walletAddress || "unknown"}`,
              ipAddress: req.ip || "webhook"
            });
          }
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
