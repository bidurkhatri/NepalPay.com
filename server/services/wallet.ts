import { ethers } from 'ethers';
import crypto from 'crypto';
import { storage } from '../pg-storage';
import { User, InsertWallet, Wallet } from '../../shared/schema';
import { environmentConfig, getNetworkConfig } from '../utils/env-config';

// Environment configuration
const networkConfig = getNetworkConfig(environmentConfig.NODE_ENV);
const NETWORK_URL = environmentConfig.BSC_NETWORK_URL;
const NEPALIPAY_CONTRACT_ADDRESS = environmentConfig.NEPALIPAY_CONTRACT_ADDRESS || '0x1234567890123456789012345678901234567890';
const PRIVATE_KEY = environmentConfig.WALLET_PRIVATE_KEY;
const ENVIRONMENT = environmentConfig.NODE_ENV;

// Contract ABI for NepaliPay contract
const NEPALIPAY_ABI = [
  "function registerUser(uint256 userId, address userAddress) external",
  "function getUserInfo(uint256 userId) external view returns (address userAddress, uint256 balance, bool isRegistered)",
  "function balanceOf(address account) external view returns (uint256)",
  "function transfer(address to, uint256 amount) external returns (bool)"
];

/**
 * Production-grade wallet service for NepaliPay
 * Handles secure wallet creation, blockchain registration, and balance management
 */
export class WalletService {
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;
  private adminWallet?: ethers.Wallet;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(NETWORK_URL);
    this.contract = new ethers.Contract(NEPALIPAY_CONTRACT_ADDRESS, NEPALIPAY_ABI, this.provider);
    
    if (PRIVATE_KEY) {
      this.adminWallet = new ethers.Wallet(PRIVATE_KEY, this.provider);
      this.contract = this.contract.connect(this.adminWallet);
    }
  }

  /**
   * Generate a secure Ethereum-compatible wallet address
   * Returns both address and encrypted private key for custodial storage
   */
  private generateWallet(): { address: string; privateKey: string; encryptedKey: string } {
    const wallet = ethers.Wallet.createRandom();
    
    // Encrypt private key for secure storage using modern crypto
    const encryptionKey = environmentConfig.WALLET_ENCRYPTION_KEY;
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey.slice(0, 32)), iv);
    let encryptedKey = cipher.update(wallet.privateKey, 'utf8', 'hex');
    encryptedKey += cipher.final('hex');
    encryptedKey = iv.toString('hex') + ':' + encryptedKey;

    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      encryptedKey
    };
  }

  /**
   * Decrypt private key for transaction signing
   */
  private decryptPrivateKey(encryptedKey: string): string {
    const encryptionKey = environmentConfig.WALLET_ENCRYPTION_KEY;
    const parts = encryptedKey.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted key format');
    }
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey.slice(0, 32)), iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  /**
   * Create a new wallet for a user during registration
   * Generates address, stores in database, and registers on blockchain
   */
  async createUserWallet(userId: number): Promise<Wallet> {
    try {
      console.log(`Creating wallet for user ${userId}`);
      
      // Generate wallet
      const { address, encryptedKey } = this.generateWallet();
      
      // Create wallet record in database
      const walletData: InsertWallet = {
        userId,
        balance: '0',
        currency: 'NPT',
        lastUpdated: new Date(),
        address,
        nptBalance: '0',
        bnbBalance: '0',
        isPrimary: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const wallet = await storage.createWallet(walletData);
      
      // Update user with wallet address
      await storage.updateUser(userId, { walletAddress: address });
      
      // Register on blockchain (in background, don't block registration)
      this.registerOnBlockchain(userId, address).catch(error => {
        console.error(`Blockchain registration failed for user ${userId}:`, error);
      });
      
      console.log(`Wallet created successfully for user ${userId}: ${address}`);
      return wallet;
      
    } catch (error) {
      console.error(`Failed to create wallet for user ${userId}:`, error);
      throw new Error('Wallet creation failed');
    }
  }

  /**
   * Register user wallet on NepaliPay smart contract
   */
  async registerOnBlockchain(userId: number, address: string): Promise<string | null> {
    try {
      if (!this.adminWallet) {
        console.warn('Admin wallet not configured, skipping blockchain registration');
        return null;
      }

      console.log(`Registering user ${userId} with address ${address} on blockchain`);
      
      // Check if user is already registered
      try {
        const userInfo = await this.contract.getUserInfo(userId);
        if (userInfo.isRegistered) {
          console.log(`User ${userId} already registered on blockchain`);
          return null;
        }
      } catch (error) {
        // Contract call failed, continue with registration
        console.log('User info check failed, proceeding with registration');
      }

      // Register user on contract
      const tx = await this.contract.registerUser(userId, address);
      const receipt = await tx.wait();
      
      console.log(`User ${userId} registered on blockchain. TX: ${receipt.hash}`);
      return receipt.hash;
      
    } catch (error) {
      console.error(`Blockchain registration failed for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Get wallet balance from blockchain
   */
  async getWalletBalance(address: string): Promise<{ npt: string; bnb: string }> {
    try {
      // Get NPT balance
      const nptBalance = await this.contract.balanceOf(address);
      
      // Get BNB balance
      const bnbBalance = await this.provider.getBalance(address);
      
      return {
        npt: ethers.formatEther(nptBalance),
        bnb: ethers.formatEther(bnbBalance)
      };
      
    } catch (error) {
      console.error(`Failed to get balance for address ${address}:`, error);
      return { npt: '0', bnb: '0' };
    }
  }

  /**
   * Update wallet balances in database from blockchain
   */
  async updateWalletBalances(userId: number): Promise<Wallet | null> {
    try {
      const wallet = await storage.getWalletByUserId(userId);
      if (!wallet || !wallet.address) {
        return null;
      }

      const balances = await this.getWalletBalance(wallet.address);
      
      return await storage.updateWallet(wallet.id, {
        nptBalance: balances.npt,
        bnbBalance: balances.bnb,
        lastUpdated: new Date(),
        updatedAt: new Date()
      });
      
    } catch (error) {
      console.error(`Failed to update balances for user ${userId}:`, error);
      return null;
    }
  }

  /**
   * Validate Ethereum address format
   */
  isValidAddress(address: string): boolean {
    try {
      return ethers.isAddress(address);
    } catch {
      return false;
    }
  }

  /**
   * Get network status and connection health
   */
  async getNetworkStatus(): Promise<{ connected: boolean; blockNumber?: number; chainId?: number }> {
    try {
      const [blockNumber, network] = await Promise.all([
        this.provider.getBlockNumber(),
        this.provider.getNetwork()
      ]);
      
      return {
        connected: true,
        blockNumber,
        chainId: Number(network.chainId)
      };
      
    } catch (error) {
      console.error('Network connection failed:', error);
      return { connected: false };
    }
  }

  /**
   * Production environment validation
   */
  validateConfiguration(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!NEPALIPAY_CONTRACT_ADDRESS || NEPALIPAY_CONTRACT_ADDRESS.startsWith('0x1234')) {
      errors.push('Invalid or missing NEPALIPAY_CONTRACT_ADDRESS');
    }
    
    if (ENVIRONMENT === 'production' && !PRIVATE_KEY) {
      errors.push('WALLET_PRIVATE_KEY required in production');
    }
    
    if (!environmentConfig.WALLET_ENCRYPTION_KEY) {
      errors.push('WALLET_ENCRYPTION_KEY required for secure key storage');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
export const walletService = new WalletService();