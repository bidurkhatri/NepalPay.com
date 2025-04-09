import express from "express";
import cors from "cors";
import { Server } from "http";
import path from "path";
import { setupVite } from "./vite";

// Initialize express app
const app = express();

// Setup middleware
app.use(cors());
app.use(express.json());

// Simple health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "UP" });
});

// Configure routes 
let httpServer: Server;

// Start the server
async function startServer() {
  try {
    // Create HTTP server
    httpServer = new Server(app);
    
    // Set up Vite middleware to serve frontend
    await setupVite(app, httpServer);
    
    // Listen on host 0.0.0.0 to make the server accessible from outside the container
    const PORT = process.env.PORT || 5000;
    httpServer.listen(PORT, () => {
      console.log(`Simple server is running at http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Graceful shutdown
function shutdownServer() {
  console.log("Shutting down server...");
  if (httpServer) {
    httpServer.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
    
    // Force close server after 5 seconds
    setTimeout(() => {
      console.error("Forcing server to shut down...");
      process.exit(1);
    }, 5000);
  } else {
    process.exit(0);
  }
}

// Handle process termination
process.on("SIGTERM", shutdownServer);
process.on("SIGINT", shutdownServer);

// Start the server
startServer();