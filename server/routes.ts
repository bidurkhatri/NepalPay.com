import { Request, Response, NextFunction, Express } from 'express';
import { createServer, type Server } from 'http';
import Stripe from 'stripe';
import { ethers } from 'ethers';
import { storage } from './storage';
import { setupAuth } from './auth';

// Initialize Stripe client
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Missing STRIPE_SECRET_KEY environment variable');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Authentication middleware
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  next();
};

const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated() || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin privileges required' });
  }
  next();
};

const requireSuperadmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated() || req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Superadmin privileges required' });
  }
  next();
};

// Initialize blockchain provider and admin wallet
const provider = new ethers.JsonRpcProvider(
  process.env.RPC_URL || 'https://data-seed.binance.org'
);

let adminWallet: ethers.Wallet | null = null;
if (process.env.ADMIN_PRIVATE_KEY) {
  adminWallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, provider);
  console.log('Admin wallet initialized with address:', adminWallet.address);
} else {
  console.warn('Missing ADMIN_PRIVATE_KEY environment variable, token transfers will not work');
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes (/api/register, /api/login, /api/logout, /api/user)
  setupAuth(app);
  
  // User routes
  app.get('/api/users', requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      // Remove sensitive data
      const safeUsers = users.map(({ password, ...user }) => user);
      res.json(safeUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Error fetching users' });
    }
  });
  
  // User profile route
  app.get('/api/profile', requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Get user's wallet
      const wallet = await storage.getWalletByUserId(user.id);
      
      // Remove sensitive data
      const { password, ...userProfile } = user;
      
      res.json({
        ...userProfile,
        wallet
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({ message: 'Error fetching profile' });
    }
  });
  
  // Update profile route
  app.patch('/api/profile', requireAuth, async (req, res) => {
    try {
      const { id, role, password, ...updateData } = req.body;
      
      // Update the user
      const updatedUser = await storage.updateUser(req.user.id, updateData);
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Remove sensitive data
      const { password: _, ...userProfile } = updatedUser;
      
      res.json(userProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ message: 'Error updating profile' });
    }
  });
  
  // Wallet routes
  app.get('/api/wallet', requireAuth, async (req, res) => {
    try {
      const wallet = await storage.getWalletByUserId(req.user.id);
      if (!wallet) {
        return res.status(404).json({ message: 'Wallet not found' });
      }
      
      res.json(wallet);
    } catch (error) {
      console.error('Error fetching wallet:', error);
      res.status(500).json({ message: 'Error fetching wallet' });
    }
  });
  
  app.post('/api/wallet', requireAuth, async (req, res) => {
    try {
      const existingWallet = await storage.getWalletByUserId(req.user.id);
      if (existingWallet) {
        return res.status(400).json({ message: 'User already has a wallet' });
      }
      
      const { address } = req.body;
      if (!address) {
        return res.status(400).json({ message: 'Wallet address is required' });
      }
      
      const wallet = await storage.createWallet({
        userId: req.user.id,
        address,
        nptBalance: '0',
        bnbBalance: '0'
      });
      
      // Also update the user with the wallet address
      await storage.updateUser(req.user.id, { walletAddress: address });
      
      // Log activity
      await storage.createActivity({
        userId: req.user.id,
        action: 'WALLET_CREATE',
        description: 'Created a new wallet',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent') || ''
      });
      
      res.status(201).json(wallet);
    } catch (error) {
      console.error('Error creating wallet:', error);
      res.status(500).json({ message: 'Error creating wallet' });
    }
  });
  
  // Transaction routes
  app.get('/api/transactions', requireAuth, async (req, res) => {
    try {
      const transactions = await storage.getUserTransactions(req.user.id);
      res.json(transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ message: 'Error fetching transactions' });
    }
  });
  
  app.get('/api/transactions/:id', requireAuth, async (req, res) => {
    try {
      const transaction = await storage.getTransaction(parseInt(req.params.id));
      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
      
      // Check if user is authorized to view this transaction
      if (transaction.senderId !== req.user.id && transaction.receiverId !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to view this transaction' });
      }
      
      res.json(transaction);
    } catch (error) {
      console.error('Error fetching transaction:', error);
      res.status(500).json({ message: 'Error fetching transaction' });
    }
  });
  
  app.post('/api/transactions/transfer', requireAuth, async (req, res) => {
    try {
      const { receiverAddress, amount } = req.body;
      if (!receiverAddress || !amount) {
        return res.status(400).json({ message: 'Receiver address and amount are required' });
      }
      
      // Verify the sender has a wallet
      const senderWallet = await storage.getWalletByUserId(req.user.id);
      if (!senderWallet) {
        return res.status(400).json({ message: 'You need a wallet to make transfers' });
      }
      
      // Check if sender has enough balance (this is a simple check, the actual transfer happens on blockchain)
      const senderBalance = parseFloat(senderWallet.nptBalance);
      const transferAmount = parseFloat(amount);
      if (senderBalance < transferAmount) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }
      
      // Create a pending transaction in the database
      const transaction = await storage.createTransaction({
        senderId: req.user.id,
        receiverId: null, // We don't know the receiver's user ID yet
        amount: amount.toString(),
        currency: 'NPT',
        status: 'pending',
        type: 'transfer',
        description: `Transfer to ${receiverAddress}`
      });
      
      // Log activity
      await storage.createActivity({
        userId: req.user.id,
        action: 'TRANSACTION_INITIATED',
        description: `Initiated transfer of ${amount} NPT to ${receiverAddress}`,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent') || ''
      });
      
      res.status(201).json({
        transaction,
        message: 'Transfer initiated. Please complete the transaction in your Web3 wallet.'
      });
    } catch (error) {
      console.error('Error creating transfer:', error);
      res.status(500).json({ message: 'Error creating transfer' });
    }
  });
  
  // Collateral routes
  app.get('/api/collaterals', requireAuth, async (req, res) => {
    try {
      const collaterals = await storage.getUserCollaterals(req.user.id);
      res.json(collaterals);
    } catch (error) {
      console.error('Error fetching collaterals:', error);
      res.status(500).json({ message: 'Error fetching collaterals' });
    }
  });
  
  app.post('/api/collaterals', requireAuth, async (req, res) => {
    try {
      const { type, amount, ltv } = req.body;
      if (!type || !amount || !ltv) {
        return res.status(400).json({ message: 'Type, amount, and LTV are required' });
      }
      
      // Create a new collateral
      const collateral = await storage.createCollateral({
        userId: req.user.id,
        type,
        amount: amount.toString(),
        status: 'pending',
        ltv: parseInt(ltv)
      });
      
      // Log activity
      await storage.createActivity({
        userId: req.user.id,
        action: 'COLLATERAL_CREATED',
        description: `Created ${amount} ${type} collateral with ${ltv}% LTV`,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent') || ''
      });
      
      res.status(201).json({
        collateral,
        message: 'Collateral created. Please complete the transaction in your Web3 wallet.'
      });
    } catch (error) {
      console.error('Error creating collateral:', error);
      res.status(500).json({ message: 'Error creating collateral' });
    }
  });
  
  // Loan routes
  app.get('/api/loans', requireAuth, async (req, res) => {
    try {
      const loans = await storage.getUserLoans(req.user.id);
      res.json(loans);
    } catch (error) {
      console.error('Error fetching loans:', error);
      res.status(500).json({ message: 'Error fetching loans' });
    }
  });
  
  app.post('/api/loans', requireAuth, async (req, res) => {
    try {
      const { collateralId, amount, term } = req.body;
      if (!collateralId || !amount || !term) {
        return res.status(400).json({ message: 'Collateral ID, amount, and term are required' });
      }
      
      // Verify the collateral exists and belongs to the user
      const collateral = await storage.getCollateral(parseInt(collateralId));
      if (!collateral) {
        return res.status(404).json({ message: 'Collateral not found' });
      }
      
      if (collateral.userId !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to use this collateral' });
      }
      
      if (collateral.status !== 'active') {
        return res.status(400).json({ message: 'Collateral is not active' });
      }
      
      // Calculate interest based on collateral type and LTV
      const interest = '5'; // 5% interest rate, could be more dynamic based on risk
      
      // Calculate due date (term is in days)
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + parseInt(term));
      
      // Create a new loan
      const loan = await storage.createLoan({
        userId: req.user.id,
        collateralId: collateral.id,
        amount: amount.toString(),
        interest,
        term: parseInt(term),
        status: 'pending',
        dueDate
      });
      
      // Log activity
      await storage.createActivity({
        userId: req.user.id,
        action: 'LOAN_CREATED',
        description: `Created loan of ${amount} NPT for ${term} days`,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent') || ''
      });
      
      res.status(201).json({
        loan,
        message: 'Loan created. Waiting for approval.'
      });
    } catch (error) {
      console.error('Error creating loan:', error);
      res.status(500).json({ message: 'Error creating loan' });
    }
  });
  
  // Ad routes
  app.get('/api/ads', async (req, res) => {
    try {
      const ads = await storage.getActiveAds();
      res.json(ads);
    } catch (error) {
      console.error('Error fetching ads:', error);
      res.status(500).json({ message: 'Error fetching ads' });
    }
  });
  
  app.post('/api/ads', requireAuth, async (req, res) => {
    try {
      const { title, description, budget, startDate, endDate } = req.body;
      if (!title || !description || !budget) {
        return res.status(400).json({ message: 'Title, description, and budget are required' });
      }
      
      // Create a new ad
      const ad = await storage.createAd({
        userId: req.user.id,
        title,
        description,
        status: 'pending',
        budget: budget.toString(),
        impressions: 0,
        clicks: 0,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null
      });
      
      // Log activity
      await storage.createActivity({
        userId: req.user.id,
        action: 'AD_CREATED',
        description: `Created ad: ${title}`,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent') || ''
      });
      
      res.status(201).json({
        ad,
        message: 'Ad created. Waiting for approval.'
      });
    } catch (error) {
      console.error('Error creating ad:', error);
      res.status(500).json({ message: 'Error creating ad' });
    }
  });
  
  // Stripe payment routes
  app.post('/api/create-payment-intent', requireAuth, async (req, res) => {
    try {
      const { amount, tokenAmount } = req.body;
      
      if (!amount) {
        return res.status(400).json({ message: 'Amount is required' });
      }
      
      // Create a Payment Intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        description: `Purchase of ${tokenAmount} NPT tokens`,
        metadata: {
          userId: req.user.id.toString(),
          tokenAmount: tokenAmount.toString()
        }
      });
      
      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error: any) {
      console.error('Error creating payment intent:', error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // Webhook handler for Stripe events
  app.post('/api/webhook', async (req, res) => {
    const sig = req.headers['stripe-signature'] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!endpointSecret) {
      return res.status(400).json({ message: 'Webhook secret not configured' });
    }
    
    let event;
    
    try {
      // Verify the webhook signature
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).json({ message: `Webhook Error: ${err.message}` });
    }
    
    // Handle the event
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      
      try {
        // Extract metadata
        const userId = parseInt(paymentIntent.metadata.userId);
        const tokenAmount = paymentIntent.metadata.tokenAmount;
        
        // Get user and wallet
        const user = await storage.getUser(userId);
        if (!user) {
          throw new Error('User not found');
        }
        
        const wallet = await storage.getWalletByUserId(userId);
        if (!wallet) {
          throw new Error('Wallet not found');
        }
        
        // Create a transaction record
        const transaction = await storage.createTransaction({
          senderId: null, // This is from the treasury/system
          receiverId: userId,
          amount: tokenAmount,
          currency: 'NPT',
          status: 'completed',
          type: 'purchase',
          description: 'Token purchase via Stripe',
          stripePaymentId: paymentIntent.id
        });
        
        // Update wallet balance (optimistic update, actual tokens will be transferred by the admin wallet)
        const currentBalance = parseFloat(wallet.nptBalance);
        const newBalance = currentBalance + parseFloat(tokenAmount);
        
        await storage.updateWallet(wallet.id, {
          nptBalance: newBalance.toString()
        });
        
        // Log activity
        await storage.createActivity({
          userId,
          action: 'PAYMENT_COMPLETED',
          description: `Purchased ${tokenAmount} NPT tokens`,
          ipAddress: 'stripe-webhook',
          userAgent: 'Stripe'
        });
        
        // Transfer tokens from admin wallet to user wallet
        if (adminWallet && wallet.address) {
          // This would normally call a contract method to transfer tokens
          // The actual implementation would depend on your smart contract
          console.log(`[SIMULATION] Transferring ${tokenAmount} NPT from ${adminWallet.address} to ${wallet.address}`);
          
          // In a real implementation, you would do something like:
          // const contract = new ethers.Contract(tokenContractAddress, tokenAbi, adminWallet);
          // const tx = await contract.transfer(wallet.address, ethers.utils.parseUnits(tokenAmount, 18));
          // await tx.wait();
          // const txHash = tx.hash;
          
          // Update transaction with tx hash once complete
          // await storage.updateTransaction(transaction.id, { txHash });
        } else {
          console.warn('Admin wallet not configured, cannot transfer tokens');
        }
        
        console.log(`Payment for user ${userId} completed successfully`);
      } catch (error) {
        console.error('Error processing payment success:', error);
      }
    }
    
    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
  });
  
  // Verification endpoint for payment status
  app.get('/api/payment/:paymentId', requireAuth, async (req, res) => {
    try {
      const { paymentId } = req.params;
      
      // Fetch payment from Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
      
      // Verify this payment belongs to the authenticated user
      if (paymentIntent.metadata.userId !== req.user.id.toString()) {
        return res.status(403).json({ message: 'Not authorized to view this payment' });
      }
      
      // Fetch transaction from our database
      const transaction = await storage.getTransaction(paymentId);
      
      res.json({
        paymentStatus: paymentIntent.status,
        transaction: transaction || null
      });
    } catch (error: any) {
      console.error('Error verifying payment:', error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // Create an HTTP server
  const httpServer = createServer(app);
  
  return httpServer;
}