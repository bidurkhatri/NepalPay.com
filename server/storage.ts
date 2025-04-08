import { db } from "./db";
import {
  users,
  wallets,
  transactions,
  activities,
  collaterals,
  loans,
  ads,
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
} from "../shared/schema";
import { eq, and, desc, or } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";

// Setup PostgreSQL session store
const PostgresSessionStore = connectPg(session);

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByWalletAddress(walletAddress: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(insertUser: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<Omit<User, "id">>): Promise<User | undefined>;
  updateStripeCustomerId(userId: number, customerId: string): Promise<User | undefined>;
  updateStripeSubscriptionId(userId: number, subscriptionId: string): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  
  // Wallet methods
  getWallet(id: number): Promise<Wallet | undefined>;
  getWalletByAddress(address: string): Promise<Wallet | undefined>;
  getWalletsByUserId(userId: number): Promise<Wallet[]>;
  getPrimaryWalletByUserId(userId: number): Promise<Wallet | undefined>;
  createWallet(insertWallet: InsertWallet & { user_id: number }): Promise<Wallet>;
  updateWallet(id: number, updates: Partial<Omit<Wallet, "id">>): Promise<Wallet | undefined>;
  deleteWallet(id: number): Promise<boolean>;
  
  // Transaction methods
  getTransaction(id: number): Promise<Transaction | undefined>;
  getTransactionByHash(hash: string): Promise<Transaction | undefined>;
  getTransactionsByUserId(userId: number, limit?: number, offset?: number): Promise<Transaction[]>;
  getTransactionsBySenderId(senderId: number, limit?: number, offset?: number): Promise<Transaction[]>;
  getTransactionsByReceiverId(receiverId: number, limit?: number, offset?: number): Promise<Transaction[]>;
  createTransaction(insertTransaction: InsertTransaction & { sender_id?: number }): Promise<Transaction>;
  updateTransaction(id: number, updates: Partial<Omit<Transaction, "id">>): Promise<Transaction | undefined>;
  
  // Activity methods
  getActivity(id: number): Promise<Activity | undefined>;
  getActivitiesByUserId(userId: number, limit?: number, offset?: number): Promise<Activity[]>;
  createActivity(insertActivity: InsertActivity): Promise<Activity>;
  
  // Collateral methods
  getCollateral(id: number): Promise<Collateral | undefined>;
  getCollateralsByUserId(userId: number): Promise<Collateral[]>;
  getCollateralByLoanId(loanId: number): Promise<Collateral | undefined>;
  createCollateral(insertCollateral: InsertCollateral & { user_id: number; loan_id: number }): Promise<Collateral>;
  updateCollateral(id: number, updates: Partial<Omit<Collateral, "id">>): Promise<Collateral | undefined>;
  
  // Loan methods
  getLoan(id: number): Promise<Loan | undefined>;
  getLoansByUserId(userId: number, limit?: number, offset?: number): Promise<Loan[]>;
  getActiveLoansByUserId(userId: number): Promise<Loan[]>;
  createLoan(insertLoan: InsertLoan & { user_id: number }): Promise<Loan>;
  updateLoan(id: number, updates: Partial<Omit<Loan, "id">>): Promise<Loan | undefined>;
  
  // Ad methods
  getAd(id: number): Promise<Ad | undefined>;
  getAdsByUserId(userId: number, limit?: number, offset?: number): Promise<Ad[]>;
  getActiveAds(limit?: number, offset?: number): Promise<Ad[]>;
  createAd(insertAd: InsertAd & { user_id: number }): Promise<Ad>;
  updateAd(id: number, updates: Partial<Omit<Ad, "id">>): Promise<Ad | undefined>;
  deleteAd(id: number): Promise<boolean>;
  
  // Session store
  sessionStore: session.Store;
}

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    // Create session store
    this.sessionStore = new PostgresSessionStore({
      conObject: {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
      },
      createTableIfMissing: true,
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.error("Error getting user:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user;
    } catch (error) {
      console.error("Error getting user by username:", error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.email, email));
      return user;
    } catch (error) {
      console.error("Error getting user by email:", error);
      return undefined;
    }
  }

  async getUserByWalletAddress(walletAddress: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.wallet_address, walletAddress));
      return user;
    } catch (error) {
      console.error("Error getting user by wallet address:", error);
      return undefined;
    }
  }
  
  async getAllUsers(): Promise<User[]> {
    try {
      return await db.select().from(users);
    } catch (error) {
      console.error("Error getting all users:", error);
      return [];
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const [user] = await db.insert(users).values(insertUser).returning();
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async updateUser(id: number, updates: Partial<Omit<User, "id">>): Promise<User | undefined> {
    try {
      const [updatedUser] = await db
        .update(users)
        .set(updates)
        .where(eq(users.id, id))
        .returning();
      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      return undefined;
    }
  }

  async updateStripeCustomerId(userId: number, customerId: string): Promise<User | undefined> {
    return this.updateUser(userId, { stripe_customer_id: customerId });
  }

  async updateStripeSubscriptionId(userId: number, subscriptionId: string): Promise<User | undefined> {
    return this.updateUser(userId, { stripe_subscription_id: subscriptionId });
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      const [deletedUser] = await db
        .delete(users)
        .where(eq(users.id, id))
        .returning();
      return !!deletedUser;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  }

  // Wallet methods
  async getWallet(id: number): Promise<Wallet | undefined> {
    try {
      const [wallet] = await db.select().from(wallets).where(eq(wallets.id, id));
      return wallet;
    } catch (error) {
      console.error("Error getting wallet:", error);
      return undefined;
    }
  }

  async getWalletByAddress(address: string): Promise<Wallet | undefined> {
    try {
      const [wallet] = await db.select().from(wallets).where(eq(wallets.address, address));
      return wallet;
    } catch (error) {
      console.error("Error getting wallet by address:", error);
      return undefined;
    }
  }

  async getWalletsByUserId(userId: number): Promise<Wallet[]> {
    try {
      return await db.select().from(wallets).where(eq(wallets.user_id, userId));
    } catch (error) {
      console.error("Error getting wallets by user id:", error);
      return [];
    }
  }

  async getPrimaryWalletByUserId(userId: number): Promise<Wallet | undefined> {
    try {
      const [wallet] = await db
        .select()
        .from(wallets)
        .where(and(eq(wallets.user_id, userId), eq(wallets.is_primary, true)));
      return wallet;
    } catch (error) {
      console.error("Error getting primary wallet by user id:", error);
      return undefined;
    }
  }

  async createWallet(insertWallet: InsertWallet & { user_id: number }): Promise<Wallet> {
    try {
      // If this is the first wallet, make it primary
      const existingWallets = await this.getWalletsByUserId(insertWallet.user_id);
      const isPrimary = existingWallets.length === 0;

      const [wallet] = await db
        .insert(wallets)
        .values({ ...insertWallet, is_primary: isPrimary })
        .returning();
      return wallet;
    } catch (error) {
      console.error("Error creating wallet:", error);
      throw error;
    }
  }

  async updateWallet(id: number, updates: Partial<Omit<Wallet, "id">>): Promise<Wallet | undefined> {
    try {
      // If making this wallet primary, update all other wallets to non-primary
      if (updates.is_primary) {
        const wallet = await this.getWallet(id);
        if (wallet) {
          await db
            .update(wallets)
            .set({ is_primary: false })
            .where(and(eq(wallets.user_id, wallet.user_id), eq(wallets.is_primary, true)));
        }
      }

      const [updatedWallet] = await db
        .update(wallets)
        .set(updates)
        .where(eq(wallets.id, id))
        .returning();
      return updatedWallet;
    } catch (error) {
      console.error("Error updating wallet:", error);
      return undefined;
    }
  }

  async deleteWallet(id: number): Promise<boolean> {
    try {
      // Check if this is a primary wallet
      const wallet = await this.getWallet(id);
      if (!wallet) return false;

      const [deletedWallet] = await db
        .delete(wallets)
        .where(eq(wallets.id, id))
        .returning();

      // If deleted wallet was primary, make another wallet primary if available
      if (deletedWallet.is_primary) {
        const remainingWallets = await this.getWalletsByUserId(deletedWallet.user_id);
        if (remainingWallets.length > 0) {
          await this.updateWallet(remainingWallets[0].id, { is_primary: true });
        }
      }

      return !!deletedWallet;
    } catch (error) {
      console.error("Error deleting wallet:", error);
      return false;
    }
  }

  // Transaction methods
  async getTransaction(id: number): Promise<Transaction | undefined> {
    try {
      const [transaction] = await db
        .select()
        .from(transactions)
        .where(eq(transactions.id, id));
      return transaction;
    } catch (error) {
      console.error("Error getting transaction:", error);
      return undefined;
    }
  }

  async getTransactionByHash(hash: string): Promise<Transaction | undefined> {
    try {
      const [transaction] = await db
        .select()
        .from(transactions)
        .where(eq(transactions.tx_hash, hash));
      return transaction;
    } catch (error) {
      console.error("Error getting transaction by hash:", error);
      return undefined;
    }
  }

  async getTransactionsByUserId(userId: number, limit = 10, offset = 0): Promise<Transaction[]> {
    try {
      return await db
        .select()
        .from(transactions)
        .where(
          or(eq(transactions.sender_id, userId), eq(transactions.receiver_id, userId))
        )
        .orderBy(desc(transactions.created_at))
        .limit(limit)
        .offset(offset);
    } catch (error) {
      console.error("Error getting transactions by user id:", error);
      return [];
    }
  }

  async getTransactionsBySenderId(senderId: number, limit = 10, offset = 0): Promise<Transaction[]> {
    try {
      return await db
        .select()
        .from(transactions)
        .where(eq(transactions.sender_id, senderId))
        .orderBy(desc(transactions.created_at))
        .limit(limit)
        .offset(offset);
    } catch (error) {
      console.error("Error getting transactions by sender id:", error);
      return [];
    }
  }

  async getTransactionsByReceiverId(receiverId: number, limit = 10, offset = 0): Promise<Transaction[]> {
    try {
      return await db
        .select()
        .from(transactions)
        .where(eq(transactions.receiver_id, receiverId))
        .orderBy(desc(transactions.created_at))
        .limit(limit)
        .offset(offset);
    } catch (error) {
      console.error("Error getting transactions by receiver id:", error);
      return [];
    }
  }
  
  async getAllTransactions(limit = 50, offset = 0): Promise<Transaction[]> {
    try {
      return await db
        .select()
        .from(transactions)
        .orderBy(desc(transactions.created_at))
        .limit(limit)
        .offset(offset);
    } catch (error) {
      console.error("Error getting all transactions:", error);
      return [];
    }
  }

  async createTransaction(insertTransaction: InsertTransaction & { sender_id?: number }): Promise<Transaction> {
    try {
      const [transaction] = await db
        .insert(transactions)
        .values(insertTransaction)
        .returning();
      return transaction;
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw error;
    }
  }

  async updateTransaction(id: number, updates: Partial<Omit<Transaction, "id">>): Promise<Transaction | undefined> {
    try {
      const [updatedTransaction] = await db
        .update(transactions)
        .set(updates)
        .where(eq(transactions.id, id))
        .returning();
      return updatedTransaction;
    } catch (error) {
      console.error("Error updating transaction:", error);
      return undefined;
    }
  }

  // Activity methods
  async getActivity(id: number): Promise<Activity | undefined> {
    try {
      const [activity] = await db
        .select()
        .from(activities)
        .where(eq(activities.id, id));
      return activity;
    } catch (error) {
      console.error("Error getting activity:", error);
      return undefined;
    }
  }

  async getActivitiesByUserId(userId: number, limit = 10, offset = 0): Promise<Activity[]> {
    try {
      return await db
        .select()
        .from(activities)
        .where(eq(activities.user_id, userId))
        .orderBy(desc(activities.created_at))
        .limit(limit)
        .offset(offset);
    } catch (error) {
      console.error("Error getting activities by user id:", error);
      return [];
    }
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    try {
      const [activity] = await db
        .insert(activities)
        .values(insertActivity)
        .returning();
      return activity;
    } catch (error) {
      console.error("Error creating activity:", error);
      throw error;
    }
  }

  // Collateral methods
  async getCollateral(id: number): Promise<Collateral | undefined> {
    try {
      const [collateral] = await db
        .select()
        .from(collaterals)
        .where(eq(collaterals.id, id));
      return collateral;
    } catch (error) {
      console.error("Error getting collateral:", error);
      return undefined;
    }
  }

  async getCollateralsByUserId(userId: number): Promise<Collateral[]> {
    try {
      return await db
        .select()
        .from(collaterals)
        .where(eq(collaterals.user_id, userId));
    } catch (error) {
      console.error("Error getting collaterals by user id:", error);
      return [];
    }
  }

  async getCollateralByLoanId(loanId: number): Promise<Collateral | undefined> {
    try {
      const [collateral] = await db
        .select()
        .from(collaterals)
        .where(eq(collaterals.loan_id, loanId));
      return collateral;
    } catch (error) {
      console.error("Error getting collateral by loan id:", error);
      return undefined;
    }
  }

  async createCollateral(insertCollateral: InsertCollateral & { user_id: number; loan_id: number }): Promise<Collateral> {
    try {
      const [collateral] = await db
        .insert(collaterals)
        .values(insertCollateral)
        .returning();
      return collateral;
    } catch (error) {
      console.error("Error creating collateral:", error);
      throw error;
    }
  }

  async updateCollateral(id: number, updates: Partial<Omit<Collateral, "id">>): Promise<Collateral | undefined> {
    try {
      const [updatedCollateral] = await db
        .update(collaterals)
        .set(updates)
        .where(eq(collaterals.id, id))
        .returning();
      return updatedCollateral;
    } catch (error) {
      console.error("Error updating collateral:", error);
      return undefined;
    }
  }

  // Loan methods
  async getLoan(id: number): Promise<Loan | undefined> {
    try {
      const [loan] = await db
        .select()
        .from(loans)
        .where(eq(loans.id, id));
      return loan;
    } catch (error) {
      console.error("Error getting loan:", error);
      return undefined;
    }
  }

  async getLoansByUserId(userId: number, limit = 10, offset = 0): Promise<Loan[]> {
    try {
      return await db
        .select()
        .from(loans)
        .where(eq(loans.user_id, userId))
        .orderBy(desc(loans.created_at))
        .limit(limit)
        .offset(offset);
    } catch (error) {
      console.error("Error getting loans by user id:", error);
      return [];
    }
  }

  async getActiveLoansByUserId(userId: number): Promise<Loan[]> {
    try {
      return await db
        .select()
        .from(loans)
        .where(and(eq(loans.user_id, userId), eq(loans.status, "active")));
    } catch (error) {
      console.error("Error getting active loans by user id:", error);
      return [];
    }
  }
  
  async getAllLoans(limit = 50, offset = 0): Promise<Loan[]> {
    try {
      return await db
        .select()
        .from(loans)
        .orderBy(desc(loans.created_at))
        .limit(limit)
        .offset(offset);
    } catch (error) {
      console.error("Error getting all loans:", error);
      return [];
    }
  }

  async createLoan(insertLoan: InsertLoan & { user_id: number }): Promise<Loan> {
    try {
      const [loan] = await db
        .insert(loans)
        .values(insertLoan)
        .returning();
      return loan;
    } catch (error) {
      console.error("Error creating loan:", error);
      throw error;
    }
  }

  async updateLoan(id: number, updates: Partial<Omit<Loan, "id">>): Promise<Loan | undefined> {
    try {
      const [updatedLoan] = await db
        .update(loans)
        .set(updates)
        .where(eq(loans.id, id))
        .returning();
      return updatedLoan;
    } catch (error) {
      console.error("Error updating loan:", error);
      return undefined;
    }
  }

  // Ad methods
  async getAd(id: number): Promise<Ad | undefined> {
    try {
      const [ad] = await db
        .select()
        .from(ads)
        .where(eq(ads.id, id));
      return ad;
    } catch (error) {
      console.error("Error getting ad:", error);
      return undefined;
    }
  }

  async getAdsByUserId(userId: number, limit = 10, offset = 0): Promise<Ad[]> {
    try {
      return await db
        .select()
        .from(ads)
        .where(eq(ads.user_id, userId))
        .orderBy(desc(ads.created_at))
        .limit(limit)
        .offset(offset);
    } catch (error) {
      console.error("Error getting ads by user id:", error);
      return [];
    }
  }

  async getActiveAds(limit = 10, offset = 0): Promise<Ad[]> {
    try {
      return await db
        .select()
        .from(ads)
        .where(eq(ads.status, "active"))
        .orderBy(desc(ads.created_at))
        .limit(limit)
        .offset(offset);
    } catch (error) {
      console.error("Error getting active ads:", error);
      return [];
    }
  }

  async createAd(insertAd: InsertAd & { user_id: number }): Promise<Ad> {
    try {
      const [ad] = await db
        .insert(ads)
        .values(insertAd)
        .returning();
      return ad;
    } catch (error) {
      console.error("Error creating ad:", error);
      throw error;
    }
  }

  async updateAd(id: number, updates: Partial<Omit<Ad, "id">>): Promise<Ad | undefined> {
    try {
      const [updatedAd] = await db
        .update(ads)
        .set(updates)
        .where(eq(ads.id, id))
        .returning();
      return updatedAd;
    } catch (error) {
      console.error("Error updating ad:", error);
      return undefined;
    }
  }

  async deleteAd(id: number): Promise<boolean> {
    try {
      const [deletedAd] = await db
        .delete(ads)
        .where(eq(ads.id, id))
        .returning();
      return !!deletedAd;
    } catch (error) {
      console.error("Error deleting ad:", error);
      return false;
    }
  }
}

// Export a singleton instance of the storage service
export const storage = new DatabaseStorage();