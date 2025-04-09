import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  primaryKey,
  pgEnum
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Enums
export const userRoleEnum = pgEnum('user_role', ['user', 'admin', 'superadmin']);
export const kycStatusEnum = pgEnum('kyc_status', ['unverified', 'pending', 'verified', 'rejected']);
export const transactionStatusEnum = pgEnum('transaction_status', ['pending', 'completed', 'failed', 'cancelled']);
export const transactionTypeEnum = pgEnum('transaction_type', ['deposit', 'withdrawal', 'transfer', 'purchase', 'payment', 'loan', 'repayment', 'reward']);
export const collateralStatusEnum = pgEnum('collateral_status', ['pending', 'active', 'liquidated', 'released']);
export const loanStatusEnum = pgEnum('loan_status', ['pending', 'active', 'paid', 'defaulted', 'cancelled']);
export const adStatusEnum = pgEnum('ad_status', ['pending', 'active', 'paused', 'completed', 'rejected']);

// User table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  email: varchar('email', { length: 255 }),
  firstName: varchar('first_name', { length: 255 }),
  lastName: varchar('last_name', { length: 255 }),
  password: text('password').notNull(),
  role: userRoleEnum('role').notNull().default('user'),
  walletAddress: varchar('wallet_address', { length: 255 }),
  phoneNumber: varchar('phone_number', { length: 20 }),
  kycStatus: kycStatusEnum('kyc_status').default('unverified'),
  kycVerificationId: varchar('kyc_verification_id', { length: 255 }),
  kycVerifiedAt: timestamp('kyc_verified_at'),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Wallet table
export const wallets = pgTable('wallets', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  address: varchar('address', { length: 255 }).notNull(),
  nptBalance: varchar('npt_balance', { length: 255 }).default('0'),
  bnbBalance: varchar('bnb_balance', { length: 255 }).default('0'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Transaction table
export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  txHash: varchar('tx_hash', { length: 255 }),
  senderId: integer('sender_id').references(() => users.id),
  receiverId: integer('receiver_id').references(() => users.id),
  amount: varchar('amount', { length: 255 }).notNull(),
  currency: varchar('currency', { length: 50 }).notNull(),
  status: transactionStatusEnum('status').notNull().default('pending'),
  type: transactionTypeEnum('type').notNull(),
  description: text('description'),
  stripePaymentId: varchar('stripe_payment_id', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Activity log table
export const activities = pgTable('activities', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  action: varchar('action', { length: 255 }).notNull(),
  description: text('description'),
  ipAddress: varchar('ip_address', { length: 50 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow()
});

// Collateral table
export const collaterals = pgTable('collaterals', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  type: varchar('type', { length: 50 }).notNull(),
  amount: varchar('amount', { length: 255 }).notNull(),
  status: collateralStatusEnum('status').notNull().default('active'),
  ltv: integer('ltv').notNull(),
  txHash: varchar('tx_hash', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Loan table
export const loans = pgTable('loans', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  collateralId: integer('collateral_id').references(() => collaterals.id),
  amount: varchar('amount', { length: 255 }).notNull(),
  interest: varchar('interest', { length: 255 }).notNull(),
  term: integer('term').notNull(),
  paymentsMade: integer('payments_made').default(0),
  status: loanStatusEnum('status').notNull().default('active'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  dueDate: timestamp('due_date')
});

// Ad table
export const ads = pgTable('ads', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  status: adStatusEnum('status').notNull().default('pending'),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  budget: varchar('budget', { length: 255 }),
  impressions: integer('impressions').default(0),
  clicks: integer('clicks').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  wallets: many(wallets),
  sentTransactions: many(transactions, { relationName: 'sender' }),
  receivedTransactions: many(transactions, { relationName: 'receiver' }),
  activities: many(activities),
  collaterals: many(collaterals),
  loans: many(loans),
  ads: many(ads)
}));

export const walletsRelations = relations(wallets, ({ one }) => ({
  user: one(users, {
    fields: [wallets.userId],
    references: [users.id]
  })
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  sender: one(users, {
    fields: [transactions.senderId],
    references: [users.id],
    relationName: 'sender'
  }),
  receiver: one(users, {
    fields: [transactions.receiverId],
    references: [users.id],
    relationName: 'receiver'
  })
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  user: one(users, {
    fields: [activities.userId],
    references: [users.id]
  })
}));

export const collateralsRelations = relations(collaterals, ({ one, many }) => ({
  user: one(users, {
    fields: [collaterals.userId],
    references: [users.id]
  }),
  loans: many(loans)
}));

export const loansRelations = relations(loans, ({ one }) => ({
  user: one(users, {
    fields: [loans.userId],
    references: [users.id]
  }),
  collateral: one(collaterals, {
    fields: [loans.collateralId],
    references: [collaterals.id]
  })
}));

export const adsRelations = relations(ads, ({ one }) => ({
  user: one(users, {
    fields: [ads.userId],
    references: [users.id]
  })
}));

// Create Zod schemas for data validation and insertion
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertWalletSchema = createInsertSchema(wallets).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true
});

export const insertCollateralSchema = createInsertSchema(collaterals).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertLoanSchema = createInsertSchema(loans).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertAdSchema = createInsertSchema(ads).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Wallet = typeof wallets.$inferSelect;
export type InsertWallet = z.infer<typeof insertWalletSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type Collateral = typeof collaterals.$inferSelect;
export type InsertCollateral = z.infer<typeof insertCollateralSchema>;

export type Loan = typeof loans.$inferSelect;
export type InsertLoan = z.infer<typeof insertLoanSchema>;

export type Ad = typeof ads.$inferSelect;
export type InsertAd = z.infer<typeof insertAdSchema>;