import { 
  users, wallets, transactions, activities, collaterals, loans, ads,
  User, Wallet, Transaction, Activity, Collateral, Loan, Ad, 
  InsertUser, InsertWallet, InsertTransaction, InsertActivity, InsertCollateral, InsertLoan, InsertAd
} from '../shared/schema';
import { db } from './db';
import { eq, and, desc } from 'drizzle-orm';
import connectPg from 'connect-pg-simple';
import session from 'express-session';
import { pool } from './db';

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  updateStripeCustomerId(id: number, stripeCustomerId: string): Promise<User | undefined>;
  updateUserStripeInfo(id: number, info: { stripeCustomerId: string, stripeSubscriptionId: string }): Promise<User | undefined>;
  
  // Wallet operations
  getWallet(id: number): Promise<Wallet | undefined>;
  getWalletByUserId(userId: number): Promise<Wallet | undefined>;
  getWalletByAddress(address: string): Promise<Wallet | undefined>;
  createWallet(wallet: InsertWallet): Promise<Wallet>;
  updateWalletBalance(id: number, balance: string): Promise<Wallet | undefined>;
  
  // Transaction operations
  getTransaction(id: number): Promise<Transaction | undefined>;
  getTransactionsByUserId(userId: number): Promise<Transaction[]>;
  getTransactionsByWalletAddress(address: string): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransactionStatus(id: number, status: string): Promise<Transaction | undefined>;
  
  // Activity operations
  getActivity(id: number): Promise<Activity | undefined>;
  getActivitiesByUserId(userId: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  
  // Collateral operations
  getCollateral(id: number): Promise<Collateral | undefined>;
  getCollateralsByUserId(userId: number): Promise<Collateral[]>;
  createCollateral(collateral: InsertCollateral): Promise<Collateral>;
  updateCollateralStatus(id: number, status: string): Promise<Collateral | undefined>;
  
  // Loan operations
  getLoan(id: number): Promise<Loan | undefined>;
  getLoansByUserId(userId: number): Promise<Loan[]>;
  createLoan(loan: InsertLoan): Promise<Loan>;
  updateLoanStatus(id: number, status: string): Promise<Loan | undefined>;
  updateLoanRepaidAmount(id: number, repaidAmount: string): Promise<Loan | undefined>;
  
  // Ad operations
  getAd(id: number): Promise<Ad | undefined>;
  getAdsByUserId(userId: number): Promise<Ad[]>;
  getActiveAds(): Promise<Ad[]>;
  createAd(ad: InsertAd): Promise<Ad>;
  updateAdStatus(id: number, status: string): Promise<Ad | undefined>;
  
  // Session store
  sessionStore: session.Store;
}

export class PostgreSQLStorage implements IStorage {
  sessionStore: session.Store;
  
  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      tableName: 'session', 
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
  
  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db.update(users)
      .set({
        ...userData,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }
  
  async updateStripeCustomerId(id: number, stripeCustomerId: string): Promise<User | undefined> {
    const [updatedUser] = await db.update(users)
      .set({
        stripeCustomerId,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }
  
  async updateUserStripeInfo(id: number, info: { stripeCustomerId: string, stripeSubscriptionId: string }): Promise<User | undefined> {
    const [updatedUser] = await db.update(users)
      .set({
        stripeCustomerId: info.stripeCustomerId,
        stripeSubscriptionId: info.stripeSubscriptionId,
        updatedAt: new Date()
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
    const [newWallet] = await db.insert(wallets).values(wallet).returning();
    return newWallet;
  }
  
  async updateWalletBalance(id: number, balance: string): Promise<Wallet | undefined> {
    const [updatedWallet] = await db.update(wallets)
      .set({
        balance,
        updatedAt: new Date()
      })
      .where(eq(wallets.id, id))
      .returning();
    return updatedWallet;
  }
  
  // Transaction operations
  async getTransaction(id: number): Promise<Transaction | undefined> {
    const [transaction] = await db.select().from(transactions).where(eq(transactions.id, id));
    return transaction;
  }
  
  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    return await db.select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt));
  }
  
  async getTransactionsByWalletAddress(address: string): Promise<Transaction[]> {
    return await db.select()
      .from(transactions)
      .where(
        and(
          eq(transactions.fromAddress, address),
          eq(transactions.toAddress, address)
        )
      )
      .orderBy(desc(transactions.createdAt));
  }
  
  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db.insert(transactions)
      .values(transaction)
      .returning();
    return newTransaction;
  }
  
  async updateTransactionStatus(id: number, status: string): Promise<Transaction | undefined> {
    const [updatedTransaction] = await db.update(transactions)
      .set({
        status,
        updatedAt: new Date()
      })
      .where(eq(transactions.id, id))
      .returning();
    return updatedTransaction;
  }
  
  // Activity operations
  async getActivity(id: number): Promise<Activity | undefined> {
    const [activity] = await db.select().from(activities).where(eq(activities.id, id));
    return activity;
  }
  
  async getActivitiesByUserId(userId: number): Promise<Activity[]> {
    return await db.select()
      .from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(desc(activities.createdAt));
  }
  
  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [newActivity] = await db.insert(activities)
      .values(activity)
      .returning();
    return newActivity;
  }
  
  // Collateral operations
  async getCollateral(id: number): Promise<Collateral | undefined> {
    const [collateral] = await db.select().from(collaterals).where(eq(collaterals.id, id));
    return collateral;
  }
  
  async getCollateralsByUserId(userId: number): Promise<Collateral[]> {
    return await db.select()
      .from(collaterals)
      .where(eq(collaterals.userId, userId))
      .orderBy(desc(collaterals.createdAt));
  }
  
  async createCollateral(collateral: InsertCollateral): Promise<Collateral> {
    const [newCollateral] = await db.insert(collaterals)
      .values(collateral)
      .returning();
    return newCollateral;
  }
  
  async updateCollateralStatus(id: number, status: string): Promise<Collateral | undefined> {
    const [updatedCollateral] = await db.update(collaterals)
      .set({
        status,
        updatedAt: new Date()
      })
      .where(eq(collaterals.id, id))
      .returning();
    return updatedCollateral;
  }
  
  // Loan operations
  async getLoan(id: number): Promise<Loan | undefined> {
    const [loan] = await db.select().from(loans).where(eq(loans.id, id));
    return loan;
  }
  
  async getLoansByUserId(userId: number): Promise<Loan[]> {
    return await db.select()
      .from(loans)
      .where(eq(loans.userId, userId))
      .orderBy(desc(loans.createdAt));
  }
  
  async createLoan(loan: InsertLoan): Promise<Loan> {
    const [newLoan] = await db.insert(loans)
      .values(loan)
      .returning();
    return newLoan;
  }
  
  async updateLoanStatus(id: number, status: string): Promise<Loan | undefined> {
    const [updatedLoan] = await db.update(loans)
      .set({
        status,
        updatedAt: new Date()
      })
      .where(eq(loans.id, id))
      .returning();
    return updatedLoan;
  }
  
  async updateLoanRepaidAmount(id: number, repaidAmount: string): Promise<Loan | undefined> {
    const [updatedLoan] = await db.update(loans)
      .set({
        repaidAmount,
        lastRepaymentDate: new Date(),
        updatedAt: new Date()
      })
      .where(eq(loans.id, id))
      .returning();
    return updatedLoan;
  }
  
  // Ad operations
  async getAd(id: number): Promise<Ad | undefined> {
    const [ad] = await db.select().from(ads).where(eq(ads.id, id));
    return ad;
  }
  
  async getAdsByUserId(userId: number): Promise<Ad[]> {
    return await db.select()
      .from(ads)
      .where(eq(ads.userId, userId))
      .orderBy(desc(ads.createdAt));
  }
  
  async getActiveAds(): Promise<Ad[]> {
    return await db.select()
      .from(ads)
      .where(eq(ads.status, 'active'))
      .orderBy(desc(ads.createdAt));
  }
  
  async createAd(ad: InsertAd): Promise<Ad> {
    const [newAd] = await db.insert(ads)
      .values(ad)
      .returning();
    return newAd;
  }
  
  async updateAdStatus(id: number, status: string): Promise<Ad | undefined> {
    const [updatedAd] = await db.update(ads)
      .set({
        status,
        updatedAt: new Date()
      })
      .where(eq(ads.id, id))
      .returning();
    return updatedAd;
  }
}

// Export a singleton instance of the storage
export const storage = new PostgreSQLStorage();