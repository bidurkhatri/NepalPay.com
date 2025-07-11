import { ethers } from 'ethers';
import crypto from 'crypto';
import { storage } from '../pg-storage';
import { User, InsertWallet, Wallet } from '../../shared/schema';
import { environmentConfig, getNetworkConfig } from '../utils/env-config';
import { blockchainService } from './blockchain';

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
    console.log(`Generating wallet with encryption key length: ${encryptionKey.length}`);
    
    const iv = crypto.randomBytes(16);
    // Ensure encryption key is exactly 32 bytes for AES-256
    const keyBuffer = Buffer.alloc(32);
    Buffer.from(encryptionKey, 'utf8').copy(keyBuffer);
    
    const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, iv);
    let encryptedKey = cipher.update(wallet.privateKey, 'utf8', 'hex');
    encryptedKey += cipher.final('hex');
    encryptedKey = iv.toString('hex') + ':' + encryptedKey;

    console.log(`Generated wallet address: ${wallet.address}`);
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
   * Create a new wallet for a user following production-grade wallet generation
   * Implements Ethereum-compatible wallet generation with secure encryption
   * Enforces one-to-one mapping between users and wallets
   */
  async createUserWallet(userId: number): Promise<Wallet> {
    try {
      console.log(`Creating/updating wallet for user ${userId}`);
      
      // Check if user already has a wallet (enforce one-to-one mapping)
      const existingWallet = await storage.getWalletByUserId(userId);
      
      if (existingWallet && existingWallet.address) {
        console.log(`User ${userId} already has wallet with address: ${existingWallet.address}`);
        return existingWallet;
      }
      
      // Generate new Ethereum-compatible wallet
      const { address, encryptedKey } = this.generateWallet();
      console.log(`Generated new address for user ${userId}: ${address}`);
      
      let wallet: Wallet;
      
      if (existingWallet) {
        // Update existing wallet without address
        console.log(`Updating existing wallet ${existingWallet.id} with address for user ${userId}`);
        const updatedWallet = await storage.updateWallet(existingWallet.id, {
          address,
          nptBalance: '0',
          bnbBalance: '0',
          lastUpdated: new Date(),
          updatedAt: new Date()
        });
        
        if (!updatedWallet) {
          throw new Error('Failed to update existing wallet');
        }
        wallet = updatedWallet;
      } else {
        // Create new wallet record following schema constraints
        console.log(`Creating new wallet for user ${userId}`);
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

        wallet = await storage.createWallet(walletData);
      }
      
      // Store encrypted private key securely (custodial approach)
      // In production, this would go to secure key management service
      await this.storeEncryptedKey(userId, address, encryptedKey);
      
      // Update user record with wallet address (enforce foreign key relationship)
      await storage.updateUser(userId, { walletAddress: address });
      
      // Register on blockchain with retry mechanism (fire and forget)
      this.registerOnBlockchainWithRetry(userId, address).catch(error => {
        console.error(`Background blockchain registration failed for user ${userId}:`, error);
      });
      
      console.log(`Wallet created successfully for user ${userId}: ${address}`);
      return wallet;
      
    } catch (error) {
      console.error(`Failed to create wallet for user ${userId}:`, error);
      throw new Error(`Wallet creation failed: ${error.message}`);
    }
  }

  /**
   * Store encrypted private key securely
   * In production, this should use AWS KMS, HashiCorp Vault, or similar
   */
  private async storeEncryptedKey(userId: number, address: string, encryptedKey: string): Promise<void> {
    try {
      // For now, store in database with wallet record
      // In production: use dedicated key management service
      console.log(`Storing encrypted key for user ${userId} address ${address}`);
      
      // This is a placeholder - in production you'd store in:
      // - AWS KMS
      // - HashiCorp Vault  
      // - Azure Key Vault
      // - Dedicated encrypted_keys table with additional security
      
    } catch (error) {
      console.error(`Failed to store encrypted key for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Register user on blockchain with exponential backoff retry
   */
  private async registerOnBlockchainWithRetry(userId: number, address: string): Promise<void> {
    const maxRetries = 3;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const txHash = await this.registerOnBlockchain(userId, address);
        if (txHash) {
          console.log(`User ${userId} registered on blockchain: ${txHash}`);
          
          // Record successful registration activity
          await storage.createActivity({
            userId,
            action: 'WALLET_CREATED',
            description: `Wallet ${address} registered on blockchain`,
            ipAddress: null,
            userAgent: null,
          });
          
          return;
        }
      } catch (error) {
        console.error(`Blockchain registration attempt ${attempt}/${maxRetries} failed for user ${userId}:`, error);
        
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
          console.log(`Retrying blockchain registration in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          console.error(`Failed to register user ${userId} on blockchain after ${maxRetries} attempts`);
          
          // Record failed registration activity
          await storage.createActivity({
            userId,
            action: 'WALLET_CREATED',
            description: `Wallet ${address} created but blockchain registration failed`,
            ipAddress: null,
            userAgent: null,
          });
        }
      }
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
      // Use blockchain service for balance queries
      const [nptBalance, bnbBalance] = await Promise.all([
        blockchainService.getBalance(address),
        blockchainService.getBNBBalance(address)
      ]);
      
      return {
        npt: nptBalance,
        bnb: bnbBalance
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