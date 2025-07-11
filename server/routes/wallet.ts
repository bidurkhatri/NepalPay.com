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
 * Creates wallet if it doesn't exist (backward compatibility)
 */
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    
    // Get wallet from database
    let wallet = await storage.getWalletByUserId(userId);
    
    // Create wallet if it doesn't exist (backward compatibility for existing users)
    if (!wallet) {
      console.log(`Creating missing wallet for existing user ${userId}`);
      wallet = await walletService.createUserWallet(userId);
    }
    
    // If wallet exists but has no address, add one
    else if (wallet && !wallet.address) {
      console.log(`Adding address to existing wallet for user ${userId}`);
      wallet = await walletService.createUserWallet(userId);
    }

    // Update balances from blockchain if wallet has an address
    if (wallet && wallet.address) {
      const updatedWallet = await walletService.updateWalletBalances(userId);
      wallet = updatedWallet || wallet;
    }
    
    res.json({
      wallet,
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