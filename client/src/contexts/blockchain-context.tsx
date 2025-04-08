import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ethers } from 'ethers';

// ABI for NepaliPayToken
const tokenAbi = [
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
];

interface BlockchainContextType {
  isConnecting: boolean;
  connectedWallet: string | null;
  tokenBalance: string;
  tokenName: string;
  tokenSymbol: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  refreshBalance: () => Promise<void>;
  transferTokens: (to: string, amount: string) => Promise<boolean>;
  errorMessage: string | null;
}

export const BlockchainContext = createContext<BlockchainContextType | null>(null);

// Contract addresses
const TOKEN_CONTRACT_ADDRESS = '0x7dd7e8b83706a1193af0f2aa5559fd50f94ed5ae'; // NepaliPayToken on BSC

export const BlockchainProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [tokenBalance, setTokenBalance] = useState('0');
  const [tokenName, setTokenName] = useState('NepaliPay Token');
  const [tokenSymbol, setTokenSymbol] = useState('NPT');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize provider and contract
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [tokenContract, setTokenContract] = useState<ethers.Contract | null>(null);

  // Check if wallet is already connected
  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (window.ethereum?.selectedAddress) {
          const address = window.ethereum.selectedAddress;
          setConnectedWallet(address);
          initializeProvider();
        }
      } catch (error) {
        console.error('Failed to check existing connection:', error);
      }
    };

    checkConnection();

    // Listen for account changes
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setConnectedWallet(null);
        setTokenBalance('0');
      } else if (accounts[0] !== connectedWallet) {
        setConnectedWallet(accounts[0]);
        refreshBalance();
      }
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  // Initialize provider and contracts when wallet connects
  const initializeProvider = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('No Ethereum wallet detected');
      }

      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(browserProvider);

      const signer = await browserProvider.getSigner();
      const token = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, tokenAbi, signer);
      setTokenContract(token);

      // Get token info
      const name = await token.name();
      const symbol = await token.symbol();
      setTokenName(name);
      setTokenSymbol(symbol);

      // Get initial balance
      await refreshBalanceInternal(token, signer.address);
    } catch (error) {
      console.error('Failed to initialize provider:', error);
      setErrorMessage('Failed to initialize blockchain connection');
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    setIsConnecting(true);
    setErrorMessage(null);

    try {
      if (!window.ethereum) {
        throw new Error('No Ethereum wallet detected. Please install MetaMask or another Ethereum wallet.');
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length === 0) {
        throw new Error('No accounts found. Please create an account in your wallet.');
      }

      setConnectedWallet(accounts[0]);
      
      await initializeProvider();
      
      toast({
        title: 'Wallet Connected',
        description: `Connected to ${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`,
      });
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      setErrorMessage(error.message || 'Failed to connect wallet');
      
      toast({
        title: 'Connection Failed',
        description: error.message || 'Failed to connect wallet',
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setConnectedWallet(null);
    setTokenBalance('0');
    setProvider(null);
    setTokenContract(null);
    
    toast({
      title: 'Wallet Disconnected',
      description: 'Your wallet has been disconnected',
    });
  };

  // Refresh token balance internal helper
  const refreshBalanceInternal = async (contract: ethers.Contract, address: string) => {
    try {
      const balance = await contract.balanceOf(address);
      const decimals = await contract.decimals();
      const formattedBalance = ethers.formatUnits(balance, decimals);
      setTokenBalance(formattedBalance);
      return formattedBalance;
    } catch (error) {
      console.error('Failed to refresh balance:', error);
      throw error;
    }
  };

  // Refresh token balance
  const refreshBalance = async () => {
    if (!tokenContract || !connectedWallet || !provider) {
      return;
    }

    try {
      await refreshBalanceInternal(tokenContract, connectedWallet);
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to refresh balance');
      
      toast({
        title: 'Balance Update Failed',
        description: 'Failed to update your token balance',
        variant: 'destructive',
      });
    }
  };

  // Transfer tokens
  const transferTokens = async (to: string, amount: string): Promise<boolean> => {
    if (!tokenContract || !connectedWallet || !provider) {
      setErrorMessage('Wallet not connected');
      return false;
    }

    try {
      const decimals = await tokenContract.decimals();
      const parsedAmount = ethers.parseUnits(amount, decimals);
      
      const tx = await tokenContract.transfer(to, parsedAmount);
      
      toast({
        title: 'Transaction Sent',
        description: 'Your transfer transaction has been sent to the blockchain',
      });
      
      await tx.wait();
      
      await refreshBalance();
      
      toast({
        title: 'Transfer Successful',
        description: `Successfully transferred ${amount} ${tokenSymbol} to ${to.substring(0, 6)}...${to.substring(to.length - 4)}`,
      });
      
      return true;
    } catch (error: any) {
      console.error('Transfer failed:', error);
      
      const errorMessage = error.message || 'Failed to transfer tokens';
      setErrorMessage(errorMessage);
      
      toast({
        title: 'Transfer Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return false;
    }
  };

  const value: BlockchainContextType = {
    isConnecting,
    connectedWallet,
    tokenBalance,
    tokenName,
    tokenSymbol,
    connectWallet,
    disconnectWallet,
    refreshBalance,
    transferTokens,
    errorMessage,
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
};

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  
  if (!context) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  
  return context;
};