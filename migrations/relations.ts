import { relations } from "drizzle-orm/relations";
import { users, transactions, bankAccounts, activities, collaterals, loans, ads, wallets, tokenPurchases } from "./schema";

export const transactionsRelations = relations(transactions, ({one}) => ({
	user_senderId: one(users, {
		fields: [transactions.senderId],
		references: [users.id],
		relationName: "transactions_senderId_users_id"
	}),
	user_receiverId: one(users, {
		fields: [transactions.receiverId],
		references: [users.id],
		relationName: "transactions_receiverId_users_id"
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	transactions_senderId: many(transactions, {
		relationName: "transactions_senderId_users_id"
	}),
	transactions_receiverId: many(transactions, {
		relationName: "transactions_receiverId_users_id"
	}),
	bankAccounts: many(bankAccounts),
	activities: many(activities),
	collaterals: many(collaterals),
	loans: many(loans),
	ads: many(ads),
	wallets: many(wallets),
	tokenPurchases: many(tokenPurchases),
}));

export const bankAccountsRelations = relations(bankAccounts, ({one}) => ({
	user: one(users, {
		fields: [bankAccounts.userId],
		references: [users.id]
	}),
}));

export const activitiesRelations = relations(activities, ({one}) => ({
	user: one(users, {
		fields: [activities.userId],
		references: [users.id]
	}),
}));

export const collateralsRelations = relations(collaterals, ({one, many}) => ({
	user: one(users, {
		fields: [collaterals.userId],
		references: [users.id]
	}),
	loans: many(loans),
}));

export const loansRelations = relations(loans, ({one}) => ({
	user: one(users, {
		fields: [loans.userId],
		references: [users.id]
	}),
	collateral: one(collaterals, {
		fields: [loans.collateralId],
		references: [collaterals.id]
	}),
}));

export const adsRelations = relations(ads, ({one}) => ({
	user: one(users, {
		fields: [ads.userId],
		references: [users.id]
	}),
}));

export const walletsRelations = relations(wallets, ({one}) => ({
	user: one(users, {
		fields: [wallets.userId],
		references: [users.id]
	}),
}));

export const tokenPurchasesRelations = relations(tokenPurchases, ({one}) => ({
	user: one(users, {
		fields: [tokenPurchases.userId],
		references: [users.id]
	}),
}));