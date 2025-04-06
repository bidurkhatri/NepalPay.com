import { pgTable, text, serial, integer, boolean, timestamp, numeric, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phoneNumber: text("phone_number"),
  role: text("role").default("USER").notNull(), // USER, ADMIN, OWNER roles
  createdAt: timestamp("created_at").defaultNow().notNull(),
  finapiUserId: text("finapi_user_id"),
  kycStatus: text("kyc_status").default("PENDING"),
  kycVerificationId: text("kyc_verification_id"),
  kycVerifiedAt: timestamp("kyc_verified_at"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  email: true,
  phoneNumber: true,
  role: true,
  finapiUserId: true,
  kycStatus: true,
  kycVerificationId: true,
});

// Wallet schema
export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  balance: numeric("balance", { precision: 10, scale: 2 }).default("0").notNull(),
  currency: text("currency").default("NPT").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  walletAddress: text("wallet_address"),
});

export const insertWalletSchema = createInsertSchema(wallets).pick({
  userId: true,
  balance: true,
  currency: true,
  walletAddress: true,
});

// Transaction schema
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").references(() => users.id),
  receiverId: integer("receiver_id").references(() => users.id),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  type: text("type").notNull(), // TRANSFER, TOPUP, UTILITY, DEPOSIT, WITHDRAWAL, MOBILE_TOPUP, UTILITY_PAYMENT
  status: text("status").default("COMPLETED").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  txHash: text("tx_hash"),
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  senderId: true,
  receiverId: true,
  amount: true,
  type: true,
  status: true,
  note: true,
  txHash: true,
  // createdAt is handled automatically by the database
});

// Activity schema
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  action: text("action").notNull(),
  details: text("details"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertActivitySchema = createInsertSchema(activities).pick({
  userId: true,
  action: true,
  details: true,
  ipAddress: true,
});

// Collateral schema
export const collaterals = pgTable("collaterals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // BNB, ETH, BTC
  amount: numeric("amount", { precision: 18, scale: 8 }).notNull(),
  valueInNPT: numeric("value_in_npt", { precision: 18, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCollateralSchema = createInsertSchema(collaterals).pick({
  userId: true,
  type: true,
  amount: true,
  valueInNPT: true,
});

// Loan schema
export const loans = pgTable("loans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  amount: numeric("amount", { precision: 18, scale: 2 }).notNull(),
  collateralId: integer("collateral_id").notNull().references(() => collaterals.id),
  interestRate: numeric("interest_rate", { precision: 5, scale: 2 }).notNull(),
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date"),
  status: text("status").default("ACTIVE").notNull(), // ACTIVE, REPAID, DEFAULTED
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertLoanSchema = createInsertSchema(loans).pick({
  userId: true,
  amount: true,
  collateralId: true,
  interestRate: true,
  startDate: true,
  endDate: true,
  status: true,
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

// Ad schema
export const ads = pgTable("ads", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  bidAmount: numeric("bid_amount", { precision: 18, scale: 2 }).notNull(),
  tier: text("tier").notNull(), // BRONZE, SILVER, GOLD, PLATINUM
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date").notNull(),
  status: text("status").default("PENDING").notNull(), // ACTIVE, EXPIRED, PENDING
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAdSchema = createInsertSchema(ads).pick({
  userId: true,
  title: true,
  description: true,
  bidAmount: true,
  tier: true,
  startDate: true,
  endDate: true,
  status: true,
});

export type Ad = typeof ads.$inferSelect;
export type InsertAd = z.infer<typeof insertAdSchema>;
