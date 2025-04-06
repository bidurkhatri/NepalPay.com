import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { ethers } from 'ethers';

// Mock ethers library
jest.mock('ethers', () => {
  return {
    ethers: {
      providers: {
        JsonRpcProvider: jest.fn().mockImplementation(() => ({
          getBalance: jest.fn().mockResolvedValue('1000000000000000000'),
          getSigner: jest.fn().mockReturnThis(),
        })),
      },
      Wallet: jest.fn().mockImplementation(() => ({
        connect: jest.fn().mockReturnThis(),
        address: '0x1234567890123456789012345678901234567890',
        sendTransaction: jest.fn().mockResolvedValue({
          hash: '0xabcdef1234567890',
          wait: jest.fn().mockResolvedValue({}),
        }),
        getBalance: jest.fn().mockResolvedValue('1000000000000000000'),
      })),
      Contract: jest.fn().mockImplementation(() => ({
        transfer: jest.fn().mockResolvedValue({
          hash: '0xabcdef1234567890',
          wait: jest.fn().mockResolvedValue({}),
        }),
        balanceOf: jest.fn().mockResolvedValue('1000000000000000000'),
        decimals: jest.fn().mockResolvedValue(18),
      })),
      formatEther: jest.fn((value) => '1.0'),
      parseEther: jest.fn((value) => '1000000000000000000'),
    }
  };
});

// Mock the NepaliPayToken ABI
jest.mock('../contracts/NepaliPayTokenABI.json', () => ({
  abi: [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
}), { virtual: true });

// A simple blockchain service for testing
class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private tokenContract: ethers.Contract;
  private tokenAddress: string;

  constructor(providerUrl: string, privateKey: string, tokenAddress: string) {
    this.provider = new ethers.providers.JsonRpcProvider(providerUrl);
    this.wallet = new ethers.Wallet(privateKey).connect(this.provider);
    this.tokenAddress = tokenAddress;
    this.tokenContract = new ethers.Contract(
      tokenAddress,
      [], // ABI is mocked
      this.wallet
    );
  }

  async getWalletBalance(): Promise<string> {
    const balance = await this.wallet.getBalance();
    return ethers.formatEther(balance);
  }

  async getTokenBalance(walletAddress: string): Promise<string> {
    const balance = await this.tokenContract.balanceOf(walletAddress);
    return balance.toString();
  }

  async transferTokens(toAddress: string, amount: string): Promise<string> {
    const tx = await this.tokenContract.transfer(
      toAddress,
      ethers.parseEther(amount)
    );
    const receipt = await tx.wait();
    return tx.hash;
  }
}

describe('Blockchain Service', () => {
  let blockchainService: BlockchainService;

  beforeEach(() => {
    blockchainService = new BlockchainService(
      'https://bsc-dataseed.binance.org/',
      '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      '0x69d34B25809b346702C21EB0E22EAD8C1de58D66' // NPT token address
    );
  });

  it('should get wallet balance', async () => {
    const balance = await blockchainService.getWalletBalance();
    
    expect(balance).toBe('1.0');
    expect(ethers.formatEther).toHaveBeenCalledWith('1000000000000000000');
  });

  it('should get token balance for an address', async () => {
    const address = '0x1234567890123456789012345678901234567890';
    const balance = await blockchainService.getTokenBalance(address);
    
    expect(balance).toBe('1000000000000000000');
    expect(ethers.Contract).toHaveBeenCalled();
  });

  it('should transfer tokens to an address', async () => {
    const toAddress = '0x2234567890123456789012345678901234567890';
    const amount = '10.0';
    
    const txHash = await blockchainService.transferTokens(toAddress, amount);
    
    expect(txHash).toBe('0xabcdef1234567890');
    expect(ethers.parseEther).toHaveBeenCalledWith(amount);
  });
});

// Test for token transfer after Stripe payment
describe('Post-Payment Token Transfer', () => {
  // Mock service to emulate the payment webhook handler
  class PaymentService {
    private blockchainService: BlockchainService;
    
    constructor(blockchainService: BlockchainService) {
      this.blockchainService = blockchainService;
    }
    
    async handleSuccessfulPayment(
      amount: number, 
      walletAddress: string
    ): Promise<{ success: boolean; txHash?: string; error?: string }> {
      try {
        // Convert USD to token amount (simplified conversion)
        const tokenAmount = (amount / 100).toString(); // Amount is in cents
        
        // Transfer tokens from hot wallet to user wallet
        const txHash = await this.blockchainService.transferTokens(
          walletAddress,
          tokenAmount
        );
        
        return { success: true, txHash };
      } catch (error) {
        return { 
          success: false, 
          error: (error as Error).message 
        };
      }
    }
  }
  
  it('should transfer tokens after a successful payment', async () => {
    const blockchainService = new BlockchainService(
      'https://bsc-dataseed.binance.org/',
      '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      '0x69d34B25809b346702C21EB0E22EAD8C1de58D66'
    );
    
    const paymentService = new PaymentService(blockchainService);
    
    const result = await paymentService.handleSuccessfulPayment(
      5000, // $50.00 in cents
      '0x2234567890123456789012345678901234567890'
    );
    
    expect(result.success).toBe(true);
    expect(result.txHash).toBe('0xabcdef1234567890');
  });
  
  it('should handle errors during token transfer', async () => {
    const blockchainService = new BlockchainService(
      'https://bsc-dataseed.binance.org/',
      '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      '0x69d34B25809b346702C21EB0E22EAD8C1de58D66'
    );
    
    // Mock a failure in the transfer function
    (blockchainService.transferTokens as jest.Mock) = jest.fn().mockRejectedValue(
      new Error('Insufficient balance')
    );
    
    const paymentService = new PaymentService(blockchainService);
    
    const result = await paymentService.handleSuccessfulPayment(
      5000,
      '0x2234567890123456789012345678901234567890'
    );
    
    expect(result.success).toBe(false);
    expect(result.error).toBe('Insufficient balance');
  });
});