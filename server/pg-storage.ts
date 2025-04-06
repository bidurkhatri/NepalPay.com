import { IStorage } from './storage';
import { db, initializeDatabase } from './db';
import connectPg from 'connect-pg-simple';
import session from 'express-session';
import { eq, and, or, desc } from 'drizzle-orm';
import { pool } from './db';
import {
  users,
  wallets,
  transactions,
  activities,
  collaterals,
  loans,
  ads,
  type User,
  type InsertUser,
  type Wallet,
  type InsertWallet,
  type Transaction,
  type InsertTransaction,
  type Activity,
  type InsertActivity,
  type Collateral,
  type InsertCollateral,
  type Loan,
  type InsertLoan,
  type Ad,
  type InsertAd,
} from '@shared/schema';

const PostgresSessionStore = connectPg(session);

/**
 * PostgreSQL Storage Implementation
 */
export class PgStorage implements IStorage {
  public sessionStore: session.Store;
  private initialized: boolean = false;
  
  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
      tableName: 'session'
    });
  }
  
  /**
   * Make sure the database is initialized before first use
   */
  private async ensureDbInitialized() {
    if (!this.initialized) {
      this.initialized = await initializeDatabase();
      if (!this.initialized) {
        throw new Error('Failed to initialize database');
      }
    }
  }
  
  // ====== User Methods ======
  
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
  
  async getAllUsers(): Promise<User[]> {
    await this.ensureDbInitialized();
    return await db.select().from(users);
  }
  
  async createUser(userData: InsertUser): Promise<User> {
    await this.ensureDbInitialized();
    const result = await db.insert(users).values(userData).returning();
    return result[0];
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    await this.ensureDbInitialized();
    const result = await db.update(users)
      .set({
        ...userData,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }
  
  // ====== Wallet Methods ======
  
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
  
  async createWallet(walletData: InsertWallet): Promise<Wallet> {
    await this.ensureDbInitialized();
    const result = await db.insert(wallets).values(walletData).returning();
    return result[0];
  }
  
  async updateWallet(id: number, walletData: Partial<Wallet>): Promise<Wallet | undefined> {
    await this.ensureDbInitialized();
    const result = await db.update(wallets)
      .set({
        ...walletData,
        updatedAt: new Date()
      })
      .where(eq(wallets.id, id))
      .returning();
    return result[0];
  }
  
  // ====== Transaction Methods ======
  
  async getTransaction(id: number): Promise<Transaction | undefined> {
    await this.ensureDbInitialized();
    const result = await db.select().from(transactions).where(eq(transactions.id, id));
    return result[0];
  }
  
  async getTransactionsBySenderId(senderId: number): Promise<Transaction[]> {
    await this.ensureDbInitialized();
    return await db.select().from(transactions).where(eq(transactions.senderId, senderId));
  }
  
  async getTransactionsByReceiverId(receiverId: number): Promise<Transaction[]> {
    await this.ensureDbInitialized();
    return await db.select().from(transactions).where(eq(transactions.receiverId, receiverId));
  }
  
  async getUserTransactions(userId: number): Promise<Transaction[]> {
    await this.ensureDbInitialized();
    return await db.select().from(transactions)
      .where(
        or(
          eq(transactions.senderId, userId),
          eq(transactions.receiverId, userId)
        )
      )
      .orderBy(desc(transactions.createdAt));
  }
  
  async createTransaction(transactionData: InsertTransaction): Promise<Transaction> {
    await this.ensureDbInitialized();
    const result = await db.insert(transactions).values(transactionData).returning();
    return result[0];
  }
  
  async updateTransaction(id: number, transactionData: Partial<Transaction>): Promise<Transaction | undefined> {
    await this.ensureDbInitialized();
    const result = await db.update(transactions)
      .set({
        ...transactionData,
        updatedAt: new Date()
      })
      .where(eq(transactions.id, id))
      .returning();
    return result[0];
  }
  
  // ====== Activity Methods ======
  
  async getActivity(id: number): Promise<Activity | undefined> {
    await this.ensureDbInitialized();
    const result = await db.select().from(activities).where(eq(activities.id, id));
    return result[0];
  }
  
  async getUserActivities(userId: number): Promise<Activity[]> {
    await this.ensureDbInitialized();
    return await db.select().from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(desc(activities.createdAt));
  }
  
  async createActivity(activityData: InsertActivity): Promise<Activity> {
    await this.ensureDbInitialized();
    const result = await db.insert(activities).values(activityData).returning();
    return result[0];
  }
  
  // ====== Collateral Methods ======
  
  async getCollateral(id: number): Promise<Collateral | undefined> {
    await this.ensureDbInitialized();
    const result = await db.select().from(collaterals).where(eq(collaterals.id, id));
    return result[0];
  }
  
  async getUserCollaterals(userId: number): Promise<Collateral[]> {
    await this.ensureDbInitialized();
    return await db.select().from(collaterals).where(eq(collaterals.userId, userId));
  }
  
  async createCollateral(collateralData: InsertCollateral): Promise<Collateral> {
    await this.ensureDbInitialized();
    const result = await db.insert(collaterals).values(collateralData).returning();
    return result[0];
  }
  
  async updateCollateral(id: number, collateralData: Partial<Collateral>): Promise<Collateral | undefined> {
    await this.ensureDbInitialized();
    const result = await db.update(collaterals)
      .set({
        ...collateralData,
        updatedAt: new Date()
      })
      .where(eq(collaterals.id, id))
      .returning();
    return result[0];
  }
  
  // ====== Loan Methods ======
  
  async getLoan(id: number): Promise<Loan | undefined> {
    await this.ensureDbInitialized();
    const result = await db.select().from(loans).where(eq(loans.id, id));
    return result[0];
  }
  
  async getUserLoans(userId: number): Promise<Loan[]> {
    await this.ensureDbInitialized();
    return await db.select().from(loans).where(eq(loans.userId, userId));
  }
  
  async getActiveLoans(): Promise<Loan[]> {
    await this.ensureDbInitialized();
    return await db.select().from(loans).where(eq(loans.status, 'active'));
  }
  
  async createLoan(loanData: InsertLoan): Promise<Loan> {
    await this.ensureDbInitialized();
    const result = await db.insert(loans).values(loanData).returning();
    return result[0];
  }
  
  async updateLoan(id: number, loanData: Partial<Loan>): Promise<Loan | undefined> {
    await this.ensureDbInitialized();
    const result = await db.update(loans)
      .set({
        ...loanData,
        updatedAt: new Date()
      })
      .where(eq(loans.id, id))
      .returning();
    return result[0];
  }
  
  // ====== Ad Methods ======
  
  async getAd(id: number): Promise<Ad | undefined> {
    await this.ensureDbInitialized();
    const result = await db.select().from(ads).where(eq(ads.id, id));
    return result[0];
  }
  
  async getUserAds(userId: number): Promise<Ad[]> {
    await this.ensureDbInitialized();
    return await db.select().from(ads).where(eq(ads.userId, userId));
  }
  
  async getActiveAds(): Promise<Ad[]> {
    await this.ensureDbInitialized();
    return await db.select().from(ads).where(eq(ads.status, 'approved'));
  }
  
  async createAd(adData: InsertAd): Promise<Ad> {
    await this.ensureDbInitialized();
    const result = await db.insert(ads).values(adData).returning();
    return result[0];
  }
  
  async updateAd(id: number, adData: Partial<Ad>): Promise<Ad | undefined> {
    await this.ensureDbInitialized();
    const result = await db.update(ads)
      .set({
        ...adData,
        updatedAt: new Date()
      })
      .where(eq(ads.id, id))
      .returning();
    return result[0];
  }
  
  // ====== Demo Data ======
  
  async initializeDemoData(): Promise<void> {
    await this.ensureDbInitialized();
    
    // Check if demo data already exists
    const userCount = await db.select({ count: users.id }).from(users);
    if (userCount[0].count > 0) {
      console.log('Demo data already exists, skipping initialization');
      return;
    }
    
    console.log('Initializing demo data...');
    
    // Create demo users
    const demoUser = await this.createUser({
      username: 'demo',
      email: 'demo@nepalipay.com',
      password: '$2b$10$XpC5Vlrlt.mpIjGbXtKlROpI2zdSW9/.18TtBl8D0POqWmyQ1xhyG', // Password: 'password'
      firstName: 'Demo',
      lastName: 'User',
      role: 'user',
      walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
      kycStatus: 'verified',
      kycVerificationId: 'demo-verification',
      kycVerifiedAt: new Date()
    });
    
    const adminUser = await this.createUser({
      username: 'admin',
      email: 'admin@nepalipay.com',
      password: '$2b$10$XpC5Vlrlt.mpIjGbXtKlROpI2zdSW9/.18TtBl8D0POqWmyQ1xhyG', // Password: 'password'
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
      kycStatus: 'verified',
      kycVerificationId: 'admin-verification',
      kycVerifiedAt: new Date()
    });
    
    const superadminUser = await this.createUser({
      username: 'superadmin',
      email: 'superadmin@nepalipay.com',
      password: '$2b$10$XpC5Vlrlt.mpIjGbXtKlROpI2zdSW9/.18TtBl8D0POqWmyQ1xhyG', // Password: 'password'
      firstName: 'Super',
      lastName: 'Admin',
      role: 'superadmin',
      walletAddress: '0x7890abcdef1234567890abcdef1234567890abcd',
      kycStatus: 'verified',
      kycVerificationId: 'superadmin-verification',
      kycVerifiedAt: new Date()
    });
    
    // Create demo wallets
    const demoWallet = await this.createWallet({
      userId: demoUser.id,
      address: demoUser.walletAddress!,
      balance: '1000',
      tokenBalance: '5000',
      currency: 'NPR'
    });
    
    const adminWallet = await this.createWallet({
      userId: adminUser.id,
      address: adminUser.walletAddress!,
      balance: '5000',
      tokenBalance: '10000',
      currency: 'NPR'
    });
    
    const superadminWallet = await this.createWallet({
      userId: superadminUser.id,
      address: superadminUser.walletAddress!,
      balance: '10000',
      tokenBalance: '100000',
      currency: 'NPR'
    });
    
    // Create demo transactions
    await this.createTransaction({
      senderId: superadminUser.id,
      receiverId: demoUser.id,
      amount: '1000',
      fee: '10',
      status: 'completed',
      type: 'transfer',
      currency: 'NPT',
      txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
    });
    
    await this.createTransaction({
      senderId: demoUser.id,
      receiverId: adminUser.id,
      amount: '500',
      fee: '5',
      status: 'completed',
      type: 'payment',
      currency: 'NPT',
      txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
    });
    
    // Create demo activities
    await this.createActivity({
      userId: demoUser.id,
      type: 'login',
      details: 'User logged in from web app'
    });
    
    await this.createActivity({
      userId: demoUser.id,
      type: 'transaction',
      details: 'Sent 500 NPT to admin'
    });
    
    // Create demo collateral
    await this.createCollateral({
      userId: demoUser.id,
      type: 'BNB',
      amount: '2',
      value: '600',
      status: 'active'
    });
    
    // Create demo loan
    await this.createLoan({
      userId: demoUser.id,
      collateralId: 1,
      amount: '450',
      interestRate: '5',
      term: 30,
      status: 'active',
      remainingAmount: '450',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    });
    
    // Create demo ad
    await this.createAd({
      userId: adminUser.id,
      title: 'Premium NPT Exchange',
      content: 'Get the best rates when exchanging NPT for other cryptocurrencies!',
      status: 'approved',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      type: 'banner',
      imageUrl: 'https://example.com/ad-image.jpg'
    });
    
    console.log('Demo data initialization complete');
  }
}

export const storage = new PgStorage();