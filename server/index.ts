import express from "express";
import cors from "cors";
import { json } from "express";
import { registerRoutes } from "./routes";
import { initializeDatabase } from "./db";
import path from "path";
import { setupVite, serveStatic } from "./vite";
import { setupAuth } from "./auth";

async function startServer() {
  // Create Express application
  const app = express();
  
  // Configure middleware
  app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
      ? 'https://nepalipay.com' 
      : ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true
  }));
  app.use(json());
  
  // Set up authentication
  setupAuth(app);
  
  // Initialize database
  try {
    console.log("Initializing database...");
    const dbInitialized = await initializeDatabase();
    
    if (!dbInitialized) {
      console.error("Failed to initialize database. Exiting...");
      process.exit(1);
    }
    
    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
  
  // Register API routes
  const server = await registerRoutes(app);

  // Set up Vite for development or serve static files for production
  if (process.env.NODE_ENV === 'production') {
    serveStatic(app);
  } else {
    await setupVite(app, server);
  }
  
  // Determine port
  const PORT = process.env.PORT || 3000;
  
  // Start server
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
  });
  
  // Handle shutdown gracefully
  process.on("SIGINT", () => {
    console.log("Shutting down server...");
    server.close(() => {
      console.log("Server shut down successfully");
      process.exit(0);
    });
  });
}

// Start the server
startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});