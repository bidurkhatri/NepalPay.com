import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
  real,
  numeric,
  pgEnum,
  json,
  uniqueIndex,
  foreignKey
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from 'zod';

// Enum definitions
export const userRoleEnum = pgEnum('user_role', ['user', 'admin', 'superadmin']);
export const kycStatusEnum = pgEnum('kyc_status', ['not_submitted', 'pending', 'approved', 'rejected']);
export const transactionTypeEnum = pgEnum('transaction_type', ['deposit', 'withdrawal', 'transfer', 'payment', 'exchange', 'fee', 'loan_disbursal', 'loan_repayment', 'collateral_lock', 'collateral_release']);
export const transactionStatusEnum = pgEnum('transaction_status', ['pending', 'processing', 'completed', 'failed', 'cancelled']);
export const activityTypeEnum = pgEnum('activity_type', ['login', 'password_change', 'password_reset_request', 'password_reset', 'profile_update', 'transaction', 'kyc_update', 'settings_change', 'wallet_create', 'loan_action', 'collateral_action']);
export const walletTypeEnum = pgEnum('wallet_type', ['custodial', 'non_custodial']);
export const collateralTypeEnum = pgEnum('collateral_type', ['BNB', 'ETH', 'BTC']);
export const collateralStatusEnum = pgEnum('collateral_status', ['active', 'locked', 'released', 'liquidated']);
export const loanStatusEnum = pgEnum('loan_status', ['pending', 'active', 'repaid', 'defaulted', 'liquidated']);
export const adStatusEnum = pgEnum('ad_status', ['active', 'inactive', 'expired', 'rejected']);

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  password: text('password').notNull(),
  firstName: varchar('first_name', { length: 50 }),
  lastName: varchar('last_name', { length: 50 }),
  phoneNumber: varchar('phone_number', { length: 20 }),
  walletAddress: varchar('wallet_address', { length: 100 }),
  role: userRoleEnum('role').default('user').notNull(),
  kycStatus: kycStatusEnum('kyc_status').default('not_submitted').notNull(),
  kycVerificationId: varchar('kyc_verification_id', { length: 100 }),
  kycVerifiedAt: timestamp('kyc_verified_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  finapiUserId: text('finapi_user_id'),
});

// User relations
export const usersRelations = relations(users, ({ one, many }) => ({
  wallet: one(wallets),
  sentTransactions: many(transactions),
  receivedTransactions: many(transactions),
  activities: many(activities),
  collaterals: many(collaterals),
  loans: many(loans),
  approvedLoans: many(loans),
  ads: many(ads)
}));

// Wallets table
export const wallets = pgTable('wallets', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  nptBalance: numeric('npt_balance', { precision: 24, scale: 8 }).default('0').notNull(),
  bnbBalance: numeric('bnb_balance', { precision: 24, scale: 18 }).default('0').notNull(),
  ethBalance: numeric('eth_balance', { precision: 24, scale: 18 }).default('0').notNull(),
  btcBalance: numeric('btc_balance', { precision: 24, scale: 8 }).default('0').notNull(),
  walletType: walletTypeEnum('wallet_type').default('custodial').notNull(),
  nptAddress: varchar('npt_address', { length: 42 }),
  bnbAddress: varchar('bnb_address', { length: 42 }),
  ethAddress: varchar('eth_address', { length: 42 }),
  btcAddress: varchar('btc_address', { length: 42 }),
  privateKeyEncrypted: text('private_key_encrypted'),
  encryptionIV: text('encryption_iv'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  lastSyncedAt: timestamp('last_synced_at'),
});

// Wallet relations
export const walletsRelations = relations(wallets, ({ one, many }) => ({
  user: one(users),
  transactions: many(transactions)
}));

// Transactions table
export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  transactionType: transactionTypeEnum('transaction_type').notNull(),
  status: transactionStatusEnum('transaction_status').notNull(),
  amount: numeric('amount', { precision: 24, scale: 8 }).notNull(),
  currency: varchar('currency', { length: 10 }).notNull(),
  fee: numeric('fee', { precision: 24, scale: 8 }).default('0').notNull(),
  senderId: integer('sender_id').references(() => users.id),
  recipientId: integer('recipient_id').references(() => users.id),
  walletId: integer('wallet_id').references(() => wallets.id),
  txHash: varchar('tx_hash', { length: 100 }),
  blockchainTimestamp: timestamp('blockchain_timestamp'),
  blockNumber: integer('block_number'),
  description: text('description'),
  metadata: json('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  stripePaymentId: varchar('stripe_payment_id', { length: 100 }),
  paymentIntentId: varchar('payment_intent_id', { length: 100 }),
  gasUsed: numeric('gas_used', { precision: 24, scale: 8 }),
  networkFee: numeric('network_fee', { precision: 24, scale: 8 }),
  relatedTransactionId: integer('related_transaction_id'),
  loanId: integer('loan_id').references(() => loans.id),
  collateralId: integer('collateral_id').references(() => collaterals.id),
  // Additional fields for exchange transactions
  exchangeRate: numeric('exchange_rate', { precision: 24, scale: 8 }),
  exchangeAmount: numeric('exchange_amount', { precision: 24, scale: 8 }),
  exchangeCurrency: varchar('exchange_currency', { length: 10 }),
});

// Transaction relations
export const transactionsRelations = relations(transactions, ({ one }) => ({
  sender: one(users),
  recipient: one(users),
  wallet: one(wallets),
  loan: one(loans),
  collateral: one(collaterals)
}));

// Activities table
export const activities = pgTable('activities', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  activityType: activityTypeEnum('activity_type').notNull(),
  description: text('description').notNull(),
  ipAddress: varchar('ip_address', { length: 50 }),
  userAgent: text('user_agent'),
  metadata: json('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  transactionId: integer('transaction_id').references(() => transactions.id),
  loanId: integer('loan_id').references(() => loans.id),
  collateralId: integer('collateral_id').references(() => collaterals.id),
});

// Activity relations
export const activitiesRelations = relations(activities, ({ one }) => ({
  user: one(users),
  transaction: one(transactions),
  loan: one(loans),
  collateral: one(collaterals)
}));

// Collaterals table
export const collaterals = pgTable('collaterals', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  collateralType: collateralTypeEnum('collateral_type').notNull(),
  amount: numeric('amount', { precision: 24, scale: 8 }).notNull(),
  valueInNpt: numeric('value_in_npt', { precision: 24, scale: 8 }).notNull(),
  status: collateralStatusEnum('status').notNull(),
  lockTimestamp: timestamp('lock_timestamp'),
  releaseTimestamp: timestamp('release_timestamp'),
  lockTxHash: varchar('lock_tx_hash', { length: 100 }),
  releaseTxHash: varchar('release_tx_hash', { length: 100 }),
  liquidationThreshold: numeric('liquidation_threshold', { precision: 24, scale: 8 }),
  liquidationTimestamp: timestamp('liquidation_timestamp'),
  valueToLoanRatio: numeric('value_to_loan_ratio', { precision: 8, scale: 6 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  loanId: integer('loan_id').references(() => loans.id),
  metadata: json('metadata'),
});

// Collateral relations
export const collateralsRelations = relations(collaterals, ({ one, many }) => ({
  user: one(users),
  loan: one(loans),
  transactions: many(transactions),
  activities: many(activities)
}));

// Loans table
export const loans = pgTable('loans', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  amount: numeric('amount', { precision: 24, scale: 8 }).notNull(),
  interestRate: numeric('interest_rate', { precision: 8, scale: 6 }).notNull(),
  termDays: integer('term_days').notNull(),
  status: loanStatusEnum('status').notNull(),
  startDate: timestamp('start_date'),
  dueDate: timestamp('due_date'),
  endDate: timestamp('end_date'),
  repaymentDate: timestamp('repayment_date'),
  repaidAmount: numeric('repaid_amount', { precision: 24, scale: 8 }).default('0').notNull(),
  loanToValueRatio: numeric('loan_to_value_ratio', { precision: 8, scale: 6 }).notNull(),
  originationFee: numeric('origination_fee', { precision: 24, scale: 8 }).notNull(),
  healthFactor: numeric('health_factor', { precision: 8, scale: 6 }),
  lastHealthCheckAt: timestamp('last_health_check_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  approvedBy: integer('approved_by').references(() => users.id),
  lateFee: numeric('late_fee', { precision: 24, scale: 8 }),
  rejectionReason: text('rejection_reason'),
  collateralRequired: boolean('collateral_required').default(false),
  metadata: json('metadata'),
});

// Loan relations
export const loansRelations = relations(loans, ({ one, many }) => ({
  user: one(users),
  approver: one(users),
  collaterals: many(collaterals),
  transactions: many(transactions),
  activities: many(activities)
}));

// Ads table
export const ads = pgTable('ads', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 100 }).notNull(),
  description: text('description').notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  status: adStatusEnum('status').default('inactive').notNull(),
  targetAudience: json('target_audience'),
  impressions: integer('impressions').default(0).notNull(),
  clicks: integer('clicks').default(0).notNull(),
  budget: numeric('budget', { precision: 10, scale: 2 }).notNull(),
  costPerClick: numeric('cost_per_click', { precision: 10, scale: 6 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  approvedBy: integer('approved_by').references(() => users.id),
  approvedAt: timestamp('approved_at'),
  rejectionReason: text('rejection_reason'),
});

// Ad relations
export const adsRelations = relations(ads, ({ one }) => ({
  user: one(users),
  approver: one(users),
}));

// Generate schemas for validation and type inference
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const selectUserSchema = createSelectSchema(users);
export type User = z.infer<typeof selectUserSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;

export const insertWalletSchema = createInsertSchema(wallets).omit({ id: true, createdAt: true, updatedAt: true });
export const selectWalletSchema = createSelectSchema(wallets);
export type Wallet = z.infer<typeof selectWalletSchema>;
export type InsertWallet = z.infer<typeof insertWalletSchema>;

export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true, createdAt: true, updatedAt: true });
export const selectTransactionSchema = createSelectSchema(transactions);
export type Transaction = z.infer<typeof selectTransactionSchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export const insertActivitySchema = createInsertSchema(activities).omit({ id: true, createdAt: true });
export const selectActivitySchema = createSelectSchema(activities);
export type Activity = z.infer<typeof selectActivitySchema>;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export const insertCollateralSchema = createInsertSchema(collaterals).omit({ id: true, createdAt: true, updatedAt: true });
export const selectCollateralSchema = createSelectSchema(collaterals);
export type Collateral = z.infer<typeof selectCollateralSchema>;
export type InsertCollateral = z.infer<typeof insertCollateralSchema>;

export const insertLoanSchema = createInsertSchema(loans).omit({ id: true, createdAt: true, updatedAt: true });
export const selectLoanSchema = createSelectSchema(loans);
export type Loan = z.infer<typeof selectLoanSchema>;
export type InsertLoan = z.infer<typeof insertLoanSchema>;

export const insertAdSchema = createInsertSchema(ads).omit({ id: true, createdAt: true, updatedAt: true });
export const selectAdSchema = createSelectSchema(ads);
export type Ad = z.infer<typeof selectAdSchema>;
export type InsertAd = z.infer<typeof insertAdSchema>;