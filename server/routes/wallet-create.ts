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
 * POST /api/v1/wallet/create
 * Create a wallet for existing users who don't have one
 */
router.post('/create', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    
    // Check if user already has a wallet
    const existingWallet = await storage.getWalletByUserId(userId);
    if (existingWallet && existingWallet.address) {
      return res.json({
        success: true,
        message: 'Wallet already exists',
        wallet: existingWallet
      });
    }
    
    // Create new wallet
    console.log(`Creating wallet for existing user ${userId}`);
    const wallet = await walletService.createUserWallet(userId);
    
    res.json({
      success: true,
      message: 'Wallet created successfully',
      wallet
    });
    
  } catch (error) {
    console.error('Wallet creation error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create wallet' 
    });
  }
});

export default router;