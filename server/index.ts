import express from 'express';
import { createServer } from 'http';
import { initializeDatabase } from './db';
import { registerRoutes } from './routes';
import { log } from './vite';
import cors from 'cors';

// Initialize Express application
const app = express();

// Configure middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Start server function
async function startServer() {
  try {
    // Initialize database connection
    const dbConnected = await initializeDatabase();
    if (!dbConnected) {
      log('Failed to connect to database, server will start but might have limited functionality');
    }

    // Register API routes and create HTTP server
    const httpServer = registerRoutes(app);

    // Determine port from environment variable or use default
    const PORT = parseInt(process.env.PORT || '3001', 10);
    
    // Start listening for requests
    httpServer.listen(PORT, () => {
      log(`Server running on http://0.0.0.0:${PORT}`);
    });

    // Handle graceful shutdown
    const gracefulShutdown = () => {
      log('Shutting down server gracefully...');
      httpServer.close(() => {
        log('Server closed');
        process.exit(0);
      });
    };

    // Listen for termination signals
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

  } catch (error) {
    log(`Server startup error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

// Start the server
startServer();