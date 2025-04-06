import { db, pool, initializeDatabase } from './db';
import { 
  users, wallets, transactions, activities,
  InsertUser, User, InsertWallet, Wallet, 
  InsertTransaction, Transaction, InsertActivity, Activity
} from '../shared/schema';
import { eq, and, or, desc } from 'drizzle-orm';
import { IStorage } from './storage';
import session from 'express-session';
import connectPg from 'connect-pg-simple';

// Initialize PostgreSQL session store
const PgSessionStore = connectPg(session);

// Make sure the database is initialized
let dbInitialized = false;

export class PgStorage implements IStorage {
  public sessionStore: session.Store;

  constructor() {
    // Initialize database when constructing the storage
    this.ensureDbInitialized();
    this.sessionStore = new PgSessionStore({
      pool,
      tableName: 'session',
      createTableIfMissing: true
    });
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
    const result = await db.update(users).set(userData).where(eq(users.id, id)).returning();
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
    // Set lastUpdated to current time
    const dataWithTimestamp = {
      ...walletData,
      lastUpdated: new Date().toISOString()
    };
    const result = await db.update(wallets).set(dataWithTimestamp).where(eq(wallets.id, id)).returning();
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
    return db.select().from(transactions).where(eq(transactions.senderId, senderId)).orderBy(desc(transactions.createdAt));
  }

  async getTransactionsByReceiverId(receiverId: number): Promise<Transaction[]> {
    await this.ensureDbInitialized();
    return db.select().from(transactions).where(eq(transactions.receiverId, receiverId)).orderBy(desc(transactions.createdAt));
  }

  async getUserTransactions(userId: number): Promise<Transaction[]> {
    await this.ensureDbInitialized();
    return db.select().from(transactions).where(
      or(
        eq(transactions.senderId, userId),
        eq(transactions.receiverId, userId)
      )
    ).orderBy(desc(transactions.createdAt));
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
    return db.select().from(activities).where(eq(activities.userId, userId)).orderBy(desc(activities.createdAt));
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    await this.ensureDbInitialized();
    const result = await db.insert(activities).values(activity).returning();
    return result[0];
  }
  
  // Initialize demo data if needed
  async initializeDemoData() {
    try {
      await this.ensureDbInitialized();
      
      // Check if users already exist
      const existingUsers = await db.select({ count: users.id }).from(users);
      if (existingUsers.length > 0 && existingUsers[0].count > 0) {
        console.log('Demo data already exists, skipping initialization');
        return;
      }
      
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
      
      console.log('Demo data initialized successfully');
    } catch (error) {
      console.error('Error initializing demo data:', error);
    }
  }
}
