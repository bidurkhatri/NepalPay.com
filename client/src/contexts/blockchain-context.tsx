import { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useToast } from '@/hooks/use-toast';

// Define ethereum in window object
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Contract addresses from deployed contracts
// Updated with the addresses you provided
const NEPALI_PAY_TOKEN_ADDRESS = '0x69d34B25809b346702C21EB0E22EAD8C1de58D66';
const NEPALI_PAY_ADDRESS = '0xe2d189f6696ee8b247ceae97fe3f1f2879054553';
const FEE_RELAYER_ADDRESS = '0x7ff2271749409f9137dac1e082962e21cc99aee6';

// Treasury wallet address for sending tokens after Stripe payments
const TREASURY_WALLET_ADDRESS = '0x67890B25809b346702C21EB0E22EADF2de58D77';

// BSC Mainnet chain ID
const BSC_CHAIN_ID = 56;

// Blockchain context type definition
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
  demoMode: boolean;
  toggleDemoMode: () => Promise<void>;
};

// Default value for context
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
  tokenPrice: {
    nprRate: 1,
    usdRate: 0.0075,
    eurRate: 0.0070,
    gbpRate: 0.0060
  },
  exchangeRates: {
    NPR: 1,
    USD: 133.05,
    EUR: 143.25,
    GBP: 167.40
  },
  feeStructure: {
    purchaseFee: 0.02,    // 2% default
    transferFee: 0.01,    // 1% default
    paymentFee: 0.015,    // 1.5% default
    withdrawalFee: 0.025  // 2.5% default
  },
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
  demoMode: false,
  toggleDemoMode: async () => {},
};

// Create blockchain context
const BlockchainContext = createContext<BlockchainContextType>(defaultContextValue);

// Provider component
export const BlockchainProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
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
  const [demoMode, setDemoMode] = useState<boolean>(false);
  const [tokenPrice, setTokenPrice] = useState<{
    nprRate: number;
    usdRate: number;
    eurRate: number;
    gbpRate: number;
  }>({
    nprRate: 1,
    usdRate: 0.0075,
    eurRate: 0.0070,
    gbpRate: 0.0060
  });
  const [exchangeRates, setExchangeRates] = useState<{
    [currency: string]: number;
  }>({
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
    purchaseFee: 0.02,    // 2% default
    transferFee: 0.01,    // 1% default
    paymentFee: 0.015,    // 1.5% default
    withdrawalFee: 0.025  // 2.5% default
  });

  // Load contracts function
  const loadContracts = async (signer: ethers.JsonRpcSigner) => {
    try {
      // Load token contract ABI
      const tokenContract = new ethers.Contract(
        NEPALI_PAY_TOKEN_ADDRESS,
        [
          "function balanceOf(address) view returns (uint256)",
          "function transfer(address to, uint256 amount) returns (bool)",
          "function approve(address spender, uint256 amount) returns (bool)",
          "function getTokenPrice() view returns (uint256)",
          "function getTokenPriceInUSD() view returns (uint256)",
          "function getTokenPriceInEUR() view returns (uint256)",
          "function getTokenPriceInGBP() view returns (uint256)",
          "function getExchangeRate(string memory currency) view returns (uint256)",
          "function getPurchaseFee() view returns (uint256)",
          "function getTransferFee() view returns (uint256)",
          "function getPaymentFee() view returns (uint256)",
          "function getWithdrawalFee() view returns (uint256)"
        ],
        signer
      );
      setTokenContract(tokenContract);

      // Load NepaliPay contract ABI
      const nepaliPayContract = new ethers.Contract(
        NEPALI_PAY_ADDRESS,
        [
          "function depositTokens(uint256 amount)",
          "function withdrawTokens(uint256 amount)",
          "function setUsername(string memory username)",
          "function addCollateral(string memory collateralType, uint256 amount) payable returns (uint256)",
          "function takeLoan(uint256 amount, uint256 collateralId) returns (uint256)",
          "function repayLoan(uint256 loanId, uint256 amount)",
          "function claimReferralReward(string memory referralCode) returns (uint256)",
          "function claimCashback(string memory txId) returns (uint256)",
          "function getCollateralValue(string memory collateralType, uint256 amount) view returns (uint256)",
          "function getLoanToValueRatio(string memory collateralType) view returns (uint256)",
          "function getLiquidationThreshold(string memory collateralType) view returns (uint256)"
        ],
        signer
      );
      setNepaliPayContract(nepaliPayContract);

      // Load FeeRelayer contract ABI
      const feeRelayerContract = new ethers.Contract(
        FEE_RELAYER_ADDRESS,
        [
          "function relayTransaction(bytes memory data, bytes memory signature) returns (bytes memory)"
        ],
        signer
      );
      setFeeRelayerContract(feeRelayerContract);
      
      // Get token prices from contract
      try {
        // Get price in NPR (base rate)
        const nprRate = await tokenContract.getTokenPrice();
        
        // Get price in USD
        const usdRate = await tokenContract.getTokenPriceInUSD();
        
        // Get price in EUR
        const eurRate = await tokenContract.getTokenPriceInEUR();
        
        // Get price in GBP
        const gbpRate = await tokenContract.getTokenPriceInGBP();
        
        // Set token price rates
        setTokenPrice({
          nprRate: parseFloat(ethers.formatUnits(nprRate, 18)),
          usdRate: parseFloat(ethers.formatUnits(usdRate, 18)),
          eurRate: parseFloat(ethers.formatUnits(eurRate, 18)),
          gbpRate: parseFloat(ethers.formatUnits(gbpRate, 18))
        });
        
        // Get exchange rates
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
      } catch (priceError) {
        console.error("Error getting token prices:", priceError);
        // Don't set error here to avoid blocking the main functionality
      }
    } catch (error) {
      console.error("Error loading contracts:", error);
      setError("Failed to load contracts");
    }
  };

  // Refresh balances function
  const refreshBalances = async () => {
    if (demoMode) {
      // In demo mode, use hardcoded balances
      setBalance('1000');
      setTokenBalance('5000');
      return;
    }

    if (!provider || !account || !tokenContract) return;

    try {
      setIsLoading(true);

      // Get BNB balance
      const bnbBalance = await provider.getBalance(account);
      setBalance(ethers.formatEther(bnbBalance));

      // Get NPT token balance
      const tokenBalance = await tokenContract.balanceOf(account);
      setTokenBalance(ethers.formatUnits(tokenBalance, 18));
    } catch (error: any) {
      console.error('Error refreshing balances:', error);
      setError(error.message || 'Error refreshing balances');
    } finally {
      setIsLoading(false);
    }
  };

  // Get token price function from smart contract
  const getTokenPrice = async (): Promise<void> => {
    if (demoMode) {
      // Use demo values
      setTokenPrice({
        nprRate: 1,
        usdRate: 0.0075,
        eurRate: 0.0070,
        gbpRate: 0.0060
      });
      setExchangeRates({
        NPR: 1,
        USD: 133.05,
        EUR: 143.25,
        GBP: 167.40
      });
      return;
    }

    if (!tokenContract) return;

    try {
      setIsLoading(true);
      
      // Get price in NPR (base rate)
      const nprRate = await tokenContract.getTokenPrice();
      
      // Get price in USD
      const usdRate = await tokenContract.getTokenPriceInUSD();
      
      // Get price in EUR
      const eurRate = await tokenContract.getTokenPriceInEUR();
      
      // Get price in GBP
      const gbpRate = await tokenContract.getTokenPriceInGBP();
      
      // Set token price rates
      setTokenPrice({
        nprRate: parseFloat(ethers.formatUnits(nprRate, 18)),
        usdRate: parseFloat(ethers.formatUnits(usdRate, 18)),
        eurRate: parseFloat(ethers.formatUnits(eurRate, 18)),
        gbpRate: parseFloat(ethers.formatUnits(gbpRate, 18))
      });
      
      // Get exchange rates
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
    
    try {
      console.log("calculateFiatAmount input:", { tokenAmount, currency, tokenPrice, exchangeRates });
      
      if (currency === 'NPR') {
        // For NPR, we still apply the token price (which should be ~1, but might fluctuate)
        const nprRate = tokenPrice.nprRate || 1;
        console.log("Using NPR rate:", nprRate);
        const result = tokenAmount * nprRate;
        console.log("NPR calculation result:", result);
        return result;
      } else {
        // Use exchange rate from smart contract
        const rate = exchangeRates[currency] || 1;
        console.log("Using exchange rate for " + currency + ":", rate);
        const result = tokenAmount * rate;
        console.log(currency + " calculation result:", result);
        return result;
      }
    } catch (error) {
      console.error("Error calculating fiat amount:", error);
      // Fallback to direct conversion if error
      return tokenAmount;
    }
  };

  // Initialize blockchain connection
  useEffect(() => {
    if (demoMode) return;

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
            // Get signer and set account
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
            
            const tokenContract = new ethers.Contract(
              NEPALI_PAY_TOKEN_ADDRESS,
              ["function balanceOf(address) view returns (uint256)"],
              signer
            );
            const nptBalance = await tokenContract.balanceOf(accounts[0].address);
            setTokenBalance(ethers.formatUnits(nptBalance, 18));
          }
        }
      } catch (error: any) {
        console.error("Blockchain initialization error:", error);
        setError(error.message || "Failed to initialize blockchain connection");
      }
    };

    initialize();

    // Set up event listeners for MetaMask events
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('disconnect', handleDisconnect);
    }

    return () => {
      // Clean up event listeners
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('disconnect', handleDisconnect);
      }
    };
  }, [demoMode]);

  // Handle MetaMask account changes
  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected
      disconnectWallet();
    } else {
      // User switched accounts
      setAccount(accounts[0]);
      refreshBalances();
    }
  };

  // Handle MetaMask chain changes
  const handleChainChanged = () => {
    window.location.reload();
  };

  // Handle MetaMask disconnect
  const handleDisconnect = () => {
    disconnectWallet();
  };

  // Connect wallet function
  const connectWallet = async () => {
    if (demoMode) {
      setAccount('0xDemoAddress...1234');
      setIsConnected(true);
      setBalance('1000');
      setTokenBalance('5000');
      return;
    }

    if (!window.ethereum) {
      toast({
        title: 'MetaMask not installed',
        description: 'Please install MetaMask to use this feature',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

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
    
    if (!demoMode) {
      toast({
        title: 'Wallet Disconnected',
        description: 'Your wallet has been disconnected',
        variant: 'default',
      });
    }
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
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x38',
                chainName: 'Binance Smart Chain Mainnet',
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
        } catch (addError: any) {
          console.error('Error adding BSC network:', addError);
          toast({
            title: 'Network Error',
            description: 'Failed to add BSC network to MetaMask',
            variant: 'destructive',
          });
        }
      } else {
        console.error('Error switching to BSC network:', switchError);
        toast({
          title: 'Network Error',
          description: 'Failed to switch to BSC network',
          variant: 'destructive',
        });
      }
    }
  };

  // Toggle demo mode - uses mock contracts for testing
  const toggleDemoMode = async () => {
    console.log("Toggle demo mode called. Current demoMode state:", demoMode);
    
    try {
      // First update demo mode state
      const newDemoModeState = !demoMode;
      console.log("Setting demo mode to:", newDemoModeState);
      setDemoMode(newDemoModeState);
      
      // Create mock implementation for development/testing purposes
      if (newDemoModeState) {
        console.log("Creating mock implementation for demo mode");
        
        // Set basic display values for UI
        setAccount('0xDemoAddress...1234');
        setIsConnected(true);
        setBalance('1000');
        setTokenBalance('5000');
        
        // Create mock contract objects
        console.log("Creating mock contracts with real functions");
        
        // Mock token contract with all required functions
        const mockTokenContract = {
          balanceOf: async () => ethers.parseEther('5000'),
          transfer: async () => ({ wait: async () => ({ hash: '0xdemo' }) }),
          approve: async () => ({ wait: async () => ({ hash: '0xdemo' }) }),
          getTokenPrice: async () => ethers.parseEther('1'),
          getTokenPriceInUSD: async () => ethers.parseEther('0.0075'),
          getTokenPriceInEUR: async () => ethers.parseEther('0.0070'),
          getTokenPriceInGBP: async () => ethers.parseEther('0.0060'),
          getExchangeRate: async (currency: string) => {
            const rates: {[key: string]: any} = {
              NPR: ethers.parseEther('1'),
              USD: ethers.parseEther('133.05'),
              EUR: ethers.parseEther('143.25'),
              GBP: ethers.parseEther('167.40')
            };
            return rates[currency] || ethers.parseEther('1');
          },
          getPurchaseFee: async () => ethers.parseUnits('2', 2), // 2%
          getTransferFee: async () => ethers.parseUnits('1', 2), // 1%
          getPaymentFee: async () => ethers.parseUnits('1.5', 2), // 1.5%
          getWithdrawalFee: async () => ethers.parseUnits('2.5', 2) // 2.5%
        };
        
        // Mock NepaliPay contract with all required functions
        const mockNepaliPayContract = {
          address: NEPALI_PAY_ADDRESS,
          depositTokens: async () => ({ wait: async () => ({ hash: '0xdemo' }) }),
          withdrawTokens: async () => ({ wait: async () => ({ hash: '0xdemo' }) }),
          setUsername: async () => ({ wait: async () => ({ hash: '0xdemo' }) }),
          addCollateral: async () => ({ wait: async () => ({ hash: '0xdemo' }) }),
          takeLoan: async () => ({ wait: async () => ({ hash: '0xdemo' }) }),
          repayLoan: async () => ({ wait: async () => ({ hash: '0xdemo' }) }),
          claimReferralReward: async () => ({ wait: async () => ({ hash: '0xdemo' }) }),
          claimCashback: async () => ({ wait: async () => ({ hash: '0xdemo' }) }),
          getCollateralValue: async (collateralType: string, amount: any) => {
            console.log("Mock getCollateralValue called with:", collateralType, amount);
            const rates: {[key: string]: number} = {
              BNB: 300,
              ETH: 3000,
              BTC: 50000
            };
            const amountNumber = parseFloat(ethers.formatEther(amount));
            return ethers.parseEther((amountNumber * rates[collateralType]).toString());
          },
          getLoanToValueRatio: async (collateralType: string) => {
            console.log("Mock getLoanToValueRatio called with:", collateralType);
            const ratios: {[key: string]: number} = {
              BNB: 70,
              ETH: 75,
              BTC: 65
            };
            return ethers.parseUnits(ratios[collateralType].toString(), 2);
          },
          getLiquidationThreshold: async (collateralType: string) => {
            console.log("Mock getLiquidationThreshold called with:", collateralType);
            const thresholds: {[key: string]: number} = {
              BNB: 85,
              ETH: 90,
              BTC: 80
            };
            return ethers.parseUnits(thresholds[collateralType].toString(), 2);
          }
        };
        
        // Mock FeeRelayer contract
        const mockFeeRelayerContract = {
          address: FEE_RELAYER_ADDRESS,
          relayTransaction: async () => ({ wait: async () => ({ hash: '0xdemo' }) })
        };
        
        // Set mock contracts
        setTokenContract(mockTokenContract as any);
        setNepaliPayContract(mockNepaliPayContract as any);
        setFeeRelayerContract(mockFeeRelayerContract as any);
        
        // Update fee structure
        setFeeStructure({
          purchaseFee: 0.02,  // 2%
          transferFee: 0.01,  // 1%
          paymentFee: 0.015,  // 1.5%
          withdrawalFee: 0.025 // 2.5%
        });
        
        console.log("Mock contracts initialized successfully");
        
        // Update token prices
        setTokenPrice({
          nprRate: 1,
          usdRate: 0.0075,
          eurRate: 0.0070,
          gbpRate: 0.0060
        });
        
        toast({
          title: 'Demo Mode Activated',
          description: 'Using simulated blockchain functionality for testing.',
        });
      } else {
        // Deactivate demo mode
        console.log("Deactivating demo mode");
        setAccount(null);
        setIsConnected(false);
        setBalance('0');
        setTokenBalance('0');
        setTokenContract(null);
        setNepaliPayContract(null);
        setFeeRelayerContract(null);
        
        toast({
          title: 'Demo Mode Deactivated',
          description: 'Using real wallet connections.',
        });
      }
    } catch (error) {
      console.error("Error toggling demo mode:", error);
      toast({
        title: 'Demo Mode Toggle Failed',
        description: 'An error occurred while toggling demo mode.',
        variant: 'destructive'
      });
    }
  };

  // Send tokens function
  const sendTokens = async (toAddress: string, amount: string): Promise<string> => {
    if (demoMode) {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
      return '0xdemo-transaction-hash';
    }

    if (!tokenContract || !account) {
      throw new Error('Wallet not connected');
    }

    if (!isCorrectNetwork) {
      throw new Error('Please switch to Binance Smart Chain');
    }

    try {
      setIsLoading(true);
      const parsedAmount = ethers.parseUnits(amount, 18);
      const tx = await tokenContract.transfer(toAddress, parsedAmount);
      const receipt = await tx.wait();
      
      await refreshBalances();
      
      return receipt.hash;
    } catch (error: any) {
      console.error('Error sending tokens:', error);
      throw new Error(error.message || 'Error sending tokens');
    } finally {
      setIsLoading(false);
    }
  };

  // Deposit tokens function
  const depositTokens = async (amount: string): Promise<string> => {
    if (demoMode) {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
      return '0xdemo-transaction-hash';
    }

    if (!nepaliPayContract || !tokenContract || !account) {
      throw new Error('Wallet not connected');
    }

    if (!isCorrectNetwork) {
      throw new Error('Please switch to Binance Smart Chain');
    }

    try {
      setIsLoading(true);
      // First approve the NepaliPay contract to spend tokens
      const parsedAmount = ethers.parseUnits(amount, 18);
      const approveTx = await tokenContract.approve(NEPALI_PAY_ADDRESS, parsedAmount);
      await approveTx.wait();

      // Then deposit tokens to NepaliPay
      const depositTx = await nepaliPayContract.depositTokens(parsedAmount);
      const receipt = await depositTx.wait();
      
      await refreshBalances();
      
      return receipt.hash;
    } catch (error: any) {
      console.error('Error depositing tokens:', error);
      throw new Error(error.message || 'Error depositing tokens');
    } finally {
      setIsLoading(false);
    }
  };

  // Withdraw tokens function
  const withdrawTokens = async (amount: string): Promise<string> => {
    if (demoMode) {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
      return '0xdemo-transaction-hash';
    }

    if (!nepaliPayContract || !account) {
      throw new Error('Wallet not connected');
    }

    if (!isCorrectNetwork) {
      throw new Error('Please switch to Binance Smart Chain');
    }

    try {
      setIsLoading(true);
      const parsedAmount = ethers.parseUnits(amount, 18);
      const tx = await nepaliPayContract.withdrawTokens(parsedAmount);
      const receipt = await tx.wait();
      
      await refreshBalances();
      
      return receipt.hash;
    } catch (error: any) {
      console.error('Error withdrawing tokens:', error);
      throw new Error(error.message || 'Error withdrawing tokens');
    } finally {
      setIsLoading(false);
    }
  };

  // Set username function
  const setUsername = async (username: string): Promise<string> => {
    if (demoMode) {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
      return '0xdemo-transaction-hash';
    }

    if (!nepaliPayContract || !account) {
      throw new Error('Wallet not connected');
    }

    if (!isCorrectNetwork) {
      throw new Error('Please switch to Binance Smart Chain');
    }

    try {
      setIsLoading(true);
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

  // Add collateral function
  const addCollateral = async (type: string, amount: string): Promise<string> => {
    if (demoMode) {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
      return '0xdemo-transaction-hash';
    }

    if (!nepaliPayContract || !account) {
      throw new Error('Wallet not connected');
    }

    if (!isCorrectNetwork) {
      throw new Error('Please switch to Binance Smart Chain');
    }

    try {
      setIsLoading(true);
      const parsedAmount = ethers.parseUnits(amount, 18);
      // For ETH/BNB, we need to send value with the transaction
      const options = type === 'BNB' ? { value: parsedAmount } : {};
      const tx = await nepaliPayContract.addCollateral(type, parsedAmount, options);
      const receipt = await tx.wait();
      
      await refreshBalances();
      
      return receipt.hash;
    } catch (error: any) {
      console.error('Error adding collateral:', error);
      throw new Error(error.message || 'Error adding collateral');
    } finally {
      setIsLoading(false);
    }
  };

  // Take loan function
  const takeLoan = async (amount: string, collateralId: number): Promise<string> => {
    if (demoMode) {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
      return '0xdemo-transaction-hash';
    }

    if (!nepaliPayContract || !account) {
      throw new Error('Wallet not connected');
    }

    if (!isCorrectNetwork) {
      throw new Error('Please switch to Binance Smart Chain');
    }

    try {
      setIsLoading(true);
      const parsedAmount = ethers.parseUnits(amount, 18);
      const tx = await nepaliPayContract.takeLoan(parsedAmount, collateralId);
      const receipt = await tx.wait();
      
      await refreshBalances();
      
      return receipt.hash;
    } catch (error: any) {
      console.error('Error taking loan:', error);
      throw new Error(error.message || 'Error taking loan');
    } finally {
      setIsLoading(false);
    }
  };

  // Repay loan function
  const repayLoan = async (loanId: number, amount: string): Promise<string> => {
    if (demoMode) {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
      return '0xdemo-transaction-hash';
    }

    if (!nepaliPayContract || !tokenContract || !account) {
      throw new Error('Wallet not connected');
    }

    if (!isCorrectNetwork) {
      throw new Error('Please switch to Binance Smart Chain');
    }

    try {
      setIsLoading(true);
      const parsedAmount = ethers.parseUnits(amount, 18);
      
      // First approve the NepaliPay contract to spend tokens
      const approveTx = await tokenContract.approve(NEPALI_PAY_ADDRESS, parsedAmount);
      await approveTx.wait();
      
      // Then repay the loan
      const repayTx = await nepaliPayContract.repayLoan(loanId, parsedAmount);
      const receipt = await repayTx.wait();
      
      await refreshBalances();
      
      return receipt.hash;
    } catch (error: any) {
      console.error('Error repaying loan:', error);
      throw new Error(error.message || 'Error repaying loan');
    } finally {
      setIsLoading(false);
    }
  };

  // Claim referral reward function
  const claimReferralReward = async (referralCode: string): Promise<string> => {
    if (demoMode) {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
      return '0xdemo-transaction-hash';
    }

    if (!nepaliPayContract || !account) {
      throw new Error('Wallet not connected');
    }

    if (!isCorrectNetwork) {
      throw new Error('Please switch to Binance Smart Chain');
    }

    try {
      setIsLoading(true);
      const tx = await nepaliPayContract.claimReferralReward(referralCode);
      const receipt = await tx.wait();
      
      await refreshBalances();
      
      return receipt.hash;
    } catch (error: any) {
      console.error('Error claiming referral reward:', error);
      throw new Error(error.message || 'Error claiming referral reward');
    } finally {
      setIsLoading(false);
    }
  };

  // Claim cashback function
  const claimCashback = async (transactionId: string): Promise<string> => {
    if (demoMode) {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
      return '0xdemo-transaction-hash';
    }

    if (!nepaliPayContract || !account) {
      throw new Error('Wallet not connected');
    }

    if (!isCorrectNetwork) {
      throw new Error('Please switch to Binance Smart Chain');
    }

    try {
      setIsLoading(true);
      const tx = await nepaliPayContract.claimCashback(transactionId);
      const receipt = await tx.wait();
      
      await refreshBalances();
      
      return receipt.hash;
    } catch (error: any) {
      console.error('Error claiming cashback:', error);
      throw new Error(error.message || 'Error claiming cashback');
    } finally {
      setIsLoading(false);
    }
  };

  // Relay transaction function (for gas-less transactions)
  const relayTransaction = async (data: string, signature: string): Promise<string> => {
    if (demoMode) {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
      return '0xdemo-transaction-hash';
    }

    if (!feeRelayerContract || !account) {
      throw new Error('Wallet not connected');
    }

    if (!isCorrectNetwork) {
      throw new Error('Please switch to Binance Smart Chain');
    }

    try {
      setIsLoading(true);
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
    demoMode,
    toggleDemoMode,
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