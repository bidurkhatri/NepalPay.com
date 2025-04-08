import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../shared/schema';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

// Setup the database connection string from environment variables
const connectionString = process.env.DATABASE_URL!;

// Create and export the postgres connection client
export const client = postgres(connectionString, { max: 10 });

// Create and export the drizzle ORM instance
export const db = drizzle(client, { schema });

// Function to run migrations
export async function runMigrations() {
  try {
    console.log('Running database migrations...');
    // In development, we'll skip migrations for now
    if (process.env.NODE_ENV === 'production') {
      await migrate(db, { migrationsFolder: './drizzle' });
      console.log('Migrations completed successfully');
    } else {
      console.log('Skipping migrations in development mode');
    }
  } catch (error) {
    console.error('Migration failed:', error);
    console.log('Continuing without migrations...');
  }
}