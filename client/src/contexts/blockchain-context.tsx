import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";
import {
  truncateAddress,
  detectNetwork,
  weiToEther,
  etherToWei,
  calculateGasCost,
} from "@/lib/utils";

// ABI imports
import NepaliPayTokenABI from "@/lib/abi/NepaliPayTokenABI.json";
import NepaliPayABI from "@/lib/abi/NepaliPayABI.json";
import FeeRelayerABI from "@/lib/abi/FeeRelayerABI.json";

// Contract addresses
const CONTRACT_ADDRESSES = {
  NEPALIPAY_TOKEN: "0x69d34B25809b346702C21EB0E22EAD8C1de58D66",
  NEPALIPAY: "0xe2d189f6696ee8b247ceae97fe3f1f2879054553",
  FEE_RELAYER: "0x7ff2271749409f9137dac1e082962e21cc99aee6",
};

// Define types
interface BlockchainContextType {
  isConnected: boolean;
  account: string | null;
  walletBalance: string;
  tokenBalance: string;
  chainId: number | null;
  networkName: string;
  provider: ethers.providers.Web3Provider | null;
  contracts: {
    nepaliPayToken: ethers.Contract | null;
    nepaliPay: ethers.Contract | null;
    feeRelayer: ethers.Contract | null;
  };
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  refreshBalances: () => Promise<void>;
  transferTokens: (to: string, amount: string) => Promise<boolean>;
  getGasPrice: () => Promise<string>;
  estimateGas: (to: string, amount: string) => Promise<number>;
}

// Create context with default values
const BlockchainContext = React.createContext<BlockchainContextType>({
  isConnected: false,
  account: null,
  walletBalance: "0",
  tokenBalance: "0",
  chainId: null,
  networkName: "Not Connected",
  provider: null,
  contracts: {
    nepaliPayToken: null,
    nepaliPay: null,
    feeRelayer: null,
  },
  connectWallet: async () => {},
  disconnectWallet: () => {},
  refreshBalances: async () => {},
  transferTokens: async () => false,
  getGasPrice: async () => "0",
  estimateGas: async () => 0,
});

// Type guard for ethereum window object
interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, callback: (...args: any[]) => void) => void;
  removeListener: (event: string, callback: (...args: any[]) => void) => void;
  isMetaMask?: boolean;
}

// Add types to Window interface
declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export const BlockchainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = React.useState<string | null>(null);
  const [chainId, setChainId] = React.useState<number | null>(null);
  const [isConnected, setIsConnected] = React.useState<boolean>(false);
  const [walletBalance, setWalletBalance] = React.useState<string>("0");
  const [tokenBalance, setTokenBalance] = React.useState<string>("0");
  const [provider, setProvider] = React.useState<ethers.providers.Web3Provider | null>(null);
  const [contracts, setContracts] = React.useState<{
    nepaliPayToken: ethers.Contract | null;
    nepaliPay: ethers.Contract | null;
    feeRelayer: ethers.Contract | null;
  }>({
    nepaliPayToken: null,
    nepaliPay: null,
    feeRelayer: null,
  });

  const { toast } = useToast();

  // Initialize contracts when provider changes
  React.useEffect(() => {
    if (provider && account) {
      initializeContracts();
    }
  }, [provider, account]);

  // Initialize MetaMask event listeners
  React.useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
      window.ethereum.on("disconnect", handleDisconnect);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
        window.ethereum.removeListener("disconnect", handleDisconnect);
      }
    };
  }, []);

  // Check for existing connection
  React.useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          if (accounts.length > 0) {
            const web3Provider = new ethers.providers.Web3Provider(window.ethereum as any);
            const network = await web3Provider.getNetwork();
            
            setProvider(web3Provider);
            setAccount(accounts[0]);
            setChainId(network.chainId);
            setIsConnected(true);
            
            // Refresh balances
            await refreshBalances(web3Provider, accounts[0]);
          }
        } catch (error) {
          console.error("Failed to check existing connection:", error);
        }
      }
    };
    
    checkConnection();
  }, []);

  // Handle account change in MetaMask
  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected their wallet
      disconnectWallet();
    } else {
      setAccount(accounts[0]);
      if (provider) {
        await refreshBalances(provider, accounts[0]);
      }
    }
  };

  // Handle chain/network change in MetaMask
  const handleChainChanged = (chainIdHex: string) => {
    // MetaMask requires page refresh on chain change
    window.location.reload();
  };

  // Handle disconnect event
  const handleDisconnect = () => {
    disconnectWallet();
  };

  // Initialize contracts with Signer
  const initializeContracts = () => {
    if (!provider || !account) return;
    
    const signer = provider.getSigner();
    
    const nepaliPayToken = new ethers.Contract(
      CONTRACT_ADDRESSES.NEPALIPAY_TOKEN,
      NepaliPayTokenABI,
      signer
    );
    
    const nepaliPay = new ethers.Contract(
      CONTRACT_ADDRESSES.NEPALIPAY,
      NepaliPayABI,
      signer
    );
    
    const feeRelayer = new ethers.Contract(
      CONTRACT_ADDRESSES.FEE_RELAYER,
      FeeRelayerABI,
      signer
    );
    
    setContracts({
      nepaliPayToken,
      nepaliPay,
      feeRelayer,
    });
  };

  // Connect wallet
  const connectWallet = async (): Promise<void> => {
    if (!window.ethereum) {
      toast({
        title: "Wallet Connection Failed",
        description: "Please install MetaMask or another Ethereum wallet to continue.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const network = await web3Provider.getNetwork();
      
      // Check if we're on BSC network
      if (network.chainId !== 56 && network.chainId !== 97) {
        toast({
          title: "Wrong Network",
          description: "Please connect to Binance Smart Chain to use this application.",
          variant: "destructive",
        });
        
        try {
          // Try to switch to BSC
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x38" }], // BSC Mainnet
          });
        } catch (switchError: any) {
          // If BSC is not added to MetaMask, let's add it
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: "0x38", // BSC Mainnet
                    chainName: "Binance Smart Chain",
                    nativeCurrency: {
                      name: "BNB",
                      symbol: "BNB",
                      decimals: 18,
                    },
                    rpcUrls: ["https://bsc-dataseed.binance.org/"],
                    blockExplorerUrls: ["https://bscscan.com/"],
                  },
                ],
              });
            } catch (addError) {
              toast({
                title: "Network Error",
                description: "Could not add Binance Smart Chain to your wallet.",
                variant: "destructive",
              });
            }
          }
        }
      }
      
      setProvider(web3Provider);
      setAccount(accounts[0]);
      setChainId(network.chainId);
      setIsConnected(true);
      
      // Initialize contracts with new provider
      await refreshBalances(web3Provider, accounts[0]);
      
      toast({
        title: "Wallet Connected",
        description: `Connected to ${truncateAddress(accounts[0])}`,
      });
    } catch (error: any) {
      console.error("Wallet connection error:", error);
      toast({
        title: "Connection Failed",
        description: error.message || "Could not connect to wallet.",
        variant: "destructive",
      });
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setChainId(null);
    setIsConnected(false);
    setWalletBalance("0");
    setTokenBalance("0");
    setProvider(null);
    setContracts({
      nepaliPayToken: null,
      nepaliPay: null,
      feeRelayer: null,
    });
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  // Refresh balances
  const refreshBalances = async (
    currentProvider?: ethers.providers.Web3Provider,
    currentAccount?: string
  ): Promise<void> => {
    const web3Provider = currentProvider || provider;
    const walletAddress = currentAccount || account;
    
    if (!web3Provider || !walletAddress) return;
    
    try {
      // Get native token balance (BNB)
      const balance = await web3Provider.getBalance(walletAddress);
      setWalletBalance(ethers.utils.formatEther(balance));
      
      // Get NPT token balance
      const tokenContract = new ethers.Contract(
        CONTRACT_ADDRESSES.NEPALIPAY_TOKEN,
        NepaliPayTokenABI,
        web3Provider
      );
      
      const tokenBal = await tokenContract.balanceOf(walletAddress);
      setTokenBalance(ethers.utils.formatEther(tokenBal));
    } catch (error) {
      console.error("Error refreshing balances:", error);
    }
  };

  // Transfer NPT tokens
  const transferTokens = async (to: string, amount: string): Promise<boolean> => {
    if (!contracts.nepaliPayToken || !account) {
      toast({
        title: "Transfer Failed",
        description: "Wallet not connected or contracts not initialized.",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      const amountInWei = ethers.utils.parseEther(amount);
      
      // Check if user has enough tokens
      const balance = await contracts.nepaliPayToken.balanceOf(account);
      if (balance.lt(amountInWei)) {
        toast({
          title: "Insufficient Balance",
          description: "You don't have enough NPT tokens for this transfer.",
          variant: "destructive",
        });
        return false;
      }
      
      // Send transaction
      const tx = await contracts.nepaliPayToken.transfer(to, amountInWei);
      
      // Show pending toast
      toast({
        title: "Transfer Pending",
        description: `Transferring ${amount} NPT to ${truncateAddress(to)}...`,
      });
      
      // Wait for transaction confirmation
      await tx.wait();
      
      // Refresh balances after transfer
      await refreshBalances();
      
      toast({
        title: "Transfer Successful",
        description: `Transferred ${amount} NPT to ${truncateAddress(to)}`,
      });
      
      return true;
    } catch (error: any) {
      console.error("Transfer error:", error);
      toast({
        title: "Transfer Failed",
        description: error.message || "Could not complete the transfer.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Get current gas price
  const getGasPrice = async (): Promise<string> => {
    if (!provider) return "0";
    
    try {
      const gasPrice = await provider.getGasPrice();
      return ethers.utils.formatUnits(gasPrice, "gwei");
    } catch (error) {
      console.error("Error getting gas price:", error);
      return "0";
    }
  };

  // Estimate gas for token transfer
  const estimateGas = async (to: string, amount: string): Promise<number> => {
    if (!contracts.nepaliPayToken || !account) return 0;
    
    try {
      const amountInWei = ethers.utils.parseEther(amount);
      const gasEstimate = await contracts.nepaliPayToken.estimateGas.transfer(to, amountInWei);
      return gasEstimate.toNumber();
    } catch (error) {
      console.error("Error estimating gas:", error);
      return 0;
    }
  };

  return (
    <BlockchainContext.Provider
      value={{
        isConnected,
        account,
        walletBalance,
        tokenBalance,
        chainId,
        networkName: chainId ? detectNetwork(chainId) : "Not Connected",
        provider,
        contracts,
        connectWallet,
        disconnectWallet,
        refreshBalances: () => refreshBalances(),
        transferTokens,
        getGasPrice,
        estimateGas,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};

export const useBlockchain = () => {
  const context = React.useContext(BlockchainContext);
  if (!context) {
    throw new Error("useBlockchain must be used within a BlockchainProvider");
  }
  return context;
};