import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { BlockchainService } from '../services/blockchain';

// Mock ethers
vi.mock('ethers', () => ({
  ethers: {
    JsonRpcProvider: vi.fn().mockImplementation(() => ({
      getBlockNumber: vi.fn().mockResolvedValue(123456),
      getNetwork: vi.fn().mockResolvedValue({ chainId: 56n }),
      getBalance: vi.fn().mockResolvedValue('1000000000000000000'), // 1 ETH in wei
    })),
    Contract: vi.fn().mockImplementation(() => ({
      registerUser: {
        estimateGas: vi.fn().mockResolvedValue(100000n),
      },
      isRegistered: vi.fn().mockResolvedValue(false),
      balanceOf: vi.fn().mockResolvedValue('1000000000000000000'),
      on: vi.fn(),
      removeAllListeners: vi.fn(),
    })),
    Wallet: vi.fn().mockImplementation(() => ({})),
    formatEther: vi.fn().mockImplementation((value) => {
      if (value === '1000000000000000000') return '1.0';
      return '0.0';
    }),
    parseEther: vi.fn().mockImplementation((value) => `${value}000000000000000000`),
  }
}));

describe('BlockchainService', () => {
  let blockchainService: BlockchainService;

  beforeEach(() => {
    blockchainService = new BlockchainService();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('registerUser', () => {
    it('should skip registration if admin wallet not configured', async () => {
      // Mock environment without admin key
      const originalEnv = process.env.ADMIN_PRIVATE_KEY;
      delete process.env.ADMIN_PRIVATE_KEY;

      const result = await blockchainService.registerUser(123, '0x1234567890123456789012345678901234567890');

      expect(result).toBeNull();

      // Restore environment
      if (originalEnv) process.env.ADMIN_PRIVATE_KEY = originalEnv;
    });

    it('should skip registration if user already registered', async () => {
      // Mock admin wallet
      process.env.ADMIN_PRIVATE_KEY = '0xprivatekey';
      
      const mockContract = {
        isRegistered: vi.fn().mockResolvedValue(true),
        registerUser: {
          estimateGas: vi.fn().mockResolvedValue(100000n),
        },
      };

      // Re-create service with mocked admin wallet
      blockchainService = new BlockchainService();
      (blockchainService as any).contract = mockContract;
      (blockchainService as any).adminWallet = {};

      const result = await blockchainService.registerUser(123, '0x1234567890123456789012345678901234567890');

      expect(result).toBeNull();
      expect(mockContract.isRegistered).toHaveBeenCalled();
    });
  });

  describe('isRegistered', () => {
    it('should check registration status', async () => {
      const mockContract = {
        isRegistered: vi.fn().mockResolvedValue(true),
      };

      (blockchainService as any).contract = mockContract;

      const result = await blockchainService.isRegistered('0x1234567890123456789012345678901234567890');

      expect(result).toBe(true);
      expect(mockContract.isRegistered).toHaveBeenCalledWith('0x1234567890123456789012345678901234567890');
    });

    it('should return false on error', async () => {
      const mockContract = {
        isRegistered: vi.fn().mockRejectedValue(new Error('Network error')),
      };

      (blockchainService as any).contract = mockContract;

      const result = await blockchainService.isRegistered('0x1234567890123456789012345678901234567890');

      expect(result).toBe(false);
    });
  });

  describe('getBalance', () => {
    it('should get token balance', async () => {
      const mockContract = {
        balanceOf: vi.fn().mockResolvedValue('1000000000000000000'),
      };

      (blockchainService as any).contract = mockContract;

      const result = await blockchainService.getBalance('0x1234567890123456789012345678901234567890');

      expect(result).toBe('1.0');
      expect(mockContract.balanceOf).toHaveBeenCalledWith('0x1234567890123456789012345678901234567890');
    });

    it('should return zero on error', async () => {
      const mockContract = {
        balanceOf: vi.fn().mockRejectedValue(new Error('Network error')),
      };

      (blockchainService as any).contract = mockContract;

      const result = await blockchainService.getBalance('0x1234567890123456789012345678901234567890');

      expect(result).toBe('0');
    });
  });

  describe('getBNBBalance', () => {
    it('should get BNB balance', async () => {
      const mockProvider = {
        getBalance: vi.fn().mockResolvedValue('1000000000000000000'),
      };

      (blockchainService as any).provider = mockProvider;

      const result = await blockchainService.getBNBBalance('0x1234567890123456789012345678901234567890');

      expect(result).toBe('1.0');
      expect(mockProvider.getBalance).toHaveBeenCalledWith('0x1234567890123456789012345678901234567890');
    });

    it('should return zero on error', async () => {
      const mockProvider = {
        getBalance: vi.fn().mockRejectedValue(new Error('Network error')),
      };

      (blockchainService as any).provider = mockProvider;

      const result = await blockchainService.getBNBBalance('0x1234567890123456789012345678901234567890');

      expect(result).toBe('0');
    });
  });

  describe('getNetworkStatus', () => {
    it('should get network status', async () => {
      const mockProvider = {
        getBlockNumber: vi.fn().mockResolvedValue(123456),
        getNetwork: vi.fn().mockResolvedValue({ chainId: 56n }),
      };

      (blockchainService as any).provider = mockProvider;

      const result = await blockchainService.getNetworkStatus();

      expect(result).toEqual({
        connected: true,
        blockNumber: 123456,
        chainId: 56,
      });
    });

    it('should return disconnected on error', async () => {
      const mockProvider = {
        getBlockNumber: vi.fn().mockRejectedValue(new Error('Network error')),
        getNetwork: vi.fn().mockRejectedValue(new Error('Network error')),
      };

      (blockchainService as any).provider = mockProvider;

      const result = await blockchainService.getNetworkStatus();

      expect(result).toEqual({
        connected: false,
      });
    });
  });

  describe('validateConfiguration', () => {
    it('should validate complete configuration', () => {
      const originalEnv = {
        BSC_RPC_URL: process.env.BSC_RPC_URL,
        NEPALIPAY_CONTRACT_ADDRESS: process.env.NEPALIPAY_CONTRACT_ADDRESS,
        ADMIN_PRIVATE_KEY: process.env.ADMIN_PRIVATE_KEY,
      };

      process.env.BSC_RPC_URL = 'https://bsc-dataseed1.binance.org/';
      process.env.NEPALIPAY_CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890';
      process.env.ADMIN_PRIVATE_KEY = '0xprivatekey';

      const result = blockchainService.validateConfiguration();

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);

      // Restore environment
      Object.assign(process.env, originalEnv);
    });

    it('should identify missing configuration', () => {
      const originalEnv = {
        BSC_RPC_URL: process.env.BSC_RPC_URL,
        NEPALIPAY_CONTRACT_ADDRESS: process.env.NEPALIPAY_CONTRACT_ADDRESS,
        ADMIN_PRIVATE_KEY: process.env.ADMIN_PRIVATE_KEY,
      };

      delete process.env.BSC_RPC_URL;
      delete process.env.NEPALIPAY_CONTRACT_ADDRESS;
      delete process.env.ADMIN_PRIVATE_KEY;

      const result = blockchainService.validateConfiguration();

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('BSC_RPC_URL not configured');
      expect(result.errors).toContain('NEPALIPAY_CONTRACT_ADDRESS not configured');
      expect(result.errors).toContain('ADMIN_PRIVATE_KEY not configured (blockchain registration disabled)');

      // Restore environment
      Object.assign(process.env, originalEnv);
    });
  });

  describe('startEventListener', () => {
    it('should start event listeners', () => {
      const mockContract = {
        on: vi.fn(),
        removeAllListeners: vi.fn(),
      };

      (blockchainService as any).contract = mockContract;

      const mockCallback = vi.fn();
      blockchainService.startEventListener(mockCallback);

      expect(mockContract.on).toHaveBeenCalledWith('Transfer', expect.any(Function));
      expect(mockContract.on).toHaveBeenCalledWith('UserRegistered', expect.any(Function));
    });
  });

  describe('stopEventListener', () => {
    it('should stop event listeners', () => {
      const mockContract = {
        removeAllListeners: vi.fn(),
      };

      (blockchainService as any).contract = mockContract;

      blockchainService.stopEventListener();

      expect(mockContract.removeAllListeners).toHaveBeenCalled();
    });
  });
});