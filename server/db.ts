import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { users, wallets, transactions, activities, collaterals, loans, ads } from '@shared/schema';

// Get the connection string from environment variables
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('DATABASE_URL environment variable not set. Please set it to connect to the database.');
}

// Create a PostgreSQL connection pool
export const pool = new pg.Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
});

// Handle pool errors
pool.on('error', (err: Error) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Create a drizzle database instance
export const db = drizzle(pool, {
  schema: {
    users,
    wallets,
    transactions,
    activities,
    collaterals,
    loans,
    ads
  }
});

/**
 * Initialize the database (connect and migrate)
 */
export async function initializeDatabase(): Promise<boolean> {
  try {
    // Test the connection
    const connected = await testConnection();
    if (!connected) {
      console.error('Failed to connect to database');
      return false;
    }
    
    console.log('Successfully connected to the database');
    
    // Run migrations to create tables if they don't exist
    await createTables();
    
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    return false;
  }
}

/**
 * Test the database connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    client.release();
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

/**
 * Create the database tables using drizzle schema
 */
export async function createTables(): Promise<void> {
  try {
    // Currently using auto-migration which creates tables if they don't exist
    // In a production environment, you would use a proper migration system
    
    // Check if the 'users' table exists
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'users'
      );
    `);
    
    const tableExists = result.rows[0].exists;
    
    if (!tableExists) {
      console.log('Tables do not exist, creating them now');
      await migrate(db, { migrationsFolder: './drizzle' });
      console.log('Tables created successfully');
    } else {
      console.log('Tables already exist, skipping creation');
    }
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
}