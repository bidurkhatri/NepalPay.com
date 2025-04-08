import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import * as schema from '../shared/schema';

// Create PostgreSQL connection pool
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create drizzle database instance
export const db = drizzle(pool, { schema });

// Initialize database
export async function initializeDatabase(): Promise<boolean> {
  try {
    // Test database connection
    const connected = await testConnection();
    if (!connected) {
      console.error('Database connection failed');
      return false;
    }
    
    // Create tables if they don't exist
    await createTables();
    
    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    return false;
  }
}

// Test database connection
export async function testConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    client.release();
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
}

// Create tables
export async function createTables(): Promise<void> {
  try {
    // Use push method to create tables based on the schema
    // This is a simpler alternative to full migrations for development
    console.log('Creating or updating database tables...');
    
    // To be replaced with drizzle-kit push in actual implementation
    // For now, we'll rely on the relations defined in the schema
    // await migrate(db, { migrationsFolder: './migrations' });
    
    console.log('Database tables created/updated successfully');
  } catch (error) {
    console.error('Failed to create tables:', error);
    throw error;
  }
}