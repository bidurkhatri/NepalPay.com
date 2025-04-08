import { IStorage } from './storage';
import { db, pgPool, getSchemaDetails } from './db';
import connectPgSimple from 'connect-pg-simple';
import session from 'express-session';
import { eq, and, or, desc, sql } from 'drizzle-orm';
import * as schema from '../shared/schema';

// Import schemas
const {
  users,
  wallets,
  transactions,
  activities,
  collaterals,
  loans,
  ads,
  tokenPurchases,
  transactionFees
} = schema;

type User = typeof schema.users.$inferSelect;
type InsertUser = typeof schema.insertUserSchema._type;
type Wallet = typeof schema.wallets.$inferSelect;
type InsertWallet = typeof schema.insertWalletSchema._type;
type Transaction = typeof schema.transactions.$inferSelect;
type InsertTransaction = typeof schema.insertTransactionSchema._type;
type Activity = typeof schema.activities.$inferSelect;
type InsertActivity = typeof schema.insertActivitySchema._type;
type Collateral = typeof schema.collaterals.$inferSelect;
type InsertCollateral = typeof schema.insertCollateralSchema._type;
type Loan = typeof schema.loans.$inferSelect;
type InsertLoan = typeof schema.insertLoanSchema._type;
type Ad = typeof schema.ads.$inferSelect;
type InsertAd = typeof schema.insertAdSchema._type;
type TokenPurchase = typeof schema.tokenPurchases.$inferSelect;
type InsertTokenPurchase = typeof schema.insertTokenPurchaseSchema._type;
type TransactionFee = typeof schema.transactionFees.$inferSelect;
type InsertTransactionFee = typeof schema.insertTransactionFeeSchema._type;

/**
 * PostgreSQL Storage Implementation
 */
export class PgStorage implements IStorage {
  public sessionStore: session.Store;
  private initialized: boolean = false;
  
  // Store schema details for field name compatibility
  private schemaDetails: any = null;
  
  constructor() {
    const PostgresSessionStore = connectPgSimple(session);
    this.sessionStore = new PostgresSessionStore({
      pool: pgPool,
      createTableIfMissing: true,
      tableName: 'session'
    });
  }
  
  /**
   * Make sure the database is initialized before first use
   */
  private async ensureDbInitialized() {
    if (!this.initialized) {
      // Get schema details to handle backward compatibility with column names
      this.schemaDetails = await getSchemaDetails();
      
      // Mark as initialized
      this.initialized = true;
      console.log("Database connection initialized");
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
  
  async updateStripeCustomerId(id: number, customerId: string): Promise<User> {
    await this.ensureDbInitialized();
    const result = await db.update(users)
      .set({
        stripeCustomerId: customerId,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }
  
  async updateUserStripeInfo(id: number, stripeInfo: { stripeCustomerId: string, stripeSubscriptionId: string }): Promise<User> {
    await this.ensureDbInitialized();
    const result = await db.update(users)
      .set({
        stripeCustomerId: stripeInfo.stripeCustomerId,
        stripeSubscriptionId: stripeInfo.stripeSubscriptionId,
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
  
  async getWalletByAddress(address: string): Promise<Wallet | undefined> {
    await this.ensureDbInitialized();
    const result = await db.select().from(wallets).where(eq(wallets.address, address));
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
  
  async updateWalletBalance(id: number, newBalance: number): Promise<Wallet> {
    await this.ensureDbInitialized();
    const [updatedWallet] = await db
      .update(wallets)
      .set({ 
        balance: newBalance.toString(), 
        updatedAt: new Date() 
      })
      .where(eq(wallets.id, id))
      .returning();
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
    return await db.select().from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(desc(activities.createdAt));
  }
  
  async createActivity(activityData: InsertActivity): Promise<Activity> {
    await this.ensureDbInitialized();
    // Map old field names to new ones if necessary
    const mappedData: InsertActivity = {
      ...activityData,
      // Replace 'action' with 'type' if it exists
      type: activityData.action ? activityData.action : activityData.type,
      // Replace 'description' with 'details' if it exists
      details: activityData.description ? activityData.description : activityData.details,
    };
    
    // Remove old field names that don't exist in the schema
    delete (mappedData as any).action;
    delete (mappedData as any).description;
    
    const result = await db.insert(activities).values(mappedData).returning();
    return result[0];
  }
  
  async updateActivity(id: number, activityData: Partial<Activity>): Promise<Activity | undefined> {
    await this.ensureDbInitialized();
    // Map old field names to new ones if necessary
    const mappedData: Partial<Activity> = {
      ...activityData,
      // Replace 'action' with 'type' if it exists
      type: activityData.action ? activityData.action : activityData.type,
      // Replace 'description' with 'details' if it exists
      details: activityData.description ? activityData.description : activityData.details,
    };
    
    // Remove old field names that don't exist in the schema
    delete (mappedData as any).action;
    delete (mappedData as any).description;
    
    const result = await db.update(activities)
      .set({
        ...mappedData,
        updatedAt: new Date()
      })
      .where(eq(activities.id, id))
      .returning();
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
    // Map old field names to their new counterparts in our schema
    const mappedData: InsertCollateral = { ...collateralData };
    
    // Remove fields that don't exist in our schema
    delete (mappedData as any).ltv;
    delete (mappedData as any).status;
    
    const result = await db.insert(collaterals).values(mappedData).returning();
    return result[0];
  }
  
  async updateCollateral(id: number, collateralData: Partial<Collateral>): Promise<Collateral | undefined> {
    await this.ensureDbInitialized();
    // Map old field names to their new counterparts in our schema
    const mappedData: Partial<Collateral> = { ...collateralData };
    
    // Remove fields that don't exist in our schema
    delete (mappedData as any).ltv;
    delete (mappedData as any).status;
    
    const result = await db.update(collaterals)
      .set({
        ...mappedData,
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
    // Map old field names to new ones
    const mappedData: InsertLoan = {
      ...loanData,
      // Replace 'interest' with 'interestRate' if it exists
      interestRate: loanData.interest ? loanData.interest : loanData.interestRate,
    };
    
    // Remove old field names that don't exist in the schema
    delete (mappedData as any).interest;
    
    const result = await db.insert(loans).values(mappedData).returning();
    return result[0];
  }
  
  async updateLoan(id: number, loanData: Partial<Loan>): Promise<Loan | undefined> {
    await this.ensureDbInitialized();
    // Map old field names to new ones
    const mappedData: Partial<Loan> = {
      ...loanData,
      // Handle legacy field names
      interestRate: loanData.interest ? loanData.interest : loanData.interestRate,
    };
    
    // Remove old field names that don't exist in the schema
    delete (mappedData as any).interest;
    
    const result = await db.update(loans)
      .set({
        ...mappedData,
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
    return await db.select().from(ads).where(eq(ads.isActive, true));
  }
  
  async createAd(adData: InsertAd): Promise<Ad> {
    await this.ensureDbInitialized();
    // Map old field names to their new counterparts
    const mappedData: InsertAd = { 
      ...adData,
      // Convert status to isActive
      isActive: adData.status === 'active' ? true : false
    };
    
    // Remove fields that don't exist in our schema
    delete (mappedData as any).status;
    delete (mappedData as any).startDate;
    delete (mappedData as any).endDate;
    delete (mappedData as any).budget;
    
    const result = await db.insert(ads).values(mappedData).returning();
    return result[0];
  }
  
  async updateAd(id: number, adData: Partial<Ad>): Promise<Ad | undefined> {
    await this.ensureDbInitialized();
    // Map old field names to their new counterparts
    const mappedData: Partial<Ad> = { 
      ...adData,
      // Convert status to isActive if status exists
      isActive: adData.status === 'active' ? true : 
                adData.status === 'inactive' ? false : 
                adData.isActive
    };
    
    // Remove fields that don't exist in our schema
    delete (mappedData as any).status;
    delete (mappedData as any).startDate;
    delete (mappedData as any).endDate;
    delete (mappedData as any).budget;
    
    const result = await db.update(ads)
      .set({
        ...mappedData,
        updatedAt: new Date()
      })
      .where(eq(ads.id, id))
      .returning();
    return result[0];
  }
  
  // ====== Token Purchase Methods ======

  async getTokenPurchase(id: number): Promise<TokenPurchase | undefined> {
    await this.ensureDbInitialized();
    const result = await db.select().from(tokenPurchases).where(eq(tokenPurchases.id, id));
    return result[0];
  }

  async getTokenPurchaseByPaymentIntent(paymentIntentId: string): Promise<TokenPurchase | undefined> {
    await this.ensureDbInitialized();
    const result = await db.select().from(tokenPurchases).where(eq(tokenPurchases.stripePaymentIntentId, paymentIntentId));
    return result[0];
  }

  async getTokenPurchasesByUserId(userId: number): Promise<TokenPurchase[]> {
    await this.ensureDbInitialized();
    return await db.select().from(tokenPurchases).where(eq(tokenPurchases.userId, userId));
  }

  async createTokenPurchase(purchaseData: InsertTokenPurchase): Promise<TokenPurchase> {
    await this.ensureDbInitialized();
    const result = await db.insert(tokenPurchases).values(purchaseData).returning();
    return result[0];
  }

  async updateTokenPurchaseStatus(id: number, status: string): Promise<TokenPurchase> {
    await this.ensureDbInitialized();
    const result = await db.update(tokenPurchases)
      .set({
        status,
        updatedAt: new Date()
      })
      .where(eq(tokenPurchases.id, id))
      .returning();
    return result[0];
  }

  async updateTokenPurchaseTxHash(id: number, txHash: string): Promise<TokenPurchase> {
    await this.ensureDbInitialized();
    const result = await db.update(tokenPurchases)
      .set({
        txHash,
        updatedAt: new Date()
      })
      .where(eq(tokenPurchases.id, id))
      .returning();
    return result[0];
  }

  // ====== Transaction Fee Methods ======

  async getTransactionFee(): Promise<TransactionFee | undefined> {
    await this.ensureDbInitialized();
    // Get the most recent transaction fee
    const result = await db.select().from(transactionFees)
      .orderBy(desc(transactionFees.updatedAt))
      .limit(1);
    return result[0];
  }

  async upsertTransactionFee(feeData: InsertTransactionFee): Promise<TransactionFee> {
    await this.ensureDbInitialized();
    
    // Check if a record exists for this token amount
    const existingFee = await db.select().from(transactionFees)
      .where(eq(transactionFees.tokenAmount, feeData.tokenAmount));
    
    if (existingFee.length > 0) {
      // Update existing record
      const result = await db.update(transactionFees)
        .set({
          ...feeData,
          updatedAt: new Date()
        })
        .where(eq(transactionFees.id, existingFee[0].id))
        .returning();
      return result[0];
    } else {
      // Insert new record
      const result = await db.insert(transactionFees).values(feeData).returning();
      return result[0];
    }
  }

  // ====== Additional Helper Methods ======

  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    await this.ensureDbInitialized();
    return await this.getUserTransactions(userId);
  }

  async updateTransactionStatus(id: number, status: string): Promise<Transaction | undefined> {
    await this.ensureDbInitialized();
    return await this.updateTransaction(id, { status });
  }

  async getActivitiesByUserId(userId: number): Promise<Activity[]> {
    await this.ensureDbInitialized();
    return await this.getUserActivities(userId);
  }

  async getLoansByUserId(userId: number): Promise<Loan[]> {
    await this.ensureDbInitialized();
    return await this.getUserLoans(userId);
  }

  async updateLoanStatus(id: number, status: string): Promise<Loan | undefined> {
    await this.ensureDbInitialized();
    return await this.updateLoan(id, { status });
  }

  async updateLoanRepaidAmount(id: number, repaidAmount: number): Promise<Loan | undefined> {
    await this.ensureDbInitialized();
    return await this.updateLoan(id, { repaidAmount });
  }

  async getCollateralsByUserId(userId: number): Promise<Collateral[]> {
    await this.ensureDbInitialized();
    return await this.getUserCollaterals(userId);
  }

  async updateCollateralLockStatus(id: number, isLocked: boolean): Promise<Collateral | undefined> {
    await this.ensureDbInitialized();
    return await this.updateCollateral(id, { isLocked });
  }

  async getAdsByUserId(userId: number): Promise<Ad[]> {
    await this.ensureDbInitialized();
    return await this.getUserAds(userId);
  }

  async updateAdStatus(id: number, isActive: boolean): Promise<Ad | undefined> {
    await this.ensureDbInitialized();
    return await this.updateAd(id, { isActive });
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
      bnbBalance: '1000'
    });
    
    const adminWallet = await this.createWallet({
      userId: adminUser.id,
      address: adminUser.walletAddress!,
      nptBalance: '10000',
      bnbBalance: '5000'
    });
    
    const superadminWallet = await this.createWallet({
      userId: superadminUser.id,
      address: superadminUser.walletAddress!,
      nptBalance: '100000',
      bnbBalance: '10000'
    });
    
    // Create demo transactions
    await this.createTransaction({
      senderId: superadminUser.id,
      receiverId: demoUser.id,
      amount: '1000',
      status: 'completed',
      type: 'transfer',
      currency: 'NPT',
      txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
    });
    
    await this.createTransaction({
      senderId: demoUser.id,
      receiverId: adminUser.id,
      amount: '500',
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
      valueInNPT: 1500
    });
    
    // Create demo loan
    await this.createLoan({
      userId: demoUser.id,
      collateralId: 1,
      amount: '450',
      interestRate: '5',
      term: 30,
      status: 'active',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    });
    
    // Create demo ad
    await this.createAd({
      userId: adminUser.id,
      title: 'Premium NPT Exchange',
      description: 'Get the best rates when exchanging NPT for other cryptocurrencies!',
      isActive: true,
      price: 500
    });
    
    console.log('Demo data initialization complete');
  }
}

export const storage = new PgStorage();