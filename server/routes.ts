import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { isAuthenticated, isAdmin, isSuperAdmin } from "./auth";
import {
  insertWalletSchema,
  insertTransactionSchema,
  insertLoanSchema,
  insertCollateralSchema,
  insertAdSchema,
  transactionFeeSchema,
} from "../shared/schema";
import { z } from "zod";
import { WebSocketServer, WebSocket } from "ws";
import { ethers } from "ethers";

// Stripe initialization
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("Missing STRIPE_SECRET_KEY environment variable");
}

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16" as any,
    })
  : null;

// Register all API routes
export function registerRoutes(app: Express): Server {
  // Profile routes
  app.get("/api/profile", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser(req.user!.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Return user profile without sensitive information
      const { password, ...profile } = user;
      res.status(200).json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.patch("/api/profile", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const allowedFields = ["full_name", "phone", "wallet_address"];
      
      // Filter out fields that are not allowed to be updated
      const updates = Object.keys(req.body)
        .filter(key => allowedFields.includes(key))
        .reduce((obj, key) => ({ ...obj, [key]: req.body[key] }), {});
      
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "No valid fields to update" });
      }
      
      const updatedUser = await storage.updateUser(req.user!.id, updates);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Return updated profile without sensitive information
      const { password, ...profile } = updatedUser;
      res.status(200).json(profile);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Wallet routes
  app.get("/api/wallets", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const wallets = await storage.getWalletsByUserId(req.user!.id);
      res.status(200).json(wallets);
    } catch (error) {
      console.error("Error fetching wallets:", error);
      res.status(500).json({ message: "Failed to fetch wallets" });
    }
  });

  app.post("/api/wallets", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const walletData = insertWalletSchema.safeParse(req.body);
      
      if (!walletData.success) {
        return res.status(400).json({ 
          message: "Invalid wallet data", 
          errors: walletData.error.errors 
        });
      }
      
      // Check if wallet with address already exists
      const existingWallet = await storage.getWalletByAddress(walletData.data.address);
      if (existingWallet) {
        return res.status(409).json({ message: "Wallet address already exists" });
      }
      
      // Get current wallets to check if this is the first one (make primary)
      const currentWallets = await storage.getWalletsByUserId(req.user!.id);
      const isPrimary = currentWallets.length === 0;
      
      const wallet = await storage.createWallet({
        ...walletData.data,
        user_id: req.user!.id,
        is_primary: isPrimary,
      });
      
      res.status(201).json(wallet);
    } catch (error) {
      console.error("Error creating wallet:", error);
      res.status(500).json({ message: "Failed to create wallet" });
    }
  });

  app.patch("/api/wallets/:id/primary", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const walletId = parseInt(req.params.id);
      if (isNaN(walletId)) {
        return res.status(400).json({ message: "Invalid wallet ID" });
      }
      
      // Check if wallet exists and belongs to user
      const wallet = await storage.getWallet(walletId);
      if (!wallet) {
        return res.status(404).json({ message: "Wallet not found" });
      }
      
      if (wallet.user_id !== req.user!.id) {
        return res.status(403).json({ message: "You don't have permission to update this wallet" });
      }
      
      // Get all user wallets and update primary status
      const userWallets = await storage.getWalletsByUserId(req.user!.id);
      
      // Update all wallets to non-primary
      for (const userWallet of userWallets) {
        if (userWallet.is_primary) {
          await storage.updateWallet(userWallet.id, { is_primary: false });
        }
      }
      
      // Set target wallet as primary
      const updatedWallet = await storage.updateWallet(walletId, { is_primary: true });
      res.status(200).json(updatedWallet);
    } catch (error) {
      console.error("Error setting primary wallet:", error);
      res.status(500).json({ message: "Failed to set primary wallet" });
    }
  });

  app.delete("/api/wallets/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const walletId = parseInt(req.params.id);
      if (isNaN(walletId)) {
        return res.status(400).json({ message: "Invalid wallet ID" });
      }
      
      // Check if wallet exists and belongs to user
      const wallet = await storage.getWallet(walletId);
      if (!wallet) {
        return res.status(404).json({ message: "Wallet not found" });
      }
      
      if (wallet.user_id !== req.user!.id) {
        return res.status(403).json({ message: "You don't have permission to delete this wallet" });
      }
      
      // Check if it's the primary wallet
      if (wallet.is_primary) {
        // Find another wallet to make primary
        const userWallets = await storage.getWalletsByUserId(req.user!.id);
        const otherWallet = userWallets.find(w => w.id !== walletId);
        
        if (otherWallet) {
          await storage.updateWallet(otherWallet.id, { is_primary: true });
        }
      }
      
      // Delete the wallet
      await storage.deleteWallet(walletId);
      res.status(200).json({ message: "Wallet deleted successfully" });
    } catch (error) {
      console.error("Error deleting wallet:", error);
      res.status(500).json({ message: "Failed to delete wallet" });
    }
  });

  // Transaction routes
  app.get("/api/transactions", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      const transactions = await storage.getTransactionsByUserId(req.user!.id, limit, offset);
      res.status(200).json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.get("/api/transactions/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const transactionId = parseInt(req.params.id);
      if (isNaN(transactionId)) {
        return res.status(400).json({ message: "Invalid transaction ID" });
      }
      
      const transaction = await storage.getTransaction(transactionId);
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      
      // Check if user is associated with the transaction
      if (transaction.sender_id !== req.user!.id && transaction.receiver_id !== req.user!.id) {
        return res.status(403).json({ message: "You don't have permission to view this transaction" });
      }
      
      res.status(200).json(transaction);
    } catch (error) {
      console.error("Error fetching transaction:", error);
      res.status(500).json({ message: "Failed to fetch transaction" });
    }
  });

  app.post("/api/transactions", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const transactionData = transactionFeeSchema.safeParse(req.body);
      
      if (!transactionData.success) {
        return res.status(400).json({ 
          message: "Invalid transaction data", 
          errors: transactionData.error.errors 
        });
      }
      
      // Create transaction with current user as sender
      const transaction = await storage.createTransaction({
        ...transactionData.data,
        sender_id: req.user!.id,
        status: "pending",
      });
      
      // Create activity record
      await storage.createActivity({
        user_id: req.user!.id,
        action: "transaction",
        description: `Transaction created: ${transaction.type} of ${transaction.amount} ${transaction.currency}`,
      });
      
      res.status(201).json(transaction);
    } catch (error) {
      console.error("Error creating transaction:", error);
      res.status(500).json({ message: "Failed to create transaction" });
    }
  });

  // Loan routes
  app.get("/api/loans", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      const loans = await storage.getLoansByUserId(req.user!.id, limit, offset);
      res.status(200).json(loans);
    } catch (error) {
      console.error("Error fetching loans:", error);
      res.status(500).json({ message: "Failed to fetch loans" });
    }
  });

  app.get("/api/loans/active", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const activeLoans = await storage.getActiveLoansByUserId(req.user!.id);
      res.status(200).json(activeLoans);
    } catch (error) {
      console.error("Error fetching active loans:", error);
      res.status(500).json({ message: "Failed to fetch active loans" });
    }
  });

  app.get("/api/loans/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const loanId = parseInt(req.params.id);
      if (isNaN(loanId)) {
        return res.status(400).json({ message: "Invalid loan ID" });
      }
      
      const loan = await storage.getLoan(loanId);
      if (!loan) {
        return res.status(404).json({ message: "Loan not found" });
      }
      
      // Check if user owns the loan
      if (loan.user_id !== req.user!.id && req.user!.role !== 'admin' && req.user!.role !== 'superadmin') {
        return res.status(403).json({ message: "You don't have permission to view this loan" });
      }
      
      // Get collateral for this loan
      const collateral = await storage.getCollateralByLoanId(loanId);
      
      res.status(200).json({ ...loan, collateral });
    } catch (error) {
      console.error("Error fetching loan:", error);
      res.status(500).json({ message: "Failed to fetch loan" });
    }
  });

  app.post("/api/loans", isAuthenticated, async (req: Request, res: Response) => {
    try {
      // Validate loan data
      const loanData = insertLoanSchema.safeParse(req.body);
      
      if (!loanData.success) {
        return res.status(400).json({ 
          message: "Invalid loan data", 
          errors: loanData.error.errors 
        });
      }

      // Validate collateral data
      const collateralData = insertCollateralSchema.safeParse(req.body.collateral);
      
      if (!collateralData.success) {
        return res.status(400).json({ 
          message: "Invalid collateral data", 
          errors: collateralData.error.errors 
        });
      }
      
      // Create new loan with pending status
      const loan = await storage.createLoan({
        ...loanData.data,
        user_id: req.user!.id,
        status: "pending",
      });
      
      // Create collateral linked to the loan
      const collateral = await storage.createCollateral({
        ...collateralData.data,
        user_id: req.user!.id,
        loan_id: loan.id,
      });
      
      // Create activity record for loan request
      await storage.createActivity({
        user_id: req.user!.id,
        action: "loan",
        description: `Loan requested: ${loan.amount} with collateral: ${collateral.type} ${collateral.amount}`,
      });
      
      res.status(201).json({ ...loan, collateral });
    } catch (error) {
      console.error("Error creating loan:", error);
      res.status(500).json({ message: "Failed to create loan" });
    }
  });

  // Admin-only loan update route
  app.patch("/api/loans/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      const loanId = parseInt(req.params.id);
      if (isNaN(loanId)) {
        return res.status(400).json({ message: "Invalid loan ID" });
      }
      
      // Validate status
      const validStatuses = ["pending", "active", "repaid", "defaulted", "liquidated"];
      
      if (req.body.status && !validStatuses.includes(req.body.status)) {
        return res.status(400).json({ message: "Invalid loan status" });
      }
      
      // Get the loan
      const loan = await storage.getLoan(loanId);
      if (!loan) {
        return res.status(404).json({ message: "Loan not found" });
      }
      
      // Update loan
      const updatedLoan = await storage.updateLoan(loanId, {
        status: req.body.status,
        ...req.body.due_date && { due_date: req.body.due_date },
      });
      
      // Create activity record for loan status change
      await storage.createActivity({
        user_id: loan.user_id,
        action: "loan",
        description: `Loan ID ${loanId} status changed to: ${req.body.status}`,
      });
      
      res.status(200).json(updatedLoan);
    } catch (error) {
      console.error("Error updating loan:", error);
      res.status(500).json({ message: "Failed to update loan" });
    }
  });

  // Collateral routes
  app.get("/api/collaterals", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const collaterals = await storage.getCollateralsByUserId(req.user!.id);
      res.status(200).json(collaterals);
    } catch (error) {
      console.error("Error fetching collaterals:", error);
      res.status(500).json({ message: "Failed to fetch collaterals" });
    }
  });

  // Standalone collateral creation without loan
  app.post("/api/collaterals", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const collateralData = insertCollateralSchema.safeParse(req.body);
      
      if (!collateralData.success) {
        return res.status(400).json({ 
          message: "Invalid collateral data", 
          errors: collateralData.error.errors 
        });
      }
      
      // Create collateral without a loan
      const collateral = await storage.createCollateral({
        ...collateralData.data,
        user_id: req.user!.id,
        loan_id: req.body.loan_id || null,
      });
      
      res.status(201).json(collateral);
    } catch (error) {
      console.error("Error creating collateral:", error);
      res.status(500).json({ message: "Failed to create collateral" });
    }
  });

  // Marketplace Ad routes
  app.get("/api/ads", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      // Get active ads only
      const ads = await storage.getActiveAds(limit, offset);
      res.status(200).json(ads);
    } catch (error) {
      console.error("Error fetching ads:", error);
      res.status(500).json({ message: "Failed to fetch ads" });
    }
  });

  app.get("/api/my-ads", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      // Get ads for current user
      const ads = await storage.getAdsByUserId(req.user!.id, limit, offset);
      res.status(200).json(ads);
    } catch (error) {
      console.error("Error fetching user ads:", error);
      res.status(500).json({ message: "Failed to fetch your ads" });
    }
  });

  app.post("/api/ads", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const adData = insertAdSchema.safeParse(req.body);
      
      if (!adData.success) {
        return res.status(400).json({ 
          message: "Invalid ad data", 
          errors: adData.error.errors 
        });
      }
      
      // Create ad for the current user
      const ad = await storage.createAd({
        ...adData.data,
        user_id: req.user!.id,
        status: "active",
        expires_at: req.body.expires_at || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days
      });
      
      res.status(201).json(ad);
    } catch (error) {
      console.error("Error creating ad:", error);
      res.status(500).json({ message: "Failed to create ad" });
    }
  });

  app.patch("/api/ads/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const adId = parseInt(req.params.id);
      if (isNaN(adId)) {
        return res.status(400).json({ message: "Invalid ad ID" });
      }
      
      // Check if ad exists and belongs to user
      const ad = await storage.getAd(adId);
      if (!ad) {
        return res.status(404).json({ message: "Ad not found" });
      }
      
      if (ad.user_id !== req.user!.id) {
        return res.status(403).json({ message: "You don't have permission to update this ad" });
      }
      
      // Validate status
      if (req.body.status && !["active", "paused", "cancelled"].includes(req.body.status)) {
        return res.status(400).json({ message: "Invalid ad status" });
      }
      
      // Update allowed fields
      const allowedFields = ["title", "description", "price", "status", "expires_at"];
      const updates = Object.keys(req.body)
        .filter(key => allowedFields.includes(key))
        .reduce((obj, key) => ({ ...obj, [key]: req.body[key] }), {});
      
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "No valid fields to update" });
      }
      
      const updatedAd = await storage.updateAd(adId, updates);
      res.status(200).json(updatedAd);
    } catch (error) {
      console.error("Error updating ad:", error);
      res.status(500).json({ message: "Failed to update ad" });
    }
  });

  app.delete("/api/ads/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const adId = parseInt(req.params.id);
      if (isNaN(adId)) {
        return res.status(400).json({ message: "Invalid ad ID" });
      }
      
      // Check if ad exists and belongs to user
      const ad = await storage.getAd(adId);
      if (!ad) {
        return res.status(404).json({ message: "Ad not found" });
      }
      
      if (ad.user_id !== req.user!.id) {
        return res.status(403).json({ message: "You don't have permission to delete this ad" });
      }
      
      await storage.deleteAd(adId);
      res.status(200).json({ message: "Ad deleted successfully" });
    } catch (error) {
      console.error("Error deleting ad:", error);
      res.status(500).json({ message: "Failed to delete ad" });
    }
  });

  // Stripe payment routes
  app.post("/api/create-payment-intent", isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!stripe) {
        return res.status(500).json({ message: "Stripe is not configured" });
      }
      
      const { amount, currency = "usd", paymentMethodType = "card" } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }
      
      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        payment_method_types: [paymentMethodType],
        metadata: {
          user_id: req.user!.id.toString(),
        },
      });
      
      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ message: "Failed to create payment intent" });
    }
  });

  // NPT token purchase endpoint
  app.post("/api/purchase-npt", isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!stripe) {
        return res.status(500).json({ message: "Stripe is not configured" });
      }
      
      const { 
        nptAmount, // Amount of NPT tokens to purchase
        walletAddress, // User's blockchain wallet address
        includeGasFee = true // Whether to include gas fee in the payment
      } = req.body;
      
      if (!nptAmount || nptAmount <= 0) {
        return res.status(400).json({ message: "Invalid token amount" });
      }
      
      if (!walletAddress) {
        return res.status(400).json({ message: "Wallet address is required" });
      }
      
      // Calculate price in USD (this would typically use an exchange rate API)
      // For now, using a fixed rate of 1 NPT = 0.01 USD (1 cent)
      const exchangeRate = 0.01; 
      let amountUsd = nptAmount * exchangeRate;
      
      // Add gas fee if requested (estimated)
      const gasFeeUsd = includeGasFee ? 0.5 : 0; // $0.50 for gas fee
      
      // Add service fee (2% of token cost)
      const serviceFeeUsd = amountUsd * 0.02;
      
      // Total amount to charge in USD
      const totalAmountUsd = amountUsd + gasFeeUsd + serviceFeeUsd;
      
      // Create a PaymentIntent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalAmountUsd * 100), // Convert to cents
        currency: "usd",
        payment_method_types: ["card"],
        metadata: {
          user_id: req.user!.id.toString(),
          npt_amount: nptAmount.toString(),
          wallet_address: walletAddress,
          token_purchase: "true",
          gas_fee_included: includeGasFee.toString(),
          service_fee: serviceFeeUsd.toFixed(2)
        },
      });
      
      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        total: totalAmountUsd,
        breakdown: {
          tokenCost: amountUsd,
          gasFee: gasFeeUsd,
          serviceFee: serviceFeeUsd
        }
      });
    } catch (error) {
      console.error("Error creating NPT purchase intent:", error);
      res.status(500).json({ message: "Failed to create NPT purchase intent" });
    }
  });
  
  // Get payment information for success page
  app.get("/api/payment/:paymentIntentId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!stripe) {
        return res.status(500).json({ message: "Stripe is not configured" });
      }
      
      const { paymentIntentId } = req.params;
      
      // Retrieve the payment intent from Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      // Only return payment details if the payment intent belongs to the authenticated user
      if (paymentIntent.metadata?.user_id !== req.user!.id.toString()) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Get the transaction record from our database if exists
      let txHash = paymentIntentId;
      try {
        const transaction = await storage.getTransactionByHash(paymentIntentId);
        if (transaction?.tx_hash) {
          txHash = transaction.tx_hash;
        }
      } catch (error) {
        console.error("Error fetching transaction:", error);
        // Continue without transaction data
      }
      
      const responseData = {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        status: paymentIntent.status,
        tokenAmount: paymentIntent.metadata?.npt_amount || "0",
        walletAddress: paymentIntent.metadata?.wallet_address || "",
        txHash
      };
      
      res.status(200).json(responseData);
    } catch (error) {
      console.error("Error retrieving payment information:", error);
      res.status(500).json({ 
        message: "Failed to retrieve payment information",
        error: error.message
      });
    }
  });

  // Stripe webhook handler
  app.post("/api/stripe-webhook", async (req: Request, res: Response) => {
    if (!stripe) {
      return res.status(500).json({ message: "Stripe is not configured" });
    }
    
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!sig || !endpointSecret) {
      return res.status(400).json({ message: "Stripe signature or endpoint secret missing" });
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
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
        
        // Process successful payment logic here
        if (paymentIntent.metadata && paymentIntent.metadata.user_id) {
          const userId = parseInt(paymentIntent.metadata.user_id);
          
          // Check if this is a token purchase
          if (paymentIntent.metadata.token_purchase === "true") {
            const nptAmount = paymentIntent.metadata.npt_amount;
            const walletAddress = paymentIntent.metadata.wallet_address;
            
            // In a real implementation, you would:
            // 1. Connect to the blockchain using ethers.js
            // 2. Call the token contract's transfer method to send tokens from treasury to user
            // 3. Wait for the transaction to be mined
            // 4. Store the transaction hash
            
            // For now, we'll simulate this with a transaction record
            console.log(`Processing NPT token purchase: ${nptAmount} NPT to wallet ${walletAddress}`);
            
            // Create a transaction record for the token purchase
            await storage.createTransaction({
              type: "token_purchase",
              amount: nptAmount,
              currency: "NPT",
              status: "completed",
              receiver_id: userId,
              sender_id: null, // System/Treasury transaction
              tx_hash: paymentIntent.id, // In real implementation, this would be the blockchain tx hash
              description: `Purchase of ${nptAmount} NPT tokens via Stripe payment`,
            });
            
            // Create activity record
            await storage.createActivity({
              user_id: userId,
              action: "token_purchase",
              description: `Purchased ${nptAmount} NPT tokens to wallet ${walletAddress}`,
            });
            
            // Update user's wallet NPT balance (in a real implementation, this would be fetched from blockchain)
            const wallet = await storage.getWalletByAddress(walletAddress);
            if (wallet) {
              // If we have this wallet in our database, update the balance
              const currentBalance = parseFloat(wallet.npt_balance || "0");
              const newBalance = currentBalance + parseFloat(nptAmount);
              
              await storage.updateWallet(wallet.id, {
                npt_balance: newBalance.toString()
              });
            }
          } else {
            // Regular payment (not a token purchase)
            // Create a transaction record
            await storage.createTransaction({
              type: "deposit",
              amount: (paymentIntent.amount / 100).toString(), // Convert from cents
              currency: "NPT",
              status: "completed",
              receiver_id: userId,
              sender_id: null, // System transaction
              tx_hash: paymentIntent.id,
              description: `Deposit via Stripe payment`,
            });
            
            // Create activity record
            await storage.createActivity({
              user_id: userId,
              action: "transaction",
              description: `Deposit of ${paymentIntent.amount / 100} via Stripe payment`,
            });
          }
        }
        break;
      
      case "payment_intent.payment_failed":
        const failedPaymentIntent = event.data.object;
        console.log(`PaymentIntent failed: ${failedPaymentIntent.id}`);
        
        // Process failed payment logic here
        if (failedPaymentIntent.metadata && failedPaymentIntent.metadata.user_id) {
          const userId = parseInt(failedPaymentIntent.metadata.user_id);
          
          // Create activity record for failed payment
          await storage.createActivity({
            user_id: userId,
            action: "transaction",
            description: `Failed payment via Stripe: ${failedPaymentIntent.id}`,
          });
        }
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    res.status(200).json({ received: true });
  });

  // Admin routes
  app.get("/api/admin/users", isAdmin, async (req: Request, res: Response) => {
    try {
      // In a real application, this would include pagination
      const allUsers = await storage.getAllUsers();
      
      // Remove sensitive information
      const safeUsers = allUsers.map(user => {
        const { password, ...safeUser } = user;
        return safeUser;
      });
      
      res.status(200).json(safeUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/admin/transactions", isAdmin, async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      // Get all transactions with pagination
      const allTransactions = await storage.getAllTransactions(limit, offset);
      
      res.status(200).json(allTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.get("/api/admin/loans", isAdmin, async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      // Get all loans with pagination
      const allLoans = await storage.getAllLoans(limit, offset);
      
      res.status(200).json(allLoans);
    } catch (error) {
      console.error("Error fetching loans:", error);
      res.status(500).json({ message: "Failed to fetch loans" });
    }
  });

  // SuperAdmin config routes
  app.get("/api/superadmin/config", isSuperAdmin, async (req: Request, res: Response) => {
    try {
      // In a real application, this would fetch app configuration from storage
      const config = {
        fee_percentage: process.env.FEE_PERCENTAGE || "2.0",
        gas_price_buffer: process.env.GAS_PRICE_BUFFER || "1.5",
        loan_interest_rate: process.env.LOAN_INTEREST_RATE || "5.0",
        loan_collateral_ratio: process.env.LOAN_COLLATERAL_RATIO || "150",
        token_treasury_address: process.env.TOKEN_TREASURY_ADDRESS || "",
      };
      
      res.status(200).json(config);
    } catch (error) {
      console.error("Error fetching config:", error);
      res.status(500).json({ message: "Failed to fetch configuration" });
    }
  });

  app.patch("/api/superadmin/config", isSuperAdmin, async (req: Request, res: Response) => {
    try {
      // In a real application, this would update app configuration in storage
      const allowedConfigKeys = [
        "fee_percentage", 
        "gas_price_buffer", 
        "loan_interest_rate", 
        "loan_collateral_ratio",
        "token_treasury_address"
      ];
      
      const config = {};
      
      for (const key of allowedConfigKeys) {
        if (req.body[key] !== undefined) {
          // In a real application, we would store these in a database or persistent storage
          process.env[key.toUpperCase()] = req.body[key].toString();
          config[key] = req.body[key];
        }
      }
      
      if (Object.keys(config).length === 0) {
        return res.status(400).json({ message: "No valid configuration keys provided" });
      }
      
      res.status(200).json({ 
        message: "Configuration updated successfully",
        config
      });
    } catch (error) {
      console.error("Error updating config:", error);
      res.status(500).json({ message: "Failed to update configuration" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  // Setup WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    
    ws.on('message', (message) => {
      console.log('Received message:', message.toString());
      
      try {
        const data = JSON.parse(message.toString());
        
        // Example of handling different message types
        if (data.type === 'subscribe' && data.channel) {
          // Subscribe to updates for a specific channel
          ws['subscribed_channel'] = data.channel;
          ws.send(JSON.stringify({ type: 'subscribed', channel: data.channel }));
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
    
    // Send a welcome message
    ws.send(JSON.stringify({ type: 'connected', message: 'Connected to NepaliPay WebSocket server' }));
  });
  
  // Function to broadcast updates to WebSocket clients
  global.broadcastUpdate = (channel: string, data: any) => {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN && client['subscribed_channel'] === channel) {
        client.send(JSON.stringify({ 
          type: 'update', 
          channel, 
          data,
          timestamp: new Date().toISOString() 
        }));
      }
    });
  };

  return httpServer;
}