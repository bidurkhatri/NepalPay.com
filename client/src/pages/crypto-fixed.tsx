import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useBlockchain } from '@/contexts/blockchain-context';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import MobileNavigation from '@/components/mobile-navigation';
import { useToast } from '@/hooks/use-toast';
import { 
  Loader2, Copy, Check, ArrowRight, ArrowDown, ArrowUp, RefreshCw, 
  PiggyBank, Coins, SendHorizonal, Wallet, ClockIcon, Landmark,
  HeartHandshake, CreditCard, History, ArrowUpRight, Verified, Calendar
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertCircle, Info } from 'lucide-react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define transaction history type
interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'stake' | 'unstake' | 'loan' | 'repay' | 'contribute';
  amount: string;
  address: string;
  description: string;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
  hash?: string;
}

// Define crowdfunding campaign type
interface Campaign {
  id: string | number;
  title: string;
  creator: string;
  description: string;
  target: number;
  raised: number;
  contributors: number;
  deadline: string;
  imageUrl?: string;
}

// Define loan type
interface Loan {
  id: number | string;
  amount: number;
  interest: number;
  dueDate: string;
  status: 'active' | 'repaid';
  collateral?: number;
}

// Scheduled payment type
interface ScheduledPayment {
  id: string;
  recipient: string;
  amount: string;
  description: string;
  scheduledDate: string;
  status: 'pending' | 'completed' | 'failed';
  recurring?: boolean;
  frequency?: 'daily' | 'weekly' | 'monthly';
}

const CryptoFixedPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    nptBalance,
    userAddress,
    isConnected,
    isStaking,
    stakedAmount,
    stakingRewards,
    connectWallet,
    disconnectWallet,
    sendTokens,
    stakeTokens,
    unstakeTokens,
    takeLoan,
    repayLoan,
    contributeToFund,
    startCrowdfundingCampaign,
    setUserProfile,
    payBusinessAccount
  } = useBlockchain();
  
  // Component state
  const [activeTab, setActiveTab] = useState('wallet');
  const [isWalletAvailable, setIsWalletAvailable] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sendingTokens, setSendingTokens] = useState(false);
  const [sendAmount, setSendAmount] = useState('');
  const [sendAddress, setSendAddress] = useState('');
  const [sendDescription, setSendDescription] = useState('');
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [repayAmount, setRepayAmount] = useState('');
  const [contributionAmount, setContributionAmount] = useState('1');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [transactionHistory, setTransactionHistory] = useState<Transaction[]>([]);
  const [campaignTitle, setCampaignTitle] = useState('');
  const [campaignDescription, setCampaignDescription] = useState('');
  const [campaignTarget, setCampaignTarget] = useState('');
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  // Scheduled payments
  const [scheduledPayments, setScheduledPayments] = useState<ScheduledPayment[]>([
    {
      id: '1',
      recipient: '0x7834AcD5D23Cd8F3EB8c50593E33C944a18E1e87',
      amount: '5',
      description: 'Monthly subscription',
      scheduledDate: '2025-06-01',
      status: 'pending',
      recurring: true,
      frequency: 'monthly'
    }
  ]);
  
  // Dialog states
  const [isNewScheduledPaymentOpen, setIsNewScheduledPaymentOpen] = useState(false);
  const [newScheduledPayment, setNewScheduledPayment] = useState<Partial<ScheduledPayment>>({
    recipient: '',
    amount: '',
    description: '',
    scheduledDate: '',
    recurring: false,
    frequency: 'monthly'
  });
  
  // Active loans
  const [activeLoans, setActiveLoans] = useState<Loan[]>([
    { id: 1, amount: 5.0, interest: 0.25, dueDate: '2025-06-01', status: 'active', collateral: 6.0 }
  ]);
  
  // Crowdfunding campaigns
  const [activeCampaigns, setActiveCampaigns] = useState<Campaign[]>([
    { 
      id: 1, 
      title: 'Community Education Project', 
      creator: 'education_ngo',
      description: 'Funding educational resources for rural communities in Nepal, providing books, technology and training for teachers.',
      target: 500, 
      raised: 320, 
      contributors: 28,
      deadline: '2025-05-15',
      imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=300'
    },
    { 
      id: 2, 
      title: 'Tech Startup Accelerator', 
      creator: 'tech_hub',
      description: 'Supporting innovative tech startups in Nepal, providing mentorship, seed funding and workspace for young entrepreneurs.',
      target: 1000, 
      raised: 650, 
      contributors: 42,
      deadline: '2025-06-10',
      imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=300' 
    },
    { 
      id: 3, 
      title: 'Clean Water Initiative', 
      creator: 'environment_nepal',
      description: 'Building clean water systems for rural villages to provide safe drinking water and improve public health outcomes.',
      target: 750, 
      raised: 210, 
      contributors: 18,
      deadline: '2025-07-20',
      imageUrl: 'https://images.unsplash.com/photo-1436262513933-a0b06755c784?auto=format&fit=crop&q=80&w=300'
    }
  ]);
  
  // Check if a wallet is available in this browser
  useEffect(() => {
    const checkWalletAvailability = () => {
      const hasEthereum = typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
      setIsWalletAvailable(hasEthereum);
    };
    
    checkWalletAvailability();
    
    // Generate mock transaction history
    const mockHistory: Transaction[] = [
      {
        id: '1',
        type: 'send',
        amount: '10',
        address: '0x1234...5678',
        description: 'Payment for services',
        timestamp: new Date(Date.now() - 3600000 * 24),
        status: 'completed',
        hash: '0x7834AcD5D23Cd8F3EB8c50593E33C944a18E1e87'
      },
      {
        id: '2',
        type: 'receive',
        amount: '25',
        address: '0xabcd...ef01',
        description: 'Salary payment',
        timestamp: new Date(Date.now() - 3600000 * 48),
        status: 'completed',
        hash: '0x9834AcD5D23Cd8F3EB8c50593E33C944a18E1e87'
      },
      {
        id: '3',
        type: 'stake',
        amount: '15',
        address: userAddress || '',
        description: 'Staked NPT tokens',
        timestamp: new Date(Date.now() - 3600000 * 72),
        status: 'completed'
      }
    ];
    
    setTransactionHistory(mockHistory);
  }, [userAddress]);
  
  // Handle address copying
  const handleCopyAddress = () => {
    if (userAddress) {
      navigator.clipboard.writeText(userAddress);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };
  
  // Handle sending tokens
  const handleSendTokens = async () => {
    if (!sendAmount || isNaN(parseFloat(sendAmount)) || parseFloat(sendAmount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount',
        variant: 'destructive',
      });
      return;
    }

    if (!sendAddress) {
      toast({
        title: 'Missing Address',
        description: 'Please enter a recipient address or username',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSendingTokens(true);
      
      // Call blockchain context to send tokens
      const result = await sendTokens(sendAddress, sendAmount, sendDescription || '');
      
      if (result.success) {
        // Add transaction to history
        const newTransaction: Transaction = {
          id: Date.now().toString(),
          type: 'send',
          amount: sendAmount,
          address: sendAddress,
          description: sendDescription || 'Token transfer',
          timestamp: new Date(),
          status: 'completed',
          hash: result.hash
        };
        
        setTransactionHistory(prev => [newTransaction, ...prev]);
        
        toast({
          title: 'Tokens Sent',
          description: `Successfully sent ${sendAmount} NPT to ${sendAddress}`,
        });
        
        setSendAmount('');
        setSendAddress('');
        setSendDescription('');
      } else {
        toast({
          title: 'Transaction Failed',
          description: result.message || 'There was an error sending tokens. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to send tokens', error);
      toast({
        title: 'Transaction Failed',
        description: 'There was an error sending tokens. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSendingTokens(false);
    }
  };
  
  // Handle staking tokens
  const handleStakeTokens = async () => {
    if (!stakeAmount || isNaN(parseFloat(stakeAmount)) || parseFloat(stakeAmount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount to stake',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsProcessing(true);
      
      const result = await stakeTokens(stakeAmount);
      
      if (result?.success) {
        // Add transaction to history
        const newTransaction: Transaction = {
          id: Date.now().toString(),
          type: 'stake',
          amount: stakeAmount,
          address: userAddress || '',
          description: 'Staked NPT tokens',
          timestamp: new Date(),
          status: 'completed',
          hash: result.hash
        };
        
        setTransactionHistory(prev => [newTransaction, ...prev]);
        
        toast({
          title: 'Tokens Staked',
          description: `Successfully staked ${stakeAmount} NPT`,
        });
        
        setStakeAmount('');
      } else {
        toast({
          title: 'Staking Failed',
          description: result?.message || 'There was an error staking tokens. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to stake tokens', error);
      toast({
        title: 'Staking Failed',
        description: 'There was an error staking tokens. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle unstaking tokens
  const handleUnstakeTokens = async () => {
    if (!unstakeAmount || isNaN(parseFloat(unstakeAmount)) || parseFloat(unstakeAmount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount to unstake',
        variant: 'destructive',
      });
      return;
    }
    
    if (parseFloat(unstakeAmount) > parseFloat(stakedAmount)) {
      toast({
        title: 'Insufficient Staked Amount',
        description: `You only have ${stakedAmount} NPT staked`,
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsProcessing(true);
      
      const result = await unstakeTokens(unstakeAmount);
      
      if (result?.success) {
        // Add transaction to history
        const newTransaction: Transaction = {
          id: Date.now().toString(),
          type: 'unstake',
          amount: unstakeAmount,
          address: userAddress || '',
          description: 'Unstaked NPT tokens',
          timestamp: new Date(),
          status: 'completed',
          hash: result.hash
        };
        
        setTransactionHistory(prev => [newTransaction, ...prev]);
        
        toast({
          title: 'Tokens Unstaked',
          description: `Successfully unstaked ${unstakeAmount} NPT`,
        });
        
        setUnstakeAmount('');
      } else {
        toast({
          title: 'Unstaking Failed',
          description: result?.message || 'There was an error unstaking tokens. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to unstake tokens', error);
      toast({
        title: 'Unstaking Failed',
        description: 'There was an error unstaking tokens. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle taking a loan
  const handleTakeLoan = async () => {
    if (!loanAmount || isNaN(parseFloat(loanAmount)) || parseFloat(loanAmount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid loan amount',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsProcessing(true);
      
      const result = await takeLoan(loanAmount);
      
      if (result?.success) {
        // Add transaction to history
        const newTransaction: Transaction = {
          id: Date.now().toString(),
          type: 'loan',
          amount: loanAmount,
          address: userAddress || '',
          description: 'Took a loan in NPT',
          timestamp: new Date(),
          status: 'completed',
          hash: result.hash
        };
        
        setTransactionHistory(prev => [newTransaction, ...prev]);
        
        // Add to active loans
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30); // 30 days loan term
        
        const newLoan: Loan = {
          id: Date.now(),
          amount: parseFloat(loanAmount),
          interest: parseFloat(loanAmount) * 0.05, // 5% interest
          dueDate: dueDate.toISOString().split('T')[0],
          status: 'active',
          collateral: parseFloat(loanAmount) * 1.2 // 120% collateral
        };
        
        setActiveLoans(prev => [...prev, newLoan]);
        
        toast({
          title: 'Loan Successful',
          description: `Successfully took a loan of ${loanAmount} NPT`,
        });
        
        setLoanAmount('');
      } else {
        toast({
          title: 'Loan Failed',
          description: result?.message || 'There was an error processing your loan. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to take loan', error);
      toast({
        title: 'Loan Failed',
        description: 'There was an error processing your loan. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle repaying a loan
  const handleRepayLoan = async (loan: Loan) => {
    try {
      setIsProcessing(true);
      
      const repayAmount = (loan.amount + loan.interest).toString();
      
      const result = await repayLoan(repayAmount);
      
      if (result?.success) {
        // Add transaction to history
        const newTransaction: Transaction = {
          id: Date.now().toString(),
          type: 'repay',
          amount: repayAmount,
          address: userAddress || '',
          description: `Repaid loan #${loan.id}`,
          timestamp: new Date(),
          status: 'completed',
          hash: result.hash
        };
        
        setTransactionHistory(prev => [newTransaction, ...prev]);
        
        // Update loan status
        setActiveLoans(prev => 
          prev.map(l => l.id === loan.id ? {...l, status: 'repaid'} : l)
        );
        
        toast({
          title: 'Loan Repaid',
          description: `Successfully repaid ${repayAmount} NPT`,
        });
      } else {
        toast({
          title: 'Repayment Failed',
          description: result?.message || 'There was an error repaying your loan. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to repay loan', error);
      toast({
        title: 'Repayment Failed',
        description: 'There was an error repaying your loan. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle contributing to campaign
  const handleContribute = async (campaign: Campaign) => {
    if (!contributionAmount || isNaN(parseFloat(contributionAmount)) || parseFloat(contributionAmount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid contribution amount',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Convert campaign ID to bytes32
      const campaignIdBytes = typeof campaign.id === 'string' ? campaign.id : `0x${campaign.id.toString(16).padStart(64, '0')}`;
      
      const result = await contributeToFund(campaignIdBytes, contributionAmount);
      
      if (result?.success) {
        // Add transaction to history
        const newTransaction: Transaction = {
          id: Date.now().toString(),
          type: 'contribute',
          amount: contributionAmount,
          address: campaign.creator,
          description: `Contributed to campaign: ${campaign.title}`,
          timestamp: new Date(),
          status: 'completed',
          hash: result.hash
        };
        
        setTransactionHistory(prev => [newTransaction, ...prev]);
        
        // Update campaign raised amount
        setActiveCampaigns(prev => 
          prev.map(c => c.id === campaign.id 
            ? {...c, raised: c.raised + parseFloat(contributionAmount), contributors: c.contributors + 1} 
            : c
          )
        );
        
        toast({
          title: 'Contribution Successful',
          description: `Successfully contributed ${contributionAmount} NPT to ${campaign.title}`,
        });
        
        setContributionAmount('1');
        setSelectedCampaign(null);
      } else {
        toast({
          title: 'Contribution Failed',
          description: result?.message || 'There was an error with your contribution. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to contribute to campaign', error);
      toast({
        title: 'Contribution Failed',
        description: 'There was an error with your contribution. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle starting a new campaign
  const handleStartCampaign = async () => {
    if (!campaignTitle) {
      toast({
        title: 'Missing Title',
        description: 'Please enter a campaign title',
        variant: 'destructive',
      });
      return;
    }
    
    if (!campaignDescription) {
      toast({
        title: 'Missing Description',
        description: 'Please enter a campaign description',
        variant: 'destructive',
      });
      return;
    }
    
    if (!campaignTarget || isNaN(parseFloat(campaignTarget)) || parseFloat(campaignTarget) <= 0) {
      toast({
        title: 'Invalid Target',
        description: 'Please enter a valid funding target',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Generate campaign ID (hash of title and timestamp)
      const campaignId = `campaign_${Date.now()}`;
      
      const result = await startCrowdfundingCampaign(campaignId, campaignTarget, campaignDescription);
      
      if (result?.success) {
        // Create new campaign
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + 30); // 30 days campaign
        
        const newCampaign: Campaign = {
          id: campaignId,
          title: campaignTitle,
          description: campaignDescription,
          target: parseFloat(campaignTarget),
          raised: 0,
          contributors: 0,
          creator: userAddress || 'anonymous',
          deadline: deadline.toISOString().split('T')[0]
        };
        
        setActiveCampaigns(prev => [...prev, newCampaign]);
        
        toast({
          title: 'Campaign Created',
          description: 'Your crowdfunding campaign has been started successfully',
        });
        
        setCampaignTitle('');
        setCampaignDescription('');
        setCampaignTarget('');
      } else {
        toast({
          title: 'Campaign Creation Failed',
          description: result?.message || 'There was an error creating your campaign. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to start campaign', error);
      toast({
        title: 'Campaign Creation Failed',
        description: 'There was an error creating your campaign. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle refresh balance
  const handleRefreshBalance = async () => {
    setIsProcessing(true);
    // In a real implementation, this would fetch from the blockchain
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate blockchain query
    setIsProcessing(false);
    toast({
      title: 'Balance Refreshed',
      description: 'Your token balance has been updated',
    });
  };
  
  // Handle creating a scheduled payment
  const handleCreateScheduledPayment = () => {
    if (!newScheduledPayment.recipient) {
      toast({
        title: 'Missing Recipient',
        description: 'Please enter a recipient address',
        variant: 'destructive',
      });
      return;
    }
    
    if (!newScheduledPayment.amount || isNaN(parseFloat(newScheduledPayment.amount || '')) || parseFloat(newScheduledPayment.amount || '') <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid payment amount',
        variant: 'destructive',
      });
      return;
    }
    
    if (!newScheduledPayment.scheduledDate) {
      toast({
        title: 'Missing Date',
        description: 'Please select a payment date',
        variant: 'destructive',
      });
      return;
    }
    
    const newPayment: ScheduledPayment = {
      id: Date.now().toString(),
      recipient: newScheduledPayment.recipient || '',
      amount: newScheduledPayment.amount || '',
      description: newScheduledPayment.description || 'Scheduled payment',
      scheduledDate: newScheduledPayment.scheduledDate || '',
      status: 'pending',
      recurring: newScheduledPayment.recurring || false,
      frequency: newScheduledPayment.frequency || 'monthly'
    };
    
    setScheduledPayments(prev => [...prev, newPayment]);
    
    toast({
      title: 'Payment Scheduled',
      description: `Payment of ${newPayment.amount} NPT has been scheduled for ${newPayment.scheduledDate}`,
    });
    
    setNewScheduledPayment({
      recipient: '',
      amount: '',
      description: '',
      scheduledDate: '',
      recurring: false,
      frequency: 'monthly'
    });
    
    setIsNewScheduledPaymentOpen(false);
  };
  
  // Dynamic component rendering based on the wallet connection status
  if (!user) {
    return null;
  }
  
  // Format address for display
  const formatAddress = (address: string) => {
    if (!address || address === 'Not connected' || address.length < 10) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  return (
    <div className="flex flex-col md:flex-row min-h-screen relative bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <Sidebar />
      
      <main className="flex-1 flex flex-col pb-16 md:pb-0">
        <Header />
        
        <div className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Page Heading with NPT Token */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white gradient-text">NepaliPay Token (NPT)</h1>
                <p className="text-gray-400 mt-1">Manage your tokens and blockchain assets</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-2">
                {isConnected ? (
                  <>
                    <Badge variant="outline" className="py-2 flex items-center gap-1 border-primary text-primary hover:text-primary glass-card backdrop-blur-md">
                      <Coins className="h-3.5 w-3.5" />
                      <span>Balance:</span>
                      <span className="font-semibold">{nptBalance} NPT</span>
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs text-primary border-primary bg-primary/10"
                      onClick={handleRefreshBalance}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <RefreshCw className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </>
                ) : (
                  isWalletAvailable ? (
                    <Button 
                      className="glass-button"
                      onClick={connectWallet}
                    >
                      Connect Wallet
                    </Button>
                  ) : (
                    <a 
                      href="https://metamask.io/download/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Button 
                        className="glass-button"
                      >
                        Install MetaMask
                      </Button>
                    </a>
                  )
                )}
              </div>
            </div>

            {/* Wallet Address Display */}
            <div className="mb-6 cyber-card">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-2 md:mb-0">
                  <h2 className="text-sm font-medium text-gray-400">Your Wallet Address</h2>
                  <div className="mt-1 font-mono text-sm text-white">{userAddress || 'Not connected'}</div>
                </div>
                {isConnected && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs gap-1 text-primary hover:bg-primary/10"
                    onClick={handleCopyAddress}
                  >
                    {copySuccess ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copy Address
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Main Content */}
            {!isConnected ? (
              <div className="text-center py-12 cyber-card relative overflow-hidden">
                <div className="card-highlight"></div>
                <Wallet className="h-16 w-16 mx-auto text-primary mb-4" />
                <h2 className="text-xl font-semibold mb-2 text-white">
                  {isWalletAvailable ? "Connect Your Wallet" : "Web3 Wallet Required"}
                </h2>
                <p className="text-gray-400 max-w-md mx-auto mb-6">
                  {isWalletAvailable 
                    ? "Connect your cryptocurrency wallet to access all blockchain features, including token transfers, loans, and crowdfunding." 
                    : "To use the blockchain features of NepaliPay, you need a Web3 wallet like MetaMask installed in your browser."
                  }
                </p>
                {isWalletAvailable ? (
                  <Button 
                    className="glass-button"
                    onClick={connectWallet}
                  >
                    Connect Wallet
                  </Button>
                ) : (
                  <a 
                    href="https://metamask.io/download/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Button 
                      className="glass-button"
                    >
                      Install MetaMask
                    </Button>
                  </a>
                )}
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6 app-tabs">
                <TabsList className="grid grid-cols-4 w-full md:w-auto">
                  <TabsTrigger value="wallet" className="app-tab">Wallet</TabsTrigger>
                  <TabsTrigger value="staking" className="app-tab">Staking</TabsTrigger>
                  <TabsTrigger value="loans" className="app-tab">Loans</TabsTrigger>
                  <TabsTrigger value="crowdfunding" className="app-tab">Funding</TabsTrigger>
                </TabsList>

                {/* Wallet Tab */}
                <TabsContent value="wallet" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Balance Card */}
                    <Card className="glass-card">
                      <div className="card-highlight"></div>
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <Wallet className="mr-2 h-5 w-5 text-primary" /> 
                          NPT Balance
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center">
                          <div>
                            <p className="text-3xl font-bold text-white">{nptBalance} <span className="text-sm text-primary">NPT</span></p>
                            <p className="text-xs text-gray-400">≈ NPR {(parseFloat(nptBalance) * 1000).toFixed(2)}</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button 
                          variant="outline" 
                          className="border-primary/50 text-primary bg-primary/10 hover:bg-primary/20"
                          onClick={handleRefreshBalance}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Refresh
                        </Button>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="bg-primary/80 hover:bg-primary text-white">
                              <SendHorizonal className="h-4 w-4 mr-2" />
                              Send Tokens
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="modern-dialog">
                            <div className="modern-dialog-header">
                              <DialogTitle className="text-white">Send NPT Tokens</DialogTitle>
                              <DialogDescription className="text-gray-400">
                                Transfer NepaliPay tokens to another wallet or user
                              </DialogDescription>
                            </div>
                            
                            <div className="modern-dialog-body space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="address" className="text-white">Recipient Address</Label>
                                <Input 
                                  id="address" 
                                  className="modern-input" 
                                  placeholder="0x... or username" 
                                  value={sendAddress} 
                                  onChange={(e) => setSendAddress(e.target.value)} 
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="amount" className="text-white">Amount</Label>
                                <div className="relative">
                                  <Input 
                                    id="amount" 
                                    className="modern-input pr-16" 
                                    placeholder="0.0" 
                                    type="number" 
                                    value={sendAmount} 
                                    onChange={(e) => setSendAmount(e.target.value)} 
                                  />
                                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 text-sm">
                                    NPT
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="description" className="text-white">Description (Optional)</Label>
                                <Textarea 
                                  id="description" 
                                  className="modern-input" 
                                  placeholder="What's this payment for?" 
                                  value={sendDescription} 
                                  onChange={(e) => setSendDescription(e.target.value)} 
                                />
                              </div>
                            </div>
                            
                            <div className="modern-dialog-footer">
                              <DialogClose asChild>
                                <Button variant="outline" className="border-primary/50 text-white hover:bg-primary/10">
                                  Cancel
                                </Button>
                              </DialogClose>
                              <Button 
                                className="glass-button" 
                                onClick={handleSendTokens}
                                disabled={sendingTokens}
                              >
                                {sendingTokens ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Sending...
                                  </>
                                ) : (
                                  <>
                                    <SendHorizonal className="h-4 w-4 mr-2" />
                                    Send Tokens
                                  </>
                                )}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </CardFooter>
                    </Card>
                    
                    {/* Recent Transactions Card */}
                    <Card className="glass-card">
                      <div className="card-highlight"></div>
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <History className="mr-2 h-5 w-5 text-primary" /> 
                          Recent Transactions
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 max-h-60 overflow-y-auto pr-2">
                        {transactionHistory.slice(0, 3).map((tx) => (
                          <div key={tx.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-900/60 border border-gray-800">
                            <div className="flex items-center">
                              {tx.type === 'send' ? (
                                <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center mr-3">
                                  <ArrowUpRight className="h-4 w-4 text-amber-500" />
                                </div>
                              ) : tx.type === 'receive' ? (
                                <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                                  <ArrowDown className="h-4 w-4 text-green-500" />
                                </div>
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                                  <PiggyBank className="h-4 w-4 text-blue-500" />
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-medium text-white capitalize">{tx.type}</p>
                                <p className="text-xs text-gray-400">{formatAddress(tx.address)}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`text-sm font-medium ${tx.type === 'receive' ? 'text-green-500' : tx.type === 'send' ? 'text-amber-500' : 'text-blue-500'}`}>
                                {tx.type === 'receive' ? '+' : '-'}{tx.amount} NPT
                              </p>
                              <p className="text-xs text-gray-400">
                                {tx.timestamp.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                        
                        {transactionHistory.length === 0 && (
                          <div className="text-center py-4">
                            <p className="text-gray-400 text-sm">No transactions yet</p>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="border-primary/50 text-white hover:bg-primary/10 w-full"
                          onClick={() => setActiveTab('history')}
                        >
                          View All Transactions
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    {/* Scheduled Payments Card */}
                    <Card className="glass-card">
                      <div className="card-highlight"></div>
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <ClockIcon className="mr-2 h-5 w-5 text-primary" /> 
                          Scheduled Payments
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 max-h-60 overflow-y-auto pr-2">
                        {scheduledPayments.map((payment) => (
                          <div key={payment.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-900/60 border border-gray-800">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                                <Calendar className="h-4 w-4 text-purple-500" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-white">{payment.description}</p>
                                <p className="text-xs text-gray-400">{formatAddress(payment.recipient)}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-purple-500">
                                {payment.amount} NPT
                              </p>
                              <p className="text-xs text-gray-400">
                                {new Date(payment.scheduledDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                        
                        {scheduledPayments.length === 0 && (
                          <div className="text-center py-4">
                            <p className="text-gray-400 text-sm">No scheduled payments</p>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Dialog open={isNewScheduledPaymentOpen} onOpenChange={setIsNewScheduledPaymentOpen}>
                          <DialogTrigger asChild>
                            <Button className="glass-button w-full">
                              Schedule New Payment
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="modern-dialog">
                            <div className="modern-dialog-header">
                              <DialogTitle className="text-white">Schedule a Payment</DialogTitle>
                              <DialogDescription className="text-gray-400">
                                Set up automatic payments for a future date
                              </DialogDescription>
                            </div>
                            
                            <div className="modern-dialog-body space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="recipient" className="text-white">Recipient Address</Label>
                                <Input 
                                  id="recipient" 
                                  className="modern-input" 
                                  placeholder="0x... or username" 
                                  value={newScheduledPayment.recipient} 
                                  onChange={(e) => setNewScheduledPayment({...newScheduledPayment, recipient: e.target.value})} 
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="payment-amount" className="text-white">Amount</Label>
                                <div className="relative">
                                  <Input 
                                    id="payment-amount" 
                                    className="modern-input pr-16" 
                                    placeholder="0.0" 
                                    type="number" 
                                    value={newScheduledPayment.amount} 
                                    onChange={(e) => setNewScheduledPayment({...newScheduledPayment, amount: e.target.value})} 
                                  />
                                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 text-sm">
                                    NPT
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="payment-date" className="text-white">Payment Date</Label>
                                <Input 
                                  id="payment-date" 
                                  className="modern-input" 
                                  type="date" 
                                  value={newScheduledPayment.scheduledDate} 
                                  onChange={(e) => setNewScheduledPayment({...newScheduledPayment, scheduledDate: e.target.value})} 
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="payment-description" className="text-white">Description</Label>
                                <Input 
                                  id="payment-description" 
                                  className="modern-input" 
                                  placeholder="What's this payment for?" 
                                  value={newScheduledPayment.description} 
                                  onChange={(e) => setNewScheduledPayment({...newScheduledPayment, description: e.target.value})} 
                                />
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id="recurring"
                                  checked={newScheduledPayment.recurring}
                                  onChange={(e) => setNewScheduledPayment({...newScheduledPayment, recurring: e.target.checked})}
                                  className="h-4 w-4 rounded border-gray-600 bg-gray-900 text-primary focus:ring-0 focus:ring-offset-0"
                                />
                                <Label htmlFor="recurring" className="text-white">Recurring Payment</Label>
                              </div>
                              
                              {newScheduledPayment.recurring && (
                                <div className="space-y-2">
                                  <Label htmlFor="frequency" className="text-white">Frequency</Label>
                                  <Select 
                                    value={newScheduledPayment.frequency}
                                    onValueChange={(value) => setNewScheduledPayment({...newScheduledPayment, frequency: value as 'daily' | 'weekly' | 'monthly'})}
                                  >
                                    <SelectTrigger className="modern-input">
                                      <SelectValue placeholder="Select frequency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="daily">Daily</SelectItem>
                                      <SelectItem value="weekly">Weekly</SelectItem>
                                      <SelectItem value="monthly">Monthly</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}
                            </div>
                            
                            <div className="modern-dialog-footer">
                              <Button 
                                variant="outline" 
                                className="border-primary/50 text-white hover:bg-primary/10"
                                onClick={() => setIsNewScheduledPaymentOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button 
                                className="glass-button" 
                                onClick={handleCreateScheduledPayment}
                              >
                                Schedule Payment
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </CardFooter>
                    </Card>
                  </div>
                  
                  {/* Token Information */}
                  <Card className="glass-card">
                    <div className="card-highlight"></div>
                    <CardHeader>
                      <CardTitle className="text-white">Token Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium text-gray-400">Token Details</h3>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Name:</span>
                              <span className="text-white">NepaliPay Token</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Symbol:</span>
                              <span className="text-white">NPT</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Decimals:</span>
                              <span className="text-white">18</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Network:</span>
                              <span className="text-white">Binance Smart Chain</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium text-gray-400">Contract Addresses</h3>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Token:</span>
                              <span className="text-white font-mono text-xs">0xD7f8...2E8e</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Platform:</span>
                              <span className="text-white font-mono text-xs">0x1b10...eB8c</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium text-gray-400">Features</h3>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Verified className="h-4 w-4 text-green-500" />
                              <span className="text-white">Staking</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Verified className="h-4 w-4 text-green-500" />
                              <span className="text-white">Decentralized Loans</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Verified className="h-4 w-4 text-green-500" />
                              <span className="text-white">Crowdfunding</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Verified className="h-4 w-4 text-green-500" />
                              <span className="text-white">Business Payments</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Staking Tab */}
                <TabsContent value="staking" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Current Staking Card */}
                    <Card className="glass-card">
                      <div className="card-highlight"></div>
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <PiggyBank className="mr-2 h-5 w-5 text-primary" /> 
                          Staking Overview
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          Earn rewards by staking your NPT tokens
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {isStaking ? (
                          <>
                            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-400">Staked Amount:</span>
                                <span className="text-white font-semibold">{stakedAmount} NPT</span>
                              </div>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-400">Current Rewards:</span>
                                <span className="text-primary font-semibold">{stakingRewards} NPT</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-400">Annual Yield:</span>
                                <span className="text-green-500 font-semibold">5.0%</span>
                              </div>
                            </div>
                            
                            <Alert className="bg-primary/10 border-primary/20">
                              <Info className="h-4 w-4 text-primary" />
                              <AlertTitle className="text-white">Staking Active</AlertTitle>
                              <AlertDescription className="text-gray-400">
                                Your tokens are currently staked and earning rewards. Rewards are calculated daily.
                              </AlertDescription>
                            </Alert>
                          </>
                        ) : (
                          <div className="text-center py-6">
                            <PiggyBank className="h-12 w-12 mx-auto text-gray-500 mb-3" />
                            <h3 className="text-white font-medium mb-2">No Active Staking</h3>
                            <p className="text-gray-400 mb-4">Stake your NPT tokens to earn passive income</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    {/* Staking Actions Card */}
                    <Card className="glass-card">
                      <div className="card-highlight"></div>
                      <CardHeader>
                        <CardTitle className="text-white">Staking Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Tabs defaultValue="stake" className="w-full">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="stake">Stake Tokens</TabsTrigger>
                            <TabsTrigger value="unstake" disabled={!isStaking}>Unstake Tokens</TabsTrigger>
                          </TabsList>
                          <TabsContent value="stake" className="space-y-4 p-4">
                            <div className="space-y-2">
                              <Label htmlFor="stake-amount" className="text-white">Amount to Stake</Label>
                              <div className="relative">
                                <Input 
                                  id="stake-amount" 
                                  className="modern-input pr-16" 
                                  placeholder="0.0" 
                                  type="number" 
                                  value={stakeAmount} 
                                  onChange={(e) => setStakeAmount(e.target.value)} 
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 text-sm">
                                  NPT
                                </div>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-400">Available:</span>
                                <span className="text-white">{nptBalance} NPT</span>
                              </div>
                            </div>
                            
                            <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Estimated APY:</span>
                                <span className="text-green-500 font-semibold">5.0%</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Rewards Paid:</span>
                                <span className="text-white">Daily</span>
                              </div>
                            </div>
                            
                            <Button 
                              className="glass-button w-full" 
                              onClick={handleStakeTokens}
                              disabled={isProcessing || !stakeAmount || parseFloat(stakeAmount) <= 0}
                            >
                              {isProcessing ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                "Stake Tokens"
                              )}
                            </Button>
                          </TabsContent>
                          
                          <TabsContent value="unstake" className="space-y-4 p-4">
                            <div className="space-y-2">
                              <Label htmlFor="unstake-amount" className="text-white">Amount to Unstake</Label>
                              <div className="relative">
                                <Input 
                                  id="unstake-amount" 
                                  className="modern-input pr-16" 
                                  placeholder="0.0" 
                                  type="number" 
                                  value={unstakeAmount} 
                                  onChange={(e) => setUnstakeAmount(e.target.value)} 
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 text-sm">
                                  NPT
                                </div>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-400">Staked:</span>
                                <span className="text-white">{stakedAmount} NPT</span>
                              </div>
                            </div>
                            
                            <Alert className="bg-amber-500/10 border-amber-500/20">
                              <AlertCircle className="h-4 w-4 text-amber-500" />
                              <AlertTitle className="text-white">Unstaking Notice</AlertTitle>
                              <AlertDescription className="text-gray-400">
                                Unstaking tokens will stop earning rewards for the unstaked amount
                              </AlertDescription>
                            </Alert>
                            
                            <Button 
                              className="glass-button w-full" 
                              onClick={handleUnstakeTokens}
                              disabled={isProcessing || !unstakeAmount || parseFloat(unstakeAmount) <= 0 || parseFloat(unstakeAmount) > parseFloat(stakedAmount)}
                            >
                              {isProcessing ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                "Unstake Tokens"
                              )}
                            </Button>
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Staking Information Card */}
                  <Card className="glass-card">
                    <div className="card-highlight"></div>
                    <CardHeader>
                      <CardTitle className="text-white">Staking Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                          <h3 className="text-sm font-medium text-white">How Staking Works</h3>
                          <p className="text-gray-400 text-sm">
                            Staking is a way to earn rewards by locking your NPT tokens in the platform. 
                            Your staked tokens help secure the network and validate transactions.
                          </p>
                        </div>
                        
                        <div className="space-y-3">
                          <h3 className="text-sm font-medium text-white">Rewards</h3>
                          <p className="text-gray-400 text-sm">
                            You earn 5% APY on your staked tokens, with rewards calculated daily and 
                            added to your rewards balance. You can claim rewards at any time.
                          </p>
                        </div>
                        
                        <div className="space-y-3">
                          <h3 className="text-sm font-medium text-white">Unstaking</h3>
                          <p className="text-gray-400 text-sm">
                            You can unstake your tokens at any time with no lockup period or penalties.
                            Once unstaked, rewards will stop accruing for the unstaked amount.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Loans Tab */}
                <TabsContent value="loans" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Take Loan Card */}
                    <Card className="glass-card">
                      <div className="card-highlight"></div>
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <Landmark className="mr-2 h-5 w-5 text-primary" /> 
                          Take a Loan
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          Borrow NPT tokens using collateral
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="loan-amount" className="text-white">Loan Amount</Label>
                          <div className="relative">
                            <Input 
                              id="loan-amount" 
                              className="modern-input pr-16" 
                              placeholder="0.0" 
                              type="number" 
                              value={loanAmount} 
                              onChange={(e) => setLoanAmount(e.target.value)} 
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 text-sm">
                              NPT
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Interest Rate:</span>
                            <span className="text-white">5.0% (30 days)</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Required Collateral:</span>
                            <span className="text-white">
                              {loanAmount ? (parseFloat(loanAmount) * 1.2).toFixed(2) : '0.00'} NPT (120%)
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Total Repayment:</span>
                            <span className="text-white">
                              {loanAmount ? (parseFloat(loanAmount) * 1.05).toFixed(2) : '0.00'} NPT
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Loan Term:</span>
                            <span className="text-white">30 days</span>
                          </div>
                        </div>
                        
                        <Alert className="bg-amber-500/10 border-amber-500/20">
                          <AlertCircle className="h-4 w-4 text-amber-500" />
                          <AlertTitle className="text-white">Collateral Required</AlertTitle>
                          <AlertDescription className="text-gray-400">
                            You must have sufficient NPT tokens as collateral to take a loan.
                            If you don't repay, you may forfeit your collateral.
                          </AlertDescription>
                        </Alert>
                        
                        <Button 
                          className="glass-button w-full" 
                          onClick={handleTakeLoan}
                          disabled={isProcessing || !loanAmount || parseFloat(loanAmount) <= 0}
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Take Loan"
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                    
                    {/* Active Loans Card */}
                    <Card className="glass-card">
                      <div className="card-highlight"></div>
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <CreditCard className="mr-2 h-5 w-5 text-primary" /> 
                          Your Active Loans
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          Manage your existing loans
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {activeLoans.filter(loan => loan.status === 'active').length > 0 ? (
                          <div className="space-y-4">
                            {activeLoans.filter(loan => loan.status === 'active').map((loan) => (
                              <div key={loan.id} className="p-4 bg-gray-900/60 rounded-lg border border-gray-800">
                                <div className="flex justify-between mb-2">
                                  <span className="text-gray-400">Loan ID:</span>
                                  <span className="text-white">#{loan.id}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                  <span className="text-gray-400">Amount:</span>
                                  <span className="text-white">{loan.amount} NPT</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                  <span className="text-gray-400">Interest:</span>
                                  <span className="text-amber-500">{loan.interest} NPT</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                  <span className="text-gray-400">Total Due:</span>
                                  <span className="text-white font-medium">{(loan.amount + loan.interest).toFixed(2)} NPT</span>
                                </div>
                                <div className="flex justify-between mb-4">
                                  <span className="text-gray-400">Due Date:</span>
                                  <span className="text-white">{loan.dueDate}</span>
                                </div>
                                <Button 
                                  className="glass-button w-full" 
                                  onClick={() => handleRepayLoan(loan)}
                                  disabled={isProcessing}
                                >
                                  {isProcessing ? (
                                    <>
                                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                      Processing...
                                    </>
                                  ) : (
                                    "Repay Loan"
                                  )}
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <Landmark className="h-12 w-12 mx-auto text-gray-500 mb-3" />
                            <h3 className="text-white font-medium mb-2">No Active Loans</h3>
                            <p className="text-gray-400">You don't have any active loans at the moment</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Loan Information Card */}
                  <Card className="glass-card">
                    <div className="card-highlight"></div>
                    <CardHeader>
                      <CardTitle className="text-white">Loan Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                          <h3 className="text-sm font-medium text-white">How Loans Work</h3>
                          <p className="text-gray-400 text-sm">
                            NepaliPay offers collateralized loans, where you provide NPT tokens as 
                            collateral to borrow additional NPT tokens. This allows you to access 
                            liquidity without selling your tokens.
                          </p>
                        </div>
                        
                        <div className="space-y-3">
                          <h3 className="text-sm font-medium text-white">Terms & Conditions</h3>
                          <p className="text-gray-400 text-sm">
                            Loans have a fixed 5% interest rate for a 30-day term. You must provide 
                            at least 120% collateral. If you fail to repay by the due date, your 
                            collateral may be liquidated.
                          </p>
                        </div>
                        
                        <div className="space-y-3">
                          <h3 className="text-sm font-medium text-white">Early Repayment</h3>
                          <p className="text-gray-400 text-sm">
                            You can repay your loan at any time before the due date without any 
                            penalties. Early repayment will still incur the full interest amount 
                            for the 30-day term.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Crowdfunding Tab */}
                <TabsContent value="crowdfunding" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {activeCampaigns.map((campaign) => (
                      <Card key={campaign.id} className="glass-card">
                        <div className="card-highlight"></div>
                        {campaign.imageUrl && (
                          <div className="h-40 overflow-hidden rounded-t-lg">
                            <img 
                              src={campaign.imageUrl} 
                              alt={campaign.title} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                        )}
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-white text-lg">{campaign.title}</CardTitle>
                            <Badge variant="secondary" className="bg-primary/20 text-primary text-xs">
                              {new Date(campaign.deadline) > new Date() ? 'Active' : 'Ended'}
                            </Badge>
                          </div>
                          <CardDescription className="text-gray-400">
                            Created by @{campaign.creator}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-gray-400 text-sm line-clamp-3">
                            {campaign.description}
                          </p>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Raised:</span>
                              <span className="text-white font-medium">{campaign.raised} / {campaign.target} NPT</span>
                            </div>
                            <Progress 
                              value={(campaign.raised / campaign.target) * 100} 
                              className="h-2 bg-gray-800" 
                            />
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-400">{campaign.contributors} Contributors</span>
                              <span className="text-gray-400">Ends {new Date(campaign.deadline).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button 
                            className="glass-button w-full" 
                            onClick={() => setSelectedCampaign(campaign)}
                          >
                            Support Project
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                    
                    {/* Create Campaign Card */}
                    <Card className="glass-card h-fit md:col-span-3">
                      <div className="card-highlight"></div>
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <HeartHandshake className="mr-2 h-5 w-5 text-primary" /> 
                          Start a Crowdfunding Campaign
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          Create a new campaign to fund your project
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="campaign-title" className="text-white">Campaign Title</Label>
                              <Input 
                                id="campaign-title" 
                                className="modern-input" 
                                placeholder="Enter a title for your campaign" 
                                value={campaignTitle} 
                                onChange={(e) => setCampaignTitle(e.target.value)} 
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="campaign-target" className="text-white">Funding Target</Label>
                              <div className="relative">
                                <Input 
                                  id="campaign-target" 
                                  className="modern-input pr-16" 
                                  placeholder="0.0" 
                                  type="number" 
                                  value={campaignTarget} 
                                  onChange={(e) => setCampaignTarget(e.target.value)} 
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 text-sm">
                                  NPT
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="campaign-description" className="text-white">Campaign Description</Label>
                              <Textarea 
                                id="campaign-description" 
                                className="modern-input min-h-[100px]" 
                                placeholder="Describe your campaign and how the funds will be used" 
                                value={campaignDescription} 
                                onChange={(e) => setCampaignDescription(e.target.value)} 
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end">
                        <Button 
                          className="glass-button" 
                          onClick={handleStartCampaign}
                          disabled={isProcessing || !campaignTitle || !campaignDescription || !campaignTarget}
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Create Campaign"
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
        <MobileNavigation />
      </main>

      {/* Contribute to Campaign Dialog */}
      {selectedCampaign && (
        <Dialog open={!!selectedCampaign} onOpenChange={(open) => !open && setSelectedCampaign(null)}>
          <DialogContent className="modern-dialog">
            <div className="modern-dialog-header">
              <DialogTitle className="text-white">Support This Project</DialogTitle>
              <DialogDescription className="text-gray-400">
                Contribute to {selectedCampaign.title}
              </DialogDescription>
            </div>
            
            <div className="modern-dialog-body space-y-4">
              <div className="space-y-1">
                <h3 className="text-white font-medium">{selectedCampaign.title}</h3>
                <p className="text-gray-400 text-sm">Created by @{selectedCampaign.creator}</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contribution-amount" className="text-white">Contribution Amount</Label>
                <div className="relative">
                  <Input 
                    id="contribution-amount" 
                    className="modern-input pr-16" 
                    placeholder="1.0" 
                    type="number" 
                    value={contributionAmount} 
                    onChange={(e) => setContributionAmount(e.target.value)} 
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 text-sm">
                    NPT
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Project Goal:</span>
                  <span className="text-white">{selectedCampaign.target} NPT</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Raised So Far:</span>
                  <span className="text-white">{selectedCampaign.raised} NPT</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Contributors:</span>
                  <span className="text-white">{selectedCampaign.contributors}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Deadline:</span>
                  <span className="text-white">{new Date(selectedCampaign.deadline).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-400">
                <p>Your contribution will help fund this project. Contributions are non-refundable 
                and do not guarantee any specific return or outcome.</p>
              </div>
            </div>
            
            <div className="modern-dialog-footer">
              <Button 
                variant="outline" 
                className="border-primary/50 text-white hover:bg-primary/10"
                onClick={() => setSelectedCampaign(null)}
              >
                Cancel
              </Button>
              <Button 
                className="glass-button" 
                onClick={() => handleContribute(selectedCampaign)}
                disabled={isProcessing || !contributionAmount || parseFloat(contributionAmount) <= 0}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Contribute"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CryptoFixedPage;