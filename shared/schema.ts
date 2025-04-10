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
export const transactionTypeEnum = pgEnum('transaction_type', ['TOPUP', 'TRANSFER', 'UTILITY', 'deposit']);
export const transactionStatusEnum = pgEnum('transaction_status', ['COMPLETED', 'pending', 'completed', 'failed']);
export const activityTypeEnum = pgEnum('activity_type', ['LOGIN', 'REGISTER', 'PAYMENT', 'TOPUP', 'TRANSFER', 'transaction']);
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
  sentTransactions: many(transactions, { relationName: 'sender' }),
  receivedTransactions: many(transactions, { relationName: 'receiver' }),
  activities: many(activities),
  collaterals: many(collaterals),
  loans: many(loans),
  approvedLoans: many(loans),
  ads: many(ads)
}));

// Wallets table
export const wallets = pgTable('wallets', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  balance: numeric('balance').notNull(),
  currency: text('currency').notNull(),
  lastUpdated: timestamp('last_updated').notNull(),
  address: text('address'),
  nptBalance: text('npt_balance'),
  bnbBalance: text('bnb_balance'),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
  isPrimary: boolean('is_primary'),
});

// Wallet relations
export const walletsRelations = relations(wallets, ({ one }) => ({
  user: one(users)
}));

// Transactions table
export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  type: transactionTypeEnum('type').notNull(),
  status: transactionStatusEnum('status').notNull(),
  amount: numeric('amount').notNull(),
  currency: text('currency').notNull(),
  senderId: integer('sender_id').references(() => users.id),
  receiverId: integer('receiver_id').references(() => users.id),
  txHash: text('tx_hash'),
  note: text('note'),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  stripePaymentId: text('stripe_payment_id'),
});

// Transaction relations
export const transactionsRelations = relations(transactions, ({ one }) => ({
  sender: one(users, { fields: [transactions.senderId], references: [users.id] }),
  receiver: one(users, { fields: [transactions.receiverId], references: [users.id] })
}));

// Activities table
export const activities = pgTable('activities', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  action: activityTypeEnum('action').notNull(),
  description: text('description').notNull(),
  ipAddress: varchar('ip_address', { length: 50 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
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