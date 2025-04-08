import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ethers } from 'ethers';
import { useToast } from '../hooks/use-toast';

// Addresses of the deployed contracts
const NEPALIPAY_TOKEN_ADDRESS = '0x69d34B25809b346702C21EB0E22EAD8C1de58D66';
const NEPALIPAY_ADDRESS = '0xe2d189f6696ee8b247ceae97fe3f1f2879054553';
const FEE_RELAYER_ADDRESS = '0x7ff2271749409f9137dac1e082962e21cc99aee6';

// Contract ABIs (simplified for now)
const TOKEN_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function mint(address to, uint256 amount) returns (bool)',
];

const NEPALIPAY_ABI = [
  'function getUserWallet(address userAddress) view returns (address)',
  'function transferWithFee(address to, uint256 amount) returns (bool)',
  'function getTransactionFee(uint256 amount) view returns (uint256)',
  'function createLoan(uint256 collateralAmount, uint256 loanAmount, uint256 term) returns (uint256)',
  'function repayLoan(uint256 loanId) returns (bool)',
];

const FEE_RELAYER_ABI = [
  'function relayTransaction(address target, bytes memory data, address token, uint256 fee) returns (bool)',
  'function estimateFee(address target, bytes memory data) view returns (uint256)',
];

// Blockchain context type
interface BlockchainContextType {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  tokenContract: ethers.Contract | null;
  nepaliPayContract: ethers.Contract | null;
  feeRelayerContract: ethers.Contract | null;
  walletAddress: string | null;
  connecting: boolean;
  connected: boolean;
  chainId: number | null;
  balance: string;
  balanceInNpt: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  transferTokens: (to: string, amount: string) => Promise<ethers.TransactionResponse>;
  getTransactionFee: (amount: string) => Promise<string>;
  updateBalance: () => Promise<void>;
}

// Create context
const BlockchainContext = createContext<BlockchainContextType | null>(null);

// Provider component
export const BlockchainProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [tokenContract, setTokenContract] = useState<ethers.Contract | null>(null);
  const [nepaliPayContract, setNepaliPayContract] = useState<ethers.Contract | null>(null);
  const [feeRelayerContract, setFeeRelayerContract] = useState<ethers.Contract | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [balanceInNpt, setBalanceInNpt] = useState<string>('0');

  // Initialize provider if window.ethereum is available
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const ethereumProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(ethereumProvider);
        
        // Listen for chain changes
        window.ethereum.on('chainChanged', (chainId: string) => {
          window.location.reload();
        });
        
        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts: string[]) => {
          if (accounts.length === 0) {
            // User disconnected their wallet
            disconnectWallet();
          } else {
            // Account changed, update the state
            setWalletAddress(accounts[0]);
            updateBalance();
          }
        });
        
        // Check if already connected
        ethereumProvider.listAccounts().then((accounts) => {
          if (accounts.length > 0) {
            // User is already connected
            connectWallet();
          }
        }).catch(console.error);
        
      } catch (error) {
        console.error('Error initializing ethereum provider:', error);
      }
    }
    
    return () => {
      // Cleanup event listeners
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', () => {});
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  // Connect wallet function
  const connectWallet = useCallback(async () => {
    if (!provider) {
      toast({
        title: 'Wallet Error',
        description: 'No Ethereum provider found. Please install MetaMask.',
        variant: 'destructive',
      });
      return;
    }
    
    setConnecting(true);
    
    try {
      // Request account access
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }
      
      // Get signer and chain ID
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);
      
      // Set state
      setSigner(signer);
      setWalletAddress(accounts[0]);
      setChainId(chainId);
      setConnected(true);
      
      // Initialize contracts
      const tokenContract = new ethers.Contract(NEPALIPAY_TOKEN_ADDRESS, TOKEN_ABI, signer);
      const nepaliPayContract = new ethers.Contract(NEPALIPAY_ADDRESS, NEPALIPAY_ABI, signer);
      const feeRelayerContract = new ethers.Contract(FEE_RELAYER_ADDRESS, FEE_RELAYER_ABI, signer);
      
      setTokenContract(tokenContract);
      setNepaliPayContract(nepaliPayContract);
      setFeeRelayerContract(feeRelayerContract);
      
      // Get balances
      await updateBalance();
      
      toast({
        title: 'Wallet Connected',
        description: `Connected to ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`,
      });
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      toast({
        title: 'Connection Failed',
        description: error.message || 'Failed to connect wallet',
        variant: 'destructive',
      });
    } finally {
      setConnecting(false);
    }
  }, [provider, toast]);

  // Disconnect wallet function
  const disconnectWallet = useCallback(() => {
    setSigner(null);
    setWalletAddress(null);
    setChainId(null);
    setConnected(false);
    setTokenContract(null);
    setNepaliPayContract(null);
    setFeeRelayerContract(null);
    setBalance('0');
    setBalanceInNpt('0');
    
    toast({
      title: 'Wallet Disconnected',
      description: 'Your wallet has been disconnected',
    });
  }, [toast]);

  // Update balance function
  const updateBalance = useCallback(async () => {
    if (!provider || !walletAddress) return;
    
    try {
      // Get native token balance (BNB)
      const balance = await provider.getBalance(walletAddress);
      setBalance(ethers.formatEther(balance));
      
      // Get NPT token balance if contract is initialized
      if (tokenContract) {
        const nptBalance = await tokenContract.balanceOf(walletAddress);
        setBalanceInNpt(ethers.formatUnits(nptBalance, 18));
      }
    } catch (error) {
      console.error('Error updating balance:', error);
    }
  }, [provider, walletAddress, tokenContract]);

  // Transfer tokens function
  const transferTokens = useCallback(async (to: string, amount: string) => {
    if (!tokenContract || !signer) {
      throw new Error('Wallet not connected');
    }
    
    try {
      // Convert amount to wei (or the appropriate decimals)
      const amountInWei = ethers.parseUnits(amount, 18);
      
      // Send the transaction
      const tx = await tokenContract.transfer(to, amountInWei);
      
      // Update balances after transfer
      await updateBalance();
      
      return tx;
    } catch (error: any) {
      console.error('Error transferring tokens:', error);
      throw new Error(error.message || 'Failed to transfer tokens');
    }
  }, [tokenContract, signer, updateBalance]);

  // Get transaction fee function
  const getTransactionFee = useCallback(async (amount: string) => {
    if (!nepaliPayContract) {
      throw new Error('Wallet not connected');
    }
    
    try {
      // Convert amount to wei
      const amountInWei = ethers.parseUnits(amount, 18);
      
      // Get fee from contract
      const feeInWei = await nepaliPayContract.getTransactionFee(amountInWei);
      
      // Convert fee back to ether (or token decimals)
      return ethers.formatUnits(feeInWei, 18);
    } catch (error: any) {
      console.error('Error getting transaction fee:', error);
      throw new Error(error.message || 'Failed to get transaction fee');
    }
  }, [nepaliPayContract]);

  const contextValue: BlockchainContextType = {
    provider,
    signer,
    tokenContract,
    nepaliPayContract,
    feeRelayerContract,
    walletAddress,
    connecting,
    connected,
    chainId,
    balance,
    balanceInNpt,
    connectWallet,
    disconnectWallet,
    transferTokens,
    getTransactionFee,
    updateBalance,
  };

  return (
    <BlockchainContext.Provider value={contextValue}>
      {children}
    </BlockchainContext.Provider>
  );
};

// Hook for using the blockchain context
export function useBlockchain() {
  const context = useContext(BlockchainContext);
  if (!context) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
}

// Extend the Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}