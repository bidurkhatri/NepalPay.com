import { Request, Response, NextFunction } from 'express';
import { walletService } from '../services/wallet';
import { storage } from '../pg-storage';

/**
 * Middleware to ensure user has a wallet
 * Creates one if it doesn't exist (backward compatibility)
 */
export async function ensureWallet(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userId = req.user.id;
    let wallet = await storage.getWalletByUserId(userId);
    
    // Create wallet if it doesn't exist (backward compatibility)
    if (!wallet) {
      console.log(`Creating missing wallet for user ${userId}`);
      wallet = await walletService.createUserWallet(userId);
    }
    
    // Attach wallet to request for use in route handlers
    req.wallet = wallet;
    next();
    
  } catch (error) {
    console.error('Wallet middleware error:', error);
    res.status(500).json({ error: 'Wallet initialization failed' });
  }
}

/**
 * Middleware to validate wallet address format
 */
export function validateWalletAddress(req: Request, res: Response, next: NextFunction) {
  const { address } = req.body;
  
  if (!address) {
    return res.status(400).json({ error: 'Wallet address is required' });
  }
  
  if (!walletService.isValidAddress(address)) {
    return res.status(400).json({ error: 'Invalid wallet address format' });
  }
  
  next();
}

// Extend Express Request interface to include wallet
declare global {
  namespace Express {
    interface Request {
      wallet?: any;
    }
  }
}