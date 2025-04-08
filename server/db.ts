import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

// Check if DATABASE_URL is available
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Create postgres client
const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString, {
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  max: 10, // Connection pool size
  idle_timeout: 30, // Max seconds a client can be idle before being removed
});

// Create drizzle instance
export const db = drizzle(client);

// Run migrations (uncomment this in development if needed)
// Alternatively, use the npm script: npm run db:push
async function runMigrations() {
  try {
    console.log("Running database migrations...");
    await migrate(db, { migrationsFolder: "drizzle" });
    console.log("Migrations completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

// Export migration function
export { runMigrations };