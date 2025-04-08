import React, { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface BlockchainContextType {
  connected: boolean;
  walletAddress: string | null;
  balance: string;
  networkId: number | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isConnecting: boolean;
}

export const BlockchainContext = createContext<BlockchainContextType | null>(null);

export function BlockchainProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState("0");
  const [networkId, setNetworkId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  // Check if MetaMask is already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          // Get connected accounts
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
            setConnected(true);
            
            // Get network ID
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            setNetworkId(parseInt(chainId, 16));
            
            // Get balance
            const balanceHex = await window.ethereum.request({
              method: 'eth_getBalance',
              params: [accounts[0], 'latest'],
            });
            
            // Convert from wei to ETH
            const balanceInWei = parseInt(balanceHex, 16);
            const balanceInEth = balanceInWei / 1e18;
            setBalance(balanceInEth.toFixed(4));
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
    };
    
    checkConnection();
    
    // Setup event listeners
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          disconnectWallet();
        } else {
          setWalletAddress(accounts[0]);
          setConnected(true);
        }
      });
      
      window.ethereum.on('chainChanged', (chainId: string) => {
        setNetworkId(parseInt(chainId, 16));
        
        // Reload the page on chain change as recommended by MetaMask
        window.location.reload();
      });
    }
    
    // Cleanup event listeners on unmount
    return () => {
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  // Connect to MetaMask wallet
  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast({
        title: "Wallet Connection Failed",
        description: "Please install MetaMask to connect your wallet",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsConnecting(true);
      
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      setWalletAddress(accounts[0]);
      setConnected(true);
      
      // Get network ID
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      setNetworkId(parseInt(chainId, 16));
      
      // Get balance
      const balanceHex = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [accounts[0], 'latest'],
      });
      
      // Convert from wei to ETH
      const balanceInWei = parseInt(balanceHex, 16);
      const balanceInEth = balanceInWei / 1e18;
      setBalance(balanceInEth.toFixed(4));
      
      toast({
        title: "Wallet Connected",
        description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
      });
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Wallet Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setWalletAddress(null);
    setConnected(false);
    setBalance("0");
    setNetworkId(null);
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  return (
    <BlockchainContext.Provider
      value={{
        connected,
        walletAddress,
        balance,
        networkId,
        connectWallet,
        disconnectWallet,
        isConnecting,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
}

export function useBlockchain() {
  const context = useContext(BlockchainContext);
  if (!context) {
    throw new Error("useBlockchain must be used within a BlockchainProvider");
  }
  return context;
}