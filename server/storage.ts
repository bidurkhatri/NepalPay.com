import session from 'express-session';
import {
  User, InsertUser, Wallet, InsertWallet, Transaction, InsertTransaction,
  Activity, InsertActivity, Collateral, InsertCollateral, Loan, InsertLoan,
  Ad, InsertAd
} from '@shared/schema';

/**
 * Storage Interface
 * This interface defines the contract for different storage implementations
 * (memory, PostgreSQL, etc.)
 */
export interface IStorage {
  // Session store
  sessionStore: session.Store;
  
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(userData: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  
  // Wallet methods
  getWallet(id: number): Promise<Wallet | undefined>;
  getWalletByUserId(userId: number): Promise<Wallet | undefined>;
  createWallet(walletData: InsertWallet): Promise<Wallet>;
  updateWallet(id: number, walletData: Partial<Wallet>): Promise<Wallet | undefined>;
  
  // Transaction methods
  getTransaction(id: number): Promise<Transaction | undefined>;
  getTransactionsBySenderId(senderId: number): Promise<Transaction[]>;
  getTransactionsByReceiverId(receiverId: number): Promise<Transaction[]>;
  getUserTransactions(userId: number): Promise<Transaction[]>;
  createTransaction(transactionData: InsertTransaction): Promise<Transaction>;
  updateTransaction?(id: number, transactionData: Partial<Transaction>): Promise<Transaction | undefined>;
  
  // Activity methods
  getActivity(id: number): Promise<Activity | undefined>;
  getUserActivities(userId: number): Promise<Activity[]>;
  createActivity(activityData: InsertActivity): Promise<Activity>;
  
  // Collateral methods
  getCollateral(id: number): Promise<Collateral | undefined>;
  getUserCollaterals(userId: number): Promise<Collateral[]>;
  createCollateral(collateralData: InsertCollateral): Promise<Collateral>;
  updateCollateral(id: number, collateralData: Partial<Collateral>): Promise<Collateral | undefined>;
  
  // Loan methods
  getLoan(id: number): Promise<Loan | undefined>;
  getUserLoans(userId: number): Promise<Loan[]>;
  getActiveLoans(): Promise<Loan[]>;
  createLoan(loanData: InsertLoan): Promise<Loan>;
  updateLoan(id: number, loanData: Partial<Loan>): Promise<Loan | undefined>;
  
  // Ad methods
  getAd(id: number): Promise<Ad | undefined>;
  getUserAds(userId: number): Promise<Ad[]>;
  getActiveAds(): Promise<Ad[]>;
  createAd(adData: InsertAd): Promise<Ad>;
  updateAd(id: number, adData: Partial<Ad>): Promise<Ad | undefined>;
  
  // Demo data initialization for development/testing
  initializeDemoData(): Promise<void>;
}

// Export the main storage implementation (PgStorage)
// We import this way to avoid circular dependencies
export const storage = await import('./pg-storage').then(module => module.storage);