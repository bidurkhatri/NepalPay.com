import { pgTable, serial, text, timestamp, integer, doublePrecision, boolean, varchar, pgEnum } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Define enums
export const userRoleEnum = pgEnum('user_role', ['user', 'admin', 'superadmin']);
export const transactionStatusEnum = pgEnum('transaction_status', ['pending', 'completed', 'failed']);
export const transactionTypeEnum = pgEnum('transaction_type', ['deposit', 'withdrawal', 'transfer', 'fee', 'loan', 'repayment']);
export const loanStatusEnum = pgEnum('loan_status', ['pending', 'approved', 'active', 'repaid', 'defaulted', 'rejected']);
export const collateralTypeEnum = pgEnum('collateral_type', ['bnb', 'eth', 'btc']);
export const activityTypeEnum = pgEnum('activity_type', ['login', 'transaction', 'profile_update', 'wallet_connect', 'loan_request', 'loan_repayment']);

// User schema
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  fullName: text('full_name'),
  profileImage: text('profile_image'),
  role: userRoleEnum('role').default('user').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
});

// Wallet schema
export const wallets = pgTable('wallets', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  address: text('address').notNull().unique(),
  balance: doublePrecision('balance').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Transaction schema
export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  senderId: integer('sender_id').references(() => users.id, { onDelete: 'set null' }),
  receiverId: integer('receiver_id').references(() => users.id, { onDelete: 'set null' }),
  amount: doublePrecision('amount').notNull(),
  fee: doublePrecision('fee').default(0).notNull(),
  type: transactionTypeEnum('type').notNull(),
  status: transactionStatusEnum('status').default('pending').notNull(),
  txHash: text('tx_hash'),
  description: text('description'),
  metadata: text('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Activity schema
export const activities = pgTable('activities', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: activityTypeEnum('type').notNull(),
  details: text('details'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Collateral schema - needs to be defined before loans to avoid circular references
export const collaterals = pgTable('collaterals', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: collateralTypeEnum('type').notNull(),
  amount: doublePrecision('amount').notNull(),
  valueInNPT: doublePrecision('value_in_npt').notNull(),
  txHash: text('tx_hash'),
  isLocked: boolean('is_locked').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Loan schema
export const loans = pgTable('loans', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  collateralId: integer('collateral_id').references(() => collaterals.id, { onDelete: 'set null' }),
  amount: doublePrecision('amount').notNull(),
  interestRate: doublePrecision('interest_rate').notNull(),
  term: integer('term').notNull(), // in days
  status: loanStatusEnum('status').default('pending').notNull(),
  repaidAmount: doublePrecision('repaid_amount').default(0).notNull(),
  dueDate: timestamp('due_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Ad schema
export const ads = pgTable('ads', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  price: doublePrecision('price').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Stripe Fee schema for token purchases
export const tokenPurchases = pgTable('token_purchases', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  tokenAmount: doublePrecision('token_amount').notNull(),
  fiatAmount: doublePrecision('fiat_amount').notNull(),
  fiatCurrency: varchar('fiat_currency', { length: 3 }).default('USD').notNull(),
  stripePaymentIntentId: text('stripe_payment_intent_id').notNull(),
  status: text('status').notNull(),
  gasFee: doublePrecision('gas_fee').default(0).notNull(),
  serviceFee: doublePrecision('service_fee').default(0).notNull(),
  txHash: text('tx_hash'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Transaction fee schema used for Stripe integration
export const transactionFees = pgTable('transaction_fees', {
  id: serial('id').primaryKey(),
  tokenAmount: doublePrecision('token_amount').notNull(),
  fiatAmount: doublePrecision('fiat_amount').notNull(),
  gasFeeUSD: doublePrecision('gas_fee_usd').notNull(),
  serviceFeePercent: doublePrecision('service_fee_percent').default(2).notNull(),
  totalFiatAmount: doublePrecision('total_fiat_amount').notNull(),
  exchangeRate: doublePrecision('exchange_rate').notNull(),
  fiatCurrency: varchar('fiat_currency', { length: 3 }).default('USD').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Zod Schemas
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().min(3),
});

export const insertWalletSchema = createInsertSchema(wallets);
export const insertTransactionSchema = createInsertSchema(transactions);
export const insertActivitySchema = createInsertSchema(activities);
export const insertLoanSchema = createInsertSchema(loans);
export const insertCollateralSchema = createInsertSchema(collaterals);
export const insertAdSchema = createInsertSchema(ads);
export const insertTokenPurchaseSchema = createInsertSchema(tokenPurchases);
export const transactionFeeSchema = createInsertSchema(transactionFees);

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Wallet = typeof wallets.$inferSelect;
export type InsertWallet = z.infer<typeof insertWalletSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type Loan = typeof loans.$inferSelect;
export type InsertLoan = z.infer<typeof insertLoanSchema>;

export type Collateral = typeof collaterals.$inferSelect;
export type InsertCollateral = z.infer<typeof insertCollateralSchema>;

export type Ad = typeof ads.$inferSelect;
export type InsertAd = z.infer<typeof insertAdSchema>;

export type TokenPurchase = typeof tokenPurchases.$inferSelect;
export type InsertTokenPurchase = z.infer<typeof insertTokenPurchaseSchema>;

export type TransactionFee = typeof transactionFees.$inferSelect;
export type InsertTransactionFee = z.infer<typeof transactionFeeSchema>;