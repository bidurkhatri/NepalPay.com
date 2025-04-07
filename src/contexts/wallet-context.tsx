import { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import { useBlockchain } from './blockchain-context';
import { useToast } from '@/hooks/use-toast';
import { WalletBalance, Transaction } from '../types';
import { apiRequest } from '@/lib/queryClient';

// Wallet context type
type WalletContextType = {
  address: string | null;
  balance: WalletBalance;
  transactions: Transaction[];
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  updateAddress: (address: string) => Promise<void>;
  fetchTransactions: () => Promise<void>;
  demoMode: boolean;
  toggleDemoMode: () => void;
};

// Default context values
const defaultContextValue: WalletContextType = {
  address: null,
  balance: { bnb: '0', npt: '0' },
  transactions: [],
  isConnected: false,
  isLoading: false,
  error: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  updateAddress: async () => {},
  fetchTransactions: async () => {},
  demoMode: false,
  toggleDemoMode: () => {},
};

// Create context
const WalletContext = createContext<WalletContextType>(defaultContextValue);

// Provider component
export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const blockchain = useBlockchain();
  
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<WalletBalance>({ bnb: '0', npt: '0' });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState<boolean>(false);

  // Initialize from blockchain context
  useEffect(() => {
    // If blockchain context is connected, update our state
    if (blockchain.isConnected) {
      setAddress(blockchain.account);
      setBalance({
        bnb: blockchain.balance,
        npt: blockchain.tokenBalance
      });
      setIsConnected(true);
    } else {
      // If blockchain context is disconnected and we're not in demo mode, reset our state
      if (!demoMode) {
        setAddress(null);
        setBalance({ bnb: '0', npt: '0' });
        setIsConnected(false);
      }
    }
  }, [blockchain.isConnected, blockchain.account, blockchain.balance, blockchain.tokenBalance, demoMode]);

  // Sync demo mode with blockchain context
  useEffect(() => {
    if (blockchain.demoMode !== demoMode) {
      setDemoMode(blockchain.demoMode);
    }
  }, [blockchain.demoMode]);

  // Connect wallet function
  const connectWallet = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use blockchain context to connect
      await blockchain.connectWallet();
      
      // Get transaction history from API
      await fetchTransactions();
      
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      setError(error.message || 'Failed to connect wallet');
      toast({
        title: 'Connection Error',
        description: error.message || 'Failed to connect wallet',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect wallet function
  const disconnectWallet = () => {
    // Use blockchain context to disconnect
    blockchain.disconnectWallet();
    
    // Clear transaction history
    setTransactions([]);
  };

  // Update address function (when user changes it in settings)
  const updateAddress = async (newAddress: string) => {
    try {
      setIsLoading(true);
      
      // Validate address format
      if (!/^0x[a-fA-F0-9]{40}$/.test(newAddress)) {
        throw new Error('Invalid wallet address format');
      }
      
      // Save to user profile via API
      await apiRequest('PATCH', '/api/user/wallet', { walletAddress: newAddress });
      
      setAddress(newAddress);
      
      toast({
        title: 'Address Updated',
        description: 'Your wallet address has been updated successfully',
        variant: 'default',
      });
    } catch (error: any) {
      console.error('Error updating address:', error);
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update wallet address',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch transactions from API
  const fetchTransactions = async () => {
    if (demoMode) {
      // Generate demo transactions
      const demoTransactions: Transaction[] = [
        {
          id: 1,
          hash: '0xdemo1...',
          from: '0xDemoAddress...1234',
          to: '0xRecipient...5678',
          amount: '100',
          token: 'NPT',
          fee: '0.001',
          status: 'completed',
          timestamp: new Date().toISOString(),
          type: 'send',
          description: 'Payment for services'
        },
        {
          id: 2,
          hash: '0xdemo2...',
          from: '0xSender...9012',
          to: '0xDemoAddress...1234',
          amount: '200',
          token: 'NPT',
          fee: '0.001',
          status: 'completed',
          timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          type: 'receive',
          description: 'Salary payment'
        },
        {
          id: 3,
          hash: '0xdemo3...',
          from: '0xDemoAddress...1234',
          to: '0xNepaliPay...Contract',
          amount: '50',
          token: 'NPT',
          fee: '0.001',
          status: 'completed',
          timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          type: 'deposit',
          description: 'Deposit to earn interest'
        }
      ];
      setTransactions(demoTransactions);
      return;
    }

    if (!address) return;

    try {
      setIsLoading(true);
      
      // Get transactions from API
      const response = await apiRequest('GET', `/api/transactions?address=${address}`);
      const data = await response.json();
      
      setTransactions(data);
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      // Don't show toast for this error as it's not critical
      // Just log it for debugging
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle demo mode
  const toggleDemoMode = () => {
    // Toggle blockchain demo mode which will update our state via useEffect
    blockchain.toggleDemoMode();
  };

  // Create context value
  const contextValue: WalletContextType = {
    address,
    balance,
    transactions,
    isConnected,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    updateAddress,
    fetchTransactions,
    demoMode,
    toggleDemoMode,
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};

// Hook to use wallet context
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export default WalletContext;