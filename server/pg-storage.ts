import { db, pool, initializeDatabase } from './db';
import { 
  users, wallets, transactions, activities, collaterals, loans, ads,
  InsertUser, User, InsertWallet, Wallet, 
  InsertTransaction, Transaction, InsertActivity, Activity,
  InsertCollateral, Collateral, InsertLoan, Loan, InsertAd, Ad
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
      lastUpdated: new Date()
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
  
  // Collateral methods
  async getCollateral(id: number): Promise<Collateral | undefined> {
    await this.ensureDbInitialized();
    const result = await db.select().from(collaterals).where(eq(collaterals.id, id));
    return result[0];
  }

  async getUserCollaterals(userId: number): Promise<Collateral[]> {
    await this.ensureDbInitialized();
    return db.select().from(collaterals).where(eq(collaterals.userId, userId));
  }

  async createCollateral(collateral: InsertCollateral): Promise<Collateral> {
    await this.ensureDbInitialized();
    const result = await db.insert(collaterals).values(collateral).returning();
    return result[0];
  }

  async updateCollateral(id: number, collateralData: Partial<Collateral>): Promise<Collateral | undefined> {
    await this.ensureDbInitialized();
    // Set updatedAt to current time
    const dataWithTimestamp = {
      ...collateralData,
      updatedAt: new Date()
    };
    const result = await db.update(collaterals).set(dataWithTimestamp).where(eq(collaterals.id, id)).returning();
    return result[0];
  }

  // Loan methods
  async getLoan(id: number): Promise<Loan | undefined> {
    await this.ensureDbInitialized();
    const result = await db.select().from(loans).where(eq(loans.id, id));
    return result[0];
  }

  async getUserLoans(userId: number): Promise<Loan[]> {
    await this.ensureDbInitialized();
    return db.select().from(loans).where(eq(loans.userId, userId));
  }

  async getActiveLoans(): Promise<Loan[]> {
    await this.ensureDbInitialized();
    return db.select().from(loans).where(eq(loans.status, "ACTIVE"));
  }

  async createLoan(loan: InsertLoan): Promise<Loan> {
    await this.ensureDbInitialized();
    const result = await db.insert(loans).values(loan).returning();
    return result[0];
  }

  async updateLoan(id: number, loanData: Partial<Loan>): Promise<Loan | undefined> {
    await this.ensureDbInitialized();
    // Set updatedAt to current time
    const dataWithTimestamp = {
      ...loanData,
      updatedAt: new Date()
    };
    const result = await db.update(loans).set(dataWithTimestamp).where(eq(loans.id, id)).returning();
    return result[0];
  }

  // Ad methods
  async getAd(id: number): Promise<Ad | undefined> {
    await this.ensureDbInitialized();
    const result = await db.select().from(ads).where(eq(ads.id, id));
    return result[0];
  }

  async getUserAds(userId: number): Promise<Ad[]> {
    await this.ensureDbInitialized();
    return db.select().from(ads).where(eq(ads.userId, userId));
  }

  async getActiveAds(): Promise<Ad[]> {
    await this.ensureDbInitialized();
    const now = new Date();
    // Use a simpler query that avoids direct comparison operators
    return db.select().from(ads).where(eq(ads.status, "ACTIVE"));
  }

  async createAd(ad: InsertAd): Promise<Ad> {
    await this.ensureDbInitialized();
    const result = await db.insert(ads).values(ad).returning();
    return result[0];
  }

  async updateAd(id: number, adData: Partial<Ad>): Promise<Ad | undefined> {
    await this.ensureDbInitialized();
    // Set updatedAt to current time
    const dataWithTimestamp = {
      ...adData,
      updatedAt: new Date()
    };
    const result = await db.update(ads).set(dataWithTimestamp).where(eq(ads.id, id)).returning();
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
      
      // Create a demo collateral
      const demoCollateral = await this.createCollateral({
        userId: demoUser.id,
        type: "BNB",
        amount: "10",
        valueInNPT: "15000" // Assuming 1 BNB = 1500 NPT
      });
      
      // Create a demo loan based on the collateral
      await this.createLoan({
        userId: demoUser.id,
        amount: "10000",
        collateralId: demoCollateral.id,
        interestRate: "12.5",
        startDate: new Date(),
        endDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        status: "ACTIVE"
      });
      
      // Create a demo ad
      await this.createAd({
        userId: demoUser.id,
        title: "Premium Crypto Exchange Services",
        description: "Trade BNB, ETH and BTC at competitive rates. Sign up today!",
        bidAmount: "500",
        tier: "GOLD",
        startDate: new Date(),
        endDate: new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        status: "ACTIVE"
      });
      
      console.log('Demo data initialized successfully');
    } catch (error) {
      console.error('Error initializing demo data:', error);
    }
  }
}
