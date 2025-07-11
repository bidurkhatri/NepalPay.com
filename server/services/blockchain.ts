import { ethers } from 'ethers';

/**
 * Comprehensive blockchain service for NepaliPay
 * Handles all smart contract interactions with the BSC network
 */
export class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;
  private adminWallet?: ethers.Wallet;
  private retryQueue: Map<string, number> = new Map();

  // Smart contract ABI for core functions
  private contractABI = [
    "function registerUser(uint256 userId, address walletAddress) external",
    "function isRegistered(address user) external view returns (bool)",
    "function balanceOf(address account) external view returns (uint256)",
    "function transfer(address to, uint256 amount) external returns (bool)",
    "function mint(address to, uint256 amount) external",
    "function burn(address from, uint256 amount) external",
    "function executeTransaction(address from, address to, uint256 amount, bytes memory data) external returns (bool)",
    "event Transfer(address indexed from, address indexed to, uint256 value)",
    "event UserRegistered(uint256 indexed userId, address indexed walletAddress)"
  ];

  constructor() {
    // Initialize BSC provider
    const rpcUrl = process.env.BSC_RPC_URL || 'https://bsc-dataseed1.binance.org/';
    this.provider = new ethers.JsonRpcProvider(rpcUrl);

    // Initialize contract
    const contractAddress = process.env.NEPALIPAY_CONTRACT_ADDRESS || '0x742d35Cc8e6F3b3F4b2e8F8aD35a3f6B8e9a0b7C';
    this.contract = new ethers.Contract(contractAddress, this.contractABI, this.provider);

    // Initialize admin wallet if private key is provided (support both env var names)
    const privateKey = process.env.ADMIN_PRIVATE_KEY || process.env.WALLET_PRIVATE_KEY;
    if (privateKey) {
      try {
        this.adminWallet = new ethers.Wallet(privateKey, this.provider);
        this.contract = this.contract.connect(this.adminWallet);
        console.log('Blockchain service initialized with admin wallet');
      } catch (error) {
        console.warn('Failed to initialize admin wallet - invalid private key format:', error instanceof Error ? error.message : String(error));
      }
    } else {
      console.log('No admin private key provided - blockchain operations will be read-only');
    }
  }

  /**
   * Register user on the blockchain
   */
  async registerUser(userId: number, walletAddress: string): Promise<string | null> {
    try {
      if (!this.adminWallet) {
        console.log('Admin wallet not configured, skipping blockchain registration');
        return null;
      }

      // Check if user is already registered
      const isRegistered = await this.isRegistered(walletAddress);
      if (isRegistered) {
        console.log(`User ${userId} already registered on blockchain`);
        return null;
      }

      console.log(`Registering user ${userId} with address ${walletAddress} on blockchain`);
      
      // Estimate gas for the transaction
      const gasEstimate = await this.contract.registerUser.estimateGas(userId, walletAddress);
      const gasLimit = gasEstimate * 120n / 100n; // Add 20% buffer

      // Execute registration transaction
      const tx = await this.contract.registerUser(userId, walletAddress, {
        gasLimit,
      });

      console.log(`Registration transaction sent: ${tx.hash}`);
      
      // Wait for confirmation
      const receipt = await tx.wait();
      console.log(`User ${userId} registered successfully. Transaction: ${receipt.transactionHash}`);
      
      return receipt.transactionHash;

    } catch (error) {
      console.error(`Failed to register user ${userId} on blockchain:`, error);
      
      // Add to retry queue
      const retryKey = `register_${userId}_${walletAddress}`;
      const currentRetries = this.retryQueue.get(retryKey) || 0;
      
      if (currentRetries < 3) {
        this.retryQueue.set(retryKey, currentRetries + 1);
        console.log(`Adding registration to retry queue (attempt ${currentRetries + 1}/3)`);
        
        // Retry with exponential backoff
        setTimeout(() => {
          this.registerUser(userId, walletAddress);
        }, Math.pow(2, currentRetries) * 1000);
      } else {
        console.error(`Failed to register user ${userId} after 3 attempts`);
        this.retryQueue.delete(retryKey);
      }
      
      return null;
    }
  }

  /**
   * Check if user is registered on blockchain
   */
  async isRegistered(walletAddress: string): Promise<boolean> {
    try {
      return await this.contract.isRegistered(walletAddress);
    } catch (error) {
      console.error(`Failed to check registration status for ${walletAddress}:`, error);
      return false;
    }
  }

  /**
   * Get token balance for an address
   */
  async getBalance(address: string): Promise<string> {
    try {
      const balance = await this.contract.balanceOf(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error(`Failed to get balance for ${address}:`, error);
      return '0';
    }
  }

  /**
   * Get BNB balance for an address
   */
  async getBNBBalance(address: string): Promise<string> {
    try {
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error(`Failed to get BNB balance for ${address}:`, error);
      return '0';
    }
  }

  /**
   * Transfer tokens between addresses (admin only)
   */
  async transfer(to: string, amount: string): Promise<string | null> {
    try {
      if (!this.adminWallet) {
        throw new Error('Admin wallet not configured');
      }

      const amountWei = ethers.parseEther(amount);
      const tx = await this.contract.transfer(to, amountWei);
      
      console.log(`Transfer transaction sent: ${tx.hash}`);
      const receipt = await tx.wait();
      
      return receipt.transactionHash;
    } catch (error) {
      console.error('Transfer failed:', error);
      return null;
    }
  }

  /**
   * Mint new tokens (admin only)
   */
  async mint(to: string, amount: string): Promise<string | null> {
    try {
      if (!this.adminWallet) {
        throw new Error('Admin wallet not configured');
      }

      const amountWei = ethers.parseEther(amount);
      const tx = await this.contract.mint(to, amountWei);
      
      console.log(`Mint transaction sent: ${tx.hash}`);
      const receipt = await tx.wait();
      
      return receipt.transactionHash;
    } catch (error) {
      console.error('Mint failed:', error);
      return null;
    }
  }

  /**
   * Burn tokens (admin only)
   */
  async burn(from: string, amount: string): Promise<string | null> {
    try {
      if (!this.adminWallet) {
        throw new Error('Admin wallet not configured');
      }

      const amountWei = ethers.parseEther(amount);
      const tx = await this.contract.burn(from, amountWei);
      
      console.log(`Burn transaction sent: ${tx.hash}`);
      const receipt = await tx.wait();
      
      return receipt.transactionHash;
    } catch (error) {
      console.error('Burn failed:', error);
      return null;
    }
  }

  /**
   * Execute a custom transaction
   */
  async executeTransaction(from: string, to: string, amount: string, data: string = '0x'): Promise<string | null> {
    try {
      if (!this.adminWallet) {
        throw new Error('Admin wallet not configured');
      }

      const amountWei = ethers.parseEther(amount);
      const tx = await this.contract.executeTransaction(from, to, amountWei, data);
      
      console.log(`Custom transaction sent: ${tx.hash}`);
      const receipt = await tx.wait();
      
      return receipt.transactionHash;
    } catch (error) {
      console.error('Custom transaction failed:', error);
      return null;
    }
  }

  /**
   * Start blockchain event listener
   */
  startEventListener(onTransfer?: (from: string, to: string, value: string) => void): void {
    if (onTransfer) {
      this.contract.on('Transfer', (from: string, to: string, value: any) => {
        const valueEther = ethers.formatEther(value);
        console.log(`Transfer detected: ${from} -> ${to}: ${valueEther} NPT`);
        onTransfer(from, to, valueEther);
      });
    }

    this.contract.on('UserRegistered', (userId: any, walletAddress: string) => {
      console.log(`User registration confirmed: ${userId} -> ${walletAddress}`);
    });

    console.log('Blockchain event listeners started');
  }

  /**
   * Stop blockchain event listener
   */
  stopEventListener(): void {
    this.contract.removeAllListeners();
    console.log('Blockchain event listeners stopped');
  }

  /**
   * Get network status
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
      console.error('Failed to get network status:', error);
      return { connected: false };
    }
  }

  /**
   * Validate configuration for production
   */
  validateConfiguration(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!process.env.BSC_RPC_URL) {
      errors.push('BSC_RPC_URL not configured');
    }

    if (!process.env.NEPALIPAY_CONTRACT_ADDRESS) {
      errors.push('NEPALIPAY_CONTRACT_ADDRESS not configured');
    }

    // Check for either ADMIN_PRIVATE_KEY or WALLET_PRIVATE_KEY
    const privateKey = process.env.ADMIN_PRIVATE_KEY || process.env.WALLET_PRIVATE_KEY;
    if (!privateKey) {
      errors.push('WALLET_PRIVATE_KEY (or ADMIN_PRIVATE_KEY) not configured (blockchain registration disabled)');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
export const blockchainService = new BlockchainService();