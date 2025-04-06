import { drizzle } from 'drizzle-orm/node-postgres';
import { users, wallets, transactions, activities } from '../shared/schema';
import { eq, and, or } from 'drizzle-orm';
import pg from 'pg';

// Initialize the pool directly for better type safety
export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// Set up error handler for pool
pool.on('error', (err: Error) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Initialize Drizzle ORM
export const db = drizzle(pool);

// Initialize database connection asynchronously
export async function initializeDatabase() {
  try {
    // Verify the connection works
    const client = await pool.connect();
    client.release();
    
    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    return false;
  }
}

// Function to test the database connection
export async function testConnection() {
  try {
    if (!pool) {
      await initializeDatabase();
    }
    
    const client = await pool.connect();
    console.log('Database connection successful');
    client.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Function to create all required tables
export async function createTables() {
  try {
    if (!pool) {
      await initializeDatabase();
    }
    
    // Create the users table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        "firstName" VARCHAR(255) NOT NULL,
        "lastName" VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        "phoneNumber" VARCHAR(255),
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'USER',
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create the wallets table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS wallets (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER NOT NULL REFERENCES users(id),
        balance DECIMAL(12, 2) NOT NULL DEFAULT 0,
        currency VARCHAR(10) NOT NULL DEFAULT 'NPR',
        "lastUpdated" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE("userId")
      );
    `);

    // Create the transactions table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        "senderId" INTEGER REFERENCES users(id),
        "receiverId" INTEGER REFERENCES users(id),
        amount DECIMAL(12, 2) NOT NULL,
        type VARCHAR(20) NOT NULL,
        status VARCHAR(20) NOT NULL,
        note TEXT,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create the activities table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS activities (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER NOT NULL REFERENCES users(id),
        action VARCHAR(50) NOT NULL,
        details TEXT,
        "ipAddress" VARCHAR(50),
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Database tables created successfully');
    return true;
  } catch (error) {
    console.error('Error creating database tables:', error);
    return false;
  }
}