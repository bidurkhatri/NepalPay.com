import express from "express";
import cors from "cors";
import { registerRoutes } from "./routes";
import { initializeDatabase } from "./db";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Set up middleware
app.use(cors());
app.use(express.json());

// API routes will be registered by the registerRoutes function
const httpServer = registerRoutes(app);

// Initialize database and start server
const PORT = process.env.PORT || 3001;

async function start() {
  try {
    // Initialize database
    const dbInitialized = await initializeDatabase();

    if (!dbInitialized) {
      console.error("Failed to initialize database. Exiting...");
      process.exit(1);
    }

    // Start server
    httpServer.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

// Start the server
start();