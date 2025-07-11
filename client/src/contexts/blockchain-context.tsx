import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { useToast } from '@/hooks/use-toast';

// TypeScript interfaces
declare global {
  interface Window {
    ethereum?: any;
  }
}

type BlockchainContextType = {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  tokenContract: ethers.Contract | null;
  nepaliPayContract: ethers.Contract | null;
  feeRelayerContract: ethers.Contract | null;
  account: string | null;
  chainId: number | null;
  balance: string;
  tokenBalance: string;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  tokenPrice: {
    nprRate: number;
    usdRate: number;
    eurRate: number;
    gbpRate: number;
  };
  exchangeRates: {
    [currency: string]: number;
  };
  feeStructure: {
    purchaseFee: number;
    transferFee: number;
    paymentFee: number;
    withdrawalFee: number;
  };
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  refreshBalances: () => Promise<void>;
  sendTokens: (toAddress: string, amount: string) => Promise<string>;
  depositTokens: (amount: string) => Promise<string>;
  withdrawTokens: (amount: string) => Promise<string>;
  setUsername: (username: string) => Promise<string>;
  addCollateral: (type: string, amount: string) => Promise<string>;
  takeLoan: (amount: string, collateralId: number) => Promise<string>;
  repayLoan: (loanId: number, amount: string) => Promise<string>;
  claimReferralReward: (referralCode: string) => Promise<string>;
  claimCashback: (transactionId: string) => Promise<string>;
  relayTransaction: (data: string, signature: string) => Promise<string>;
  getTokenPrice: () => Promise<void>;
  calculateTokenAmount: (fiatAmount: number, currency: string) => number;
  calculateFiatAmount: (tokenAmount: number, currency: string) => number;
  isCorrectNetwork: boolean;
  switchToBscNetwork: () => Promise<void>;
};

// Contract addresses on BSC Mainnet
const TOKEN_CONTRACT_ADDRESS = '0x8619AC8a93FfD39F8E7eEcDc6Bfd2C8Ffc7aCD64';
const NEPALIPAY_CONTRACT_ADDRESS = '0x9619Db1A86fFD59F8E7eEcDc6cfd2C8ffc7aCc64';
const FEE_RELAYER_CONTRACT_ADDRESS = '0xA619Dc1a86fFD59f8e7eeeDc6bfD2c8ffc7acC64';

// BSC Chain ID
const BSC_CHAIN_ID = 56;

// Token contract ABI (simplified for demo)
const TOKEN_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function getTokenPrice() view returns (uint256)',
  'function getTokenPriceInUSD() view returns (uint256)',
  'function getTokenPriceInEUR() view returns (uint256)',
  'function getTokenPriceInGBP() view returns (uint256)',
  'function getExchangeRate(string currency) view returns (uint256)',
  'function getPurchaseFee() view returns (uint256)',
  'function getTransferFee() view returns (uint256)',
  'function getPaymentFee() view returns (uint256)',
  'function getWithdrawalFee() view returns (uint256)',
];

// Default context value
const defaultContextValue: BlockchainContextType = {
  provider: null,
  signer: null,
  tokenContract: null,
  nepaliPayContract: null,
  feeRelayerContract: null,
  account: null,
  chainId: null,
  balance: '0',
  tokenBalance: '0',
  isConnected: false,
  isLoading: false,
  error: null,
  tokenPrice: { nprRate: 1, usdRate: 0.0075, eurRate: 0.0070, gbpRate: 0.0060 },
  exchangeRates: { NPR: 1, USD: 133.05, EUR: 143.25, GBP: 167.40 },
  feeStructure: { purchaseFee: 0.01, transferFee: 0.005, paymentFee: 0.002, withdrawalFee: 0.01 },
  connectWallet: async () => {},
  disconnectWallet: () => {},
  refreshBalances: async () => {},
  sendTokens: async () => '',
  depositTokens: async () => '',
  withdrawTokens: async () => '',
  setUsername: async () => '',
  addCollateral: async () => '',
  takeLoan: async () => '',
  repayLoan: async () => '',
  claimReferralReward: async () => '',
  claimCashback: async () => '',
  relayTransaction: async () => '',
  getTokenPrice: async () => {},
  calculateTokenAmount: () => 0,
  calculateFiatAmount: () => 0,
  isCorrectNetwork: false,
  switchToBscNetwork: async () => {},
};

// Create blockchain context
const BlockchainContext = createContext<BlockchainContextType>(defaultContextValue);

// Blockchain provider component
export const BlockchainProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  
  // State variables
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [tokenContract, setTokenContract] = useState<ethers.Contract | null>(null);
  const [nepaliPayContract, setNepaliPayContract] = useState<ethers.Contract | null>(null);
  const [feeRelayerContract, setFeeRelayerContract] = useState<ethers.Contract | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [tokenBalance, setTokenBalance] = useState<string>('0');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState<boolean>(false);
  const [tokenPrice, setTokenPrice] = useState<{
    nprRate: number;
    usdRate: number;
    eurRate: number;
    gbpRate: number;
  }>({ nprRate: 1, usdRate: 0.0075, eurRate: 0.0070, gbpRate: 0.0060 });
  const [exchangeRates, setExchangeRates] = useState<{ [currency: string]: number }>({
    NPR: 1,
    USD: 133.05,
    EUR: 143.25,
    GBP: 167.40
  });
  const [feeStructure, setFeeStructure] = useState<{
    purchaseFee: number;
    transferFee: number;
    paymentFee: number;
    withdrawalFee: number;
  }>({
    purchaseFee: 0.01,
    transferFee: 0.005,
    paymentFee: 0.002,
    withdrawalFee: 0.01
  });

  // Load smart contracts
  const loadContracts = async (signer: ethers.JsonRpcSigner) => {
    try {
      const tokenContract = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, TOKEN_ABI, signer);
      setTokenContract(tokenContract);
      
      // Load price data immediately after contract connection
      await getTokenPrice();
    } catch (error) {
      console.error("Error loading contracts:", error);
      setError("Failed to load contracts");
    }
  };

  // Refresh balances function
  const refreshBalances = async () => {
    if (!provider || !account) return;

    setIsLoading(true);
    try {
      // Get BNB balance from blockchain
      const bnbBalance = await provider.getBalance(account);
      setBalance(ethers.formatEther(bnbBalance));

      // Get NPT token balance from smart contract
      if (tokenContract && account) {
        const nptBalance = await tokenContract.balanceOf(account);
        setTokenBalance(ethers.formatUnits(nptBalance, 18));
      }
    } catch (error: any) {
      console.error('Error refreshing balances:', error);
      setError(error.message || 'Error refreshing balances');
    } finally {
      setIsLoading(false);
    }
  };

  // Get token price function from smart contract
  const getTokenPrice = async (): Promise<void> => {
    if (!tokenContract) {
      console.log('Token contract not available for price fetching');
      return;
    }

    setIsLoading(true);
    try {
      // Get token prices from smart contract
      const nprPrice = await tokenContract.getTokenPrice();
      const usdPrice = await tokenContract.getTokenPriceInUSD(); 
      const eurPrice = await tokenContract.getTokenPriceInEUR();
      const gbpPrice = await tokenContract.getTokenPriceInGBP();
      
      // Set token price
      setTokenPrice({
        nprRate: parseFloat(ethers.formatUnits(nprPrice, 6)),
        usdRate: parseFloat(ethers.formatUnits(usdPrice, 6)),
        eurRate: parseFloat(ethers.formatUnits(eurPrice, 6)),
        gbpRate: parseFloat(ethers.formatUnits(gbpPrice, 6))
      });
      
      // Get exchange rates from smart contract
      const usdExchangeRate = await tokenContract.getExchangeRate('USD');
      const eurExchangeRate = await tokenContract.getExchangeRate('EUR');
      const gbpExchangeRate = await tokenContract.getExchangeRate('GBP');
      
      // Set exchange rates
      setExchangeRates({
        NPR: 1,
        USD: parseFloat(ethers.formatUnits(usdExchangeRate, 6)),
        EUR: parseFloat(ethers.formatUnits(eurExchangeRate, 6)),
        GBP: parseFloat(ethers.formatUnits(gbpExchangeRate, 6))
      });
      
      // Get fee structure from smart contract
      const purchaseFee = await tokenContract.getPurchaseFee();
      const transferFee = await tokenContract.getTransferFee();
      const paymentFee = await tokenContract.getPaymentFee();
      const withdrawalFee = await tokenContract.getWithdrawalFee();
      
      // Set fee structure
      setFeeStructure({
        purchaseFee: parseFloat(ethers.formatUnits(purchaseFee, 6)),
        transferFee: parseFloat(ethers.formatUnits(transferFee, 6)),
        paymentFee: parseFloat(ethers.formatUnits(paymentFee, 6)),
        withdrawalFee: parseFloat(ethers.formatUnits(withdrawalFee, 6))
      });
    } catch (error: any) {
      console.error('Error getting token price:', error);
      setError(error.message || 'Error getting token price');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Calculate token amount from fiat amount using real-time exchange rates
  const calculateTokenAmount = (fiatAmount: number, currency: string): number => {
    if (!fiatAmount || fiatAmount <= 0) return 0;
    
    if (currency === 'NPR') {
      // Direct conversion - 1 NPT = 1 NPR
      return fiatAmount;
    } else {
      // Use exchange rate from smart contract
      const rate = exchangeRates[currency] || 1;
      return fiatAmount / rate;
    }
  };
  
  // Calculate fiat amount from token amount using real-time exchange rates
  const calculateFiatAmount = (tokenAmount: number, currency: string): number => {
    if (!tokenAmount || tokenAmount <= 0) return 0;
    
    if (currency === 'NPR') {
      const nprRate = tokenPrice.nprRate || 1;
      return tokenAmount * nprRate;
    } else {
      const rate = exchangeRates[currency] || 1;
      return tokenAmount * rate;
    }
  };

  // Initialize blockchain connection
  useEffect(() => {
    const initialize = async () => {
      try {
        if (window.ethereum) {
          // Create provider
          const web3Provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(web3Provider);

          // Get network info
          const network = await web3Provider.getNetwork();
          const currentChainId = Number(network.chainId);
          setChainId(currentChainId);
          setIsCorrectNetwork(currentChainId === BSC_CHAIN_ID);

          // Check if already connected
          const accounts = await web3Provider.listAccounts();
          if (accounts.length > 0) {
            const address = accounts[0].address;
            setAccount(address);
            const signer = await web3Provider.getSigner();
            setSigner(signer);
            setIsConnected(true);
            
            // Load contracts
            await loadContracts(signer);
            
            // Get balances
            const bnbBalance = await web3Provider.getBalance(accounts[0].address);
            setBalance(ethers.formatEther(bnbBalance));
          }
        }
      } catch (error) {
        console.error('Error initializing blockchain:', error);
      }
    };

    initialize();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setAccount(accounts[0]);
        }
      });

      window.ethereum.on('chainChanged', (chainId: string) => {
        const newChainId = parseInt(chainId, 16);
        setChainId(newChainId);
        setIsCorrectNetwork(newChainId === BSC_CHAIN_ID);
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  // Connect wallet function
  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({
        title: 'MetaMask not installed',
        description: 'Please install MetaMask to use this feature',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      setAccount(account);
      setIsConnected(true);

      // Get current chain ID
      const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
      const chainId = parseInt(chainIdHex, 16);
      setChainId(chainId);
      setIsCorrectNetwork(chainId === BSC_CHAIN_ID);

      // Get provider and signer
      if (provider) {
        const newSigner = await provider.getSigner();
        setSigner(newSigner);
        
        // Load contracts
        await loadContracts(newSigner);
        
        // Refresh balances
        await refreshBalances();
      }

      toast({
        title: 'Wallet Connected',
        description: 'Your wallet has been connected successfully',
        variant: 'default',
      });
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      setError(error.message || 'Error connecting wallet');
      toast({
        title: 'Connection Failed',
        description: error.message || 'Failed to connect wallet',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect wallet function
  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    setBalance('0');
    setTokenBalance('0');
    
    toast({
      title: 'Wallet Disconnected',
      description: 'Your wallet has been disconnected',
      variant: 'default',
    });
  };

  // Switch to BSC Network
  const switchToBscNetwork = async () => {
    if (!window.ethereum) {
      toast({
        title: 'MetaMask not installed',
        description: 'Please install MetaMask to use this feature',
        variant: 'destructive',
      });
      return;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x38' }], // BSC Mainnet: 0x38 (in hex)
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x38',
                chainName: 'Binance Smart Chain',
                nativeCurrency: {
                  name: 'BNB',
                  symbol: 'BNB',
                  decimals: 18,
                },
                rpcUrls: ['https://bsc-dataseed.binance.org/'],
                blockExplorerUrls: ['https://bscscan.com/'],
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding BSC network:', addError);
        }
      } else {
        console.error('Error switching to BSC network:', switchError);
      }
    }
  };

  // Blockchain transaction functions - all use real smart contracts
  const sendTokens = async (toAddress: string, amount: string): Promise<string> => {
    if (!tokenContract || !signer) throw new Error('Contract not available');
    
    setIsLoading(true);
    try {
      const parsedAmount = ethers.parseUnits(amount, 18);
      const tx = await tokenContract.transfer(toAddress, parsedAmount);
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error: any) {
      console.error('Error sending tokens:', error);
      throw new Error(error.message || 'Error sending tokens');
    } finally {
      setIsLoading(false);
    }
  };

  const depositTokens = async (amount: string): Promise<string> => {
    if (!nepaliPayContract || !signer) throw new Error('Contract not available');
    
    setIsLoading(true);
    try {
      const parsedAmount = ethers.parseUnits(amount, 18);
      const tx = await nepaliPayContract.depositTokens(parsedAmount);
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error: any) {
      console.error('Error depositing tokens:', error);
      throw new Error(error.message || 'Error depositing tokens');
    } finally {
      setIsLoading(false);
    }
  };

  const withdrawTokens = async (amount: string): Promise<string> => {
    if (!nepaliPayContract || !signer) throw new Error('Contract not available');
    
    setIsLoading(true);
    try {
      const parsedAmount = ethers.parseUnits(amount, 18);
      const tx = await nepaliPayContract.withdrawTokens(parsedAmount);
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error: any) {
      console.error('Error withdrawing tokens:', error);
      throw new Error(error.message || 'Error withdrawing tokens');
    } finally {
      setIsLoading(false);
    }
  };

  const setUsername = async (username: string): Promise<string> => {
    if (!nepaliPayContract || !signer) throw new Error('Contract not available');
    
    setIsLoading(true);
    try {
      const tx = await nepaliPayContract.setUsername(username);
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error: any) {
      console.error('Error setting username:', error);
      throw new Error(error.message || 'Error setting username');
    } finally {
      setIsLoading(false);
    }
  };

  const addCollateral = async (type: string, amount: string): Promise<string> => {
    if (!nepaliPayContract || !signer) throw new Error('Contract not available');
    
    setIsLoading(true);
    try {
      const parsedAmount = ethers.parseUnits(amount, 18);
      const tx = await nepaliPayContract.addCollateral(type, parsedAmount);
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error: any) {
      console.error('Error adding collateral:', error);
      throw new Error(error.message || 'Error adding collateral');
    } finally {
      setIsLoading(false);
    }
  };

  const takeLoan = async (amount: string, collateralId: number): Promise<string> => {
    if (!nepaliPayContract || !signer) throw new Error('Contract not available');
    
    setIsLoading(true);
    try {
      const parsedAmount = ethers.parseUnits(amount, 18);
      const tx = await nepaliPayContract.takeLoan(parsedAmount, collateralId);
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error: any) {
      console.error('Error taking loan:', error);
      throw new Error(error.message || 'Error taking loan');
    } finally {
      setIsLoading(false);
    }
  };

  const repayLoan = async (loanId: number, amount: string): Promise<string> => {
    if (!nepaliPayContract || !signer) throw new Error('Contract not available');
    
    setIsLoading(true);
    try {
      const parsedAmount = ethers.parseUnits(amount, 18);
      const tx = await nepaliPayContract.repayLoan(loanId, parsedAmount);
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error: any) {
      console.error('Error repaying loan:', error);
      throw new Error(error.message || 'Error repaying loan');
    } finally {
      setIsLoading(false);
    }
  };

  const claimReferralReward = async (referralCode: string): Promise<string> => {
    if (!nepaliPayContract || !signer) throw new Error('Contract not available');
    
    setIsLoading(true);
    try {
      const tx = await nepaliPayContract.claimReferralReward(referralCode);
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error: any) {
      console.error('Error claiming referral reward:', error);
      throw new Error(error.message || 'Error claiming referral reward');
    } finally {
      setIsLoading(false);
    }
  };

  const claimCashback = async (transactionId: string): Promise<string> => {
    if (!nepaliPayContract || !signer) throw new Error('Contract not available');
    
    setIsLoading(true);
    try {
      const tx = await nepaliPayContract.claimCashback(transactionId);
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error: any) {
      console.error('Error claiming cashback:', error);
      throw new Error(error.message || 'Error claiming cashback');
    } finally {
      setIsLoading(false);
    }
  };

  const relayTransaction = async (data: string, signature: string): Promise<string> => {
    if (!feeRelayerContract || !signer) throw new Error('Contract not available');
    
    setIsLoading(true);
    try {
      const tx = await feeRelayerContract.relayTransaction(data, signature);
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error: any) {
      console.error('Error relaying transaction:', error);
      throw new Error(error.message || 'Error relaying transaction');
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const contextValue: BlockchainContextType = {
    provider,
    signer,
    tokenContract,
    nepaliPayContract,
    feeRelayerContract,
    account,
    chainId,
    balance,
    tokenBalance,
    isConnected,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    refreshBalances,
    sendTokens,
    depositTokens,
    withdrawTokens,
    setUsername,
    addCollateral,
    takeLoan,
    repayLoan,
    claimReferralReward,
    claimCashback,
    relayTransaction,
    isCorrectNetwork,
    switchToBscNetwork,
    tokenPrice,
    exchangeRates,
    feeStructure,
    getTokenPrice,
    calculateTokenAmount,
    calculateFiatAmount,
  };

  return (
    <BlockchainContext.Provider value={contextValue}>
      {children}
    </BlockchainContext.Provider>
  );
};

// Hook to use blockchain context
export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (!context) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
};

export default BlockchainContext;