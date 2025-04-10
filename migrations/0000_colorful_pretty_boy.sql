-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"sender_id" integer,
	"receiver_id" integer,
	"amount" numeric(10, 2) NOT NULL,
	"type" text NOT NULL,
	"status" text DEFAULT 'COMPLETED' NOT NULL,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"tx_hash" text,
	"stripe_payment_id" text,
	"currency" text DEFAULT 'NPT',
	"updated_at" timestamp DEFAULT now(),
	"description" text
);
--> statement-breakpoint
CREATE TABLE "bank_accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"finapi_account_id" text NOT NULL,
	"account_name" text NOT NULL,
	"account_number" text,
	"iban" text,
	"bank_name" text,
	"bank_id" text,
	"balance" numeric(10, 2),
	"currency" text,
	"is_verified" boolean DEFAULT false,
	"last_synced" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"action" text NOT NULL,
	"description" text,
	"ip_address" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"user_agent" text
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"phone_number" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"finapi_user_id" text,
	"kyc_status" text DEFAULT 'PENDING',
	"kyc_verification_id" text,
	"kyc_verified_at" timestamp,
	"role" text DEFAULT 'user' NOT NULL,
	"wallet_address" text,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "collaterals" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"type" text NOT NULL,
	"amount" numeric(18, 8) NOT NULL,
	"value_in_npt" numeric(18, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"ltv" integer DEFAULT 75 NOT NULL,
	"tx_hash" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "loans" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"amount" numeric(18, 2) NOT NULL,
	"collateral_id" integer NOT NULL,
	"interest" numeric(5, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"due_date" timestamp,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"term" integer DEFAULT 30 NOT NULL,
	"payments_made" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ads" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"budget" numeric(18, 2) NOT NULL,
	"tier" text NOT NULL,
	"start_date" timestamp DEFAULT now() NOT NULL,
	"end_date" timestamp NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"impressions" integer DEFAULT 0 NOT NULL,
	"clicks" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wallets" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"balance" numeric(10, 2) DEFAULT '0' NOT NULL,
	"currency" text DEFAULT 'NPR' NOT NULL,
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"address" text,
	"npt_balance" text DEFAULT '0',
	"bnb_balance" text DEFAULT '0',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"is_primary" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "token_purchases" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"token_amount" double precision NOT NULL,
	"fiat_amount" double precision NOT NULL,
	"fiat_currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"stripe_payment_intent_id" text NOT NULL,
	"status" text NOT NULL,
	"gas_fee" double precision DEFAULT 0 NOT NULL,
	"service_fee" double precision DEFAULT 0 NOT NULL,
	"tx_hash" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transaction_fees" (
	"id" serial PRIMARY KEY NOT NULL,
	"token_amount" double precision NOT NULL,
	"fiat_amount" double precision NOT NULL,
	"gas_fee_usd" double precision NOT NULL,
	"service_fee_percent" double precision DEFAULT 2 NOT NULL,
	"total_fiat_amount" double precision NOT NULL,
	"exchange_rate" double precision NOT NULL,
	"fiat_currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_receiver_id_users_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collaterals" ADD CONSTRAINT "collaterals_userid_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loans" ADD CONSTRAINT "loans_userid_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loans" ADD CONSTRAINT "loans_collateralid_fkey" FOREIGN KEY ("collateral_id") REFERENCES "public"."collaterals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ads" ADD CONSTRAINT "ads_userid_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "token_purchases" ADD CONSTRAINT "token_purchases_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "email_idx" ON "users" USING btree ("email" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "username_idx" ON "users" USING btree ("username" text_ops);--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "session" USING btree ("expire" timestamp_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "wallet_address_idx" ON "wallets" USING btree ("address" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "wallet_user_id_idx" ON "wallets" USING btree ("user_id" int4_ops);
*/