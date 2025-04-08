import { pgTable, serial, text, timestamp, integer, boolean, primaryKey, uniqueIndex, index, pgSchema } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

/************************************************
 * USER SCHEMA
 ************************************************/
export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    username: text("username").notNull().unique(),
    password: text("password").notNull(),
    email: text("email"),
    fullName: text("full_name"),
    role: text("role", { enum: ["user", "admin", "superadmin"] }).default("user").notNull(),
    stripeCustomerId: text("stripe_customer_id"),
    avatar: text("avatar"),
    phone: text("phone"),
    address: text("address"),
    city: text("city"),
    country: text("country"),
    postalCode: text("postal_code"),
    kycStatus: text("kyc_status", { enum: ["none", "pending", "verified", "rejected"] }).default("none").notNull(),
    kycVerificationId: text("kyc_verification_id"),
    kycVerifiedAt: timestamp("kyc_verified_at"),
    isActive: boolean("is_active").default(true).notNull(),
    isVerified: boolean("is_verified").default(false).notNull(),
    verificationToken: text("verification_token"),
    resetPasswordToken: text("reset_password_token"),
    resetPasswordExpires: timestamp("reset_password_expires"),
    lastLoginAt: timestamp("last_login_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      usernameIdx: uniqueIndex("username_idx").on(table.username),
      emailIdx: index("email_idx").on(table.email),
    };
  }
);

export const usersRelations = relations(users, ({ one, many }) => ({
  wallet: one(wallets, {
    fields: [users.id],
    references: [wallets.userId],
  }),
  transactions: many(transactions),
  activities: many(activities),
  collaterals: many(collaterals),
  loans: many(loans),
  ads: many(ads),
}));

/************************************************
 * WALLET SCHEMA
 ************************************************/
export const wallets = pgTable(
  "wallets",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => users.id),
    address: text("address").notNull().unique(),
    balance: text("balance").default("0").notNull(),
    privateKey: text("private_key"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      userIdIdx: uniqueIndex("wallet_user_id_idx").on(table.userId),
      addressIdx: uniqueIndex("wallet_address_idx").on(table.address),
    };
  }
);

export const walletsRelations = relations(wallets, ({ one, many }) => ({
  user: one(users, {
    fields: [wallets.userId],
    references: [users.id],
  }),
  sentTransactions: many(transactions, { relationName: "sentTransactions" }),
  receivedTransactions: many(transactions, { relationName: "receivedTransactions" }),
}));

/************************************************
 * TRANSACTION SCHEMA
 ************************************************/
export const transactions = pgTable(
  "transactions",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => users.id),
    type: text("type", { enum: ["deposit", "withdrawal", "transfer", "fee", "loan", "repayment"] }).notNull(),
    amount: text("amount").notNull(),
    hash: text("hash").notNull().unique(),
    status: text("status", { enum: ["pending", "completed", "failed", "rejected"] }).default("pending").notNull(),
    fromAddress: text("from_address").notNull(),
    toAddress: text("to_address").notNull(),
    fee: text("fee"),
    gasPrice: text("gas_price"),
    gasUsed: text("gas_used"),
    blockNumber: text("block_number"),
    blockHash: text("block_hash"),
    description: text("description"),
    metadata: text("metadata"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      userIdIdx: index("transaction_user_id_idx").on(table.userId),
      hashIdx: uniqueIndex("transaction_hash_idx").on(table.hash),
      statusIdx: index("transaction_status_idx").on(table.status),
      fromAddressIdx: index("transaction_from_address_idx").on(table.fromAddress),
      toAddressIdx: index("transaction_to_address_idx").on(table.toAddress),
    };
  }
);

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
  sender: one(wallets, {
    fields: [transactions.fromAddress],
    references: [wallets.address],
    relationName: "sentTransactions",
  }),
  receiver: one(wallets, {
    fields: [transactions.toAddress],
    references: [wallets.address],
    relationName: "receivedTransactions",
  }),
}));

/************************************************
 * ACTIVITY SCHEMA
 ************************************************/
export const activities = pgTable(
  "activities",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => users.id),
    action: text("action").notNull(),
    details: text("details"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      userIdIdx: index("activity_user_id_idx").on(table.userId),
      actionIdx: index("activity_action_idx").on(table.action),
    };
  }
);

export const activitiesRelations = relations(activities, ({ one }) => ({
  user: one(users, {
    fields: [activities.userId],
    references: [users.id],
  }),
}));

/************************************************
 * COLLATERAL SCHEMA
 ************************************************/
export const collaterals = pgTable(
  "collaterals",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => users.id),
    assetType: text("asset_type", { enum: ["BNB", "ETH", "BTC", "NPT"] }).notNull(),
    amount: text("amount").notNull(),
    valueInUsd: text("value_in_usd").notNull(),
    status: text("status", { enum: ["pending", "active", "released", "liquidated"] }).default("pending").notNull(),
    lockedUntil: timestamp("locked_until"),
    transactionHash: text("transaction_hash"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      userIdIdx: index("collateral_user_id_idx").on(table.userId),
      statusIdx: index("collateral_status_idx").on(table.status),
    };
  }
);

export const collateralsRelations = relations(collaterals, ({ one, many }) => ({
  user: one(users, {
    fields: [collaterals.userId],
    references: [users.id],
  }),
  loans: many(loans),
}));

/************************************************
 * LOAN SCHEMA
 ************************************************/
export const loans = pgTable(
  "loans",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => users.id),
    collateralId: integer("collateral_id").references(() => collaterals.id),
    amount: text("amount").notNull(),
    interestRate: text("interest_rate").notNull(),
    duration: integer("duration").notNull(), // in days
    dueDate: timestamp("due_date").notNull(),
    status: text("status", { enum: ["pending", "active", "repaid", "defaulted", "liquidated"] }).default("pending").notNull(),
    repaidAmount: text("repaid_amount").default("0"),
    lastRepaymentDate: timestamp("last_repayment_date"),
    loanTransactionHash: text("loan_transaction_hash"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      userIdIdx: index("loan_user_id_idx").on(table.userId),
      collateralIdIdx: index("loan_collateral_id_idx").on(table.collateralId),
      statusIdx: index("loan_status_idx").on(table.status),
    };
  }
);

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

/************************************************
 * AD SCHEMA (Peer-to-peer marketplace)
 ************************************************/
export const ads = pgTable(
  "ads",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => users.id),
    type: text("type", { enum: ["buy", "sell"] }).notNull(),
    assetType: text("asset_type", { enum: ["BNB", "ETH", "BTC", "NPT"] }).notNull(),
    amount: text("amount").notNull(),
    price: text("price").notNull(),
    paymentMethod: text("payment_method", { enum: ["bank_transfer", "cash", "mobile_payment", "crypto"] }).notNull(),
    title: text("title").notNull(),
    description: text("description"),
    location: text("location"),
    status: text("status", { enum: ["active", "completed", "cancelled"] }).default("active").notNull(),
    expiresAt: timestamp("expires_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      userIdIdx: index("ad_user_id_idx").on(table.userId),
      typeIdx: index("ad_type_idx").on(table.type),
      assetTypeIdx: index("ad_asset_type_idx").on(table.assetType),
      statusIdx: index("ad_status_idx").on(table.status),
    };
  }
);

export const adsRelations = relations(ads, ({ one }) => ({
  user: one(users, {
    fields: [ads.userId],
    references: [users.id],
  }),
}));

/************************************************
 * SESSION SCHEMA
 ************************************************/
export const sessions = pgTable("session", {
  sid: text("sid").primaryKey(),
  sess: text("sess").notNull(),
  expire: timestamp("expire").notNull(),
});

/************************************************
 * SCHEMAS FOR ZOD VALIDATION
 ************************************************/

// Users
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

// Wallets
export const insertWalletSchema = createInsertSchema(wallets);
export const selectWalletSchema = createSelectSchema(wallets);

// Transactions
export const insertTransactionSchema = createInsertSchema(transactions);
export const selectTransactionSchema = createSelectSchema(transactions);

// Activities
export const insertActivitySchema = createInsertSchema(activities);
export const selectActivitySchema = createSelectSchema(activities);

// Collaterals
export const insertCollateralSchema = createInsertSchema(collaterals);
export const selectCollateralSchema = createSelectSchema(collaterals);

// Loans
export const insertLoanSchema = createInsertSchema(loans);
export const selectLoanSchema = createSelectSchema(loans);

// Ads
export const insertAdSchema = createInsertSchema(ads);
export const selectAdSchema = createSelectSchema(ads);

/************************************************
 * TYPESCRIPT TYPES
 ************************************************/

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