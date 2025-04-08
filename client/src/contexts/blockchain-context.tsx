import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { useToast } from "@/hooks/use-toast";

// Contract addresses - these should match the deployed contract addresses
const NPT_TOKEN_ADDRESS = "0x69d34B25809b346702C21EB0E22EAD8C1de58D66";
const NEPALIPAY_ADDRESS = "0xe2d189f6696ee8b247ceae97fe3f1f2879054553";
const FEE_RELAYER_ADDRESS = "0x7ff2271749409f9137dac1e082962e21cc99aee6";

// ABI interfaces will be imported when we have the actual ABIs
interface NepaliPayTokenABI {
  // Define contract functions here
  balanceOf: (address: string) => Promise<ethers.BigNumber>;
  transfer: (to: string, amount: ethers.BigNumber) => Promise<ethers.ContractTransaction>;
  approve: (spender: string, amount: ethers.BigNumber) => Promise<ethers.ContractTransaction>;
  allowance: (owner: string, spender: string) => Promise<ethers.BigNumber>;
  totalSupply: () => Promise<ethers.BigNumber>;
}

interface NepaliPayABI {
  // Define contract functions here
  createLoan: (
    collateralType: string,
    collateralAmount: ethers.BigNumber,
    loanAmount: ethers.BigNumber,
    durationDays: number
  ) => Promise<ethers.ContractTransaction>;
  repayLoan: (loanId: ethers.BigNumber) => Promise<ethers.ContractTransaction>;
  getUserLoans: (userAddress: string) => Promise<any[]>;
}

interface FeeRelayerABI {
  // Define contract functions here
  relayTransaction: (
    to: string,
    data: string,
    gasPrice: ethers.BigNumber,
    gasLimit: ethers.BigNumber
  ) => Promise<ethers.ContractTransaction>;
}

interface BlockchainContextType {
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  account: string | null;
  chainId: number | null;
  tokenContract: (ethers.Contract & NepaliPayTokenABI) | null;
  nepaliPayContract: (ethers.Contract & NepaliPayABI) | null;
  feeRelayerContract: (ethers.Contract & FeeRelayerABI) | null;
  tokenBalance: string;
  isConnecting: boolean;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshBalance: () => Promise<void>;
  transferTokens: (to: string, amount: string) => Promise<boolean>;
  createLoan: (
    collateralType: string,
    collateralAmount: string,
    loanAmount: string,
    durationDays: number
  ) => Promise<boolean>;
  repayLoan: (loanId: string) => Promise<boolean>;
}

const BlockchainContext = createContext<BlockchainContextType>({
  provider: null,
  signer: null,
  account: null,
  chainId: null,
  tokenContract: null,
  nepaliPayContract: null,
  feeRelayerContract: null,
  tokenBalance: "0",
  isConnecting: false,
  isConnected: false,
  connect: async () => {},
  disconnect: () => {},
  refreshBalance: async () => {},
  transferTokens: async () => false,
  createLoan: async () => false,
  repayLoan: async () => false,
});

export const useBlockchain = () => useContext(BlockchainContext);

export const BlockchainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [tokenContract, setTokenContract] = useState<(ethers.Contract & NepaliPayTokenABI) | null>(null);
  const [nepaliPayContract, setNepaliPayContract] = useState<(ethers.Contract & NepaliPayABI) | null>(null);
  const [feeRelayerContract, setFeeRelayerContract] = useState<(ethers.Contract & FeeRelayerABI) | null>(null);
  const [tokenBalance, setTokenBalance] = useState<string>("0");
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Initialize provider from window.ethereum (if available)
  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
          setProvider(provider);

          // Try to reconnect if account was previously connected
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            setAccount(address);
            setSigner(signer);
            setIsConnected(true);
            
            // Get network information
            const { chainId } = await provider.getNetwork();
            setChainId(chainId);
            
            // Initialize contracts
            initializeContracts(provider, signer);
          }
        } catch (error) {
          console.error("Error initializing blockchain provider:", error);
        }
      }
    };

    init();
  }, []);

  // Initialize the smart contract instances
  const initializeContracts = (provider: ethers.providers.Web3Provider, signer: ethers.Signer) => {
    try {
      // When we have the actual ABIs, we'll use them here
      // For now, we'll use placeholder ABIs that include the methods we need
      const tokenAbi = [
        "function balanceOf(address owner) view returns (uint256)",
        "function transfer(address to, uint256 amount) returns (bool)",
        "function approve(address spender, uint256 amount) returns (bool)",
        "function allowance(address owner, address spender) view returns (uint256)",
        "function totalSupply() view returns (uint256)",
        "event Transfer(address indexed from, address indexed to, uint256 value)",
      ];

      const nepaliPayAbi = [
        "function createLoan(string collateralType, uint256 collateralAmount, uint256 loanAmount, uint256 durationDays) returns (uint256)",
        "function repayLoan(uint256 loanId) returns (bool)",
        "function getUserLoans(address userAddress) view returns (tuple(uint256 id, address borrower, string collateralType, uint256 collateralAmount, uint256 loanAmount, uint256 startDate, uint256 durationDays, bool repaid)[])",
      ];

      const feeRelayerAbi = [
        "function relayTransaction(address to, bytes data, uint256 gasPrice, uint256 gasLimit) payable returns (bool)",
      ];

      const tokenContract = new ethers.Contract(
        NPT_TOKEN_ADDRESS,
        tokenAbi,
        signer
      ) as ethers.Contract & NepaliPayTokenABI;

      const nepaliPayContract = new ethers.Contract(
        NEPALIPAY_ADDRESS,
        nepaliPayAbi,
        signer
      ) as ethers.Contract & NepaliPayABI;

      const feeRelayerContract = new ethers.Contract(
        FEE_RELAYER_ADDRESS,
        feeRelayerAbi,
        signer
      ) as ethers.Contract & FeeRelayerABI;

      setTokenContract(tokenContract);
      setNepaliPayContract(nepaliPayContract);
      setFeeRelayerContract(feeRelayerContract);

      // Refresh token balance after initializing contracts
      if (account) {
        refreshBalance();
      }
    } catch (error) {
      console.error("Error initializing contracts:", error);
      toast({
        title: "Contract Initialization Failed",
        description: "Could not initialize smart contracts. Please try reconnecting your wallet.",
        variant: "destructive",
      });
    }
  };

  // Connect to MetaMask
  const connect = async () => {
    if (typeof window.ethereum === "undefined") {
      toast({
        title: "Wallet Not Found",
        description: "Please install MetaMask or another Ethereum wallet to continue.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsConnecting(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      setProvider(provider);

      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" });
      
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      
      // Get network information
      const { chainId } = await provider.getNetwork();
      setChainId(chainId);
      
      setSigner(signer);
      setAccount(address);
      setIsConnected(true);
      
      // Initialize contracts with the connected account
      initializeContracts(provider, signer);
      
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been successfully connected.",
      });
    } catch (error: any) {
      console.error("Error connecting to wallet:", error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect to wallet.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect from MetaMask
  const disconnect = () => {
    setAccount(null);
    setSigner(null);
    setIsConnected(false);
    setTokenBalance("0");
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  // Refresh token balance
  const refreshBalance = async () => {
    if (!tokenContract || !account) return;

    try {
      const balance = await tokenContract.balanceOf(account);
      // Convert from wei to token units (assuming 18 decimals)
      setTokenBalance(ethers.utils.formatUnits(balance, 18));
    } catch (error) {
      console.error("Error refreshing token balance:", error);
      toast({
        title: "Balance Update Failed",
        description: "Could not retrieve your token balance.",
        variant: "destructive",
      });
    }
  };

  // Transfer tokens
  const transferTokens = async (to: string, amount: string): Promise<boolean> => {
    if (!tokenContract || !account) {
      toast({
        title: "Transfer Failed",
        description: "Wallet not connected. Please connect your wallet first.",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Convert amount to wei
      const amountInWei = ethers.utils.parseUnits(amount, 18);
      
      // Perform the transfer
      const tx = await tokenContract.transfer(to, amountInWei);
      
      // Wait for the transaction to be mined
      await tx.wait();
      
      // Refresh balance after transfer
      await refreshBalance();
      
      toast({
        title: "Transfer Successful",
        description: `Successfully transferred ${amount} NPT to ${to}`,
      });
      
      return true;
    } catch (error: any) {
      console.error("Error transferring tokens:", error);
      toast({
        title: "Transfer Failed",
        description: error.message || "Failed to transfer tokens.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Create a loan
  const createLoan = async (
    collateralType: string,
    collateralAmount: string,
    loanAmount: string,
    durationDays: number
  ): Promise<boolean> => {
    if (!nepaliPayContract || !account) {
      toast({
        title: "Loan Creation Failed",
        description: "Wallet not connected. Please connect your wallet first.",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Convert amounts to wei
      const collateralAmountInWei = ethers.utils.parseUnits(collateralAmount, 18);
      const loanAmountInWei = ethers.utils.parseUnits(loanAmount, 18);
      
      // Create the loan
      const tx = await nepaliPayContract.createLoan(
        collateralType,
        collateralAmountInWei,
        loanAmountInWei,
        durationDays
      );
      
      // Wait for the transaction to be mined
      await tx.wait();
      
      // Refresh balance after loan creation
      await refreshBalance();
      
      toast({
        title: "Loan Created",
        description: `Successfully created a loan of ${loanAmount} NPT with ${collateralAmount} ${collateralType} as collateral.`,
      });
      
      return true;
    } catch (error: any) {
      console.error("Error creating loan:", error);
      toast({
        title: "Loan Creation Failed",
        description: error.message || "Failed to create loan.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Repay a loan
  const repayLoan = async (loanId: string): Promise<boolean> => {
    if (!nepaliPayContract || !account) {
      toast({
        title: "Loan Repayment Failed",
        description: "Wallet not connected. Please connect your wallet first.",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Repay the loan
      const tx = await nepaliPayContract.repayLoan(loanId);
      
      // Wait for the transaction to be mined
      await tx.wait();
      
      // Refresh balance after loan repayment
      await refreshBalance();
      
      toast({
        title: "Loan Repaid",
        description: `Successfully repaid loan #${loanId}.`,
      });
      
      return true;
    } catch (error: any) {
      console.error("Error repaying loan:", error);
      toast({
        title: "Loan Repayment Failed",
        description: error.message || "Failed to repay loan.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Set up event listeners for account and chain changes
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      // Account changed listener
      const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length > 0) {
          const newAccount = accounts[0];
          setAccount(newAccount);
          
          if (provider) {
            const signer = provider.getSigner();
            setSigner(signer);
            
            // Reinitialize contracts with new signer
            initializeContracts(provider, signer);
          }
        } else {
          // User disconnected all accounts
          disconnect();
        }
      };

      // Chain changed listener
      const handleChainChanged = (chainIdHex: string) => {
        const newChainId = parseInt(chainIdHex, 16);
        setChainId(newChainId);
        
        // Reload page on chain change as recommended by MetaMask docs
        window.location.reload();
      };

      // Subscribe to events
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      // Clean up listeners on unmount
      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, [provider]);

  return (
    <BlockchainContext.Provider
      value={{
        provider,
        signer,
        account,
        chainId,
        tokenContract,
        nepaliPayContract,
        feeRelayerContract,
        tokenBalance,
        isConnecting,
        isConnected,
        connect,
        disconnect,
        refreshBalance,
        transferTokens,
        createLoan,
        repayLoan,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};