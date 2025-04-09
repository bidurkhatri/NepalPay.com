import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import { Server } from 'http';
import { registerRoutes } from './routes';
import { runMigrations } from './db';

// Initialize Express app
const app = express();

// Apply middleware
app.use(cors());
app.use(json({ limit: '10mb' }));

// Server variables
let httpServer: Server;

// Start server function
async function startServer() {
  try {
    // Run database migrations
    await runMigrations();

    // Register application routes and get server instance
    httpServer = registerRoutes(app);

    // Start listening
    const PORT = process.env.PORT || 5000;
    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
function shutdownServer() {
  console.log('Shutting down server...');
  
  if (httpServer) {
    httpServer.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

// Handle shutdown signals
process.on('SIGINT', shutdownServer);
process.on('SIGTERM', shutdownServer);

// Start the server
startServer();