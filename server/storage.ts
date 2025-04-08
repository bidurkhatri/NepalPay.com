import { eq, and, desc, SQL } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import {
  User,
  InsertUser,
  Wallet,
  InsertWallet,
  Transaction,
  InsertTransaction,
  Activity,
  InsertActivity,
  Collateral,
  InsertCollateral,
  Loan,
  InsertLoan,
  Ad,
  InsertAd,
  users,
  wallets,
  transactions,
  activities,
  collaterals,
  loans,
  ads,
} from "../shared/schema";
import { db, pool } from "./db";

// PostgreSQL session store
const PostgresSessionStore = connectPg(session);

// Storage interface
export interface IStorage {
  // Session store
  sessionStore: session.Store;

  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  updateStripeCustomerId(userId: number, stripeCustomerId: string): Promise<User | undefined>;
  updateUserStripeInfo(
    userId: number, 
    info: { stripeCustomerId: string, stripeSubscriptionId: string }
  ): Promise<User | undefined>;

  // Wallet methods
  getWallet(id: number): Promise<Wallet | undefined>;
  getWalletByAddress(address: string): Promise<Wallet | undefined>;
  getWalletByUserId(userId: number): Promise<Wallet | undefined>;
  createWallet(wallet: InsertWallet): Promise<Wallet>;

  // Transaction methods
  getTransaction(id: number): Promise<Transaction | undefined>;
  getTransactionsByUserId(userId: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransactionStatus(
    id: number,
    status: "pending" | "completed" | "failed" | "cancelled",
    txHash?: string
  ): Promise<Transaction | undefined>;

  // Activity methods
  getActivity(id: number): Promise<Activity | undefined>;
  getActivitiesByUserId(userId: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;

  // Collateral methods
  getCollateral(id: number): Promise<Collateral | undefined>;
  getCollateralsByUserId(userId: number): Promise<Collateral[]>;
  createCollateral(collateral: InsertCollateral): Promise<Collateral>;
  updateCollateralStatus(
    id: number,
    status: "pending" | "completed" | "failed" | "cancelled",
    txHash?: string
  ): Promise<Collateral | undefined>;

  // Loan methods
  getLoan(id: number): Promise<Loan | undefined>;
  getLoansByUserId(userId: number): Promise<Loan[]>;
  createLoan(loan: InsertLoan): Promise<Loan>;
  updateLoanStatus(
    id: number,
    status: "pending" | "approved" | "rejected" | "active" | "paid" | "defaulted"
  ): Promise<Loan | undefined>;

  // Ad methods
  getAd(id: number): Promise<Ad | undefined>;
  getAdsByUserId(userId: number): Promise<Ad[]>;
  createAd(ad: InsertAd): Promise<Ad>;
  updateAd(id: number, updates: Partial<Ad>): Promise<Ad | undefined>;
  toggleAdActive(id: number, isActive: boolean): Promise<Ad | undefined>;
  incrementAdImpressions(id: number): Promise<Ad | undefined>;
  incrementAdClicks(id: number): Promise<Ad | undefined>;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      tableName: "session",
      createTableIfMissing: true,
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async updateStripeCustomerId(userId: number, stripeCustomerId: string): Promise<User | undefined> {
    return this.updateUser(userId, { stripeCustomerId });
  }

  async updateUserStripeInfo(
    userId: number, 
    info: { stripeCustomerId: string, stripeSubscriptionId: string }
  ): Promise<User | undefined> {
    return this.updateUser(userId, { 
      stripeCustomerId: info.stripeCustomerId,
      stripeSubscriptionId: info.stripeSubscriptionId
    });
  }

  // Wallet methods
  async getWallet(id: number): Promise<Wallet | undefined> {
    const [wallet] = await db.select().from(wallets).where(eq(wallets.id, id));
    return wallet;
  }

  async getWalletByAddress(address: string): Promise<Wallet | undefined> {
    const [wallet] = await db
      .select()
      .from(wallets)
      .where(eq(wallets.address, address));
    return wallet;
  }

  async getWalletByUserId(userId: number): Promise<Wallet | undefined> {
    const [wallet] = await db
      .select()
      .from(wallets)
      .where(eq(wallets.userId, userId));
    return wallet;
  }

  async createWallet(wallet: InsertWallet): Promise<Wallet> {
    const [newWallet] = await db
      .insert(wallets)
      .values(wallet)
      .returning();
    return newWallet;
  }

  // Transaction methods
  async getTransaction(id: number): Promise<Transaction | undefined> {
    const [transaction] = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, id));
    return transaction;
  }

  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    return db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt));
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db
      .insert(transactions)
      .values(transaction)
      .returning();
    return newTransaction;
  }

  async updateTransactionStatus(
    id: number,
    status: "pending" | "completed" | "failed" | "cancelled",
    txHash?: string
  ): Promise<Transaction | undefined> {
    const updates: Partial<Transaction> = { status };
    if (txHash) {
      updates.txHash = txHash;
    }
    
    const [updatedTransaction] = await db
      .update(transactions)
      .set(updates)
      .where(eq(transactions.id, id))
      .returning();
    
    return updatedTransaction;
  }

  // Activity methods
  async getActivity(id: number): Promise<Activity | undefined> {
    const [activity] = await db
      .select()
      .from(activities)
      .where(eq(activities.id, id));
    return activity;
  }

  async getActivitiesByUserId(userId: number): Promise<Activity[]> {
    return db
      .select()
      .from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(desc(activities.createdAt));
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [newActivity] = await db
      .insert(activities)
      .values(activity)
      .returning();
    return newActivity;
  }

  // Collateral methods
  async getCollateral(id: number): Promise<Collateral | undefined> {
    const [collateral] = await db
      .select()
      .from(collaterals)
      .where(eq(collaterals.id, id));
    return collateral;
  }

  async getCollateralsByUserId(userId: number): Promise<Collateral[]> {
    return db
      .select()
      .from(collaterals)
      .where(eq(collaterals.userId, userId))
      .orderBy(desc(collaterals.createdAt));
  }

  async createCollateral(collateral: InsertCollateral): Promise<Collateral> {
    const [newCollateral] = await db
      .insert(collaterals)
      .values(collateral)
      .returning();
    return newCollateral;
  }

  async updateCollateralStatus(
    id: number,
    status: "pending" | "completed" | "failed" | "cancelled",
    txHash?: string
  ): Promise<Collateral | undefined> {
    const updates: any = { status };
    if (txHash) {
      updates.txHash = txHash;
    }
    
    const [updatedCollateral] = await db
      .update(collaterals)
      .set(updates)
      .where(eq(collaterals.id, id))
      .returning();
    
    return updatedCollateral;
  }

  // Loan methods
  async getLoan(id: number): Promise<Loan | undefined> {
    const [loan] = await db
      .select()
      .from(loans)
      .where(eq(loans.id, id));
    return loan;
  }

  async getLoansByUserId(userId: number): Promise<Loan[]> {
    return db
      .select()
      .from(loans)
      .where(eq(loans.userId, userId))
      .orderBy(desc(loans.createdAt));
  }

  async createLoan(loan: InsertLoan): Promise<Loan> {
    const [newLoan] = await db
      .insert(loans)
      .values(loan)
      .returning();
    return newLoan;
  }

  async updateLoanStatus(
    id: number,
    status: "pending" | "approved" | "rejected" | "active" | "paid" | "defaulted"
  ): Promise<Loan | undefined> {
    const [updatedLoan] = await db
      .update(loans)
      .set({ status })
      .where(eq(loans.id, id))
      .returning();
    
    return updatedLoan;
  }

  // Ad methods
  async getAd(id: number): Promise<Ad | undefined> {
    const [ad] = await db
      .select()
      .from(ads)
      .where(eq(ads.id, id));
    return ad;
  }

  async getAdsByUserId(userId: number): Promise<Ad[]> {
    return db
      .select()
      .from(ads)
      .where(eq(ads.userId, userId))
      .orderBy(desc(ads.createdAt));
  }

  async createAd(ad: InsertAd): Promise<Ad> {
    const [newAd] = await db
      .insert(ads)
      .values(ad)
      .returning();
    return newAd;
  }

  async updateAd(id: number, updates: Partial<Ad>): Promise<Ad | undefined> {
    const [updatedAd] = await db
      .update(ads)
      .set(updates)
      .where(eq(ads.id, id))
      .returning();
    
    return updatedAd;
  }

  async toggleAdActive(id: number, isActive: boolean): Promise<Ad | undefined> {
    return this.updateAd(id, { isActive });
  }

  async incrementAdImpressions(id: number): Promise<Ad | undefined> {
    const [ad] = await db
      .select()
      .from(ads)
      .where(eq(ads.id, id));
    
    if (!ad) return undefined;
    
    return this.updateAd(id, { impressions: ad.impressions + 1 });
  }

  async incrementAdClicks(id: number): Promise<Ad | undefined> {
    const [ad] = await db
      .select()
      .from(ads)
      .where(eq(ads.id, id));
    
    if (!ad) return undefined;
    
    return this.updateAd(id, { clicks: ad.clicks + 1 });
  }
}

// Export singleton instance
export const storage = new DatabaseStorage();