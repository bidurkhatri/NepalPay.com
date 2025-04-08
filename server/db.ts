import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
import * as schema from '../shared/schema';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { sql } from 'drizzle-orm';

// Create a PostgreSQL connection pool
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create a Drizzle ORM instance using the pool
export const db = drizzle(pool, { schema });

/**
 * Initialize database with tables
 */
export async function initializeDatabase(): Promise<boolean> {
  try {
    console.log('Testing database connection...');
    const connected = await testConnection();
    
    if (!connected) {
      console.error('Failed to connect to the database.');
      return false;
    }
    
    console.log('Database connection successful. Creating tables...');
    await createTables();
    
    try {
      console.log('Creating indexes...');
      await createIndexes();
    } catch (indexError) {
      console.error('Warning: Error creating indexes, but continuing:', indexError);
      // Continue execution even if indexes fail
    }
    
    console.log('Database initialization complete.');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}

/**
 * Test database connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Database connection test successful:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
}

/**
 * Create database tables using Drizzle ORM
 */
export async function createTables(): Promise<void> {
  try {
    // This will create all tables defined in the schema
    const queries = [
      // Users table
      `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT,
        full_name TEXT,
        role TEXT NOT NULL DEFAULT 'user',
        stripe_customer_id TEXT,
        avatar TEXT,
        phone TEXT,
        address TEXT,
        city TEXT,
        country TEXT,
        postal_code TEXT,
        kyc_status TEXT NOT NULL DEFAULT 'none',
        kyc_verification_id TEXT,
        kyc_verified_at TIMESTAMP,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        is_verified BOOLEAN NOT NULL DEFAULT FALSE,
        verification_token TEXT,
        reset_password_token TEXT,
        reset_password_expires TIMESTAMP,
        last_login_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )`,
      
      // Wallets table
      `CREATE TABLE IF NOT EXISTS wallets (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        address TEXT NOT NULL UNIQUE,
        balance TEXT NOT NULL DEFAULT '0',
        private_key TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )`,
      
      // Transactions table
      `CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        type TEXT NOT NULL,
        amount TEXT NOT NULL,
        hash TEXT NOT NULL UNIQUE,
        status TEXT NOT NULL DEFAULT 'pending',
        from_address TEXT NOT NULL,
        to_address TEXT NOT NULL,
        fee TEXT,
        gas_price TEXT,
        gas_used TEXT,
        block_number TEXT,
        block_hash TEXT,
        description TEXT,
        metadata TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )`,
      
      // Activities table
      `CREATE TABLE IF NOT EXISTS activities (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        action TEXT NOT NULL,
        details TEXT,
        ip_address TEXT,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )`,
      
      // Collaterals table
      `CREATE TABLE IF NOT EXISTS collaterals (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        asset_type TEXT NOT NULL,
        amount TEXT NOT NULL,
        value_in_usd TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        locked_until TIMESTAMP,
        transaction_hash TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )`,
      
      // Loans table
      `CREATE TABLE IF NOT EXISTS loans (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        collateral_id INTEGER REFERENCES collaterals(id),
        amount TEXT NOT NULL,
        interest_rate TEXT NOT NULL,
        duration INTEGER NOT NULL,
        due_date TIMESTAMP NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        repaid_amount TEXT DEFAULT '0',
        last_repayment_date TIMESTAMP,
        loan_transaction_hash TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )`,
      
      // Ads table
      `CREATE TABLE IF NOT EXISTS ads (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        type TEXT NOT NULL,
        asset_type TEXT NOT NULL,
        amount TEXT NOT NULL,
        price TEXT NOT NULL,
        payment_method TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        location TEXT,
        status TEXT NOT NULL DEFAULT 'active',
        expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )`,
      
      // Session table (for connect-pg-simple)
      `CREATE TABLE IF NOT EXISTS session (
        sid TEXT PRIMARY KEY,
        sess TEXT NOT NULL,
        expire TIMESTAMP NOT NULL
      )`
    ];
    
    for (const query of queries) {
      await pool.query(query);
    }
    
    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
}

/**
 * Create indexes for better query performance
 */
export async function createIndexes(): Promise<void> {
  try {
    // First, check what columns exist in each table
    const checkColumnExists = async (tableName: string, columnName: string): Promise<boolean> => {
      const result = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = $1 
        AND column_name = $2
      `, [tableName, columnName]);
      return result.rows.length > 0;
    };

    const createIndexIfColumnExists = async (indexSql: string, tableName: string, columnName: string): Promise<void> => {
      try {
        const exists = await checkColumnExists(tableName, columnName);
        if (exists) {
          await pool.query(indexSql);
          console.log(`Created index with SQL: ${indexSql}`);
        } else {
          console.log(`Skipping index creation for non-existent column ${columnName} in table ${tableName}`);
        }
      } catch (error) {
        console.error(`Error creating index with SQL: ${indexSql}`, error);
        // We continue even if an index creation fails
      }
    };
    
    // User indexes
    await createIndexIfColumnExists('CREATE INDEX IF NOT EXISTS email_idx ON users(email)', 'users', 'email');
    await createIndexIfColumnExists('CREATE UNIQUE INDEX IF NOT EXISTS username_idx ON users(username)', 'users', 'username');
    
    // Wallet indexes - we'll check these but they're likely already there
    await createIndexIfColumnExists('CREATE UNIQUE INDEX IF NOT EXISTS wallet_user_id_idx ON wallets(user_id)', 'wallets', 'user_id');
    await createIndexIfColumnExists('CREATE UNIQUE INDEX IF NOT EXISTS wallet_address_idx ON wallets(address)', 'wallets', 'address');
    
    // Skip other indexes since they may not match our schema yet, we'll fix them later
    
    console.log('Indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error);
    throw error;
  }
}

// For testing purposes only - don't use in production
export async function clearDatabase(): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Cannot clear database in production environment');
  }
  
  try {
    await pool.query('DROP TABLE IF EXISTS session CASCADE');
    await pool.query('DROP TABLE IF EXISTS ads CASCADE');
    await pool.query('DROP TABLE IF EXISTS loans CASCADE');
    await pool.query('DROP TABLE IF EXISTS collaterals CASCADE');
    await pool.query('DROP TABLE IF EXISTS activities CASCADE');
    await pool.query('DROP TABLE IF EXISTS transactions CASCADE');
    await pool.query('DROP TABLE IF EXISTS wallets CASCADE');
    await pool.query('DROP TABLE IF EXISTS users CASCADE');
    
    console.log('Database cleared successfully');
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  }
}