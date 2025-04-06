import { 
  users, type User, type InsertUser,
  wallets, type Wallet, type InsertWallet,
  transactions, type Transaction, type InsertTransaction,
  activities, type Activity, type InsertActivity,
  collaterals, type Collateral, type InsertCollateral,
  loans, type Loan, type InsertLoan,
  ads, type Ad, type InsertAd
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Wallet methods
  getWallet(id: number): Promise<Wallet | undefined>;
  getWalletByUserId(userId: number): Promise<Wallet | undefined>;
  createWallet(wallet: InsertWallet): Promise<Wallet>;
  updateWallet(id: number, wallet: Partial<Wallet>): Promise<Wallet | undefined>;
  
  // Transaction methods
  getTransaction(id: number): Promise<Transaction | undefined>;
  getTransactionsBySenderId(senderId: number): Promise<Transaction[]>;
  getTransactionsByReceiverId(receiverId: number): Promise<Transaction[]>;
  getUserTransactions(userId: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  
  // Activity methods
  getActivity(id: number): Promise<Activity | undefined>;
  getUserActivities(userId: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  
  // Collateral methods
  getCollateral(id: number): Promise<Collateral | undefined>;
  getUserCollaterals(userId: number): Promise<Collateral[]>;
  createCollateral(collateral: InsertCollateral): Promise<Collateral>;
  updateCollateral(id: number, collateral: Partial<Collateral>): Promise<Collateral | undefined>;
  
  // Loan methods
  getLoan(id: number): Promise<Loan | undefined>;
  getUserLoans(userId: number): Promise<Loan[]>;
  getActiveLoans(): Promise<Loan[]>;
  createLoan(loan: InsertLoan): Promise<Loan>;
  updateLoan(id: number, loan: Partial<Loan>): Promise<Loan | undefined>;
  
  // Ad methods
  getAd(id: number): Promise<Ad | undefined>;
  getUserAds(userId: number): Promise<Ad[]>;
  getActiveAds(): Promise<Ad[]>;
  createAd(ad: InsertAd): Promise<Ad>;
  updateAd(id: number, ad: Partial<Ad>): Promise<Ad | undefined>;
  
  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private wallets: Map<number, Wallet>;
  private transactions: Map<number, Transaction>;
  private activities: Map<number, Activity>;
  private collaterals: Map<number, Collateral>;
  private loans: Map<number, Loan>;
  private ads: Map<number, Ad>;
  private userIdCounter = 1;
  private walletIdCounter = 1;
  private transactionIdCounter = 1;
  private activityIdCounter = 1;
  private collateralIdCounter = 1;
  private loanIdCounter = 1;
  private adIdCounter = 1;
  public sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.wallets = new Map();
    this.transactions = new Map();
    this.activities = new Map();
    this.collaterals = new Map();
    this.loans = new Map();
    this.ads = new Map();
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    this.initializeDemoData();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      user => user.username === username
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      user => user.email === email
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    
    const user: User = { 
      id, 
      username: insertUser.username,
      password: insertUser.password,
      firstName: insertUser.firstName,
      lastName: insertUser.lastName,
      email: insertUser.email,
      role: insertUser.role || 'USER', // Default role if not provided
      phoneNumber: insertUser.phoneNumber || null, // Default to null if not provided
      finapiUserId: insertUser.finapiUserId || null,
      kycStatus: insertUser.kycStatus || 'PENDING',
      kycVerificationId: insertUser.kycVerificationId || null,
      kycVerifiedAt: null,
      createdAt: now
    };
    
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getWallet(id: number): Promise<Wallet | undefined> {
    return this.wallets.get(id);
  }

  async getWalletByUserId(userId: number): Promise<Wallet | undefined> {
    return Array.from(this.wallets.values()).find(
      wallet => wallet.userId === userId
    );
  }

  async createWallet(insertWallet: InsertWallet): Promise<Wallet> {
    const id = this.walletIdCounter++;
    const now = new Date();
    
    const wallet: Wallet = { 
      id, 
      userId: insertWallet.userId,
      balance: insertWallet.balance || "0",
      currency: insertWallet.currency || "NPT",
      lastUpdated: now,
      walletAddress: insertWallet.walletAddress || null
    };
    
    this.wallets.set(id, wallet);
    return wallet;
  }

  async updateWallet(id: number, walletData: Partial<Wallet>): Promise<Wallet | undefined> {
    const wallet = this.wallets.get(id);
    if (!wallet) return undefined;
    
    const now = new Date();
    const updatedWallet = { 
      ...wallet, 
      ...walletData,
      lastUpdated: now
    };
    
    this.wallets.set(id, updatedWallet);
    return updatedWallet;
  }

  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async getTransactionsBySenderId(senderId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      transaction => transaction.senderId === senderId
    );
  }

  async getTransactionsByReceiverId(receiverId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      transaction => transaction.receiverId === receiverId
    );
  }

  async getUserTransactions(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      transaction => transaction.senderId === userId || transaction.receiverId === userId
    );
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionIdCounter++;
    const now = new Date();
    
    const transaction: Transaction = { 
      id,
      type: insertTransaction.type,
      amount: insertTransaction.amount,
      status: insertTransaction.status || "COMPLETED",
      senderId: insertTransaction.senderId || null,
      receiverId: insertTransaction.receiverId || null,
      note: insertTransaction.note || null,
      txHash: insertTransaction.txHash || null,
      createdAt: now
    };
    
    this.transactions.set(id, transaction);
    return transaction;
  }

  async getActivity(id: number): Promise<Activity | undefined> {
    return this.activities.get(id);
  }

  async getUserActivities(userId: number): Promise<Activity[]> {
    return Array.from(this.activities.values()).filter(
      activity => activity.userId === userId
    );
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.activityIdCounter++;
    const now = new Date();
    
    const activity: Activity = { 
      id,
      userId: insertActivity.userId,
      action: insertActivity.action,
      details: insertActivity.details || null,
      ipAddress: insertActivity.ipAddress || null,
      createdAt: now
    };
    
    this.activities.set(id, activity);
    return activity;
  }

  // Collateral methods
  async getCollateral(id: number): Promise<Collateral | undefined> {
    return this.collaterals.get(id);
  }

  async getUserCollaterals(userId: number): Promise<Collateral[]> {
    return Array.from(this.collaterals.values()).filter(
      collateral => collateral.userId === userId
    );
  }

  async createCollateral(insertCollateral: InsertCollateral): Promise<Collateral> {
    const id = this.collateralIdCounter++;
    const now = new Date();
    
    const collateral: Collateral = { 
      id, 
      userId: insertCollateral.userId,
      type: insertCollateral.type,
      amount: insertCollateral.amount,
      valueInNPT: insertCollateral.valueInNPT,
      createdAt: now,
      updatedAt: now
    };
    
    this.collaterals.set(id, collateral);
    return collateral;
  }

  async updateCollateral(id: number, collateralData: Partial<Collateral>): Promise<Collateral | undefined> {
    const collateral = this.collaterals.get(id);
    if (!collateral) return undefined;
    
    const now = new Date();
    const updatedCollateral = { 
      ...collateral, 
      ...collateralData,
      updatedAt: now
    };
    
    this.collaterals.set(id, updatedCollateral);
    return updatedCollateral;
  }

  // Loan methods
  async getLoan(id: number): Promise<Loan | undefined> {
    return this.loans.get(id);
  }

  async getUserLoans(userId: number): Promise<Loan[]> {
    return Array.from(this.loans.values()).filter(
      loan => loan.userId === userId
    );
  }

  async getActiveLoans(): Promise<Loan[]> {
    return Array.from(this.loans.values()).filter(
      loan => loan.status === "ACTIVE"
    );
  }

  async createLoan(insertLoan: InsertLoan): Promise<Loan> {
    const id = this.loanIdCounter++;
    const now = new Date();
    
    const loan: Loan = { 
      id, 
      userId: insertLoan.userId,
      amount: insertLoan.amount,
      collateralId: insertLoan.collateralId,
      interestRate: insertLoan.interestRate,
      startDate: insertLoan.startDate ? new Date(insertLoan.startDate) : now,
      endDate: insertLoan.endDate ? new Date(insertLoan.endDate) : null,
      status: insertLoan.status || "ACTIVE",
      createdAt: now,
      updatedAt: now
    };
    
    this.loans.set(id, loan);
    return loan;
  }

  async updateLoan(id: number, loanData: Partial<Loan>): Promise<Loan | undefined> {
    const loan = this.loans.get(id);
    if (!loan) return undefined;
    
    const now = new Date();
    const updatedLoan = { 
      ...loan, 
      ...loanData,
      updatedAt: now
    };
    
    this.loans.set(id, updatedLoan);
    return updatedLoan;
  }

  // Ad methods
  async getAd(id: number): Promise<Ad | undefined> {
    return this.ads.get(id);
  }

  async getUserAds(userId: number): Promise<Ad[]> {
    return Array.from(this.ads.values()).filter(
      ad => ad.userId === userId
    );
  }

  async getActiveAds(): Promise<Ad[]> {
    const now = new Date();
    
    return Array.from(this.ads.values()).filter(
      ad => ad.status === "ACTIVE" && 
           new Date(ad.startDate) <= now && 
           new Date(ad.endDate) >= now
    );
  }

  async createAd(insertAd: InsertAd): Promise<Ad> {
    const id = this.adIdCounter++;
    const now = new Date();
    
    const ad: Ad = { 
      id, 
      userId: insertAd.userId,
      title: insertAd.title,
      description: insertAd.description,
      bidAmount: insertAd.bidAmount,
      tier: insertAd.tier,
      startDate: insertAd.startDate ? new Date(insertAd.startDate) : now,
      endDate: insertAd.endDate ? new Date(insertAd.endDate) : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // Default 30 days from now
      status: insertAd.status || "PENDING",
      createdAt: now,
      updatedAt: now
    };
    
    this.ads.set(id, ad);
    return ad;
  }

  async updateAd(id: number, adData: Partial<Ad>): Promise<Ad | undefined> {
    const ad = this.ads.get(id);
    if (!ad) return undefined;
    
    const now = new Date();
    const updatedAd = { 
      ...ad, 
      ...adData,
      updatedAt: now
    };
    
    this.ads.set(id, updatedAd);
    return updatedAd;
  }

  private async initializeDemoData() {
    // Create demo user
    const demoUser = await this.createUser({
      username: "demouser",
      firstName: "Demo",
      lastName: "User",
      email: "demo@nepalipay.com",
      password: "$2b$10$JQMN5yfcuSGLYQVEUlN1A.n4TjdqLrURoJoS3XAXBIGIvB3jQXPLm", // "password123"
      role: "USER",
      phoneNumber: "+9779841234567",
      finapiUserId: null,
      kycStatus: "PENDING",
      kycVerificationId: null
    });

    // Create wallet for demo user
    const demoWallet = await this.createWallet({
      userId: demoUser.id,
      balance: "5000",
      currency: "NPT",
      walletAddress: "0x1234567890123456789012345678901234567890"  // Example wallet address
    });

    // Create some transactions
    await this.createTransaction({
      senderId: demoUser.id,
      receiverId: null,
      amount: "500",
      type: "MOBILE_TOPUP",
      status: "COMPLETED",
      note: "Mobile recharge"
    });

    await this.createTransaction({
      senderId: demoUser.id,
      receiverId: null,
      amount: "1000",
      type: "UTILITY_PAYMENT",
      status: "COMPLETED",
      note: "Electricity bill"
    });

    // Create some activities
    await this.createActivity({
      userId: demoUser.id,
      action: "LOGIN",
      details: "User logged in",
      ipAddress: "192.168.1.1"
    });

    await this.createActivity({
      userId: demoUser.id,
      action: "FAILED_LOGIN",
      details: "Failed login attempt",
      ipAddress: "192.168.1.2"
    });
  }
}

// Import PgStorage
import { PgStorage } from './pg-storage';

// Use PgStorage instead of MemStorage for persistent database storage
export const storage = new PgStorage();
