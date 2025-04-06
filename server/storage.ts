import { 
  users, type User, type InsertUser,
  wallets, type Wallet, type InsertWallet,
  transactions, type Transaction, type InsertTransaction,
  activities, type Activity, type InsertActivity
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
  
  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private wallets: Map<number, Wallet>;
  private transactions: Map<number, Transaction>;
  private activities: Map<number, Activity>;
  private userIdCounter = 1;
  private walletIdCounter = 1;
  private transactionIdCounter = 1;
  private activityIdCounter = 1;
  public sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.wallets = new Map();
    this.transactions = new Map();
    this.activities = new Map();
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
      lastUpdated: now
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

  private async initializeDemoData() {
    // Create demo user
    const demoUser = await this.createUser({
      username: "demouser",
      firstName: "Demo",
      lastName: "User",
      email: "demo@nepalipay.com",
      password: "$2b$10$JQMN5yfcuSGLYQVEUlN1A.n4TjdqLrURoJoS3XAXBIGIvB3jQXPLm", // "password123"
      role: "USER",
      phoneNumber: "+9779841234567"
    });

    // Create wallet for demo user
    const demoWallet = await this.createWallet({
      userId: demoUser.id,
      balance: "5000",
      currency: "NPT"
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
