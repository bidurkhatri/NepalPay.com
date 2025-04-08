import { relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  full_name: varchar("full_name", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  kyc_status: varchar("kyc_status", { length: 20 }).default("none"),
  role: varchar("role", { length: 20 }).default("user"),
  wallet_address: varchar("wallet_address", { length: 42 }),
  stripe_customer_id: varchar("stripe_customer_id", { length: 255 }),
  stripe_subscription_id: varchar("stripe_subscription_id", { length: 255 }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// User relations
export const usersRelations = relations(users, ({ many }) => ({
  wallets: many(wallets),
  transactions_as_sender: many(transactions, { relationName: "sender" }),
  transactions_as_receiver: many(transactions, { relationName: "receiver" }),
  activities: many(activities),
  collaterals: many(collaterals),
  loans: many(loans),
  ads: many(ads),
}));

// Wallet model
export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  address: varchar("address", { length: 42 }).notNull().unique(),
  is_primary: boolean("is_primary").default(false),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Wallet relations
export const walletsRelations = relations(wallets, ({ one }) => ({
  user: one(users, {
    fields: [wallets.user_id],
    references: [users.id],
  }),
}));

// Transaction model
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 50 }).notNull(), // deposit, withdrawal, transfer, payment, fee, loan, collateral
  amount: varchar("amount", { length: 50 }).notNull(),
  asset: varchar("asset", { length: 20 }).notNull().default("NPT"),
  hash: varchar("hash", { length: 66 }).unique(),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, completed, failed
  description: text("description"),
  sender_id: integer("sender_id").references(() => users.id, { onDelete: "set null" }),
  receiver_id: integer("receiver_id").references(() => users.id, { onDelete: "set null" }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Transaction relations
export const transactionsRelations = relations(transactions, ({ one }) => ({
  sender: one(users, {
    fields: [transactions.sender_id],
    references: [users.id],
    relationName: "sender",
  }),
  receiver: one(users, {
    fields: [transactions.receiver_id],
    references: [users.id],
    relationName: "receiver",
  }),
}));

// Activity model
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 20 }).notNull(), // loan, collateral, login, wallet_connect, transaction, kyc_update, account_update
  description: text("description"),
  created_at: timestamp("created_at").defaultNow(),
});

// Activity relations
export const activitiesRelations = relations(activities, ({ one }) => ({
  user: one(users, {
    fields: [activities.user_id],
    references: [users.id],
  }),
}));

// Collateral model
export const collaterals = pgTable("collaterals", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  loan_id: integer("loan_id"), // We'll add the reference in relations to avoid circular dependency
  type: varchar("type", { length: 10 }).notNull(), // bnb, btc, eth
  amount: varchar("amount", { length: 50 }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Collateral relations
export const collateralsRelations = relations(collaterals, ({ one }) => ({
  user: one(users, {
    fields: [collaterals.user_id],
    references: [users.id],
  }),
  loan: one(loans, {
    fields: [collaterals.loan_id],
    references: [loans.id],
  }),
}));

// Loan model
export const loans = pgTable("loans", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  amount: varchar("amount", { length: 50 }).notNull(),
  interest_rate: varchar("interest_rate", { length: 10 }).notNull(),
  due_date: timestamp("due_date").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, active, repaid, defaulted, liquidated
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Loan relations
export const loansRelations = relations(loans, ({ one, many }) => ({
  user: one(users, {
    fields: [loans.user_id],
    references: [users.id],
  }),
  collaterals: many(collaterals),
}));

// Ad model (for marketplace)
export const ads = pgTable("ads", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 100 }).notNull(),
  description: text("description").notNull(),
  price: varchar("price", { length: 50 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("active"), // active, paused, cancelled
  expires_at: timestamp("expires_at").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Ad relations
export const adsRelations = relations(ads, ({ one }) => ({
  user: one(users, {
    fields: [ads.user_id],
    references: [users.id],
  }),
}));

// Zod schema for user insertion
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// Zod schema for wallet insertion
export const insertWalletSchema = createInsertSchema(wallets).omit({
  id: true,
  user_id: true,
  is_primary: true,
  created_at: true,
  updated_at: true,
});

// Zod schema for transaction insertion
export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  sender_id: true,
  status: true,
  created_at: true,
  updated_at: true,
});

// Zod schema for transaction with fees
export const transactionFeeSchema = insertTransactionSchema.extend({
  gas_fee: z.string().optional(),
  service_fee: z.string().optional(),
});

// Zod schema for activity insertion
export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  created_at: true,
});

// Zod schema for collateral insertion
export const insertCollateralSchema = createInsertSchema(collaterals).omit({
  id: true,
  user_id: true,
  loan_id: true,
  created_at: true,
  updated_at: true,
});

// Zod schema for loan insertion
export const insertLoanSchema = createInsertSchema(loans).omit({
  id: true,
  user_id: true,
  status: true,
  created_at: true,
  updated_at: true,
});

// Zod schema for ad insertion
export const insertAdSchema = createInsertSchema(ads).omit({
  id: true,
  user_id: true,
  status: true,
  created_at: true,
  updated_at: true,
});

// TypeScript types

// User types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

// Wallet types
export type Wallet = typeof wallets.$inferSelect;
export type InsertWallet = z.infer<typeof insertWalletSchema>;

// Transaction types
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

// Activity types
export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

// Collateral types
export type Collateral = typeof collaterals.$inferSelect;
export type InsertCollateral = z.infer<typeof insertCollateralSchema>;

// Loan types
export type Loan = typeof loans.$inferSelect;
export type InsertLoan = z.infer<typeof insertLoanSchema>;

// Ad types
export type Ad = typeof ads.$inferSelect;
export type InsertAd = z.infer<typeof insertAdSchema>;