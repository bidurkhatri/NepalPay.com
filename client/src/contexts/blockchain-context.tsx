import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ethers } from 'ethers';
import { BrowserProvider, JsonRpcSigner } from 'ethers';
import { Contract } from 'ethers';
import { useToast } from "@/hooks/use-toast";


// Contract ABIs
import NepaliPayTokenABI from '@/contracts/NepaliPayTokenABI.json';
import NepaliPayABI from '@/contracts/NepaliPayABI.json';
import FeeRelayerABI from '@/contracts/FeeRelayerABI.json';

// Extend Window to include ethereum for MetaMask
declare global {
  interface Window {
    ethereum: any;
  }
}

// Contract addresses from BSC mainnet
const NEPALIPAY_TOKEN_ADDRESS = "0x69d34B25809b346702C21EB0E22EAD8C1de58D66";
const NEPALIPAY_ADDRESS = "0xe2d189f6696ee8b247ceae97fe3f1f2879054553";
const FEE_RELAYER_ADDRESS = "0x7ff2271749409f9137dac1e082962e21cc99aee6";

interface BlockchainContextType {
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  nepaliPayContract: Contract | null;
  tokenContract: Contract | null;
  feeRelayerContract: Contract | null;
  userAddress: string | null;
  isConnected: boolean;
  connecting: boolean;
  tokenBalance: string;
  nptBalance: string;
  username: string | null;
  userRole: string;
  
  // Collateral and loan properties
  userCollaterals: {
    bnb: string;
    eth: string;
    btc: string;
    nptValue: string;
  };
  userDebt: string;
  loanStartTimestamp: number;
  
  // Staking properties
  isStaking: boolean;
  stakedAmount: string;
  stakingRewards: string;
  
  // User stats
  avatars: string[];
  txCount: number;
  referralCount: number;
  
  // Core actions
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  
  // Core functions
  setUsername: (username: string, referrer?: string) => Promise<any>;
  
  // Token functions
  depositTokens: (amount: string) => Promise<any>;
  withdrawTokens: (amount: string) => Promise<any>;
  mintTokens: (usdtAmount: string) => Promise<any>;
  sendTokens: (recipient: string, amount: string, description?: string) => Promise<any>;
  
  // Loan functions
  addCollateral: (type: string, amount: string) => Promise<any>;
  takeLoan: (amount: string) => Promise<any>; // uses borrow() contract method
  repayLoan: (amount: string) => Promise<any>; // uses repayLoan() contract method with no params
  
  // Reward functions
  claimReferralReward: () => Promise<any>;
  claimCashback: () => Promise<any>;
  claimAvatarBonus: () => Promise<any>;
  
  // Ad Bazaar functions
  bidForFlame: (adData: AdData, tier: string, amount: string) => Promise<any>;
  getActiveAds: (tier: string) => Promise<any>;
  
  // Fee relayer functions
  relayTransaction: (from: string, value: string) => Promise<any>;
  getDynamicGasFee: () => Promise<string>;
  
  // Staking functions
  stakeTokens: (amount: string) => Promise<any>;
  unstakeTokens: (amount: string) => Promise<any>;
  
  // Additional functions
  contributeToFund: (amount: string) => Promise<any>;
  startCrowdfundingCampaign: (params: any) => Promise<any>;
  setUserProfile: (params: any) => Promise<any>;
  payBusinessAccount: (params: any) => Promise<any>;
}

export interface AdData {
  heading: string;
  description: string;
  business: string;
  location: string;
  contact: string;
}

const BlockchainContext = createContext<BlockchainContextType | null>(null);

export const BlockchainProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [nepaliPayContract, setNepaliPayContract] = useState<Contract | null>(null);
  const [tokenContract, setTokenContract] = useState<Contract | null>(null);
  const [feeRelayerContract, setFeeRelayerContract] = useState<Contract | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [tokenBalance, setTokenBalance] = useState<string>("0");
  const [nptBalance, setNptBalance] = useState<string>("0");
  const [username, setUsernameState] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>("NONE"); // NONE, USER, ADMIN
  
  // Staking state variables
  const [isStaking, setIsStaking] = useState<boolean>(false);
  const [stakedAmount, setStakedAmount] = useState<string>("0");
  const [stakingRewards, setStakingRewards] = useState<string>("0");
  
  // Collaterals
  const [userCollaterals, setUserCollaterals] = useState({
    bnb: "0",
    eth: "0",
    btc: "0",
    nptValue: "0"
  });
  const [userDebt, setUserDebt] = useState<string>("0");
  const [loanStartTimestamp, setLoanStartTimestamp] = useState<number>(0);
  const [avatars, setAvatars] = useState<string[]>([]);
  const [txCount, setTxCount] = useState<number>(0);
  const [referralCount, setReferralCount] = useState<number>(0);

  // Initialize provider on component mount
  useEffect(() => {
    const init = async () => {
      // Check if demo mode is activated
      const isDemoMode = localStorage.getItem('demo_mode') === 'true';
      if (isDemoMode) {
        // In demo mode, we don't need to connect to the blockchain
        // The app will use the loadUserData function with demo data
        // Set some basic values to avoid UI errors
        setUserAddress('0xdemo');
        setIsConnected(true);
        
        // Load demo data
        loadUserData('0xdemo', null, null);
        return;
      }
      
      // Check if MetaMask is installed
      if (typeof window.ethereum !== 'undefined') {
        try {
          // Create ethers provider
          const web3Provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(web3Provider);

          // Check if already connected
          const accounts = await web3Provider.listAccounts();
          
          if (accounts.length > 0) {
            await connectToBlockchain(web3Provider);
          }
        } catch (error) {
          console.error("Error initializing web3:", error);
        }
      } else {
        console.log("Please install MetaMask to use this application");
        
        // If MetaMask isn't installed and we're not in demo mode,
        // we should activate demo mode automatically
        if (!isDemoMode) {
          localStorage.setItem('demo_mode', 'true');
          localStorage.setItem('demo_credentials', 'true');
          
          // Reload the page to apply demo mode
          window.location.reload();
        }
      }
    };

    init();
  }, []);

  // Connect to blockchain and load contracts
  const connectToBlockchain = async (provider: BrowserProvider) => {
    try {
      // Check if we're in demo mode
      const isDemoMode = localStorage.getItem('demo_mode') === 'true';
      if (isDemoMode) {
        setIsConnected(true);
        setUserAddress('0xdemo');
        // Load demo data
        await loadUserData('0xdemo', null, null);
        return true;
      }
      
      const signer = await provider.getSigner();
      setSigner(signer);
      
      const userAddress = await signer.getAddress();
      setUserAddress(userAddress);
      setIsConnected(true);

      // Initialize contracts
      const nepaliPay = new Contract(NEPALIPAY_ADDRESS, NepaliPayABI, signer);
      const nepaliPayToken = new Contract(NEPALIPAY_TOKEN_ADDRESS, NepaliPayTokenABI, signer);
      const feeRelayer = new Contract(FEE_RELAYER_ADDRESS, FeeRelayerABI, signer);
      
      setNepaliPayContract(nepaliPay);
      setTokenContract(nepaliPayToken);
      setFeeRelayerContract(feeRelayer);

      // Load user data
      await loadUserData(userAddress, nepaliPay, nepaliPayToken);
      
      return true;
    } catch (error) {
      console.error("Error connecting to blockchain:", error);
      setIsConnected(false);
      
      // If connecting to blockchain fails, but we're supposed to be in demo mode
      if (localStorage.getItem('demo_credentials') === 'true') {
        localStorage.setItem('demo_mode', 'true');
        setIsConnected(true);
        setUserAddress('0xdemo');
        // Load demo data
        await loadUserData('0xdemo', null, null);
        return true;
      }
      
      return false;
    }
  };

  // Load user data from contracts
  const loadUserData = async (address: string, nepaliPay: Contract | null, nepaliPayToken: Contract | null) => {
    try {
      // When using the demo account or when blockchain isn't connected properly
      // Default to a demo experience with pre-set values
      const isDemoMode = window.localStorage.getItem('demo_mode') === 'true' || 
                        address.toLowerCase() === '0xdemo' || 
                        !nepaliPay || 
                        !nepaliPayToken;
      
      if (isDemoMode) {
        console.log("Loading demo blockchain data");
        setTokenBalance("1.23");
        setNptBalance("1.23");
        setUsernameState("demo_user");
        setUserRole("USER");
        setUserCollaterals({
          bnb: "0.5",
          eth: "0.1",
          btc: "0.01",
          nptValue: "300"
        });
        setUserDebt("0");
        setLoanStartTimestamp(0);
        setTxCount(3);
        setReferralCount(1);
        setAvatars(["Yeti", "Everest", "Buddha"]);
        
        // Set default staking values
        setIsStaking(true);
        setStakedAmount("0.5");
        setStakingRewards("0.025");
        return;
      }
      
      // Real blockchain data loading for connected wallets
      try {
        // Get token balance
        const balance = await nepaliPayToken.balanceOf(address);
        setTokenBalance(ethers.formatEther(balance));
      } catch (error) {
        console.error("Error getting token balance:", error);
        setTokenBalance("0");
      }
      
      try {  
        // Get NPT balance from NepaliPay contract
        const nptBalance = await nepaliPay.userBalances(address);
        setNptBalance(ethers.formatEther(nptBalance));
      } catch (error) {
        console.error("Error getting NPT balance:", error);
        setNptBalance("0");
      }
      
      // Get username
      try {
        const username = await nepaliPay.userNames(address);
        if (username && username !== "") {
          setUsernameState(username);
        } else {
          setUsernameState(null);
        }
      } catch (error) {
        console.error("Error getting username:", error);
        setUsernameState(null);
      }
      
      // Get user role
      try {
        const role = await nepaliPay.userRoles(address);
        // Convert role number to string
        const roleMap = ["NONE", "USER", "ADMIN"];
        setUserRole(roleMap[Number(role)] || "NONE");
      } catch (error) {
        console.error("Error getting user role:", error);
        setUserRole("USER"); // Default to USER role for better experience
      }
      
      // Get collaterals
      try {
        const collaterals = await nepaliPay.userCollaterals(address);
        setUserCollaterals({
          bnb: ethers.formatEther(collaterals.bnb || 0),
          eth: ethers.formatEther(collaterals.eth || 0),
          btc: ethers.formatEther(collaterals.btc || 0),
          nptValue: ethers.formatEther(collaterals.nptValue || 0)
        });
      } catch (error) {
        console.error("Error getting collaterals:", error);
        // Keep default collaterals (all zeros)
      }
      
      // Get debt
      try {
        const debt = await nepaliPay.userDebts(address);
        setUserDebt(ethers.formatEther(debt));
        
        // Get loan start timestamp
        const timestamp = await nepaliPay.loanStartTimestamps(address);
        setLoanStartTimestamp(Number(timestamp));
      } catch (error) {
        console.error("Error getting debt:", error);
        // Keep default debt (zero)
      }
      
      // Get tx count
      try {
        const count = await nepaliPay.txCount(address);
        setTxCount(Number(count));
      } catch (error) {
        console.error("Error getting tx count:", error);
        setTxCount(0);
      }
      
      // Get referral count
      try {
        const count = await nepaliPay.referralCounts(address);
        setReferralCount(Number(count));
      } catch (error) {
        console.error("Error getting referral count:", error);
        setReferralCount(0);
      }
      
      // Get avatars - this is a simplified approach
      try {
        // In a real implementation, we would iterate through the avatar mapping
        // For now, we'll mock some avatars based on tx count
        const avatarTypes = ["Yeti", "Everest", "Buddha", "Tiger", "Lotus"];
        const userAvatars = [];
        
        for (let i = 0; i < Math.min(txCount, 5); i++) {
          userAvatars.push(avatarTypes[i]);
        }
        
        setAvatars(userAvatars);
      } catch (error) {
        console.error("Error getting avatars:", error);
        setAvatars([]);
      }
      
    } catch (error) {
      console.error("Error loading user data:", error);
      // Set safe default values to prevent UI errors
      setTokenBalance("0");
      setNptBalance("0");
      setUsernameState(null);
      setUserRole("USER");
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    if (connecting) return;
    
    setConnecting(true);
    
    try {
      if (typeof window.ethereum !== 'undefined') {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Create ethers provider
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(web3Provider);
        
        // Connect to blockchain
        const success = await connectToBlockchain(web3Provider);
        
        if (!success) {
          toast({
            title: "Connection Failed",
            description: "Failed to connect to the blockchain. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "MetaMask Missing",
          description: "Please install MetaMask to use this application.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: error.message || "An error occurred while connecting your wallet.",
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setSigner(null);
    setUserAddress(null);
    setIsConnected(false);
    setNepaliPayContract(null);
    setTokenContract(null);
    setFeeRelayerContract(null);
    setTokenBalance("0");
    setNptBalance("0");
    setUsernameState(null);
  };

  // Set username
  const setUsername = async (username: string, referrer?: string) => {
    if (!nepaliPayContract || !signer) throw new Error("Not connected");
    
    try {
      let tx;
      
      if (referrer) {
        tx = await nepaliPayContract.setUsername(username, referrer);
      } else {
        tx = await nepaliPayContract.setUsername(username, "");
      }
      
      await tx.wait();
      
      // Update state
      setUsernameState(username);
      
      return { success: true, message: "Username set successfully" };
    } catch (error: any) {
      console.error("Error setting username:", error);
      throw new Error(error.message || "Failed to set username");
    }
  };

  // Deposit tokens
  const depositTokens = async (amount: string) => {
    // Check for demo mode first
    const isDemoMode = localStorage.getItem('demo_mode') === 'true';
    if (isDemoMode) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
      
      // Update state with mock values for demo
      const currentBalance = parseFloat(nptBalance);
      const depositAmount = parseFloat(amount);
      setNptBalance((currentBalance + depositAmount).toString());
      
      return { success: true, message: "Tokens deposited successfully (Demo Mode)" };
    }
    
    if (!tokenContract || !nepaliPayContract || !signer) throw new Error("Not connected");
    
    try {
      // Convert amount to wei
      const amountWei = ethers.parseEther(amount);
      
      // First, approve NepaliPay to spend tokens
      const approveTx = await tokenContract.approve(NEPALIPAY_ADDRESS, amountWei);
      await approveTx.wait();
      
      // Now deposit tokens
      const tx = await nepaliPayContract.depositTokens(amountWei);
      await tx.wait();
      
      // Update balances
      const userAddr = await signer.getAddress();
      await loadUserData(userAddr, nepaliPayContract, tokenContract);
      
      return { success: true, message: "Tokens deposited successfully" };
    } catch (error: any) {
      console.error("Error depositing tokens:", error);
      throw new Error(error.message || "Failed to deposit tokens");
    }
  };

  // Withdraw tokens
  const withdrawTokens = async (amount: string) => {
    if (!nepaliPayContract || !signer) throw new Error("Not connected");
    
    try {
      // Convert amount to wei
      const amountWei = ethers.parseEther(amount);
      
      // Withdraw tokens
      const tx = await nepaliPayContract.withdrawTokens(amountWei);
      await tx.wait();
      
      // Update balances
      const userAddr = await signer.getAddress();
      await loadUserData(userAddr, nepaliPayContract, tokenContract as Contract);
      
      return { success: true, message: "Tokens withdrawn successfully" };
    } catch (error: any) {
      console.error("Error withdrawing tokens:", error);
      throw new Error(error.message || "Failed to withdraw tokens");
    }
  };

  // Mint tokens with USDT
  const mintTokens = async (usdtAmount: string) => {
    if (!tokenContract || !signer) throw new Error("Not connected");
    
    try {
      // Convert amount to wei
      const amountWei = ethers.parseEther(usdtAmount);
      
      // Mint tokens
      const tx = await tokenContract.mint(amountWei);
      await tx.wait();
      
      // Update balances
      const userAddr = await signer.getAddress();
      await loadUserData(userAddr, nepaliPayContract as Contract, tokenContract);
      
      return { success: true, message: "Tokens minted successfully" };
    } catch (error: any) {
      console.error("Error minting tokens:", error);
      throw new Error(error.message || "Failed to mint tokens");
    }
  };

  // Send tokens to another user
  const sendTokens = async (recipient: string, amount: string, description?: string) => {
    if (!nepaliPayContract || !signer) throw new Error("Not connected");
    
    try {
      // Convert amount to wei
      const amountWei = ethers.parseEther(amount);
      
      // Send tokens
      const tx = await nepaliPayContract.sendTokens(recipient, amountWei, description || "");
      await tx.wait();
      
      // Update balances
      const userAddr = await signer.getAddress();
      await loadUserData(userAddr, nepaliPayContract, tokenContract as Contract);
      
      return { success: true, message: "Tokens sent successfully" };
    } catch (error: any) {
      console.error("Error sending tokens:", error);
      throw new Error(error.message || "Failed to send tokens");
    }
  };

  // Add collateral
  const addCollateral = async (type: string, amount: string) => {
    if (!nepaliPayContract || !signer) throw new Error("Not connected");
    
    try {
      // Convert amount to wei
      const amountWei = ethers.parseEther(amount);
      
      // Add collateral
      const tx = await nepaliPayContract.addCollateral(type, { value: amountWei });
      await tx.wait();
      
      // Update collaterals
      const userAddr = await signer.getAddress();
      await loadUserData(userAddr, nepaliPayContract, tokenContract as Contract);
      
      return { success: true, message: "Collateral added successfully" };
    } catch (error: any) {
      console.error("Error adding collateral:", error);
      throw new Error(error.message || "Failed to add collateral");
    }
  };

  // Take loan
  const takeLoan = async (amount: string) => {
    if (!nepaliPayContract || !signer) throw new Error("Not connected");
    
    try {
      // Convert amount to wei
      const amountWei = ethers.parseEther(amount);
      
      // Take loan (using borrow method as per contract)
      const tx = await nepaliPayContract.borrow(amountWei);
      await tx.wait();
      
      // Update data
      const userAddr = await signer.getAddress();
      await loadUserData(userAddr, nepaliPayContract, tokenContract as Contract);
      
      return { success: true, message: "Loan taken successfully" };
    } catch (error: any) {
      console.error("Error taking loan:", error);
      throw new Error(error.message || "Failed to take loan");
    }
  };

  // Repay loan
  const repayLoan = async (amount: string) => {
    if (!nepaliPayContract || !signer) throw new Error("Not connected");
    
    try {
      // Convert amount to wei
      const amountWei = ethers.parseEther(amount);
      
      // Repay loan (using repayLoan method as per contract)
      const tx = await nepaliPayContract.repayLoan();
      await tx.wait();
      
      // Update data
      const userAddr = await signer.getAddress();
      await loadUserData(userAddr, nepaliPayContract, tokenContract as Contract);
      
      return { success: true, message: "Loan repaid successfully" };
    } catch (error: any) {
      console.error("Error repaying loan:", error);
      throw new Error(error.message || "Failed to repay loan");
    }
  };

  // Claim referral reward
  const claimReferralReward = async () => {
    if (!nepaliPayContract || !signer) throw new Error("Not connected");
    
    try {
      // Claim reward
      const tx = await nepaliPayContract.claimReferralReward();
      await tx.wait();
      
      // Update data
      const userAddr = await signer.getAddress();
      await loadUserData(userAddr, nepaliPayContract, tokenContract as Contract);
      
      return { success: true, message: "Referral reward claimed successfully" };
    } catch (error: any) {
      console.error("Error claiming referral reward:", error);
      throw new Error(error.message || "Failed to claim referral reward");
    }
  };

  // Claim cashback
  const claimCashback = async () => {
    if (!nepaliPayContract || !signer) throw new Error("Not connected");
    
    try {
      // Claim cashback
      const tx = await nepaliPayContract.claimCashback();
      await tx.wait();
      
      // Update data
      const userAddr = await signer.getAddress();
      await loadUserData(userAddr, nepaliPayContract, tokenContract as Contract);
      
      return { success: true, message: "Cashback claimed successfully" };
    } catch (error: any) {
      console.error("Error claiming cashback:", error);
      throw new Error(error.message || "Failed to claim cashback");
    }
  };

  // Claim avatar bonus
  const claimAvatarBonus = async () => {
    if (!nepaliPayContract || !signer) throw new Error("Not connected");
    
    try {
      // Claim avatar bonus
      const tx = await nepaliPayContract.claimAvatarBonus();
      await tx.wait();
      
      // Update data
      const userAddr = await signer.getAddress();
      await loadUserData(userAddr, nepaliPayContract, tokenContract as Contract);
      
      return { success: true, message: "Avatar bonus claimed successfully" };
    } catch (error: any) {
      console.error("Error claiming avatar bonus:", error);
      throw new Error(error.message || "Failed to claim avatar bonus");
    }
  };

  // Bid for flame (post ad)
  const bidForFlame = async (adData: AdData, tier: string, amount: string) => {
    if (!nepaliPayContract || !signer) throw new Error("Not connected");
    
    try {
      // Convert amount to wei
      const amountWei = ethers.parseEther(amount);
      
      // Create ad fields array
      const adFields = [
        adData.heading,
        adData.description,
        adData.business,
        adData.location,
        adData.contact
      ];
      
      // Bid for flame
      const tx = await nepaliPayContract.bidForFlame(tier, adFields, amountWei);
      await tx.wait();
      
      return { success: true, message: "Ad posted successfully, awaiting approval" };
    } catch (error: any) {
      console.error("Error posting ad:", error);
      throw new Error(error.message || "Failed to post ad");
    }
  };

  // Get active ads
  const getActiveAds = async (tier: string) => {
    if (!nepaliPayContract) throw new Error("Not connected");
    
    try {
      // This is a simplified approach - in reality we would need to filter the events
      // For now, we'll mock some ads
      return [
        {
          id: 1,
          heading: "Fresh Momos",
          description: "Spicy and hot momos",
          business: "Raju's Stall",
          location: "Thamel, Kathmandu",
          contact: "+977-9841-123456",
          amount: tier === "Base" ? "500" : tier === "Wings" ? "1000" : "15000",
          tier: tier,
          timestamp: Date.now() - 86400000, // 1 day ago
          duration: tier === "Crest" ? 7 : 1 // days
        }
      ];
    } catch (error: any) {
      console.error("Error getting ads:", error);
      throw new Error(error.message || "Failed to get ads");
    }
  };

  // Relay transaction
  const relayTransaction = async (from: string, value: string) => {
    if (!feeRelayerContract || !signer) throw new Error("Not connected");
    
    try {
      // Convert amount to wei
      const valueWei = ethers.parseEther(value);
      
      // Relay transaction
      const tx = await feeRelayerContract.relayTransaction(from, valueWei);
      await tx.wait();
      
      return { success: true, message: "Transaction relayed successfully" };
    } catch (error: any) {
      console.error("Error relaying transaction:", error);
      throw new Error(error.message || "Failed to relay transaction");
    }
  };

  // Get dynamic gas fee
  const getDynamicGasFee = async (): Promise<string> => {
    if (!feeRelayerContract) throw new Error("Not connected");
    
    try {
      const fee = await feeRelayerContract.getDynamicGasFee();
      return ethers.formatEther(fee);
    } catch (error: any) {
      console.error("Error getting gas fee:", error);
      throw new Error(error.message || "Failed to get gas fee");
    }
  };

  // Effects for wallet changes
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      // Handle account changes
      const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          disconnectWallet();
        } else if (accounts[0] !== userAddress) {
          // User switched account
          if (provider) {
            await connectToBlockchain(provider);
          }
        }
      };

      // Handle chain changes
      const handleChainChanged = () => {
        // Reload the page
        window.location.reload();
      };

      // Subscribe to events
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      // Cleanup
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [provider, userAddress]);

  // Staking functions - stub implementations 
  const stakeTokens = async (amount: string) => {
    // Demo implementation
    const isDemoMode = localStorage.getItem('demo_mode') === 'true';
    if (isDemoMode) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
      
      // Update state with mock values for demo
      const stakeAmount = parseFloat(amount);
      setStakedAmount((parseFloat(stakedAmount) + stakeAmount).toString());
      setIsStaking(true);
      
      return { success: true, message: "Tokens staked successfully (Demo Mode)" };
    }
    
    throw new Error("Staking not implemented in this version");
  };
  
  const unstakeTokens = async (amount: string) => {
    // Demo implementation
    const isDemoMode = localStorage.getItem('demo_mode') === 'true';
    if (isDemoMode) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
      
      // Update state with mock values for demo
      const unstakeAmount = parseFloat(amount);
      setStakedAmount((parseFloat(stakedAmount) - unstakeAmount).toString());
      if (parseFloat(stakedAmount) - unstakeAmount <= 0) {
        setIsStaking(false);
      }
      
      return { success: true, message: "Tokens unstaked successfully (Demo Mode)" };
    }
    
    throw new Error("Unstaking not implemented in this version");
  };
  
  // Additional placeholder functions to match the interface
  const contributeToFund = async (amount: string) => {
    throw new Error("Contribute to fund not implemented in this version");
  };
  
  const startCrowdfundingCampaign = async (params: any) => {
    throw new Error("Crowdfunding campaigns not implemented in this version");
  };
  
  const setUserProfile = async (params: any) => {
    throw new Error("User profile settings not implemented in this version");
  };
  
  const payBusinessAccount = async (params: any) => {
    throw new Error("Business payments not implemented in this version");
  };

  return (
    <BlockchainContext.Provider
      value={{
        provider,
        signer,
        nepaliPayContract,
        tokenContract,
        feeRelayerContract,
        userAddress,
        isConnected,
        connecting,
        tokenBalance,
        nptBalance,
        username,
        userRole,
        userCollaterals,
        userDebt,
        loanStartTimestamp,
        isStaking,
        stakedAmount,
        stakingRewards,
        avatars,
        txCount,
        referralCount,
        connectWallet,
        disconnectWallet,
        setUsername,
        depositTokens,
        withdrawTokens,
        mintTokens,
        sendTokens,
        addCollateral,
        takeLoan,
        repayLoan,
        claimReferralReward,
        claimCashback,
        claimAvatarBonus,
        bidForFlame,
        getActiveAds,
        relayTransaction,
        getDynamicGasFee,
        // Add the new functions
        stakeTokens,
        unstakeTokens,
        contributeToFund,
        startCrowdfundingCampaign,
        setUserProfile,
        payBusinessAccount
      }}
    >
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