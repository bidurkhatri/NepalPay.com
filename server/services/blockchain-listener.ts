import { ethers } from 'ethers';
import { blockchainService } from './blockchain';
import { storage } from '../pg-storage';

/**
 * Blockchain Event Listener Service
 * Monitors smart contract events and updates local database
 */
export class BlockchainListener {
  private isListening: boolean = false;
  private eventHandlers: Map<string, Function> = new Map();

  constructor() {
    this.setupEventHandlers();
  }

  /**
   * Setup event handlers for different blockchain events
   */
  private setupEventHandlers(): void {
    // Handle token transfers
    this.eventHandlers.set('Transfer', async (from: string, to: string, value: string, event: any) => {
      try {
        console.log(`Transfer detected: ${from} -> ${to}: ${value} NPT`);
        
        // Update balances for both sender and receiver if they are our users
        const [fromUser, toUser] = await Promise.all([
          this.getUserByWalletAddress(from),
          this.getUserByWalletAddress(to)
        ]);

        if (fromUser) {
          await this.updateUserWalletBalance(fromUser.id);
          console.log(`Updated balance for user ${fromUser.id} (${fromUser.username})`);
        }

        if (toUser) {
          await this.updateUserWalletBalance(toUser.id);
          console.log(`Updated balance for user ${toUser.id} (${toUser.username})`);
        }

        // Create transaction record
        if (fromUser || toUser) {
          await this.createTransactionRecord(from, to, value, event.transactionHash);
        }

      } catch (error) {
        console.error('Error handling Transfer event:', error);
      }
    });

    // Handle user registrations
    this.eventHandlers.set('UserRegistered', async (userId: number, walletAddress: string, event: any) => {
      try {
        console.log(`User registration confirmed: ${userId} -> ${walletAddress}`);
        
        // Update user registration status in database
        const user = await storage.getUser(userId);
        if (user) {
          await storage.updateUser(userId, {
            walletAddress,
            updatedAt: new Date()
          });
          console.log(`Confirmed registration for user ${userId}`);
        }

      } catch (error) {
        console.error('Error handling UserRegistered event:', error);
      }
    });
  }

  /**
   * Start listening to blockchain events
   */
  async startListening(): Promise<void> {
    if (this.isListening) {
      console.log('Blockchain listener already running');
      return;
    }

    try {
      console.log('Starting blockchain event listener...');

      // Start listening to Transfer events
      blockchainService.startEventListener((from: string, to: string, value: string) => {
        const handler = this.eventHandlers.get('Transfer');
        if (handler) {
          handler(from, to, value, { transactionHash: 'pending' });
        }
      });

      this.isListening = true;
      console.log('Blockchain event listener started successfully');

    } catch (error) {
      console.error('Failed to start blockchain listener:', error);
      throw error;
    }
  }

  /**
   * Stop listening to blockchain events
   */
  stopListening(): void {
    if (!this.isListening) {
      return;
    }

    try {
      blockchainService.stopEventListener();
      this.isListening = false;
      console.log('Blockchain event listener stopped');

    } catch (error) {
      console.error('Error stopping blockchain listener:', error);
    }
  }

  /**
   * Get user by wallet address
   */
  private async getUserByWalletAddress(address: string) {
    try {
      // Search for user with this wallet address
      const users = await storage.getAllUsers();
      return users.find(user => user.walletAddress?.toLowerCase() === address.toLowerCase());
    } catch (error) {
      console.error('Error finding user by wallet address:', error);
      return null;
    }
  }

  /**
   * Update user wallet balance from blockchain
   */
  private async updateUserWalletBalance(userId: number): Promise<void> {
    try {
      const wallet = await storage.getWalletByUserId(userId);
      if (!wallet || !wallet.address) {
        return;
      }

      // Get latest balances from blockchain
      const [nptBalance, bnbBalance] = await Promise.all([
        blockchainService.getBalance(wallet.address),
        blockchainService.getBNBBalance(wallet.address)
      ]);

      // Update wallet in database
      await storage.updateWallet(wallet.id, {
        nptBalance,
        bnbBalance,
        lastUpdated: new Date(),
        updatedAt: new Date()
      });

    } catch (error) {
      console.error(`Error updating wallet balance for user ${userId}:`, error);
    }
  }

  /**
   * Create transaction record from blockchain event
   */
  private async createTransactionRecord(from: string, to: string, value: string, txHash: string): Promise<void> {
    try {
      const [fromUser, toUser] = await Promise.all([
        this.getUserByWalletAddress(from),
        this.getUserByWalletAddress(to)
      ]);

      if (!fromUser && !toUser) {
        return; // Neither address belongs to our users
      }

      // Create transaction record
      await storage.createTransaction({
        senderId: fromUser?.id || null,
        receiverId: toUser?.id || null,
        amount: parseFloat(value),
        currency: 'NPT',
        status: 'completed',
        txHash,
        senderAddress: from,
        receiverAddress: to,
        description: `NPT Transfer: ${value} NPT`,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log(`Transaction record created: ${txHash}`);

    } catch (error) {
      console.error('Error creating transaction record:', error);
    }
  }

  /**
   * Get listener status
   */
  getStatus(): { listening: boolean; handlers: string[] } {
    return {
      listening: this.isListening,
      handlers: Array.from(this.eventHandlers.keys())
    };
  }
}

// Export singleton instance
export const blockchainListener = new BlockchainListener();