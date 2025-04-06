import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { registerRoutes } from './routes';
import { initializeDatabase } from './db';
import { storage } from './storage';
import bodyParser from 'body-parser';
import { setupVite } from './vite';

/**
 * Main server initialization and startup
 */
async function main() {
  // Create express application
  const app: Express = express();
  
  // Set up middleware
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  
  // Initialize database
  try {
    const dbInitialized = await initializeDatabase();
    if (!dbInitialized) {
      console.error('Failed to initialize database');
      process.exit(1);
    }
    
    // Initialize demo data
    await storage.initializeDemoData();
  } catch (error) {
    console.error('Database initialization error:', error);
    process.exit(1);
  }
  
  // Register routes
  const server = await registerRoutes(app);
  
  // Set up Vite dev server
  await setupVite(app, server);
  
  // Global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled error:', err);
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({ error: message });
  });
  
  // Start server
  const PORT = process.env.PORT || 5000;
  server.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
  
  // Handle shutdown
  const shutdown = () => {
    console.log('Gracefully shutting down...');
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  };
  
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

// Start the server
main().catch(err => {
  console.error('Server failed to start:', err);
  process.exit(1);
});