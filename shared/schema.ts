import { pgTable, serial, text, timestamp, integer, pgEnum, boolean } from "drizzle-orm/pg-core";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// User role enum
export const userRoleEnum = pgEnum("user_role", ["user", "admin", "superadmin"]);

// KYC status enum
export const kycStatusEnum = pgEnum("kyc_status", ["pending", "verified", "rejected"]);

// Transaction type enum
export const transactionTypeEnum = pgEnum("transaction_type", [
  "deposit",
  "withdrawal",
  "transfer",
  "payment",
  "loan_repayment",
  "interest_payment",
  "refund"
]);

// Transaction status enum
export const transactionStatusEnum = pgEnum("transaction_status", [
  "pending",
  "completed",
  "failed",
  "cancelled"
]);

// Loan status enum
export const loanStatusEnum = pgEnum("loan_status", [
  "pending",
  "approved",
  "rejected",
  "active",
  "paid",
  "defaulted"
]);

// Collateral type enum
export const collateralTypeEnum = pgEnum("collateral_type", ["BNB", "ETH", "BTC"]);

// Database tables
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  role: userRoleEnum("role").default("user"),
  kycStatus: kycStatusEnum("kyc_status").default("pending"),
  kycVerificationId: text("kyc_verification_id"),
  kycVerifiedAt: timestamp("kyc_verified_at"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  address: text("address").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  fromAddress: text("from_address"),
  toAddress: text("to_address"),
  txHash: text("tx_hash").unique(),
  amount: text("amount").notNull(),
  fee: text("fee"),
  type: transactionTypeEnum("type").notNull(),
  status: transactionStatusEnum("status").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  action: text("action").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const collaterals = pgTable("collaterals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  amount: text("amount").notNull(),
  type: collateralTypeEnum("type").notNull(),
  status: transactionStatusEnum("status").notNull(),
  value: text("value").notNull(), // USD value
  txHash: text("tx_hash").unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const loans = pgTable("loans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  collateralId: integer("collateral_id").references(() => collaterals.id).notNull(),
  amount: text("amount").notNull(), // Amount in NPT
  status: loanStatusEnum("status").notNull(),
  interestRate: text("interest_rate").notNull(),
  term: integer("term").notNull(), // In days
  dueDate: timestamp("due_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const ads = pgTable("ads", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  targetUrl: text("target_url"),
  isActive: boolean("is_active").default(true),
  impressions: integer("impressions").default(0),
  clicks: integer("clicks").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Types
export type User = InferSelectModel<typeof users>;
export type InsertUser = InferInsertModel<typeof users>;

export type Wallet = InferSelectModel<typeof wallets>;
export type InsertWallet = InferInsertModel<typeof wallets>;

export type Transaction = InferSelectModel<typeof transactions>;
export type InsertTransaction = InferInsertModel<typeof transactions>;

export type Activity = InferSelectModel<typeof activities>;
export type InsertActivity = InferInsertModel<typeof activities>;

export type Collateral = InferSelectModel<typeof collaterals>;
export type InsertCollateral = InferInsertModel<typeof collaterals>;

export type Loan = InferSelectModel<typeof loans>;
export type InsertLoan = InferInsertModel<typeof loans>;

export type Ad = InferSelectModel<typeof ads>;
export type InsertAd = InferInsertModel<typeof ads>;

// Zod schemas
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertWalletSchema = createInsertSchema(wallets);
export const selectWalletSchema = createSelectSchema(wallets);

export const insertTransactionSchema = createInsertSchema(transactions);
export const selectTransactionSchema = createSelectSchema(transactions);

export const insertActivitySchema = createInsertSchema(activities);
export const selectActivitySchema = createSelectSchema(activities);

export const insertCollateralSchema = createInsertSchema(collaterals);
export const selectCollateralSchema = createSelectSchema(collaterals);

export const insertLoanSchema = createInsertSchema(loans);
export const selectLoanSchema = createSelectSchema(loans);

export const insertAdSchema = createInsertSchema(ads);
export const selectAdSchema = createSelectSchema(ads);