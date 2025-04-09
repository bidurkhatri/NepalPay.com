import { relations } from 'drizzle-orm';
import { 
  pgTable, 
  serial, 
  text, 
  varchar, 
  timestamp, 
  decimal, 
  boolean, 
  integer,
  primaryKey,
  pgEnum
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Enums
export const roleEnum = pgEnum('role', ['user', 'admin', 'superadmin']);
export const transactionTypeEnum = pgEnum('transaction_type', [
  'deposit', 'withdrawal', 'transfer', 'payment', 'fee', 'loan', 'repayment'
]);
export const transactionStatusEnum = pgEnum('transaction_status', [
  'pending', 'completed', 'failed', 'cancelled'
]);
export const activityTypeEnum = pgEnum('activity_type', [
  'login', 'logout', 'register', 'password_change', 'email_change', 'transfer', 
  'payment', 'loan', 'repayment', 'collateral_added', 'collateral_removed'
]);
export const currencyEnum = pgEnum('currency', ['NPT', 'BNB', 'ETH', 'BTC', 'NPR', 'USD', 'EUR']);
export const loanStatusEnum = pgEnum('loan_status', ['pending', 'active', 'repaid', 'defaulted', 'liquidated']);
export const collateralTypeEnum = pgEnum('collateral_type', ['BNB', 'ETH', 'BTC']);
export const adStatusEnum = pgEnum('ad_status', ['active', 'inactive', 'pending', 'rejected']);

// Tables
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  role: roleEnum('role').default('user').notNull(),
  email: text('email').notNull().unique(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  password: text('password').notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  phoneNumber: text('phone_number'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  finApiUserId: text('finapi_user_id'),
  walletAddress: text('wallet_address'),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  isVerified: boolean('is_verified').default(false),
  verificationToken: text('verification_token'),
  resetPasswordToken: text('reset_password_token'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const wallets = pgTable('wallets', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  currency: currencyEnum('currency').notNull(),
  address: text('address').notNull(),
  balance: decimal('balance', { precision: 18, scale: 8 }).default('0').notNull(),
  isPrimary: boolean('is_primary').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  type: transactionTypeEnum('type').notNull(),
  senderId: integer('sender_id').references(() => users.id),
  receiverId: integer('receiver_id').references(() => users.id),
  amount: decimal('amount', { precision: 18, scale: 8 }).notNull(),
  currency: currencyEnum('currency').notNull(),
  status: transactionStatusEnum('status').default('pending').notNull(),
  txHash: text('tx_hash'),
  note: text('note'),
  stripePaymentId: text('stripe_payment_id'),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const tokenPurchases = pgTable('token_purchases', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  amount: decimal('amount', { precision: 18, scale: 8 }).notNull(),
  tokenPrice: decimal('token_price', { precision: 18, scale: 8 }).notNull(),
  gasFee: decimal('gas_fee', { precision: 18, scale: 8 }).notNull(),
  serviceFee: decimal('service_fee', { precision: 18, scale: 8 }).notNull(),
  totalAmount: decimal('total_amount', { precision: 18, scale: 8 }).notNull(),
  stripePaymentId: text('stripe_payment_id'),
  txHash: text('tx_hash'),
  status: transactionStatusEnum('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const transactionFees = pgTable('transaction_fees', {
  id: serial('id').primaryKey(),
  transactionId: integer('transaction_id').references(() => transactions.id, { onDelete: 'cascade' }).notNull(),
  amount: decimal('amount', { precision: 18, scale: 8 }).notNull(),
  currency: currencyEnum('currency').notNull(),
  receivedBy: text('received_by').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const activities = pgTable('activities', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  type: activityTypeEnum('type').notNull(),
  details: text('details'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const bankAccounts = pgTable('bank_accounts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  accountName: text('account_name').notNull(),
  accountNumber: text('account_number').notNull(),
  bankName: text('bank_name').notNull(),
  branchName: text('branch_name'),
  isVerified: boolean('is_verified').default(false),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const collaterals = pgTable('collaterals', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  type: collateralTypeEnum('type').notNull(),
  amount: decimal('amount', { precision: 18, scale: 8 }).notNull(),
  usdValue: decimal('usd_value', { precision: 18, scale: 8 }).notNull(),
  txHash: text('tx_hash'),
  isLocked: boolean('is_locked').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const loans = pgTable('loans', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  collateralId: integer('collateral_id').references(() => collaterals.id).notNull(),
  amount: decimal('amount', { precision: 18, scale: 8 }).notNull(),
  interestRate: decimal('interest_rate', { precision: 5, scale: 2 }).notNull(),
  term: integer('term').notNull(), // In days
  dueDate: timestamp('due_date').notNull(),
  status: loanStatusEnum('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const ads = pgTable('ads', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  imageUrl: text('image_url'),
  linkUrl: text('link_url'),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  isActive: boolean('is_active').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Sessions table for auth
export const sessions = pgTable('session', {
  sid: text('sid').primaryKey(),
  sess: text('sess').notNull(),
  expire: timestamp('expire').notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  wallets: many(wallets),
  sentTransactions: many(transactions, { relationName: 'sender' }),
  receivedTransactions: many(transactions, { relationName: 'receiver' }),
  tokenPurchases: many(tokenPurchases),
  activities: many(activities),
  bankAccounts: many(bankAccounts),
  collaterals: many(collaterals),
  loans: many(loans),
}));

export const walletsRelations = relations(wallets, ({ one }) => ({
  user: one(users, {
    fields: [wallets.userId],
    references: [users.id],
  }),
}));

export const transactionsRelations = relations(transactions, ({ one, many }) => ({
  sender: one(users, {
    fields: [transactions.senderId],
    references: [users.id],
    relationName: 'sender',
  }),
  receiver: one(users, {
    fields: [transactions.receiverId],
    references: [users.id],
    relationName: 'receiver',
  }),
  fees: many(transactionFees),
}));

export const tokenPurchasesRelations = relations(tokenPurchases, ({ one }) => ({
  user: one(users, {
    fields: [tokenPurchases.userId],
    references: [users.id],
  }),
}));

export const transactionFeesRelations = relations(transactionFees, ({ one }) => ({
  transaction: one(transactions, {
    fields: [transactionFees.transactionId],
    references: [transactions.id],
  }),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  user: one(users, {
    fields: [activities.userId],
    references: [users.id],
  }),
}));

export const bankAccountsRelations = relations(bankAccounts, ({ one }) => ({
  user: one(users, {
    fields: [bankAccounts.userId],
    references: [users.id],
  }),
}));

export const collateralsRelations = relations(collaterals, ({ one, many }) => ({
  user: one(users, {
    fields: [collaterals.userId],
    references: [users.id],
  }),
  loans: many(loans),
}));

export const loansRelations = relations(loans, ({ one }) => ({
  user: one(users, {
    fields: [loans.userId],
    references: [users.id],
  }),
  collateral: one(collaterals, {
    fields: [loans.collateralId],
    references: [collaterals.id],
  }),
}));

// Zod schemas for validation and types
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const insertWalletSchema = createInsertSchema(wallets).omit({ id: true, createdAt: true, updatedAt: true });
export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true, createdAt: true, updatedAt: true });
export const insertTokenPurchaseSchema = createInsertSchema(tokenPurchases).omit({ id: true, createdAt: true, updatedAt: true });
export const insertTransactionFeeSchema = createInsertSchema(transactionFees).omit({ id: true, createdAt: true });
export const insertActivitySchema = createInsertSchema(activities).omit({ id: true, createdAt: true });
export const insertBankAccountSchema = createInsertSchema(bankAccounts).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCollateralSchema = createInsertSchema(collaterals).omit({ id: true, createdAt: true, updatedAt: true });
export const insertLoanSchema = createInsertSchema(loans).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAdSchema = createInsertSchema(ads).omit({ id: true, createdAt: true, updatedAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Wallet = typeof wallets.$inferSelect;
export type InsertWallet = z.infer<typeof insertWalletSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type TokenPurchase = typeof tokenPurchases.$inferSelect;
export type InsertTokenPurchase = z.infer<typeof insertTokenPurchaseSchema>;

export type TransactionFee = typeof transactionFees.$inferSelect;
export type InsertTransactionFee = z.infer<typeof insertTransactionFeeSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type BankAccount = typeof bankAccounts.$inferSelect;
export type InsertBankAccount = z.infer<typeof insertBankAccountSchema>;

export type Collateral = typeof collaterals.$inferSelect;
export type InsertCollateral = z.infer<typeof insertCollateralSchema>;

export type Loan = typeof loans.$inferSelect;
export type InsertLoan = z.infer<typeof insertLoanSchema>;

export type Ad = typeof ads.$inferSelect;
export type InsertAd = z.infer<typeof insertAdSchema>;