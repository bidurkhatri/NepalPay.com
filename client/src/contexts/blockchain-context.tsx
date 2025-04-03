import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { BrowserProvider, JsonRpcSigner, Contract, formatUnits, parseUnits, keccak256, toUtf8Bytes } from 'ethers';
import { useAuth } from './auth-context';
import { useToast } from '@/hooks/use-toast';

// Utility function to convert ID to bytes32
const id_to_bytes32 = (text: string) => {
  return keccak256(toUtf8Bytes(text));
};

// Define window.ethereum for TypeScript
declare global {
  interface Window {
    ethereum: any;
  }
}

// ABIs
const NepalPayABI = [
  "function depositTokens(uint256 _amount) external",
  "function withdrawTokens(uint256 _amount) external",
  "function sendTokens(address _recipient, uint256 _amount, string memory _description) external",
  "function setUsername(string memory _username, string memory _role, string memory _country) external",
  "function balance(address) public view returns (uint256)",
  "function usernameOf(address) public view returns (string memory)",
  "function fullName(address) public view returns (string memory)",
  "function userRoles(address) public view returns (string memory)",
  "function token() public view returns (address)",
  "function takeLoan(uint256 _amount) external",
  "function repayLoan(uint256 _amount) external",
  "function makeBusinessPayment(string memory _recipientUsername, uint256 _amount, string memory _description) external",
  "function startCampaign(bytes32 _campaignId, uint256 _targetAmount, string memory _description) external",
  "function contribute(bytes32 _campaignId, uint256 _amount) external",
  "function getStakingInfo(address user) public view returns (bool isStaking, uint256 stakedAmount, uint256 rewards)",
  "function setScheduledPayment(bytes32 _paymentId, uint256 _amount, uint256 _timestamp) external",
  "function modifyScheduledPayment(bytes32 _paymentId, uint256 _amount, uint256 _timestamp) external",
  "function cancelScheduledPayment(bytes32 _paymentId) external",
  "function scheduledPayments(address, bytes32) public view returns (uint256 amount, uint256 timestamp, bool active)",
  "function crowdfundingCampaigns(address, bytes32) public view returns (uint256)",
];

const NepalPayTokenABI = [
  "function balanceOf(address owner) external view returns (uint256)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function stake(uint256 amount) public",
  "function unstake(uint256 amount) public",
  "function getStakingInfo(address user) public view returns (uint256 staked, uint256 since, uint256 reward)",
  "function decimals() external view returns (uint8)",
  "function name() external view returns (string memory)",
  "function symbol() external view returns (string memory)",
];

// Interface types
interface BlockchainContextType {
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  nepalPayContract: Contract | null;
  tokenContract: Contract | null;
  userAddress: string | null;
  isConnected: boolean;
  connecting: boolean;
  tokenBalance: string;
  nptBalance: string;
  isStaking: boolean;
  stakedAmount: string;
  stakingRewards: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  sendTokens: (recipientAddress: string, amount: string, description: string) => Promise<any>;
  payBusinessAccount: (recipientUsername: string, amount: string, description: string) => Promise<any>;
  stakeTokens: (amount: string) => Promise<any>;
  unstakeTokens: (amount: string) => Promise<any>;
  takeLoan: (amount: string) => Promise<any>;
  repayLoan: (amount: string) => Promise<any>;
  startCrowdfundingCampaign: (id: string, amount: string, description: string) => Promise<any>;
  contributeToFund: (campaignId: string, amount: string) => Promise<any>;
  setUserProfile: (username: string, role: string, country: string) => Promise<any>;
}

// Create context with default values
const BlockchainContext = createContext<BlockchainContextType>({
  provider: null,
  signer: null,
  nepalPayContract: null,
  tokenContract: null,
  userAddress: null,
  isConnected: false,
  connecting: false,
  tokenBalance: '0',
  nptBalance: '0',
  isStaking: false,
  stakedAmount: '0',
  stakingRewards: '0',
  connectWallet: async () => {},
  disconnectWallet: () => {},
  sendTokens: async () => ({}),
  payBusinessAccount: async () => ({}),
  stakeTokens: async () => ({}),
  unstakeTokens: async () => ({}),
  takeLoan: async () => ({}),
  repayLoan: async () => ({}),
  startCrowdfundingCampaign: async () => ({}),
  contributeToFund: async () => ({}),
  setUserProfile: async () => ({}),
});

// Contract addresses (actual deployed contracts on BSC)
const NEPALPAY_CONTRACT_ADDRESS = '0x1b10ba100e879d30f62cea5c5d385ad11b6deb8c'; // NepalPay contract on BSC Mainnet
const TOKEN_CONTRACT_ADDRESS = '0xD7f8cFeE6721F9c876DB7a808E53Fe4759392E8e'; // NepalPay Token (NPT) on BSC Mainnet

// BSC Network Configuration
const BSC_MAINNET = {
  chainId: '0x38', // 56 in hexadecimal
  chainName: 'Binance Smart Chain',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
  rpcUrls: ['https://bsc-dataseed.binance.org/'],
  blockExplorerUrls: ['https://bscscan.com/'],
};

const BSC_TESTNET = {
  chainId: '0x61', // 97 in hexadecimal
  chainName: 'Binance Smart Chain Testnet',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
  rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
  blockExplorerUrls: ['https://testnet.bscscan.com/'],
};

export const BlockchainProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [nepalPayContract, setNepalPayContract] = useState<Contract | null>(null);
  const [tokenContract, setTokenContract] = useState<Contract | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [tokenBalance, setTokenBalance] = useState<string>('0');
  const [nptBalance, setNptBalance] = useState<string>('0');
  const [isStaking, setIsStaking] = useState<boolean>(false);
  const [stakedAmount, setStakedAmount] = useState<string>('0');
  const [stakingRewards, setStakingRewards] = useState<string>('0');
  
  // For demo purposes, initialize mock data when not connected to a wallet
  useEffect(() => {
    if (!isConnected && process.env.NODE_ENV === 'development') {
      setTokenBalance('100.00');
      setNptBalance('50.00');
      setIsStaking(true);
      setStakedAmount('25.00');
      setStakingRewards('2.50');
    }
  }, [isConnected]);
  
  // Handle account changes
  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      // User has disconnected all accounts
      disconnectWallet();
      toast({
        title: 'Wallet Disconnected',
        description: 'Your wallet has been disconnected.',
        variant: 'destructive',
      });
    } else {
      // User has switched accounts
      setUserAddress(accounts[0]);
      toast({
        title: 'Account Changed',
        description: `Switched to account: ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`,
      });
      // Refresh balances and other account-specific data
      updateBalances(accounts[0]);
    }
  };
  
  // Update balances and other account data
  const updateBalances = async (address: string) => {
    if (!tokenContract || !nepalPayContract) return;
    
    try {
      // Get token balance
      const balance = await tokenContract.balanceOf(address);
      const formattedBalance = formatUnits(balance, 18);
      setNptBalance(formattedBalance);
      
      // Get staking info
      try {
        const stakingData = await nepalPayContract.getStakingInfo(address);
        setIsStaking(stakingData.isStaking);
        setStakedAmount(formatUnits(stakingData.stakedAmount, 18));
        setStakingRewards(formatUnits(stakingData.rewards, 18));
      } catch (error) {
        console.log("Could not fetch staking info:", error);
      }
    } catch (error) {
      console.error("Error updating balances:", error);
    }
  };

  // Connect to wallet
  const connectWallet = async () => {
    try {
      setConnecting(true);
      
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        toast({
          title: 'Wallet Connection Failed',
          description: 'Please install MetaMask or another Web3 wallet to connect.',
          variant: 'destructive',
        });
        return;
      }
      
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      
      // Initialize provider
      const provider = new BrowserProvider(window.ethereum);
      
      // Switch to BSC network if not already on it
      try {
        // Check if we're on BSC already
        const network = await provider.getNetwork();
        
        // BSC Mainnet Chain ID is 56, BSC Testnet Chain ID is 97
        if (network.chainId !== 56n && network.chainId !== 97n) {
          try {
            // Try to switch to BSC Mainnet
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: BSC_MAINNET.chainId }],
            });
          } catch (switchError: any) {
            // This error code indicates that the chain has not been added to MetaMask
            if (switchError.code === 4902) {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [BSC_MAINNET],
              });
            } else {
              throw switchError;
            }
          }
        }
      } catch (networkError) {
        console.error('Failed to switch network:', networkError);
        toast({
          title: 'Network Switch Failed',
          description: 'Could not switch to Binance Smart Chain. Please try manually switching in your wallet.',
          variant: 'destructive',
        });
        setConnecting(false);
        return;
      }
      
      // Refresh provider after potential network switch
      const updatedProvider = new BrowserProvider(window.ethereum);
      const signer = await updatedProvider.getSigner();
      
      // Initialize contracts
      const nepalPayContract = new Contract(NEPALPAY_CONTRACT_ADDRESS, NepalPayABI, signer);
      const tokenContract = new Contract(TOKEN_CONTRACT_ADDRESS, NepalPayTokenABI, signer);
      
      // Get token balances
      let formattedTokenBalance = '0';
      try {
        const tokenBalance = await tokenContract.balanceOf(account);
        formattedTokenBalance = formatUnits(tokenBalance, 18);
      } catch (error) {
        console.error("Error fetching token balance:", error);
      }
      
      // Get staking info if available in contract
      let isStaking = false;
      let stakedAmount = "0";
      let stakingRewards = "0";
      
      try {
        const stakingData = await nepalPayContract.getStakingInfo(account);
        isStaking = stakingData.isStaking;
        stakedAmount = formatUnits(stakingData.stakedAmount, 18);
        stakingRewards = formatUnits(stakingData.rewards, 18);
      } catch (error) {
        console.log("Staking features not available or error:", error);
      }

      // Update state
      setProvider(updatedProvider);
      setSigner(signer);
      setNepalPayContract(nepalPayContract);
      setTokenContract(tokenContract);
      setUserAddress(account);
      setIsConnected(true);
      setNptBalance(formattedTokenBalance);
      setIsStaking(isStaking);
      setStakedAmount(stakedAmount);
      setStakingRewards(stakingRewards);
      
      // Add event listener for account changes
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      // Success message
      toast({
        title: 'Wallet Connected',
        description: `Connected to BSC wallet: ${account.substring(0, 6)}...${account.substring(38)}`,
      });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast({
        title: 'Connection Failed',
        description: 'Could not connect to your wallet. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = () => {
    // Remove event listeners
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    }
    
    // Reset state
    setIsConnected(false);
    setUserAddress(null);
    setSigner(null);
    setProvider(null);
    setNepalPayContract(null);
    setTokenContract(null);
    
    toast({
      title: 'Wallet Disconnected',
      description: 'Your wallet has been disconnected successfully.',
    });
  };

  // Send tokens
  const sendTokens = async (recipientAddress: string, amount: string, description: string) => {
    try {
      if (!nepalPayContract || !signer) {
        throw new Error("Wallet not connected");
      }
      
      toast({
        title: 'Sending Tokens',
        description: `Sending ${amount} NPT to ${recipientAddress.substring(0, 6)}...${recipientAddress.substring(38)}`,
      });
      
      // Convert amount to wei (considering 18 decimals for the token)
      const amountInWei = parseUnits(amount, 18);
      
      // Call the contract method to send tokens
      const tx = await nepalPayContract.sendTokens(recipientAddress, amountInWei, description);
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        // Update balances after successful transaction
        if (userAddress) {
          updateBalances(userAddress);
        }
        
        return { 
          success: true, 
          message: 'Transfer successful!', 
          hash: receipt.transactionHash 
        };
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error: any) {
      console.error('Error sending tokens:', error);
      return { 
        success: false, 
        message: error.message || 'Transfer failed. Please try again.' 
      };
    }
  };

  // Pay business account
  const payBusinessAccount = async (recipientUsername: string, amount: string, description: string) => {
    try {
      if (!nepalPayContract || !signer) {
        throw new Error("Wallet not connected");
      }
      
      toast({
        title: 'Making Business Payment',
        description: `Sending ${amount} NPT to business account: ${recipientUsername}`,
      });
      
      // Convert amount to wei (considering 18 decimals for the token)
      const amountInWei = parseUnits(amount, 18);
      
      // Call the contract method to make business payment
      const tx = await nepalPayContract.makeBusinessPayment(recipientUsername, amountInWei, description);
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        // Update balances after successful transaction
        if (userAddress) {
          updateBalances(userAddress);
        }
        
        return { 
          success: true, 
          message: 'Payment successful!', 
          hash: receipt.transactionHash 
        };
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error: any) {
      console.error('Error making business payment:', error);
      return { 
        success: false, 
        message: error.message || 'Payment failed. Please try again.' 
      };
    }
  };

  // Stake tokens
  const stakeTokens = async (amount: string) => {
    try {
      if (!tokenContract || !signer) {
        throw new Error("Wallet not connected");
      }
      
      toast({
        title: 'Staking Tokens',
        description: `Staking ${amount} NPT tokens`,
      });
      
      // Convert amount to wei (considering 18 decimals for the token)
      const amountInWei = parseUnits(amount, 18);
      
      // Call the contract method to stake tokens
      const tx = await tokenContract.stake(amountInWei);
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        // Update staking info after successful transaction
        if (userAddress) {
          updateBalances(userAddress);
        }
        
        return { 
          success: true, 
          message: 'Tokens staked successfully!', 
          hash: receipt.transactionHash 
        };
      } else {
        throw new Error("Staking transaction failed");
      }
    } catch (error: any) {
      console.error('Error staking tokens:', error);
      return { 
        success: false, 
        message: error.message || 'Staking failed. Please try again.' 
      };
    }
  };

  // Unstake tokens
  const unstakeTokens = async (amount: string) => {
    try {
      if (!tokenContract || !signer) {
        throw new Error("Wallet not connected");
      }
      
      toast({
        title: 'Unstaking Tokens',
        description: `Unstaking ${amount} NPT tokens`,
      });
      
      // Convert amount to wei (considering 18 decimals for the token)
      const amountInWei = parseUnits(amount, 18);
      
      // Call the contract method to unstake tokens
      const tx = await tokenContract.unstake(amountInWei);
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        // Update staking info after successful transaction
        if (userAddress) {
          updateBalances(userAddress);
        }
        
        return { 
          success: true, 
          message: 'Tokens unstaked successfully!', 
          hash: receipt.transactionHash 
        };
      } else {
        throw new Error("Unstaking transaction failed");
      }
    } catch (error: any) {
      console.error('Error unstaking tokens:', error);
      return { 
        success: false, 
        message: error.message || 'Unstaking failed. Please try again.' 
      };
    }
  };

  // Take loan
  const takeLoan = async (amount: string) => {
    try {
      if (!nepalPayContract || !signer) {
        throw new Error("Wallet not connected");
      }
      
      toast({
        title: 'Taking Loan',
        description: `Taking a loan of ${amount} NPT tokens`,
      });
      
      // Convert amount to wei (considering 18 decimals for the token)
      const amountInWei = parseUnits(amount, 18);
      
      // Call the contract method to take a loan
      const tx = await nepalPayContract.takeLoan(amountInWei);
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        // Update balances after successful transaction
        if (userAddress) {
          updateBalances(userAddress);
        }
        
        return { 
          success: true, 
          message: 'Loan taken successfully!', 
          hash: receipt.transactionHash 
        };
      } else {
        throw new Error("Loan transaction failed");
      }
    } catch (error: any) {
      console.error('Error taking loan:', error);
      return { 
        success: false, 
        message: error.message || 'Loan failed. Please try again.' 
      };
    }
  };

  // Repay loan
  const repayLoan = async (amount: string) => {
    try {
      if (!nepalPayContract || !signer) {
        throw new Error("Wallet not connected");
      }
      
      toast({
        title: 'Repaying Loan',
        description: `Repaying loan of ${amount} NPT tokens`,
      });
      
      // Convert amount to wei (considering 18 decimals for the token)
      const amountInWei = parseUnits(amount, 18);
      
      // Call the contract method to repay a loan
      const tx = await nepalPayContract.repayLoan(amountInWei);
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        // Update balances after successful transaction
        if (userAddress) {
          updateBalances(userAddress);
        }
        
        return { 
          success: true, 
          message: 'Loan repaid successfully!', 
          hash: receipt.transactionHash 
        };
      } else {
        throw new Error("Loan repayment transaction failed");
      }
    } catch (error: any) {
      console.error('Error repaying loan:', error);
      return { 
        success: false, 
        message: error.message || 'Loan repayment failed. Please try again.' 
      };
    }
  };

  // Start crowdfunding campaign
  const startCrowdfundingCampaign = async (id: string, amount: string, description: string) => {
    try {
      if (!nepalPayContract || !signer) {
        throw new Error("Wallet not connected");
      }
      
      toast({
        title: 'Starting Campaign',
        description: `Creating campaign for ${amount} NPT tokens`,
      });
      
      // Convert amount to wei (considering 18 decimals for the token)
      const amountInWei = parseUnits(amount, 18);
      
      // Convert id to bytes32
      const campaignId = id_to_bytes32(id);
      
      // Call the contract method to start a campaign
      const tx = await nepalPayContract.startCampaign(campaignId, amountInWei, description);
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        return { 
          success: true, 
          message: 'Campaign created successfully!', 
          hash: receipt.transactionHash,
          campaignId: campaignId
        };
      } else {
        throw new Error("Campaign creation transaction failed");
      }
    } catch (error: any) {
      console.error('Error starting campaign:', error);
      return { 
        success: false, 
        message: error.message || 'Campaign creation failed. Please try again.' 
      };
    }
  };

  // Contribute to fund
  const contributeToFund = async (campaignId: string, amount: string) => {
    try {
      if (!nepalPayContract || !signer) {
        throw new Error("Wallet not connected");
      }
      
      toast({
        title: 'Contributing to Campaign',
        description: `Contributing ${amount} NPT tokens to campaign`,
      });
      
      // Convert amount to wei (considering 18 decimals for the token)
      const amountInWei = parseUnits(amount, 18);
      
      // Convert id to bytes32 if it's not already in bytes32 format
      const campaignIdBytes = campaignId.startsWith('0x') && campaignId.length === 66 
        ? campaignId 
        : id_to_bytes32(campaignId);
      
      // Call the contract method to contribute to a campaign
      const tx = await nepalPayContract.contribute(campaignIdBytes, amountInWei);
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        // Update balances after successful transaction
        if (userAddress) {
          updateBalances(userAddress);
        }
        
        return { 
          success: true, 
          message: 'Contribution successful!', 
          hash: receipt.transactionHash 
        };
      } else {
        throw new Error("Contribution transaction failed");
      }
    } catch (error: any) {
      console.error('Error contributing to fund:', error);
      return { 
        success: false, 
        message: error.message || 'Contribution failed. Please try again.' 
      };
    }
  };

  // Set user profile
  const setUserProfile = async (username: string, role: string, country: string) => {
    try {
      if (!nepalPayContract || !signer) {
        throw new Error("Wallet not connected");
      }
      
      toast({
        title: 'Updating Profile',
        description: `Setting profile information on blockchain`,
      });
      
      // Call the contract method to set user profile
      const tx = await nepalPayContract.setUsername(username, role, country);
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        return { 
          success: true, 
          message: 'Profile updated successfully!', 
          hash: receipt.transactionHash 
        };
      } else {
        throw new Error("Profile update transaction failed");
      }
    } catch (error: any) {
      console.error('Error setting user profile:', error);
      return { 
        success: false, 
        message: error.message || 'Profile update failed. Please try again.' 
      };
    }
  };

  return (
    <BlockchainContext.Provider
      value={{
        provider,
        signer,
        nepalPayContract,
        tokenContract,
        userAddress,
        isConnected,
        connecting,
        tokenBalance,
        nptBalance,
        isStaking,
        stakedAmount,
        stakingRewards,
        connectWallet,
        disconnectWallet,
        sendTokens,
        payBusinessAccount,
        stakeTokens,
        unstakeTokens,
        takeLoan,
        repayLoan,
        startCrowdfundingCampaign,
        contributeToFund,
        setUserProfile,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};

export const useBlockchain = () => useContext(BlockchainContext);