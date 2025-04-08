import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './auth-context';

// ABIs for the contracts
import NEPALIPAY_TOKEN_ABI from '../abis/NepaliPayToken.json';
import NEPALIPAY_ABI from '../abis/NepaliPay.json';
import FEE_RELAYER_ABI from '../abis/FeeRelayer.json';

// Contract addresses from deployed contracts (Binance Smart Chain)
const NEPALIPAY_TOKEN_ADDRESS = '0x69d34B25809b346702C21EB0E22EAD8C1de58D66';
const NEPALIPAY_ADDRESS = '0xe2d189f6696ee8b247ceae97fe3f1f2879054553';
const FEE_RELAYER_ADDRESS = '0x7ff2271749409f9137dac1e082962e21cc99aee6';

type BlockchainContextType = {
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  nepalipayTokenContract: ethers.Contract | null;
  nepalipayContract: ethers.Contract | null;
  feeRelayerContract: ethers.Contract | null;
  isMetaMaskConnected: boolean;
  isNetworkSupported: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  getBalance: (address: string) => Promise<string>;
  transfer: (to: string, amount: string) => Promise<ethers.providers.TransactionReceipt>;
  approveCollateral: (amount: string, tokenAddress: string) => Promise<ethers.providers.TransactionReceipt>;
  createLoan: (amount: string, collateralAmount: string, collateralType: string) => Promise<ethers.providers.TransactionReceipt>;
  repayLoan: (loanId: number, amount: string) => Promise<ethers.providers.TransactionReceipt>;
};

const BlockchainContext = createContext<BlockchainContextType | null>(null);

export function BlockchainProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [nepalipayTokenContract, setNepalipayTokenContract] = useState<ethers.Contract | null>(null);
  const [nepalipayContract, setNepalipayContract] = useState<ethers.Contract | null>(null);
  const [feeRelayerContract, setFeeRelayerContract] = useState<ethers.Contract | null>(null);
  const [isMetaMaskConnected, setIsMetaMaskConnected] = useState(false);
  const [isNetworkSupported, setIsNetworkSupported] = useState(false);

  // Initialize web3 provider and check connection
  useEffect(() => {
    const initializeProvider = async () => {
      // Check if MetaMask is installed
      if (typeof window.ethereum !== 'undefined') {
        try {
          // Create ethers provider
          const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(web3Provider);
          
          // Check if already connected
          const accounts = await web3Provider.listAccounts();
          if (accounts.length > 0) {
            setIsMetaMaskConnected(true);
            const chainId = (await web3Provider.getNetwork()).chainId;
            // BSC Mainnet is 56
            setIsNetworkSupported(chainId === 56);
            
            // Get signer
            const web3Signer = web3Provider.getSigner();
            setSigner(web3Signer);
            
            // Initialize contracts
            const tokenContract = new ethers.Contract(NEPALIPAY_TOKEN_ADDRESS, NEPALIPAY_TOKEN_ABI, web3Signer);
            const payContract = new ethers.Contract(NEPALIPAY_ADDRESS, NEPALIPAY_ABI, web3Signer);
            const relayerContract = new ethers.Contract(FEE_RELAYER_ADDRESS, FEE_RELAYER_ABI, web3Signer);
            
            setNepalipayTokenContract(tokenContract);
            setNepalipayContract(payContract);
            setFeeRelayerContract(relayerContract);
          }
        } catch (error) {
          console.error('Error initializing provider:', error);
        }
      }
    };
    
    initializeProvider();
    
    // Handle account and chain changes
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setIsMetaMaskConnected(accounts.length > 0);
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          connectWallet();
        }
      });
      
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
    
    return () => {
      // Clean up listeners
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  // Connect wallet function
  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast({
        title: 'MetaMask not found',
        description: 'Please install MetaMask browser extension to connect.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // Request accounts
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Check network
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const chainId = (await web3Provider.getNetwork()).chainId;
      
      // BSC Mainnet is 56
      if (chainId !== 56) {
        // Prompt to switch to BSC
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x38' }], // 0x38 is 56 in hex
          });
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask
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
              toast({
                title: 'Network Error',
                description: 'Could not add BSC network to MetaMask',
                variant: 'destructive',
              });
              return;
            }
          } else {
            toast({
              title: 'Network Error',
              description: 'Could not switch to BSC network',
              variant: 'destructive',
            });
            return;
          }
        }
      }
      
      setIsNetworkSupported(true);
      setIsMetaMaskConnected(true);
      
      // Update provider and signer
      const updatedProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(updatedProvider);
      
      const web3Signer = updatedProvider.getSigner();
      setSigner(web3Signer);
      
      // Initialize contracts
      const tokenContract = new ethers.Contract(NEPALIPAY_TOKEN_ADDRESS, NEPALIPAY_TOKEN_ABI, web3Signer);
      const payContract = new ethers.Contract(NEPALIPAY_ADDRESS, NEPALIPAY_ABI, web3Signer);
      const relayerContract = new ethers.Contract(FEE_RELAYER_ADDRESS, FEE_RELAYER_ABI, web3Signer);
      
      setNepalipayTokenContract(tokenContract);
      setNepalipayContract(payContract);
      setFeeRelayerContract(relayerContract);
      
      toast({
        title: 'Wallet Connected',
        description: 'Your MetaMask wallet is now connected',
      });
      
    } catch (error: any) {
      console.error('Error connecting to MetaMask:', error);
      toast({
        title: 'Connection Error',
        description: error.message || 'Could not connect to MetaMask',
        variant: 'destructive',
      });
    }
  };

  // Disconnect wallet function
  const disconnectWallet = () => {
    setIsMetaMaskConnected(false);
    setSigner(null);
    setNepalipayTokenContract(null);
    setNepalipayContract(null);
    setFeeRelayerContract(null);
    
    toast({
      title: 'Wallet Disconnected',
      description: 'Your wallet has been disconnected',
    });
  };

  // Get token balance
  const getBalance = async (address: string): Promise<string> => {
    if (!nepalipayTokenContract) {
      throw new Error('Token contract not initialized');
    }
    
    try {
      const balance = await nepalipayTokenContract.balanceOf(address);
      return ethers.utils.formatUnits(balance, 18); // NPT has 18 decimals
    } catch (error: any) {
      console.error('Error getting balance:', error);
      throw new Error(error.message || 'Failed to get balance');
    }
  };

  // Transfer NPT tokens
  const transfer = async (to: string, amount: string): Promise<ethers.providers.TransactionReceipt> => {
    if (!nepalipayTokenContract || !signer) {
      throw new Error('Token contract not initialized or wallet not connected');
    }
    
    try {
      // Convert amount to wei (NPT has 18 decimals)
      const amountInWei = ethers.utils.parseUnits(amount, 18);
      
      // Send transaction
      const tx = await nepalipayTokenContract.transfer(to, amountInWei);
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      toast({
        title: 'Transfer Successful',
        description: `${amount} NPT has been sent`,
      });
      
      return receipt;
    } catch (error: any) {
      console.error('Error transferring tokens:', error);
      toast({
        title: 'Transfer Failed',
        description: error.message || 'Failed to transfer tokens',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Approve collateral for loan
  const approveCollateral = async (amount: string, tokenAddress: string): Promise<ethers.providers.TransactionReceipt> => {
    if (!signer) {
      throw new Error('Wallet not connected');
    }
    
    try {
      // Create contract instance for the collateral token
      const tokenContract = new ethers.Contract(
        tokenAddress,
        [
          'function approve(address spender, uint256 amount) public returns (bool)',
        ],
        signer
      );
      
      // Convert amount to wei
      const amountInWei = ethers.utils.parseUnits(amount, 18);
      
      // Approve NEPALIPAY_ADDRESS to spend tokens
      const tx = await tokenContract.approve(NEPALIPAY_ADDRESS, amountInWei);
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      toast({
        title: 'Approval Successful',
        description: `${amount} tokens approved as collateral`,
      });
      
      return receipt;
    } catch (error: any) {
      console.error('Error approving collateral:', error);
      toast({
        title: 'Approval Failed',
        description: error.message || 'Failed to approve collateral',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Create loan
  const createLoan = async (
    amount: string,
    collateralAmount: string,
    collateralType: string
  ): Promise<ethers.providers.TransactionReceipt> => {
    if (!nepalipayContract || !signer) {
      throw new Error('NepaliPay contract not initialized or wallet not connected');
    }
    
    try {
      // Convert amounts to wei
      const loanAmountInWei = ethers.utils.parseUnits(amount, 18);
      const collateralAmountInWei = ethers.utils.parseUnits(collateralAmount, 18);
      
      // Determine collateral token address based on type
      let collateralAddress = '';
      if (collateralType === 'BNB') {
        collateralAddress = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'; // WBNB
      } else if (collateralType === 'ETH') {
        collateralAddress = '0x2170Ed0880ac9A755fd29B2688956BD959F933F8'; // Binance-Peg Ethereum
      } else if (collateralType === 'BTC') {
        collateralAddress = '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c'; // Binance-Peg BTCB
      } else {
        throw new Error('Unsupported collateral type');
      }
      
      // Create loan
      const tx = await nepalipayContract.createLoan(
        loanAmountInWei,
        collateralAddress,
        collateralAmountInWei
      );
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      toast({
        title: 'Loan Created',
        description: `${amount} NPT loan created with ${collateralAmount} ${collateralType} collateral`,
      });
      
      return receipt;
    } catch (error: any) {
      console.error('Error creating loan:', error);
      toast({
        title: 'Loan Creation Failed',
        description: error.message || 'Failed to create loan',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Repay loan
  const repayLoan = async (loanId: number, amount: string): Promise<ethers.providers.TransactionReceipt> => {
    if (!nepalipayContract || !signer) {
      throw new Error('NepaliPay contract not initialized or wallet not connected');
    }
    
    try {
      // Convert amount to wei
      const amountInWei = ethers.utils.parseUnits(amount, 18);
      
      // Repay loan
      const tx = await nepalipayContract.repayLoan(loanId, amountInWei);
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      toast({
        title: 'Loan Repaid',
        description: `${amount} NPT repaid for loan #${loanId}`,
      });
      
      return receipt;
    } catch (error: any) {
      console.error('Error repaying loan:', error);
      toast({
        title: 'Loan Repayment Failed',
        description: error.message || 'Failed to repay loan',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return (
    <BlockchainContext.Provider
      value={{
        provider,
        signer,
        nepalipayTokenContract,
        nepalipayContract,
        feeRelayerContract,
        isMetaMaskConnected,
        isNetworkSupported,
        connectWallet,
        disconnectWallet,
        getBalance,
        transfer,
        approveCollateral,
        createLoan,
        repayLoan,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
}

export function useBlockchain() {
  const context = useContext(BlockchainContext);
  if (!context) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
}