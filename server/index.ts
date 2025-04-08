import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { Server } from "http";
import { setupAuth, isAuthenticated, isAdmin, isSuperAdmin } from "./auth";
import { registerRoutes } from "./routes";
import bodyParser from "body-parser";

// Load environment variables
config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setup authentication
setupAuth(app);

// Initialize server variable
let httpServer: Server;

// Start server function
async function startServer() {
  try {
    // Register API routes
    httpServer = registerRoutes(app);

    // Start server on port 3000 or environment variable PORT
    const PORT = parseInt(process.env.PORT || "3000");
    httpServer.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });

    // Handle shutdown gracefully
    process.on("SIGTERM", shutdownServer);
    process.on("SIGINT", shutdownServer);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Shutdown server function
function shutdownServer() {
  console.log("Shutting down server...");
  if (httpServer) {
    httpServer.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

// Start the server
startServer();

// Export for testing
export { app, isAuthenticated, isAdmin, isSuperAdmin };