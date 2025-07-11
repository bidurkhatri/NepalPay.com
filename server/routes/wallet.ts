import { Request, Response, Router } from 'express';
import { walletService } from '../services/wallet';
import { storage } from '../pg-storage';

const router = Router();

/**
 * Middleware to ensure user is authenticated
 */
const requireAuth = (req: Request, res: Response, next: any) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

/**
 * GET /api/v1/wallet
 * Get user's wallet information with current balances
 */
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    
    // Get wallet from database
    const wallet = await storage.getWalletByUserId(userId);
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    // Update balances from blockchain
    const updatedWallet = await walletService.updateWalletBalances(userId);
    
    res.json({
      wallet: updatedWallet || wallet,
      networkStatus: await walletService.getNetworkStatus()
    });
    
  } catch (error) {
    console.error('Wallet fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch wallet information' });
  }
});

/**
 * POST /api/v1/wallet/refresh
 * Manually refresh wallet balances from blockchain
 */
router.post('/refresh', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    
    const wallet = await walletService.updateWalletBalances(userId);
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    res.json({ 
      wallet,
      message: 'Wallet balances updated successfully'
    });
    
  } catch (error) {
    console.error('Wallet refresh error:', error);
    res.status(500).json({ error: 'Failed to refresh wallet balances' });
  }
});

/**
 * GET /api/v1/wallet/status
 * Get wallet and network status information
 */
router.get('/status', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const wallet = await storage.getWalletByUserId(userId);
    const networkStatus = await walletService.getNetworkStatus();
    const configValidation = walletService.validateConfiguration();
    
    res.json({
      hasWallet: !!wallet,
      walletAddress: wallet?.address || null,
      networkStatus,
      configValid: configValidation.valid,
      configErrors: configValidation.errors
    });
    
  } catch (error) {
    console.error('Wallet status error:', error);
    res.status(500).json({ error: 'Failed to get wallet status' });
  }
});

/**
 * POST /api/v1/wallet/validate-address
 * Validate an Ethereum address format
 */
router.post('/validate-address', requireAuth, async (req: Request, res: Response) => {
  try {
    const { address } = req.body;
    
    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }
    
    const isValid = walletService.isValidAddress(address);
    
    res.json({
      address,
      valid: isValid
    });
    
  } catch (error) {
    console.error('Address validation error:', error);
    res.status(500).json({ error: 'Failed to validate address' });
  }
});

export default router;