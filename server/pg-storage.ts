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
  
  /**
   * Update wallet balance for a specific currency
   */
  async updateWalletBalance(userId: number, currency: string, amount: number): Promise<Wallet | undefined> {
    await this.ensureDbInitialized();
    
    // Get the user's wallet
    const wallet = await this.getWalletByUserId(userId);
    if (!wallet) {
      return undefined;
    }
    
    // Update the appropriate balance field based on currency
    let updatedWallet: Wallet | undefined;
    
    if (currency === 'NPT') {
      const currentBalance = parseFloat(wallet.nptBalance || '0');
      const newBalance = (currentBalance + amount).toString();
      
      const result = await db
        .update(wallets)
        .set({ 
          nptBalance: newBalance,
          updatedAt: new Date()
        })
        .where(eq(wallets.id, wallet.id))
        .returning();
      updatedWallet = result[0];
    } else if (currency === 'BNB') {
      const currentBalance = parseFloat(wallet.bnbBalance || '0');
      const newBalance = (currentBalance + amount).toString();
      
      const result = await db
        .update(wallets)
        .set({ 
          bnbBalance: newBalance,
          updatedAt: new Date()
        })
        .where(eq(wallets.id, wallet.id))
        .returning();
      updatedWallet = result[0];
    } else if (currency === 'ETH') {
      const currentBalance = parseFloat(wallet.ethBalance || '0');
      const newBalance = (currentBalance + amount).toString();
      
      const result = await db
        .update(wallets)
        .set({ 
          ethBalance: newBalance,
          updatedAt: new Date()
        })
        .where(eq(wallets.id, wallet.id))
        .returning();
      updatedWallet = result[0];
    } else if (currency === 'BTC') {
      const currentBalance = parseFloat(wallet.btcBalance || '0');
      const newBalance = (currentBalance + amount).toString();
      
      const result = await db
        .update(wallets)
        .set({ 
          btcBalance: newBalance,
          updatedAt: new Date()
        })
        .where(eq(wallets.id, wallet.id))
        .returning();
      updatedWallet = result[0];
    }
    
    return updatedWallet;
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
    try {
      console.log(`Fetching transactions for user ID: ${userId}`);
      // Use raw SQL query since we're having issues with the ORM
      const result = await db.execute(
        `SELECT * FROM transactions 
         WHERE sender_id = $1 OR receiver_id = $1 
         ORDER BY created_at DESC`,
        [userId]
      );
      
      console.log(`Found ${result.length} transactions`);
      return result;
    } catch (error) {
      console.error('Error in getUserTransactions:', error);
      console.error('SQL Error details:', error instanceof Error ? error.message : String(error));
      console.error('User ID:', userId);
      throw error;
    }
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
  
  async getAllTransactions(): Promise<Transaction[]> {
    await this.ensureDbInitialized();
    return await db.select().from(transactions);
  }
  
  // ====== Activity Methods ======
  
  async getActivity(id: number): Promise<Activity | undefined> {
    await this.ensureDbInitialized();
    const result = await db.select().from(activities).where(eq(activities.id, id));
    return result[0];
  }
  
  async getUserActivities(userId: number): Promise<Activity[]> {
    await this.ensureDbInitialized();
    try {
      console.log(`Fetching activities for user ID: ${userId}`);
      const query = db.select().from(activities)
        .where(eq(activities.userId, userId))
        .orderBy(desc(activities.createdAt));
      
      console.log('Activity query:', query.toSQL());
      return await query;
    } catch (error) {
      console.error('Error in getUserActivities:', error);
      console.error('SQL Error details:', error instanceof Error ? error.message : String(error));
      console.error('User ID:', userId);
      throw error;
    }
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
    return await db.select().from(ads).where(eq(ads.status, 'active'));
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
      nptBalance: '5000',
      bnbBalance: '1000',
      balance: '5000',
      currency: 'NPT',
      lastUpdated: new Date(),
      isPrimary: true
    });
    
    const adminWallet = await this.createWallet({
      userId: adminUser.id,
      address: adminUser.walletAddress!,
      nptBalance: '10000',
      bnbBalance: '5000',
      balance: '10000',
      currency: 'NPT',
      lastUpdated: new Date(),
      isPrimary: true
    });
    
    const superadminWallet = await this.createWallet({
      userId: superadminUser.id,
      address: superadminUser.walletAddress!,
      nptBalance: '100000',
      bnbBalance: '10000',
      balance: '100000',
      currency: 'NPT',
      lastUpdated: new Date(),
      isPrimary: true
    });
    
    // Create demo transactions
    await this.createTransaction({
      senderId: superadminUser.id,
      receiverId: demoUser.id,
      amount: '1000',
      status: 'COMPLETED',
      type: 'TRANSFER',
      currency: 'NPT',
      txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
    });
    
    await this.createTransaction({
      senderId: demoUser.id,
      receiverId: adminUser.id,
      amount: '500',
      status: 'COMPLETED',
      type: 'UTILITY',
      currency: 'NPT',
      txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
    });
    
    // Create demo activities
    await this.createActivity({
      userId: demoUser.id,
      action: 'LOGIN',
      description: 'User logged in from web app'
    });
    
    await this.createActivity({
      userId: demoUser.id,
      action: 'TRANSFER',
      description: 'Sent 500 NPT to admin'
    });
    
    // Create demo collateral
    await this.createCollateral({
      userId: demoUser.id,
      collateralType: 'BNB',
      amount: '2',
      valueInNpt: '500',
      valueToLoanRatio: '0.75',
      status: 'active'
    });
    
    // Create demo loan
    await this.createLoan({
      userId: demoUser.id,
      amount: '450',
      interestRate: '5',
      termDays: 30,
      loanToValueRatio: '0.8',
      originationFee: '10',
      status: 'active',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      collateralRequired: true
    });
    
    // Create demo ad
    await this.createAd({
      userId: adminUser.id,
      title: 'Premium NPT Exchange',
      description: 'Get the best rates when exchanging NPT for other cryptocurrencies!',
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      budget: '500'
    });
    
    console.log('Demo data initialization complete');
  }
}

export const storage = new PgStorage();