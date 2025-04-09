import express from "express";
import cors from "cors";
import { Server } from "http";
import path from "path";

// Initialize express app
const app = express();

// Setup middleware
app.use(cors());
app.use(express.json());

// Set up API routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "UP" });
});

// Start the server
async function startServer() {
  try {
    // Create HTTP server
    const httpServer = new Server(app);
    
    // Listen on host 0.0.0.0 to make the server accessible from outside
    const PORT = process.env.PORT || 5000;
    httpServer.listen(PORT, () => {
      console.log(`Simple server running at http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Start the server
startServer();