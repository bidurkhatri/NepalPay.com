import { 
  users, type User, type InsertUser,
  wallets, type Wallet, type InsertWallet,
  transactions, type Transaction, type InsertTransaction,
  activities, type Activity, type InsertActivity
} from "@shared/schema";

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

  constructor() {
    this.users = new Map();
    this.wallets = new Map();
    this.transactions = new Map();
    this.activities = new Map();
    this.initializeDemoData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: now,
      phoneNumber: insertUser.phoneNumber || null
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Wallet methods
  async getWallet(id: number): Promise<Wallet | undefined> {
    return this.wallets.get(id);
  }

  async getWalletByUserId(userId: number): Promise<Wallet | undefined> {
    return Array.from(this.wallets.values()).find(
      (wallet) => wallet.userId === userId
    );
  }

  async createWallet(insertWallet: InsertWallet): Promise<Wallet> {
    const id = this.walletIdCounter++;
    const now = new Date();
    const wallet: Wallet = { 
      ...insertWallet,
      id,
      lastUpdated: now,
      balance: insertWallet.balance || "0",
      currency: insertWallet.currency || "NPR"
    };
    this.wallets.set(id, wallet);
    return wallet;
  }

  async updateWallet(id: number, walletData: Partial<Wallet>): Promise<Wallet | undefined> {
    const wallet = await this.getWallet(id);
    if (!wallet) return undefined;
    
    const updatedWallet = { 
      ...wallet, 
      ...walletData,
      lastUpdated: new Date()
    };
    this.wallets.set(id, updatedWallet);
    return updatedWallet;
  }

  // Transaction methods
  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async getTransactionsBySenderId(senderId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(tx => tx.senderId === senderId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getTransactionsByReceiverId(receiverId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(tx => tx.receiverId === receiverId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getUserTransactions(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(tx => tx.senderId === userId || tx.receiverId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionIdCounter++;
    const now = new Date();
    const transaction: Transaction = { 
      ...insertTransaction, 
      id, 
      createdAt: now,
      status: insertTransaction.status || "COMPLETED",
      senderId: insertTransaction.senderId || null,
      receiverId: insertTransaction.receiverId || null,
      note: insertTransaction.note || null
    };
    this.transactions.set(id, transaction);
    
    // Update wallet balances
    if (transaction.senderId) {
      const senderWallet = await this.getWalletByUserId(transaction.senderId);
      if (senderWallet) {
        const currentBalance = parseFloat(senderWallet.balance.toString());
        const amount = parseFloat(transaction.amount.toString());
        await this.updateWallet(senderWallet.id, { 
          balance: (currentBalance - amount).toString() 
        });
      }
    }
    
    if (transaction.receiverId) {
      const receiverWallet = await this.getWalletByUserId(transaction.receiverId);
      if (receiverWallet) {
        const currentBalance = parseFloat(receiverWallet.balance.toString());
        const amount = parseFloat(transaction.amount.toString());
        await this.updateWallet(receiverWallet.id, { 
          balance: (currentBalance + amount).toString() 
        });
      }
    }
    
    return transaction;
  }

  // Activity methods
  async getActivity(id: number): Promise<Activity | undefined> {
    return this.activities.get(id);
  }

  async getUserActivities(userId: number): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter(activity => activity.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.activityIdCounter++;
    const now = new Date();
    const activity: Activity = { 
      ...insertActivity, 
      id, 
      createdAt: now,
      details: insertActivity.details || null,
      ipAddress: insertActivity.ipAddress || null
    };
    this.activities.set(id, activity);
    return activity;
  }
  
  // Bank Account methods have been removed as we don't need FinAPI anymore

  // Initialize demo data method
  private async initializeDemoData() {
    // Create a demo user
    const demoUser = await this.createUser({
      username: "demo",
      password: "password",
      firstName: "Demo",
      lastName: "User",
      email: "demo@example.com",
      phoneNumber: "+9779876543210"
    });

    // Create a wallet for the demo user
    await this.createWallet({
      userId: demoUser.id,
      balance: "85250.75",
      currency: "NPR"
    });

    // Create some contacts
    const binod = await this.createUser({
      username: "binod",
      password: "password",
      firstName: "Binod",
      lastName: "Thapa",
      email: "binod@example.com",
      phoneNumber: "+9779876543211"
    });
    
    const ajay = await this.createUser({
      username: "ajay",
      password: "password",
      firstName: "Ajay",
      lastName: "Sharma",
      email: "ajay@example.com",
      phoneNumber: "+9779876543212"
    });
    
    const prabesh = await this.createUser({
      username: "prabesh",
      password: "password",
      firstName: "Prabesh",
      lastName: "Gyawali",
      email: "prabesh@example.com",
      phoneNumber: "+9779876543213"
    });

    // Create wallets for contacts
    await this.createWallet({
      userId: binod.id,
      balance: "25000",
      currency: "NPR"
    });
    
    await this.createWallet({
      userId: ajay.id,
      balance: "18000",
      currency: "NPR"
    });
    
    await this.createWallet({
      userId: prabesh.id,
      balance: "32000",
      currency: "NPR"
    });

    // Create some transactions
    const now = new Date();
    
    await this.createTransaction({
      receiverId: demoUser.id,
      senderId: binod.id,
      amount: "5000",
      type: "TRANSFER",
      status: "COMPLETED",
      note: "Payment for services"
    });
    
    await this.createTransaction({
      senderId: demoUser.id,
      receiverId: ajay.id,
      amount: "2500",
      type: "TRANSFER",
      status: "COMPLETED",
      note: "Dinner payment"
    });
    
    await this.createTransaction({
      senderId: demoUser.id,
      amount: "500",
      type: "TOPUP",
      status: "COMPLETED",
      note: "Mobile Recharge"
    });
    
    await this.createTransaction({
      senderId: demoUser.id,
      amount: "1250",
      type: "UTILITY",
      status: "COMPLETED",
      note: "Electricity Bill"
    });
    
    await this.createTransaction({
      receiverId: demoUser.id,
      senderId: prabesh.id,
      amount: "3750",
      type: "TRANSFER",
      status: "COMPLETED",
      note: "Project payment"
    });

    // Create some activities
    await this.createActivity({
      userId: demoUser.id,
      action: "LOGIN",
      details: "Login from new device",
      ipAddress: "192.168.1.1"
    });
    
    await this.createActivity({
      userId: demoUser.id,
      action: "PASSWORD_CHANGE",
      details: "Password changed",
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

// Use MemStorage for development
export const storage = new MemStorage();
