import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../shared/schema';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import pkg from 'pg';
const { Pool } = pkg;

// Setup the database connection string from environment variables
const connectionString = process.env.DATABASE_URL!;

// Create and export the postgres connection client
export const client = postgres(connectionString, { max: 10 });

// Create a proper pg Pool for session store
export const pgPool = new Pool({
  connectionString: connectionString,
});

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

// Function to check if a column exists in a table
export async function columnExists(table: string, column: string): Promise<boolean> {
  try {
    const result = await client`
      SELECT 1
      FROM information_schema.columns
      WHERE table_name = ${table}
      AND column_name = ${column}
    `;
    return result.length > 0;
  } catch (error) {
    console.error(`Error checking if column ${column} exists in table ${table}:`, error);
    return false;
  }
}

// Function to check the schema and update our handling functions accordingly
export async function getSchemaDetails() {
  try {
    // Check activities table columns
    const activityTypeExists = await columnExists('activities', 'type');
    const activityDetailsExists = await columnExists('activities', 'details');
    const activityActionExists = await columnExists('activities', 'action');
    const activityDescriptionExists = await columnExists('activities', 'description');
    
    // Check loans table columns
    const loanInterestRateExists = await columnExists('loans', 'interest_rate');
    const loanInterestExists = await columnExists('loans', 'interest');
    
    // Check ads table columns
    const adIsActiveExists = await columnExists('ads', 'is_active');
    const adStatusExists = await columnExists('ads', 'status');
    
    // Check collaterals table columns
    const collateralIsLockedExists = await columnExists('collaterals', 'is_locked');
    const collateralStatusExists = await columnExists('collaterals', 'status');
    
    return {
      activities: {
        useNewNames: activityTypeExists && activityDetailsExists,
        useOldNames: activityActionExists && activityDescriptionExists,
      },
      loans: {
        useNewNames: loanInterestRateExists,
        useOldNames: loanInterestExists,
      },
      ads: {
        useNewNames: adIsActiveExists,
        useOldNames: adStatusExists,
      },
      collaterals: {
        useNewNames: collateralIsLockedExists,
        useOldNames: collateralStatusExists,
      }
    };
  } catch (error) {
    console.error('Error checking schema details:', error);
    return {
      activities: { useNewNames: false, useOldNames: true },
      loans: { useNewNames: false, useOldNames: true },
      ads: { useNewNames: false, useOldNames: true },
      collaterals: { useNewNames: false, useOldNames: true }
    };
  }
}