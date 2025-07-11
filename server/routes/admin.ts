import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { blockchainService } from '../services/blockchain';
import { blockchainListener } from '../services/blockchain-listener';
import { retryQueue } from '../services/retry-queue';
import { storage } from '../pg-storage';

const router = Router();

/**
 * Admin route to get system status
 */
router.get('/status', requireAuth, requireRole(['admin', 'superadmin']), async (req, res) => {
  try {
    // Get blockchain status
    const networkStatus = await blockchainService.getNetworkStatus();
    const configValidation = blockchainService.validateConfiguration();
    
    // Get listener status
    const listenerStatus = blockchainListener.getStatus();
    
    // Get retry queue stats
    const queueStats = retryQueue.getStats();
    
    // Get database stats
    const totalUsers = (await storage.getAllUsers()).length;
    const totalWallets = (await storage.getAllWallets()).length;
    
    res.json({
      blockchain: {
        network: networkStatus,
        configuration: configValidation,
        listener: listenerStatus
      },
      retryQueue: queueStats,
      database: {
        totalUsers,
        totalWallets,
        connected: true
      },
      system: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        environment: process.env.NODE_ENV || 'development'
      }
    });

  } catch (error) {
    console.error('Error getting admin status:', error);
    res.status(500).json({
      error: 'Failed to get system status',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Admin route to manually trigger blockchain operations
 */
router.post('/blockchain/register-user', requireAuth, requireRole(['admin', 'superadmin']), async (req, res) => {
  try {
    const { userId, walletAddress } = req.body;

    if (!userId || !walletAddress) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['userId', 'walletAddress']
      });
    }

    // Register user on blockchain
    const txHash = await blockchainService.registerUser(userId, walletAddress);
    
    if (txHash) {
      res.json({
        success: true,
        message: 'User registered on blockchain',
        transactionHash: txHash
      });
    } else {
      res.status(500).json({
        error: 'Failed to register user on blockchain',
        message: 'Transaction failed or admin wallet not configured'
      });
    }

  } catch (error) {
    console.error('Error registering user on blockchain:', error);
    res.status(500).json({
      error: 'Failed to register user',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Admin route to check user registration status
 */
router.get('/blockchain/check-registration/:address', requireAuth, requireRole(['admin', 'superadmin']), async (req, res) => {
  try {
    const { address } = req.params;

    if (!address) {
      return res.status(400).json({
        error: 'Wallet address is required'
      });
    }

    const isRegistered = await blockchainService.isRegistered(address);
    
    res.json({
      address,
      isRegistered,
      checked: true
    });

  } catch (error) {
    console.error('Error checking registration status:', error);
    res.status(500).json({
      error: 'Failed to check registration status',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Admin route to get retry queue jobs
 */
router.get('/retry-queue', requireAuth, requireRole(['admin', 'superadmin']), (req, res) => {
  try {
    const stats = retryQueue.getStats();
    const jobs = retryQueue.getAllJobs();

    res.json({
      stats,
      jobs: jobs.map(job => ({
        id: job.id,
        type: job.type,
        attempts: job.attempts,
        maxAttempts: job.maxAttempts,
        nextRetry: job.nextRetry,
        createdAt: job.createdAt,
        lastError: job.lastError
      }))
    });

  } catch (error) {
    console.error('Error getting retry queue status:', error);
    res.status(500).json({
      error: 'Failed to get retry queue status',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Admin route to manually remove a job from retry queue
 */
router.delete('/retry-queue/:jobId', requireAuth, requireRole(['admin', 'superadmin']), (req, res) => {
  try {
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({
        error: 'Job ID is required'
      });
    }

    const removed = retryQueue.removeJob(jobId);
    
    if (removed) {
      res.json({
        success: true,
        message: 'Job removed from retry queue',
        jobId
      });
    } else {
      res.status(404).json({
        error: 'Job not found',
        jobId
      });
    }

  } catch (error) {
    console.error('Error removing job from retry queue:', error);
    res.status(500).json({
      error: 'Failed to remove job',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Admin route to restart blockchain listener
 */
router.post('/blockchain/restart-listener', requireAuth, requireRole(['admin', 'superadmin']), async (req, res) => {
  try {
    // Stop listener
    blockchainListener.stopListening();
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Start listener
    await blockchainListener.startListening();
    
    res.json({
      success: true,
      message: 'Blockchain listener restarted',
      status: blockchainListener.getStatus()
    });

  } catch (error) {
    console.error('Error restarting blockchain listener:', error);
    res.status(500).json({
      error: 'Failed to restart blockchain listener',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export { router as adminRouter };