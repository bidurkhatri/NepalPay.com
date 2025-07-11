import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { WalletService } from '../services/wallet';
import { blockchainService } from '../services/blockchain';
import { storage } from '../pg-storage';

// Mock the storage and blockchain services
vi.mock('../pg-storage');
vi.mock('../services/blockchain');

describe('WalletService', () => {
  let walletService: WalletService;
  const mockUserId = 123;

  beforeEach(() => {
    walletService = new WalletService();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('createUserWallet', () => {
    it('should create a new wallet for user without existing wallet', async () => {
      // Mock no existing wallet
      vi.mocked(storage.getWalletByUserId).mockResolvedValue(undefined);
      
      // Mock wallet creation
      const mockWallet = {
        id: 1,
        userId: mockUserId,
        address: '0x1234567890123456789012345678901234567890',
        nptBalance: '0',
        bnbBalance: '0',
        balance: '0.00',
        currency: 'NPT',
        lastUpdated: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        isPrimary: true
      };
      
      vi.mocked(storage.createWallet).mockResolvedValue(mockWallet);
      vi.mocked(storage.updateUser).mockResolvedValue({} as any);
      vi.mocked(blockchainService.registerUser).mockResolvedValue('0xabc123');

      const result = await walletService.createUserWallet(mockUserId);

      expect(result).toEqual(mockWallet);
      expect(storage.createWallet).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockUserId,
          address: expect.stringMatching(/^0x[0-9a-fA-F]{40}$/),
          nptBalance: '0',
          bnbBalance: '0',
          isPrimary: true
        })
      );
      expect(storage.updateUser).toHaveBeenCalledWith(
        mockUserId,
        expect.objectContaining({
          walletAddress: expect.stringMatching(/^0x[0-9a-fA-F]{40}$/)
        })
      );
    });

    it('should update existing wallet without address', async () => {
      // Mock existing wallet without address
      const existingWallet = {
        id: 1,
        userId: mockUserId,
        address: null,
        nptBalance: '0',
        bnbBalance: '0',
        balance: '0.00',
        currency: 'NPT',
        lastUpdated: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        isPrimary: true
      };
      
      vi.mocked(storage.getWalletByUserId).mockResolvedValue(existingWallet);
      
      // Mock wallet update
      const updatedWallet = {
        ...existingWallet,
        address: '0x1234567890123456789012345678901234567890'
      };
      
      vi.mocked(storage.updateWallet).mockResolvedValue(updatedWallet);
      vi.mocked(storage.updateUser).mockResolvedValue({} as any);
      vi.mocked(blockchainService.registerUser).mockResolvedValue('0xabc123');

      const result = await walletService.createUserWallet(mockUserId);

      expect(result).toEqual(updatedWallet);
      expect(storage.updateWallet).toHaveBeenCalledWith(
        existingWallet.id,
        expect.objectContaining({
          address: expect.stringMatching(/^0x[0-9a-fA-F]{40}$/),
          nptBalance: '0',
          bnbBalance: '0'
        })
      );
    });

    it('should handle blockchain registration failure gracefully', async () => {
      vi.mocked(storage.getWalletByUserId).mockResolvedValue(undefined);
      
      const mockWallet = {
        id: 1,
        userId: mockUserId,
        address: '0x1234567890123456789012345678901234567890',
        nptBalance: '0',
        bnbBalance: '0',
        balance: '0.00',
        currency: 'NPT',
        lastUpdated: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        isPrimary: true
      };
      
      vi.mocked(storage.createWallet).mockResolvedValue(mockWallet);
      vi.mocked(storage.updateUser).mockResolvedValue({} as any);
      vi.mocked(blockchainService.registerUser).mockRejectedValue(new Error('Blockchain error'));

      // Should still succeed even if blockchain registration fails
      const result = await walletService.createUserWallet(mockUserId);

      expect(result).toEqual(mockWallet);
      expect(storage.createWallet).toHaveBeenCalled();
    });
  });

  describe('getWalletBalance', () => {
    it('should fetch balances from blockchain service', async () => {
      const address = '0x1234567890123456789012345678901234567890';
      const mockBalances = { npt: '100.5', bnb: '0.1' };
      
      vi.mocked(blockchainService.getBalance).mockResolvedValue('100.5');
      vi.mocked(blockchainService.getBNBBalance).mockResolvedValue('0.1');

      const result = await walletService.getWalletBalance(address);

      expect(result).toEqual(mockBalances);
      expect(blockchainService.getBalance).toHaveBeenCalledWith(address);
      expect(blockchainService.getBNBBalance).toHaveBeenCalledWith(address);
    });

    it('should return zero balances on error', async () => {
      const address = '0x1234567890123456789012345678901234567890';
      
      vi.mocked(blockchainService.getBalance).mockRejectedValue(new Error('Network error'));
      vi.mocked(blockchainService.getBNBBalance).mockRejectedValue(new Error('Network error'));

      const result = await walletService.getWalletBalance(address);

      expect(result).toEqual({ npt: '0', bnb: '0' });
    });
  });

  describe('updateWalletBalances', () => {
    it('should update wallet balances from blockchain', async () => {
      const mockWallet = {
        id: 1,
        userId: mockUserId,
        address: '0x1234567890123456789012345678901234567890',
        nptBalance: '0',
        bnbBalance: '0',
        balance: '0.00',
        currency: 'NPT',
        lastUpdated: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        isPrimary: true
      };

      const updatedWallet = {
        ...mockWallet,
        nptBalance: '100.5',
        bnbBalance: '0.1'
      };

      vi.mocked(storage.getWalletByUserId).mockResolvedValue(mockWallet);
      vi.mocked(blockchainService.getBalance).mockResolvedValue('100.5');
      vi.mocked(blockchainService.getBNBBalance).mockResolvedValue('0.1');
      vi.mocked(storage.updateWallet).mockResolvedValue(updatedWallet);

      const result = await walletService.updateWalletBalances(mockUserId);

      expect(result).toEqual(updatedWallet);
      expect(storage.updateWallet).toHaveBeenCalledWith(
        mockWallet.id,
        expect.objectContaining({
          nptBalance: '100.5',
          bnbBalance: '0.1'
        })
      );
    });

    it('should return null if user has no wallet', async () => {
      vi.mocked(storage.getWalletByUserId).mockResolvedValue(undefined);

      const result = await walletService.updateWalletBalances(mockUserId);

      expect(result).toBeNull();
    });

    it('should return null if wallet has no address', async () => {
      const mockWallet = {
        id: 1,
        userId: mockUserId,
        address: null,
        nptBalance: '0',
        bnbBalance: '0',
        balance: '0.00',
        currency: 'NPT',
        lastUpdated: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        isPrimary: true
      };

      vi.mocked(storage.getWalletByUserId).mockResolvedValue(mockWallet);

      const result = await walletService.updateWalletBalances(mockUserId);

      expect(result).toBeNull();
    });
  });

  describe('isValidAddress', () => {
    it('should validate correct Ethereum addresses', () => {
      const validAddress = '0x1234567890123456789012345678901234567890';
      expect(walletService.isValidAddress(validAddress)).toBe(true);
    });

    it('should reject invalid addresses', () => {
      expect(walletService.isValidAddress('invalid')).toBe(false);
      expect(walletService.isValidAddress('0x123')).toBe(false);
      expect(walletService.isValidAddress('')).toBe(false);
    });
  });

  describe('getNetworkStatus', () => {
    it('should return network connection status', async () => {
      const mockStatus = {
        connected: true,
        blockNumber: 123456,
        chainId: 56
      };

      vi.mocked(blockchainService.getNetworkStatus).mockResolvedValue(mockStatus);

      const result = await walletService.getNetworkStatus();

      expect(result).toEqual(mockStatus);
      expect(blockchainService.getNetworkStatus).toHaveBeenCalled();
    });
  });
});