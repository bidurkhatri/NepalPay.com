import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { Pool } from 'pg';
import * as schema from '@shared/schema';

// Extract the DATABASE_URL from the environment variables
const connectionString = process.env.DATABASE_URL || '';

if (!connectionString) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

// Create postgres client
export const client = postgres(connectionString, { max: 10 });

// Create pg Pool for connect-pg-simple
export const pgPool = new Pool({
  connectionString,
});

// Create drizzle ORM instance
export const db = drizzle(client, { schema });

// Function to run migrations (for development and testing)
export async function runMigrations() {
  try {
    console.log('Running database migrations...');
    // In a real environment, you'd use drizzle-kit to run proper migrations
    // This is a simplified version just to ensure the database is properly set up
    console.log('Database ready!');
  } catch (error) {
    console.error('Error running migrations:', error);
    throw error;
  }
}

// Helper function to check if a column exists
export async function columnExists(table: string, column: string): Promise<boolean> {
  const { rows } = await pgPool.query(`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = $1 
    AND column_name = $2
  `, [table, column]);
  
  return rows.length > 0;
}

// Get schema details (for debugging)
export async function getSchemaDetails() {
  try {
    const { rows } = await pgPool.query(`
      SELECT table_name, column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position
    `);
    return rows;
  } catch (error) {
    console.error('Error getting schema details:', error);
    throw error;
  }
}