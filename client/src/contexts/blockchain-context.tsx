import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers, JsonRpcProvider, Contract, Wallet } from 'ethers';
import { useAuth } from './auth-context';

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
  provider: JsonRpcProvider | null;
  signer: ethers.Signer | null;
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

// Contract addresses (Replace with actual contract addresses when deployed)
const NEPALPAY_CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890'; // Example address
const NEPALTOKEN_CONTRACT_ADDRESS = '0x0987654321098765432109876543210987654321'; // Example address

export const BlockchainProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [provider, setProvider] = useState<JsonRpcProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
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

  // Check if ethereum is available
  useEffect(() => {
    // For demo purposes, mock provider and signer
    const mockProvider = new JsonRpcProvider();
    const mockSigner = new Wallet('0x0123456789012345678901234567890123456789012345678901234567890123', mockProvider);
    
    setProvider(mockProvider);
    setSigner(mockSigner);
    setUserAddress(mockSigner.address);
    
    const mockNepalPayContract = new Contract(NEPALPAY_CONTRACT_ADDRESS, NepalPayABI, mockSigner);
    const mockTokenContract = new Contract(NEPALTOKEN_CONTRACT_ADDRESS, NepalPayTokenABI, mockSigner);
    
    setNepalPayContract(mockNepalPayContract);
    setTokenContract(mockTokenContract);
    setIsConnected(true);

    // Set mock balances
    setTokenBalance('100.00');
    setNptBalance('50.00');
    setIsStaking(true);
    setStakedAmount('25.00');
    setStakingRewards('2.50');
  }, []);

  // Connect to wallet
  const connectWallet = async () => {
    try {
      setConnecting(true);
      console.log('Connecting to wallet...');
      
      // In a real implementation, we would connect to MetaMask or other wallet provider
      // This is a mock implementation for demonstration purposes
      
      // Mock connection success
      setIsConnected(true);
      setConnecting(false);
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      setConnecting(false);
    }
  };

  const disconnectWallet = () => {
    // In a real implementation, we would disconnect from the wallet provider
    setIsConnected(false);
    setUserAddress(null);
    setSigner(null);
    setProvider(null);
    setNepalPayContract(null);
    setTokenContract(null);
  };

  // Send tokens
  const sendTokens = async (recipientAddress: string, amount: string, description: string) => {
    try {
      console.log(`Sending ${amount} tokens to ${recipientAddress}: ${description}`);
      // In a real implementation, we would call the contract method
      return { success: true, message: 'Transfer successful (simulation)' };
    } catch (error) {
      console.error('Error sending tokens:', error);
      return { success: false, message: 'Transfer failed' };
    }
  };

  // Pay business account
  const payBusinessAccount = async (recipientUsername: string, amount: string, description: string) => {
    try {
      console.log(`Paying ${amount} to business account ${recipientUsername}: ${description}`);
      // In a real implementation, we would call the contract method
      return { success: true, message: 'Payment successful (simulation)' };
    } catch (error) {
      console.error('Error making business payment:', error);
      return { success: false, message: 'Payment failed' };
    }
  };

  // Stake tokens
  const stakeTokens = async (amount: string) => {
    try {
      console.log(`Staking ${amount} tokens`);
      // In a real implementation, we would call the contract method
      setIsStaking(true);
      setStakedAmount((parseFloat(stakedAmount) + parseFloat(amount)).toString());
      return { success: true, message: 'Staking successful (simulation)' };
    } catch (error) {
      console.error('Error staking tokens:', error);
      return { success: false, message: 'Staking failed' };
    }
  };

  // Unstake tokens
  const unstakeTokens = async (amount: string) => {
    try {
      console.log(`Unstaking ${amount} tokens`);
      // In a real implementation, we would call the contract method
      if (parseFloat(stakedAmount) >= parseFloat(amount)) {
        setStakedAmount((parseFloat(stakedAmount) - parseFloat(amount)).toString());
        if (parseFloat(stakedAmount) - parseFloat(amount) <= 0) {
          setIsStaking(false);
        }
      }
      return { success: true, message: 'Unstaking successful (simulation)' };
    } catch (error) {
      console.error('Error unstaking tokens:', error);
      return { success: false, message: 'Unstaking failed' };
    }
  };

  // Take loan
  const takeLoan = async (amount: string) => {
    try {
      console.log(`Taking loan of ${amount} tokens`);
      // In a real implementation, we would call the contract method
      return { success: true, message: 'Loan successful (simulation)' };
    } catch (error) {
      console.error('Error taking loan:', error);
      return { success: false, message: 'Loan failed' };
    }
  };

  // Repay loan
  const repayLoan = async (amount: string) => {
    try {
      console.log(`Repaying loan of ${amount} tokens`);
      // In a real implementation, we would call the contract method
      return { success: true, message: 'Loan repayment successful (simulation)' };
    } catch (error) {
      console.error('Error repaying loan:', error);
      return { success: false, message: 'Loan repayment failed' };
    }
  };

  // Start crowdfunding campaign
  const startCrowdfundingCampaign = async (id: string, amount: string, description: string) => {
    try {
      console.log(`Starting campaign ${id} for ${amount} tokens: ${description}`);
      // In a real implementation, we would call the contract method
      return { success: true, message: 'Campaign started successfully (simulation)' };
    } catch (error) {
      console.error('Error starting campaign:', error);
      return { success: false, message: 'Campaign start failed' };
    }
  };

  // Contribute to fund
  const contributeToFund = async (campaignId: string, amount: string) => {
    try {
      console.log(`Contributing ${amount} tokens to campaign ${campaignId}`);
      // In a real implementation, we would call the contract method
      return { success: true, message: 'Contribution successful (simulation)' };
    } catch (error) {
      console.error('Error contributing to fund:', error);
      return { success: false, message: 'Contribution failed' };
    }
  };

  // Set user profile
  const setUserProfile = async (username: string, role: string, country: string) => {
    try {
      console.log(`Setting profile: ${username}, ${role}, ${country}`);
      // In a real implementation, we would call the contract method
      return { success: true, message: 'Profile updated successfully (simulation)' };
    } catch (error) {
      console.error('Error setting user profile:', error);
      return { success: false, message: 'Profile update failed' };
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