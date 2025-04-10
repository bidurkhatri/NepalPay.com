import { pgTable, foreignKey, serial, integer, numeric, text, timestamp, boolean, index, uniqueIndex, unique, varchar, json, doublePrecision } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const transactions = pgTable("transactions", {
	id: serial().primaryKey().notNull(),
	senderId: integer("sender_id"),
	receiverId: integer("receiver_id"),
	amount: numeric({ precision: 10, scale:  2 }).notNull(),
	type: text().notNull(),
	status: text().default('COMPLETED').notNull(),
	note: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	txHash: text("tx_hash"),
	stripePaymentId: text("stripe_payment_id"),
	currency: text().default('NPT'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	description: text(),
}, (table) => [
	foreignKey({
			columns: [table.senderId],
			foreignColumns: [users.id],
			name: "transactions_sender_id_users_id_fk"
		}),
	foreignKey({
			columns: [table.receiverId],
			foreignColumns: [users.id],
			name: "transactions_receiver_id_users_id_fk"
		}),
]);

export const bankAccounts = pgTable("bank_accounts", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	finapiAccountId: text("finapi_account_id").notNull(),
	accountName: text("account_name").notNull(),
	accountNumber: text("account_number"),
	iban: text(),
	bankName: text("bank_name"),
	bankId: text("bank_id"),
	balance: numeric({ precision: 10, scale:  2 }),
	currency: text(),
	isVerified: boolean("is_verified").default(false),
	lastSynced: timestamp("last_synced", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "bank_accounts_user_id_users_id_fk"
		}),
]);

export const activities = pgTable("activities", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	action: text().notNull(),
	description: text(),
	ipAddress: text("ip_address"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	userAgent: text("user_agent"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "activities_user_id_users_id_fk"
		}),
]);

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	username: text().notNull(),
	password: text().notNull(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	email: text().notNull(),
	phoneNumber: text("phone_number"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	finapiUserId: text("finapi_user_id"),
	kycStatus: text("kyc_status").default('PENDING'),
	kycVerificationId: text("kyc_verification_id"),
	kycVerifiedAt: timestamp("kyc_verified_at", { mode: 'string' }),
	role: text().default('user').notNull(),
	walletAddress: text("wallet_address"),
	stripeCustomerId: text("stripe_customer_id"),
	stripeSubscriptionId: text("stripe_subscription_id"),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("email_idx").using("btree", table.email.asc().nullsLast().op("text_ops")),
	uniqueIndex("username_idx").using("btree", table.username.asc().nullsLast().op("text_ops")),
	unique("users_username_unique").on(table.username),
	unique("users_email_unique").on(table.email),
]);

export const session = pgTable("session", {
	sid: varchar().primaryKey().notNull(),
	sess: json().notNull(),
	expire: timestamp({ precision: 6, mode: 'string' }).notNull(),
}, (table) => [
	index("IDX_session_expire").using("btree", table.expire.asc().nullsLast().op("timestamp_ops")),
]);

export const collaterals = pgTable("collaterals", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	type: text().notNull(),
	amount: numeric({ precision: 18, scale:  8 }).notNull(),
	valueInNpt: numeric("value_in_npt", { precision: 18, scale:  2 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	status: text().default('active').notNull(),
	ltv: integer().default(75).notNull(),
	txHash: varchar("tx_hash", { length: 255 }),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "collaterals_userid_fkey"
		}),
]);

export const loans = pgTable("loans", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	amount: numeric({ precision: 18, scale:  2 }).notNull(),
	collateralId: integer("collateral_id").notNull(),
	interest: numeric({ precision: 5, scale:  2 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	dueDate: timestamp("due_date", { mode: 'string' }),
	status: text().default('ACTIVE').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	term: integer().default(30).notNull(),
	paymentsMade: integer("payments_made").default(0).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "loans_userid_fkey"
		}),
	foreignKey({
			columns: [table.collateralId],
			foreignColumns: [collaterals.id],
			name: "loans_collateralid_fkey"
		}),
]);

export const ads = pgTable("ads", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	title: text().notNull(),
	description: text().notNull(),
	budget: numeric({ precision: 18, scale:  2 }).notNull(),
	tier: text().notNull(),
	startDate: timestamp("start_date", { mode: 'string' }).defaultNow().notNull(),
	endDate: timestamp("end_date", { mode: 'string' }).notNull(),
	status: text().default('PENDING').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	impressions: integer().default(0).notNull(),
	clicks: integer().default(0).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "ads_userid_fkey"
		}),
]);

export const wallets = pgTable("wallets", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	balance: numeric({ precision: 10, scale:  2 }).default('0').notNull(),
	currency: text().default('NPR').notNull(),
	lastUpdated: timestamp("last_updated", { mode: 'string' }).defaultNow().notNull(),
	address: text(),
	nptBalance: text("npt_balance").default('0'),
	bnbBalance: text("bnb_balance").default('0'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	isPrimary: boolean("is_primary").default(false),
}, (table) => [
	uniqueIndex("wallet_address_idx").using("btree", table.address.asc().nullsLast().op("text_ops")),
	uniqueIndex("wallet_user_id_idx").using("btree", table.userId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "wallets_user_id_users_id_fk"
		}),
]);

export const tokenPurchases = pgTable("token_purchases", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	tokenAmount: doublePrecision("token_amount").notNull(),
	fiatAmount: doublePrecision("fiat_amount").notNull(),
	fiatCurrency: varchar("fiat_currency", { length: 3 }).default('USD').notNull(),
	stripePaymentIntentId: text("stripe_payment_intent_id").notNull(),
	status: text().notNull(),
	gasFee: doublePrecision("gas_fee").default(0).notNull(),
	serviceFee: doublePrecision("service_fee").default(0).notNull(),
	txHash: text("tx_hash"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "token_purchases_user_id_fkey"
		}).onDelete("cascade"),
]);

export const transactionFees = pgTable("transaction_fees", {
	id: serial().primaryKey().notNull(),
	tokenAmount: doublePrecision("token_amount").notNull(),
	fiatAmount: doublePrecision("fiat_amount").notNull(),
	gasFeeUsd: doublePrecision("gas_fee_usd").notNull(),
	serviceFeePercent: doublePrecision("service_fee_percent").default(2).notNull(),
	totalFiatAmount: doublePrecision("total_fiat_amount").notNull(),
	exchangeRate: doublePrecision("exchange_rate").notNull(),
	fiatCurrency: varchar("fiat_currency", { length: 3 }).default('USD').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});
