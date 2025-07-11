import express from 'express';
import { createServer } from 'http';
import { initializeDatabase, testConnection } from './db';
import { registerRoutes } from './routes';
import { log, setupVite } from './vite';
import cors from 'cors';
import { blockchainListener } from './services/blockchain-listener';
import { retryQueue } from './services/retry-queue';
import { blockchainService } from './services/blockchain';
import { loadEnvironmentConfig, validateEnvironmentConfigWithGracefulHandling } from './utils/env-config';

// Initialize Express application
const app = express();

// Configure middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Start server function
async function startServer() {
  try {
    // Validate environment configuration early but gracefully
    try {
      const config = loadEnvironmentConfig(false); // This will perform validation
      log('Environment configuration validated successfully');
    } catch (error) {
      log(`Environment validation warning: ${error instanceof Error ? error.message : String(error)}`);
      log('Continuing with available configuration - some features may be disabled');
    }

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

    // Initialize database connection with better error handling
    try {
      const connected = await testConnection();
      if (connected) {
        log('Database connected successfully');
        
        // Try to initialize database tables
        try {
          const dbInitialized = await initializeDatabase();
          if (dbInitialized) {
            log('Database tables verified/created');
            
            // Initialize blockchain services after database is ready
            try {
              // Validate blockchain configuration
              const configValidation = blockchainService.validateConfiguration();
              if (configValidation.valid) {
                log('Blockchain configuration valid');
                
                // Start blockchain event listener
                await blockchainListener.startListening();
                log('Blockchain event listener started');
                
                // Retry queue is automatically started in constructor
                log('Retry queue service initialized');
                
              } else {
                log('Blockchain configuration invalid:');
                configValidation.errors.forEach(error => log(`  - ${error}`));
                log('Blockchain services disabled - wallet operations will work in offline mode');
              }
              
            } catch (blockchainErr) {
              log(`Blockchain services initialization failed: ${blockchainErr instanceof Error ? blockchainErr.message : String(blockchainErr)}`);
              log('Continuing without blockchain services - wallet operations will work in offline mode');
            }
            
          } else {
            log('Database tables initialization skipped or failed');
          }
        } catch (err) {
          log(`Error checking/creating tables: ${err instanceof Error ? err.message : String(err)}`);
        }
      } else {
        log('Failed to connect to database, server will operate with limited functionality');
      }
    } catch (err) {
      log(`Database connection error: ${err instanceof Error ? err.message : String(err)}`);
    }

    // Graceful shutdown handling
    process.on('SIGINT', async () => {
      log('Received SIGINT, shutting down gracefully...');
      
      try {
        // Stop blockchain services
        blockchainListener.stopListening();
        retryQueue.stopProcessing();
        log('Blockchain services stopped');
        
        // Close HTTP server
        httpServer.close(() => {
          log('HTTP server closed');
          process.exit(0);
        });
        
        // Force exit after 10 seconds
        setTimeout(() => {
          log('Force exiting...');
          process.exit(1);
        }, 10000);
        
      } catch (shutdownErr) {
        log(`Error during shutdown: ${shutdownErr instanceof Error ? shutdownErr.message : String(shutdownErr)}`);
        process.exit(1);
      }
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