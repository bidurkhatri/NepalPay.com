import { db, initializeDatabase } from './db';
import { 
  users, wallets, transactions, activities,
  InsertUser, User, InsertWallet, Wallet, 
  InsertTransaction, Transaction, InsertActivity, Activity
} from '../shared/schema';
import { eq, and, or, desc } from 'drizzle-orm';
import { IStorage } from './storage';

// Make sure the database is initialized
let dbInitialized = false;

export class PgStorage implements IStorage {
  constructor() {
    // Initialize database when constructing the storage
    this.ensureDbInitialized();
  }

  private async ensureDbInitialized() {
    if (!dbInitialized) {
      await initializeDatabase();
      dbInitialized = true;
    }
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    await this.ensureDbInitialized();
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    await this.ensureDbInitialized();
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    await this.ensureDbInitialized();
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    await this.ensureDbInitialized();
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    await this.ensureDbInitialized();
    const result = await db.update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  // Wallet methods
  async getWallet(id: number): Promise<Wallet | undefined> {
    await this.ensureDbInitialized();
    const result = await db.select().from(wallets).where(eq(wallets.id, id));
    return result[0];
  }

  async getWalletByUserId(userId: number): Promise<Wallet | undefined> {
    await this.ensureDbInitialized();
    const result = await db.select().from(wallets).where(eq(wallets.userId, userId));
    return result[0];
  }

  async createWallet(wallet: InsertWallet): Promise<Wallet> {
    await this.ensureDbInitialized();
    const result = await db.insert(wallets).values(wallet).returning();
    return result[0];
  }

  async updateWallet(id: number, walletData: Partial<Wallet>): Promise<Wallet | undefined> {
    await this.ensureDbInitialized();
    const result = await db.update(wallets)
      .set({ ...walletData, lastUpdated: new Date() })
      .where(eq(wallets.id, id))
      .returning();
    return result[0];
  }

  // Transaction methods
  async getTransaction(id: number): Promise<Transaction | undefined> {
    await this.ensureDbInitialized();
    const result = await db.select().from(transactions).where(eq(transactions.id, id));
    return result[0];
  }

  async getTransactionsBySenderId(senderId: number): Promise<Transaction[]> {
    await this.ensureDbInitialized();
    return await db.select()
      .from(transactions)
      .where(eq(transactions.senderId, senderId))
      .orderBy(desc(transactions.createdAt));
  }

  async getTransactionsByReceiverId(receiverId: number): Promise<Transaction[]> {
    await this.ensureDbInitialized();
    return await db.select()
      .from(transactions)
      .where(eq(transactions.receiverId, receiverId))
      .orderBy(desc(transactions.createdAt));
  }

  async getUserTransactions(userId: number): Promise<Transaction[]> {
    await this.ensureDbInitialized();
    return await db.select()
      .from(transactions)
      .where(or(
        eq(transactions.senderId, userId),
        eq(transactions.receiverId, userId)
      ))
      .orderBy(desc(transactions.createdAt));
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    await this.ensureDbInitialized();
    const result = await db.insert(transactions).values(transaction).returning();
    return result[0];
  }

  // Activity methods
  async getActivity(id: number): Promise<Activity | undefined> {
    await this.ensureDbInitialized();
    const result = await db.select().from(activities).where(eq(activities.id, id));
    return result[0];
  }

  async getUserActivities(userId: number): Promise<Activity[]> {
    await this.ensureDbInitialized();
    return await db.select()
      .from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(desc(activities.createdAt));
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    await this.ensureDbInitialized();
    const result = await db.insert(activities).values(activity).returning();
    return result[0];
  }
  
  // Bank Account methods have been removed from the system completely

  // Initialize demo data for development
  async initializeDemoData() {
    try {
      await this.ensureDbInitialized();
      // Check if demo user already exists
      const existingUser = await this.getUserByUsername('demo');
      if (existingUser) {
        console.log('Demo data already initialized');
        return;
      }

      // Create demo user
      const demoUser = await this.createUser({
        username: 'demo',
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@example.com',
        password: 'password', // In a real app, this would be hashed
        phoneNumber: '+1234567890'
      });

      // Create additional users for transactions
      const user2 = await this.createUser({
        username: 'binod',
        firstName: 'Binod',
        lastName: 'Sharma',
        email: 'binod@example.com',
        password: 'password',
        phoneNumber: '+9876543210'
      });

      const user3 = await this.createUser({
        username: 'preeti',
        firstName: 'Preeti',
        lastName: 'Thapa',
        email: 'preeti@example.com',
        password: 'password',
        phoneNumber: '+1122334455'
      });

      // Create wallets for users
      const demoWallet = await this.createWallet({
        userId: demoUser.id,
        balance: '89750.75',
        currency: 'NPR'
      });

      await this.createWallet({
        userId: user2.id,
        balance: '12500.00',
        currency: 'NPR'
      });

      await this.createWallet({
        userId: user3.id,
        balance: '75000.00',
        currency: 'NPR'
      });

      // Create demo transactions
      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const twoDaysAgo = new Date(now);
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      const threeDaysAgo = new Date(now);
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      // Create transactions - note: createdAt gets set automatically 
      // in the database by the defaultNow() in the schema
      await this.createTransaction({
        senderId: user2.id,
        receiverId: demoUser.id,
        amount: '500.00',
        type: 'TRANSFER',
        status: 'COMPLETED',
        note: 'Payment for lunch'
      });

      await this.createTransaction({
        senderId: demoUser.id,
        receiverId: user3.id,
        amount: '1200.00',
        type: 'TRANSFER',
        status: 'COMPLETED',
        note: 'Monthly rent'
      });

      await this.createTransaction({
        senderId: null,
        receiverId: demoUser.id,
        amount: '5000.00',
        type: 'TOPUP',
        status: 'COMPLETED',
        note: 'Account recharge'
      });

      await this.createTransaction({
        senderId: demoUser.id,
        receiverId: null,
        amount: '750.00',
        type: 'UTILITY',
        status: 'COMPLETED',
        note: 'Electricity bill payment'
      });

      // Create activities - createdAt gets set automatically in database
      await this.createActivity({
        userId: demoUser.id,
        action: 'LOGIN',
        details: 'User logged in from a new device',
        ipAddress: '192.168.1.1'
      });

      await this.createActivity({
        userId: demoUser.id,
        action: 'TRANSFER',
        details: 'Sent NPR 1200.00 to Preeti Thapa',
        ipAddress: '192.168.1.1'
      });

      await this.createActivity({
        userId: demoUser.id,
        action: 'TOPUP',
        details: 'Account topped up with NPR 5000.00',
        ipAddress: '192.168.1.1'
      });

      await this.createActivity({
        userId: demoUser.id,
        action: 'PAYMENT',
        details: 'Paid NPR 750.00 for electricity bill',
        ipAddress: '192.168.1.1'
      });

      console.log('Demo data initialized successfully');
    } catch (error) {
      console.error('Error initializing demo data:', error);
    }
  }
}