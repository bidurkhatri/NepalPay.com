import session from 'express-session';
import connectPg from 'connect-pg-simple';
import { db } from './db';
import { pool } from './db';
import * as schema from '@shared/schema';
import { eq, or, and, desc, sql } from 'drizzle-orm';
import { log } from './vite';

// Create a connect-pg-simple session store
const PostgresSessionStore = connectPg(session);

/**
 * Interface for storage operations
 */
export interface IStorage {
  // Session store
  sessionStore: session.Store;

  // User operations
  getUser(id: number): Promise<schema.User | undefined>;
  getUserByUsername(username: string): Promise<schema.User | undefined>;
  getUserByEmail(email: string): Promise<schema.User | undefined>;
  createUser(insertUser: schema.InsertUser): Promise<schema.User>;
  updateUser(id: number, userUpdates: Partial<schema.InsertUser>): Promise<schema.User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  updateStripeCustomerId(userId: number, stripeCustomerId: string): Promise<schema.User | undefined>;
  updateUserStripeInfo(userId: number, stripeInfo: { customerId: string, subscriptionId: string }): Promise<schema.User | undefined>;

  // Wallet operations
  getWallet(id: number): Promise<schema.Wallet | undefined>;
  getWalletByUserId(userId: number): Promise<schema.Wallet | undefined>;
  createWallet(insertWallet: schema.InsertWallet): Promise<schema.Wallet>;
  updateWallet(id: number, walletUpdates: Partial<schema.InsertWallet>): Promise<schema.Wallet | undefined>;
  updateWalletBalance(userId: number, currency: string, amount: number): Promise<schema.Wallet | undefined>;

  // Transaction operations
  getTransaction(id: number): Promise<schema.Transaction | undefined>;
  getUserTransactions(userId: number): Promise<schema.Transaction[]>;
  createTransaction(insertTransaction: schema.InsertTransaction): Promise<schema.Transaction>;
  updateTransaction(id: number, transactionUpdates: Partial<schema.InsertTransaction>): Promise<schema.Transaction | undefined>;

  // Activity operations
  getActivity(id: number): Promise<schema.Activity | undefined>;
  getUserActivities(userId: number): Promise<schema.Activity[]>;
  createActivity(insertActivity: schema.InsertActivity): Promise<schema.Activity>;

  // Collateral operations
  getCollateral(id: number): Promise<schema.Collateral | undefined>;
  getUserCollaterals(userId: number): Promise<schema.Collateral[]>;
  createCollateral(insertCollateral: schema.InsertCollateral): Promise<schema.Collateral>;
  updateCollateral(id: number, collateralUpdates: Partial<schema.InsertCollateral>): Promise<schema.Collateral | undefined>;

  // Loan operations
  getLoan(id: number): Promise<schema.Loan | undefined>;
  getUserLoans(userId: number): Promise<schema.Loan[]>;
  createLoan(insertLoan: schema.InsertLoan): Promise<schema.Loan>;
  updateLoan(id: number, loanUpdates: Partial<schema.InsertLoan>): Promise<schema.Loan | undefined>;

  // Ad operations
  getAd(id: number): Promise<schema.Ad | undefined>;
  getUserAds(userId: number): Promise<schema.Ad[]>;
  getActiveAds(): Promise<schema.Ad[]>;
  createAd(insertAd: schema.InsertAd): Promise<schema.Ad>;
  updateAd(id: number, adUpdates: Partial<schema.InsertAd>): Promise<schema.Ad | undefined>;
  incrementAdImpressions(id: number): Promise<schema.Ad | undefined>;
  incrementAdClicks(id: number): Promise<schema.Ad | undefined>;
}

/**
 * Database storage implementation using PostgreSQL
 */
export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
      tableName: 'session'
    });
  }

  // User operations
  async getUser(id: number): Promise<schema.User | undefined> {
    try {
      const [user] = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.id, id));
      return user;
    } catch (error) {
      log(`Error getting user by ID: ${error instanceof Error ? error.message : String(error)}`);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<schema.User | undefined> {
    try {
      const [user] = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.username, username));
      return user;
    } catch (error) {
      log(`Error getting user by username: ${error instanceof Error ? error.message : String(error)}`);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<schema.User | undefined> {
    try {
      const [user] = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, email));
      return user;
    } catch (error) {
      log(`Error getting user by email: ${error instanceof Error ? error.message : String(error)}`);
      return undefined;
    }
  }

  async createUser(insertUser: schema.InsertUser): Promise<schema.User> {
    try {
      const [user] = await db
        .insert(schema.users)
        .values({
          ...insertUser,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
      return user;
    } catch (error) {
      log(`Error creating user: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  async updateUser(id: number, userUpdates: Partial<schema.InsertUser>): Promise<schema.User | undefined> {
    try {
      const [user] = await db
        .update(schema.users)
        .set({
          ...userUpdates,
          updatedAt: new Date()
        })
        .where(eq(schema.users.id, id))
        .returning();
      return user;
    } catch (error) {
      log(`Error updating user: ${error instanceof Error ? error.message : String(error)}`);
      return undefined;
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      const result = await db
        .delete(schema.users)
        .where(eq(schema.users.id, id));
      return true;
    } catch (error) {
      log(`Error deleting user: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }

  async updateStripeCustomerId(userId: number, stripeCustomerId: string): Promise<schema.User | undefined> {
    try {
      const [user] = await db
        .update(schema.users)
        .set({
          stripeCustomerId,
          updatedAt: new Date()
        })
        .where(eq(schema.users.id, userId))
        .returning();
      return user;
    } catch (error) {
      log(`Error updating Stripe customer ID: ${error instanceof Error ? error.message : String(error)}`);
      return undefined;
    }
  }

  async updateUserStripeInfo(userId: number, stripeInfo: { customerId: string, subscriptionId: string }): Promise<schema.User | undefined> {
    try {
      const [user] = await db
        .update(schema.users)
        .set({
          stripeCustomerId: stripeInfo.customerId,
          stripeSubscriptionId: stripeInfo.subscriptionId,
          updatedAt: new Date()
        })
        .where(eq(schema.users.id, userId))
        .returning();
      return user;
    } catch (error) {
      log(`Error updating Stripe info: ${error instanceof Error ? error.message : String(error)}`);
      return undefined;
    }
  }

  // Wallet operations
  async getWallet(id: number): Promise<schema.Wallet | undefined> {
    try {
      const [wallet] = await db
        .select()
        .from(schema.wallets)
        .where(eq(schema.wallets.id, id));
      return wallet;
    } catch (error) {
      log(`Error getting wallet by ID: ${error instanceof Error ? error.message : String(error)}`);
      return undefined;
    }
  }

  async getWalletByUserId(userId: number): Promise<schema.Wallet | undefined> {
    try {
      const [wallet] = await db
        .select()
        .from(schema.wallets)
        .where(eq(schema.wallets.userId, userId));
      return wallet;
    } catch (error) {
      log(`Error getting wallet by user ID: ${error instanceof Error ? error.message : String(error)}`);
      return undefined;
    }
  }

  async createWallet(insertWallet: schema.InsertWallet): Promise<schema.Wallet> {
    try {
      const [wallet] = await db
        .insert(schema.wallets)
        .values({
          ...insertWallet,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
      return wallet;
    } catch (error) {
      log(`Error creating wallet: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  async updateWallet(id: number, walletUpdates: Partial<schema.InsertWallet>): Promise<schema.Wallet | undefined> {
    try {
      const [wallet] = await db
        .update(schema.wallets)
        .set({
          ...walletUpdates,
          updatedAt: new Date()
        })
        .where(eq(schema.wallets.id, id))
        .returning();
      return wallet;
    } catch (error) {
      log(`Error updating wallet: ${error instanceof Error ? error.message : String(error)}`);
      return undefined;
    }
  }

  async updateWalletBalance(userId: number, currency: string, amount: number): Promise<schema.Wallet | undefined> {
    try {
      const wallet = await this.getWalletByUserId(userId);
      if (!wallet) {
        throw new Error(`Wallet not found for user ID: ${userId}`);
      }

      let updateField: string;
      let currentBalance: string;

      switch (currency.toLowerCase()) {
        case 'npt':
          updateField = 'nptBalance';
          currentBalance = wallet.nptBalance;
          break;
        case 'bnb':
          updateField = 'bnbBalance';
          currentBalance = wallet.bnbBalance;
          break;
        case 'eth':
          updateField = 'ethBalance';
          currentBalance = wallet.ethBalance;
          break;
        case 'btc':
          updateField = 'btcBalance';
          currentBalance = wallet.btcBalance;
          break;
        default:
          throw new Error(`Unsupported currency: ${currency}`);
      }

      // Convert string balance to number, add amount, then convert back to string
      const newBalance = (parseFloat(currentBalance) + amount).toString();

      // Create update object dynamically
      const updateObject: any = { updatedAt: new Date() };
      updateObject[updateField] = newBalance;

      // Update wallet with new balance
      const [updatedWallet] = await db
        .update(schema.wallets)
        .set(updateObject)
        .where(eq(schema.wallets.id, wallet.id))
        .returning();

      return updatedWallet;
    } catch (error) {
      log(`Error updating wallet balance: ${error instanceof Error ? error.message : String(error)}`);
      return undefined;
    }
  }

  // Transaction operations
  async getTransaction(id: number): Promise<schema.Transaction | undefined> {
    try {
      const [transaction] = await db
        .select()
        .from(schema.transactions)
        .where(eq(schema.transactions.id, id));
      return transaction;
    } catch (error) {
      log(`Error getting transaction by ID: ${error instanceof Error ? error.message : String(error)}`);
      return undefined;
    }
  }

  async getUserTransactions(userId: number): Promise<schema.Transaction[]> {
    try {
      const transactions = await db
        .select()
        .from(schema.transactions)
        .where(
          or(
            eq(schema.transactions.senderId, userId),
            eq(schema.transactions.recipientId, userId)
          )
        )
        .orderBy(desc(schema.transactions.createdAt));
      return transactions;
    } catch (error) {
      log(`Error getting user transactions: ${error instanceof Error ? error.message : String(error)}`);
      return [];
    }
  }

  async createTransaction(insertTransaction: schema.InsertTransaction): Promise<schema.Transaction> {
    try {
      const [transaction] = await db
        .insert(schema.transactions)
        .values({
          ...insertTransaction,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
      return transaction;
    } catch (error) {
      log(`Error creating transaction: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  async updateTransaction(id: number, transactionUpdates: Partial<schema.InsertTransaction>): Promise<schema.Transaction | undefined> {
    try {
      const [transaction] = await db
        .update(schema.transactions)
        .set({
          ...transactionUpdates,
          updatedAt: new Date()
        })
        .where(eq(schema.transactions.id, id))
        .returning();
      return transaction;
    } catch (error) {
      log(`Error updating transaction: ${error instanceof Error ? error.message : String(error)}`);
      return undefined;
    }
  }

  // Activity operations
  async getActivity(id: number): Promise<schema.Activity | undefined> {
    try {
      const [activity] = await db
        .select()
        .from(schema.activities)
        .where(eq(schema.activities.id, id));
      return activity;
    } catch (error) {
      log(`Error getting activity by ID: ${error instanceof Error ? error.message : String(error)}`);
      return undefined;
    }
  }

  async getUserActivities(userId: number): Promise<schema.Activity[]> {
    try {
      const activities = await db
        .select()
        .from(schema.activities)
        .where(eq(schema.activities.userId, userId))
        .orderBy(desc("createdAt"));
      return activities;
    } catch (error) {
      log(`Error getting user activities: ${error instanceof Error ? error.message : String(error)}`);
      return [];
    }
  }

  async createActivity(insertActivity: schema.InsertActivity): Promise<schema.Activity> {
    try {
      const [activity] = await db
        .insert(schema.activities)
        .values({
          ...insertActivity,
          createdAt: new Date()
        })
        .returning();
      return activity;
    } catch (error) {
      log(`Error creating activity: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  // Collateral operations
  async getCollateral(id: number): Promise<schema.Collateral | undefined> {
    try {
      const [collateral] = await db
        .select()
        .from(schema.collaterals)
        .where(eq(schema.collaterals.id, id));
      return collateral;
    } catch (error) {
      log(`Error getting collateral by ID: ${error instanceof Error ? error.message : String(error)}`);
      return undefined;
    }
  }

  async getUserCollaterals(userId: number): Promise<schema.Collateral[]> {
    try {
      const collaterals = await db
        .select()
        .from(schema.collaterals)
        .where(eq(schema.collaterals.userId, userId))
        .orderBy(desc(schema.collaterals.createdAt));
      return collaterals;
    } catch (error) {
      log(`Error getting user collaterals: ${error instanceof Error ? error.message : String(error)}`);
      return [];
    }
  }

  async createCollateral(insertCollateral: schema.InsertCollateral): Promise<schema.Collateral> {
    try {
      const [collateral] = await db
        .insert(schema.collaterals)
        .values({
          ...insertCollateral,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
      return collateral;
    } catch (error) {
      log(`Error creating collateral: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  async updateCollateral(id: number, collateralUpdates: Partial<schema.InsertCollateral>): Promise<schema.Collateral | undefined> {
    try {
      const [collateral] = await db
        .update(schema.collaterals)
        .set({
          ...collateralUpdates,
          updatedAt: new Date()
        })
        .where(eq(schema.collaterals.id, id))
        .returning();
      return collateral;
    } catch (error) {
      log(`Error updating collateral: ${error instanceof Error ? error.message : String(error)}`);
      return undefined;
    }
  }

  // Loan operations
  async getLoan(id: number): Promise<schema.Loan | undefined> {
    try {
      const [loan] = await db
        .select()
        .from(schema.loans)
        .where(eq(schema.loans.id, id));
      return loan;
    } catch (error) {
      log(`Error getting loan by ID: ${error instanceof Error ? error.message : String(error)}`);
      return undefined;
    }
  }

  async getUserLoans(userId: number): Promise<schema.Loan[]> {
    try {
      const loans = await db
        .select()
        .from(schema.loans)
        .where(eq(schema.loans.userId, userId))
        .orderBy(desc(schema.loans.createdAt));
      return loans;
    } catch (error) {
      log(`Error getting user loans: ${error instanceof Error ? error.message : String(error)}`);
      return [];
    }
  }

  async createLoan(insertLoan: schema.InsertLoan): Promise<schema.Loan> {
    try {
      const [loan] = await db
        .insert(schema.loans)
        .values({
          ...insertLoan,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
      return loan;
    } catch (error) {
      log(`Error creating loan: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  async updateLoan(id: number, loanUpdates: Partial<schema.InsertLoan>): Promise<schema.Loan | undefined> {
    try {
      const [loan] = await db
        .update(schema.loans)
        .set({
          ...loanUpdates,
          updatedAt: new Date()
        })
        .where(eq(schema.loans.id, id))
        .returning();
      return loan;
    } catch (error) {
      log(`Error updating loan: ${error instanceof Error ? error.message : String(error)}`);
      return undefined;
    }
  }

  // Ad operations
  async getAd(id: number): Promise<schema.Ad | undefined> {
    try {
      const [ad] = await db
        .select()
        .from(schema.ads)
        .where(eq(schema.ads.id, id));
      return ad;
    } catch (error) {
      log(`Error getting ad by ID: ${error instanceof Error ? error.message : String(error)}`);
      return undefined;
    }
  }

  async getUserAds(userId: number): Promise<schema.Ad[]> {
    try {
      const ads = await db
        .select()
        .from(schema.ads)
        .where(eq(schema.ads.userId, userId))
        .orderBy(desc(schema.ads.createdAt));
      return ads;
    } catch (error) {
      log(`Error getting user ads: ${error instanceof Error ? error.message : String(error)}`);
      return [];
    }
  }

  async getActiveAds(): Promise<schema.Ad[]> {
    try {
      const now = new Date();
      const ads = await db
        .select()
        .from(schema.ads)
        .where(
          and(
            eq(schema.ads.status, 'active'),
            sql`${schema.ads.startDate} <= ${now}`,
            sql`${schema.ads.endDate} >= ${now}`
          )
        )
        .orderBy(desc(schema.ads.budget));
      return ads;
    } catch (error) {
      log(`Error getting active ads: ${error instanceof Error ? error.message : String(error)}`);
      return [];
    }
  }

  async createAd(insertAd: schema.InsertAd): Promise<schema.Ad> {
    try {
      const [ad] = await db
        .insert(schema.ads)
        .values({
          ...insertAd,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
      return ad;
    } catch (error) {
      log(`Error creating ad: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  async updateAd(id: number, adUpdates: Partial<schema.InsertAd>): Promise<schema.Ad | undefined> {
    try {
      const [ad] = await db
        .update(schema.ads)
        .set({
          ...adUpdates,
          updatedAt: new Date()
        })
        .where(eq(schema.ads.id, id))
        .returning();
      return ad;
    } catch (error) {
      log(`Error updating ad: ${error instanceof Error ? error.message : String(error)}`);
      return undefined;
    }
  }

  async incrementAdImpressions(id: number): Promise<schema.Ad | undefined> {
    try {
      const [ad] = await db
        .update(schema.ads)
        .set({
          impressions: sql`${schema.ads.impressions} + 1`,
          updatedAt: new Date()
        })
        .where(eq(schema.ads.id, id))
        .returning();
      return ad;
    } catch (error) {
      log(`Error incrementing ad impressions: ${error instanceof Error ? error.message : String(error)}`);
      return undefined;
    }
  }

  async incrementAdClicks(id: number): Promise<schema.Ad | undefined> {
    try {
      const [ad] = await db
        .update(schema.ads)
        .set({
          clicks: sql`${schema.ads.clicks} + 1`,
          updatedAt: new Date()
        })
        .where(eq(schema.ads.id, id))
        .returning();
      return ad;
    } catch (error) {
      log(`Error incrementing ad clicks: ${error instanceof Error ? error.message : String(error)}`);
      return undefined;
    }
  }
}

export const storage = new DatabaseStorage();