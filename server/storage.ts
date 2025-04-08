import { 
  User, InsertUser, users,
  Wallet, InsertWallet, wallets,
  Transaction, InsertTransaction, transactions,
  Activity, InsertActivity, activities,
  Loan, InsertLoan, loans,
  Collateral, InsertCollateral, collaterals,
  Ad, InsertAd, ads,
  TokenPurchase, InsertTokenPurchase, tokenPurchases,
  TransactionFee, InsertTransactionFee, transactionFees
} from '../shared/schema';
import { db } from './db';
import { eq, and, desc, sql } from 'drizzle-orm';
import session from 'express-session';
import { Store as SessionStore } from 'express-session';
import connectPg from 'connect-pg-simple';
import { client, pgPool } from './db';

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<Omit<User, 'id'>>): Promise<User>;
  updateStripeCustomerId(id: number, customerId: string): Promise<User>;
  updateUserStripeInfo(id: number, stripeInfo: { stripeCustomerId: string, stripeSubscriptionId: string }): Promise<User>;
  
  // Wallet operations
  getWallet(id: number): Promise<Wallet | undefined>;
  getWalletByUserId(userId: number): Promise<Wallet | undefined>;
  getWalletByAddress(address: string): Promise<Wallet | undefined>;
  createWallet(wallet: InsertWallet): Promise<Wallet>;
  updateWalletBalance(id: number, newBalance: number): Promise<Wallet>;
  
  // Transaction operations
  getTransaction(id: number): Promise<Transaction | undefined>;
  getTransactionsByUserId(userId: number, limit?: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransactionStatus(id: number, status: 'pending' | 'completed' | 'failed'): Promise<Transaction>;
  
  // Activity operations
  getActivity(id: number): Promise<Activity | undefined>;
  getActivitiesByUserId(userId: number, limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  
  // Loan operations
  getLoan(id: number): Promise<Loan | undefined>;
  getLoansByUserId(userId: number): Promise<Loan[]>;
  createLoan(loan: InsertLoan): Promise<Loan>;
  updateLoanStatus(id: number, status: 'pending' | 'approved' | 'active' | 'repaid' | 'defaulted' | 'rejected'): Promise<Loan>;
  updateLoanRepaidAmount(id: number, repaidAmount: number): Promise<Loan>;
  
  // Collateral operations
  getCollateral(id: number): Promise<Collateral | undefined>;
  getCollateralsByUserId(userId: number): Promise<Collateral[]>;
  createCollateral(collateral: InsertCollateral): Promise<Collateral>;
  updateCollateralLockStatus(id: number, isLocked: boolean): Promise<Collateral>;
  
  // Ad operations
  getAd(id: number): Promise<Ad | undefined>;
  getAdsByUserId(userId: number): Promise<Ad[]>;
  getActiveAds(limit?: number): Promise<Ad[]>;
  createAd(ad: InsertAd): Promise<Ad>;
  updateAdStatus(id: number, isActive: boolean): Promise<Ad>;
  
  // Token purchase operations
  getTokenPurchase(id: number): Promise<TokenPurchase | undefined>;
  getTokenPurchaseByPaymentIntent(paymentIntentId: string): Promise<TokenPurchase | undefined>;
  getTokenPurchasesByUserId(userId: number): Promise<TokenPurchase[]>;
  createTokenPurchase(purchase: InsertTokenPurchase): Promise<TokenPurchase>;
  updateTokenPurchaseStatus(id: number, status: string): Promise<TokenPurchase>;
  updateTokenPurchaseTxHash(id: number, txHash: string): Promise<TokenPurchase>;
  
  // Transaction fee operations
  getTransactionFee(): Promise<TransactionFee | undefined>;
  upsertTransactionFee(fee: InsertTransactionFee): Promise<TransactionFee>;
  
  // Session store for authentication
  sessionStore: SessionStore;
}

export class DatabaseStorage implements IStorage {
  sessionStore: SessionStore;
  
  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool: pgPool,
      createTableIfMissing: true
    });
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const [createdUser] = await db.insert(users).values(user).returning();
    return createdUser;
  }
  
  async updateUser(id: number, updates: Partial<Omit<User, 'id'>>): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }
  
  async updateStripeCustomerId(id: number, customerId: string): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ stripeCustomerId: customerId })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }
  
  async updateUserStripeInfo(id: number, stripeInfo: { stripeCustomerId: string, stripeSubscriptionId: string }): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({
        stripeCustomerId: stripeInfo.stripeCustomerId,
        stripeSubscriptionId: stripeInfo.stripeSubscriptionId
      })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }
  
  // Wallet operations
  async getWallet(id: number): Promise<Wallet | undefined> {
    const [wallet] = await db.select().from(wallets).where(eq(wallets.id, id));
    return wallet;
  }
  
  async getWalletByUserId(userId: number): Promise<Wallet | undefined> {
    const [wallet] = await db.select().from(wallets).where(eq(wallets.userId, userId));
    return wallet;
  }
  
  async getWalletByAddress(address: string): Promise<Wallet | undefined> {
    const [wallet] = await db.select().from(wallets).where(eq(wallets.address, address));
    return wallet;
  }
  
  async createWallet(wallet: InsertWallet): Promise<Wallet> {
    const [createdWallet] = await db.insert(wallets).values(wallet).returning();
    return createdWallet;
  }
  
  async updateWalletBalance(id: number, newBalance: number): Promise<Wallet> {
    const [updatedWallet] = await db
      .update(wallets)
      .set({ balance: newBalance, updatedAt: new Date() })
      .where(eq(wallets.id, id))
      .returning();
    return updatedWallet;
  }
  
  // Transaction operations
  async getTransaction(id: number): Promise<Transaction | undefined> {
    const [transaction] = await db.select().from(transactions).where(eq(transactions.id, id));
    return transaction;
  }
  
  async getTransactionsByUserId(userId: number, limit: number = 50): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(
        sql`${transactions.senderId} = ${userId} OR ${transactions.receiverId} = ${userId}`
      )
      .orderBy(desc(transactions.createdAt))
      .limit(limit);
  }
  
  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [createdTransaction] = await db.insert(transactions).values(transaction).returning();
    return createdTransaction;
  }
  
  async updateTransactionStatus(id: number, status: 'pending' | 'completed' | 'failed'): Promise<Transaction> {
    const [updatedTransaction] = await db
      .update(transactions)
      .set({ status, updatedAt: new Date() })
      .where(eq(transactions.id, id))
      .returning();
    return updatedTransaction;
  }
  
  // Activity operations
  async getActivity(id: number): Promise<Activity | undefined> {
    const [activity] = await db.select().from(activities).where(eq(activities.id, id));
    return activity;
  }
  
  async getActivitiesByUserId(userId: number, limit: number = 50): Promise<Activity[]> {
    return await db
      .select()
      .from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(desc(activities.createdAt))
      .limit(limit);
  }
  
  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [createdActivity] = await db.insert(activities).values(activity).returning();
    return createdActivity;
  }
  
  // Loan operations
  async getLoan(id: number): Promise<Loan | undefined> {
    const [loan] = await db.select().from(loans).where(eq(loans.id, id));
    return loan;
  }
  
  async getLoansByUserId(userId: number): Promise<Loan[]> {
    return await db
      .select()
      .from(loans)
      .where(eq(loans.userId, userId))
      .orderBy(desc(loans.createdAt));
  }
  
  async createLoan(loan: InsertLoan): Promise<Loan> {
    const [createdLoan] = await db.insert(loans).values(loan).returning();
    return createdLoan;
  }
  
  async updateLoanStatus(id: number, status: 'pending' | 'approved' | 'active' | 'repaid' | 'defaulted' | 'rejected'): Promise<Loan> {
    const [updatedLoan] = await db
      .update(loans)
      .set({ status, updatedAt: new Date() })
      .where(eq(loans.id, id))
      .returning();
    return updatedLoan;
  }
  
  async updateLoanRepaidAmount(id: number, repaidAmount: number): Promise<Loan> {
    const [updatedLoan] = await db
      .update(loans)
      .set({ repaidAmount, updatedAt: new Date() })
      .where(eq(loans.id, id))
      .returning();
    return updatedLoan;
  }
  
  // Collateral operations
  async getCollateral(id: number): Promise<Collateral | undefined> {
    const [collateral] = await db.select().from(collaterals).where(eq(collaterals.id, id));
    return collateral;
  }
  
  async getCollateralsByUserId(userId: number): Promise<Collateral[]> {
    return await db
      .select()
      .from(collaterals)
      .where(eq(collaterals.userId, userId))
      .orderBy(desc(collaterals.createdAt));
  }
  
  async createCollateral(collateral: InsertCollateral): Promise<Collateral> {
    const [createdCollateral] = await db.insert(collaterals).values(collateral).returning();
    return createdCollateral;
  }
  
  async updateCollateralLockStatus(id: number, isLocked: boolean): Promise<Collateral> {
    const [updatedCollateral] = await db
      .update(collaterals)
      .set({ isLocked, updatedAt: new Date() })
      .where(eq(collaterals.id, id))
      .returning();
    return updatedCollateral;
  }
  
  // Ad operations
  async getAd(id: number): Promise<Ad | undefined> {
    const [ad] = await db.select().from(ads).where(eq(ads.id, id));
    return ad;
  }
  
  async getAdsByUserId(userId: number): Promise<Ad[]> {
    return await db
      .select()
      .from(ads)
      .where(eq(ads.userId, userId))
      .orderBy(desc(ads.createdAt));
  }
  
  async getActiveAds(limit: number = 50): Promise<Ad[]> {
    return await db
      .select()
      .from(ads)
      .where(eq(ads.isActive, true))
      .orderBy(desc(ads.createdAt))
      .limit(limit);
  }
  
  async createAd(ad: InsertAd): Promise<Ad> {
    const [createdAd] = await db.insert(ads).values(ad).returning();
    return createdAd;
  }
  
  async updateAdStatus(id: number, isActive: boolean): Promise<Ad> {
    const [updatedAd] = await db
      .update(ads)
      .set({ isActive, updatedAt: new Date() })
      .where(eq(ads.id, id))
      .returning();
    return updatedAd;
  }
  
  // Token purchase operations
  async getTokenPurchase(id: number): Promise<TokenPurchase | undefined> {
    const [purchase] = await db.select().from(tokenPurchases).where(eq(tokenPurchases.id, id));
    return purchase;
  }
  
  async getTokenPurchaseByPaymentIntent(paymentIntentId: string): Promise<TokenPurchase | undefined> {
    const [purchase] = await db
      .select()
      .from(tokenPurchases)
      .where(eq(tokenPurchases.stripePaymentIntentId, paymentIntentId));
    return purchase;
  }
  
  async getTokenPurchasesByUserId(userId: number): Promise<TokenPurchase[]> {
    return await db
      .select()
      .from(tokenPurchases)
      .where(eq(tokenPurchases.userId, userId))
      .orderBy(desc(tokenPurchases.createdAt));
  }
  
  async createTokenPurchase(purchase: InsertTokenPurchase): Promise<TokenPurchase> {
    const [createdPurchase] = await db.insert(tokenPurchases).values(purchase).returning();
    return createdPurchase;
  }
  
  async updateTokenPurchaseStatus(id: number, status: string): Promise<TokenPurchase> {
    const [updatedPurchase] = await db
      .update(tokenPurchases)
      .set({ status, updatedAt: new Date() })
      .where(eq(tokenPurchases.id, id))
      .returning();
    return updatedPurchase;
  }
  
  async updateTokenPurchaseTxHash(id: number, txHash: string): Promise<TokenPurchase> {
    const [updatedPurchase] = await db
      .update(tokenPurchases)
      .set({ txHash, updatedAt: new Date() })
      .where(eq(tokenPurchases.id, id))
      .returning();
    return updatedPurchase;
  }
  
  // Transaction fee operations
  async getTransactionFee(): Promise<TransactionFee | undefined> {
    const [fee] = await db
      .select()
      .from(transactionFees)
      .orderBy(desc(transactionFees.updatedAt))
      .limit(1);
    return fee;
  }
  
  async upsertTransactionFee(fee: InsertTransactionFee): Promise<TransactionFee> {
    // Delete any existing fee
    await db.delete(transactionFees);
    
    // Insert the new fee
    const [createdFee] = await db.insert(transactionFees).values(fee).returning();
    return createdFee;
  }
}

export const storage = new DatabaseStorage();