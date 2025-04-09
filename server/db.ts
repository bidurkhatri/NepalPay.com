import postgres from 'postgres';
import pg from 'pg';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import * as schema from '@shared/schema';
import { log } from './vite';

// Get database connection string from environment variables
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/nepalipay';

// Create postgres client for drizzle ORM
export const client = postgres(connectionString, {
  max: 10, // Maximum connection pool size
  idle_timeout: 20, // Idle connection timeout in seconds
  connect_timeout: 10, // Connection timeout in seconds
  prepare: false,
});

// Create pg Pool for session store and other direct queries
export const pool = new pg.Pool({
  connectionString,
  max: 10, // Maximum connection pool size
  idleTimeoutMillis: 20000, // Idle connection timeout in milliseconds
  connectionTimeoutMillis: 10000, // Connection timeout in milliseconds
});

// Create drizzle ORM instance
export const db = drizzle(client, { schema });

/**
 * Initialize the database (connect and migrate)
 */
export async function initializeDatabase(): Promise<boolean> {
  try {
    // Test the connection
    const connected = await testConnection();
    if (!connected) {
      return false;
    }

    try {
      // Create database tables if they don't exist
      await createTables();
      log('Database tables verified/created');
    } catch (err) {
      log(`Error creating tables: ${err instanceof Error ? err.message : String(err)}`);
      // Don't fail the whole initialization if table creation fails
      // Some functionality may still work
    }

    return true;
  } catch (error) {
    log(`Database initialization error: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

/**
 * Test the database connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    // Perform a simple query to test connection
    const result = await client`SELECT 1 as connected`;
    log('Database connection successful');
    return result && result[0]?.connected === 1;
  } catch (error) {
    log(`Database connection error: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

/**
 * Create the database tables using drizzle schema
 */
export async function createTables(): Promise<void> {
  try {
    // Simple query to create all tables based on the schema
    const query = `
      -- Users table
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(255),
        phone VARCHAR(50),
        role VARCHAR(20) NOT NULL DEFAULT 'user',
        kyc_status VARCHAR(20) NOT NULL DEFAULT 'not_submitted',
        kyc_verification_id VARCHAR(255),
        kyc_verified_at TIMESTAMP,
        two_factor_enabled BOOLEAN NOT NULL DEFAULT false,
        two_factor_secret VARCHAR(255),
        last_login_at TIMESTAMP,
        referral_code VARCHAR(100),
        referred_by INTEGER REFERENCES users(id),
        preferred_language VARCHAR(10) NOT NULL DEFAULT 'en',
        preferences JSONB NOT NULL DEFAULT '{}',
        stripe_customer_id VARCHAR(255),
        stripe_subscription_id VARCHAR(255),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- Wallets table
      CREATE TABLE IF NOT EXISTS wallets (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        npt_balance VARCHAR(255) NOT NULL DEFAULT '0',
        bnb_balance VARCHAR(255) NOT NULL DEFAULT '0',
        eth_balance VARCHAR(255) NOT NULL DEFAULT '0',
        btc_balance VARCHAR(255) NOT NULL DEFAULT '0',
        wallet_type VARCHAR(20) NOT NULL DEFAULT 'custodial',
        npt_address VARCHAR(255),
        bnb_address VARCHAR(255),
        eth_address VARCHAR(255),
        btc_address VARCHAR(255),
        private_key_encrypted VARCHAR(512),
        encryption_iv VARCHAR(255),
        last_synced_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        UNIQUE(user_id)
      );

      -- Loans table (creating this first due to references)
      CREATE TABLE IF NOT EXISTS loans (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        amount VARCHAR(255) NOT NULL,
        interest_rate VARCHAR(10) NOT NULL,
        term_days INTEGER NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        start_date TIMESTAMP,
        end_date TIMESTAMP,
        repayment_date TIMESTAMP,
        late_fee VARCHAR(255),
        collateral_required BOOLEAN NOT NULL DEFAULT true,
        approved_by INTEGER REFERENCES users(id),
        rejection_reason TEXT,
        metadata JSONB NOT NULL DEFAULT '{}',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
      
      -- Collaterals table (creating second due to references)
      CREATE TABLE IF NOT EXISTS collaterals (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        loan_id INTEGER REFERENCES loans(id),
        collateral_type VARCHAR(10) NOT NULL,
        amount VARCHAR(255) NOT NULL,
        value_in_npt VARCHAR(255) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'active',
        lock_timestamp TIMESTAMP,
        release_timestamp TIMESTAMP,
        liquidation_timestamp TIMESTAMP,
        value_to_loan_ratio VARCHAR(10) NOT NULL,
        liquidation_threshold VARCHAR(10),
        metadata JSONB NOT NULL DEFAULT '{}',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- Transactions table (creating third due to references)
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        sender_id INTEGER REFERENCES users(id),
        recipient_id INTEGER REFERENCES users(id),
        wallet_id INTEGER REFERENCES wallets(id),
        amount VARCHAR(255) NOT NULL,
        currency VARCHAR(10) NOT NULL,
        fee VARCHAR(255) NOT NULL DEFAULT '0',
        transaction_type VARCHAR(50) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        tx_hash VARCHAR(255),
        block_number VARCHAR(100),
        network_fee VARCHAR(255),
        exchange_rate VARCHAR(255),
        exchange_amount VARCHAR(255),
        exchange_currency VARCHAR(10),
        description TEXT,
        metadata JSONB NOT NULL DEFAULT '{}',
        loan_id INTEGER REFERENCES loans(id),
        collateral_id INTEGER REFERENCES collaterals(id),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- Activities table
      CREATE TABLE IF NOT EXISTS activities (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        activity_type VARCHAR(50) NOT NULL,
        description TEXT NOT NULL,
        ip_address VARCHAR(50),
        user_agent TEXT,
        metadata JSONB NOT NULL DEFAULT '{}',
        transaction_id INTEGER REFERENCES transactions(id),
        loan_id INTEGER REFERENCES loans(id),
        collateral_id INTEGER REFERENCES collaterals(id),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- Ads table
      CREATE TABLE IF NOT EXISTS ads (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT,
        target_url TEXT NOT NULL,
        target_audience JSONB NOT NULL DEFAULT '{}',
        budget VARCHAR(255) NOT NULL,
        impressions INTEGER NOT NULL DEFAULT 0,
        clicks INTEGER NOT NULL DEFAULT 0,
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        approved_by INTEGER REFERENCES users(id),
        approved_at TIMESTAMP,
        rejection_reason TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;

    // Use the pg Pool directly for this operation 
    // since we need to execute a raw SQL string
    await pool.query(query);
    log('Tables created successfully');
  } catch (error) {
    log(`Error creating tables: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}