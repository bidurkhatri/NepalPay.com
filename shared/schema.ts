import { relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  boolean,
  integer,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  first_name: text("first_name"),
  last_name: text("last_name"),
  phone_number: text("phone_number"),
  finapi_user_id: text("finapi_user_id"),
  kyc_status: text("kyc_status").default("PENDING"),
  kyc_verification_id: text("kyc_verification_id"),
  kyc_verified_at: timestamp("kyc_verified_at"),
  role: text("role").default("user"),
  wallet_address: text("wallet_address"),
  stripe_customer_id: text("stripe_customer_id"),
  stripe_subscription_id: text("stripe_subscription_id"),
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
  balance: decimal("balance", { precision: 18, scale: 8 }).default("0").notNull(),
  currency: text("currency").default("NPR"),
  last_updated: timestamp("last_updated").defaultNow(),
  address: text("address").notNull(),
  npt_balance: text("npt_balance").default("0"),
  bnb_balance: text("bnb_balance").default("0"),
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
  sender_id: integer("sender_id").references(() => users.id, { onDelete: "set null" }),
  receiver_id: integer("receiver_id").references(() => users.id, { onDelete: "set null" }),
  amount: text("amount").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull().default("COMPLETED"),
  note: text("note"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  tx_hash: text("tx_hash"),
  stripe_payment_id: text("stripe_payment_id"),
  currency: text("currency").default("NPT"),
  updated_at: timestamp("updated_at").defaultNow(),
  description: text("description"),
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
  action: text("action").notNull(),
  description: text("description"),
  ip_address: text("ip_address"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  user_agent: text("user_agent"),
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
export const insertUserSchema = createInsertSchema(users);

// Zod schema for wallet insertion
export const insertWalletSchema = createInsertSchema(wallets).omit({ id: true }).extend({
  is_primary: z.boolean().optional().default(false)
});

// Zod schema for transaction insertion
export const insertTransactionSchema = createInsertSchema(transactions).extend({
  type: z.string().optional(),
  status: z.string().optional().default("COMPLETED"),
  amount: z.string().optional(),
  currency: z.string().optional().default("NPT"),
  tx_hash: z.string().optional(),
  description: z.string().optional(),
  receiver_id: z.number().optional(),
});

// Zod schema for transaction with fees
export const transactionFeeSchema = insertTransactionSchema.extend({
  gas_fee: z.string().optional(),
  service_fee: z.string().optional(),
});

// Zod schema for activity insertion
export const insertActivitySchema = createInsertSchema(activities).omit({ id: true }).extend({
  user_id: z.number(),
  action: z.string(),
  description: z.string().optional(),
  ip_address: z.string().optional(),
  user_agent: z.string().optional()
});

// Zod schema for collateral insertion
export const insertCollateralSchema = createInsertSchema(collaterals).extend({
  type: z.string().optional(),
});

// Zod schema for loan insertion
export const insertLoanSchema = createInsertSchema(loans).extend({
  status: z.string().optional().default("pending"),
});

// Zod schema for ad insertion
export const insertAdSchema = createInsertSchema(ads).extend({
  status: z.string().optional().default("active"),
  expires_at: z.date().optional().default(() => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
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