import express from 'express';
import { createServer } from 'http';
import { initializeDatabase, testConnection } from './db';
import { registerRoutes } from './routes';
import { log, setupVite } from './vite';
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
    // Register API routes and create HTTP server first
    const httpServer = registerRoutes(app);

    // Determine port from environment variable or use default (must be 5000 for Replit workflow)
    const PORT = parseInt(process.env.PORT || '5000', 10);
    
    // Set up Vite for serving client application
    await setupVite(app, httpServer);
    
    // Start listening for requests immediately
    httpServer.listen(PORT, () => {
      log(`Server running on http://0.0.0.0:${PORT}`);
    });

    // Initialize database connection in the background
    // This will not block server startup
    testConnection()
      .then(connected => {
        if (connected) {
          log('Database connected successfully');
          // Initialize database tables in the background
          initializeDatabase()
            .then(dbInitialized => {
              if (dbInitialized) {
                log('Database tables verified/created');
              } else {
                log('Database tables initialization skipped or failed');
              }
            })
            .catch(err => {
              log(`Database tables initialization error: ${err instanceof Error ? err.message : String(err)}`);
            });
        } else {
          log('Failed to connect to database, server will operate with limited functionality');
        }
      })
      .catch(err => {
        log(`Database connection error: ${err instanceof Error ? err.message : String(err)}`);
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