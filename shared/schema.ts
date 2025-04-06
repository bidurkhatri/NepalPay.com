import { pgTable, text, serial, integer, boolean, timestamp, numeric, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("firstName").notNull(),
  lastName: text("lastName").notNull(),
  email: text("email").notNull().unique(),
  phoneNumber: text("phoneNumber"),
  role: text("role").default("USER").notNull(), // USER, ADMIN, OWNER roles
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  email: true,
  phoneNumber: true,
  role: true,
});

// Wallet schema
export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id),
  balance: numeric("balance", { precision: 10, scale: 2 }).default("0").notNull(),
  currency: text("currency").default("NPT").notNull(),
  lastUpdated: timestamp("lastUpdated").defaultNow().notNull(),
});

export const insertWalletSchema = createInsertSchema(wallets).pick({
  userId: true,
  balance: true,
  currency: true,
});

// Transaction schema
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  senderId: integer("senderId").references(() => users.id),
  receiverId: integer("receiverId").references(() => users.id),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  type: text("type").notNull(), // TRANSFER, TOPUP, UTILITY, DEPOSIT, WITHDRAWAL
  status: text("status").default("COMPLETED").notNull(),
  note: text("note"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  senderId: true,
  receiverId: true,
  amount: true,
  type: true,
  status: true,
  note: true,
  // createdAt is handled automatically by the database
});

// Activity schema
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id),
  action: text("action").notNull(),
  details: text("details"),
  ipAddress: text("ipAddress"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
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
  userId: integer("userId").notNull().references(() => users.id),
  type: text("type").notNull(), // BNB, ETH, BTC
  amount: numeric("amount", { precision: 18, scale: 8 }).notNull(),
  valueInNPT: numeric("valueInNPT", { precision: 18, scale: 2 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
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
  userId: integer("userId").notNull().references(() => users.id),
  amount: numeric("amount", { precision: 18, scale: 2 }).notNull(),
  collateralId: integer("collateralId").notNull().references(() => collaterals.id),
  interestRate: numeric("interestRate", { precision: 5, scale: 2 }).notNull(),
  startDate: timestamp("startDate").defaultNow().notNull(),
  endDate: timestamp("endDate"),
  status: text("status").default("ACTIVE").notNull(), // ACTIVE, REPAID, DEFAULTED
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
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
