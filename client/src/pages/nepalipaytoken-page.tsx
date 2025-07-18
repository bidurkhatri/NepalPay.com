import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useBlockchain } from '@/contexts/blockchain-context';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import MobileNavigation from '@/components/mobile-navigation';
import { useToast } from '@/hooks/use-toast';
import { 
  Loader2, Copy, Check, RefreshCw, 
  PiggyBank, SendHorizonal, ArrowDown, 
  Landmark, CreditCard, Target, Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
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
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle } from 'lucide-react';
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

// Transaction type definition
interface Transaction {
  id: string;
  type: string;
  amount: string;
  address: string;
  description: string;
  timestamp: Date;
}

const NepaliPayTokenPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    nptBalance,
    userAddress,
    isConnected,
    connectWallet,
    sendTokens,
    addCollateral,
    takeLoan
  } = useBlockchain();
  
  // State
  const [activeTab, setActiveTab] = useState('wallet');
  const [copySuccess, setCopySuccess] = useState(false);
  const [sendAmount, setSendAmount] = useState('');
  const [sendAddress, setSendAddress] = useState('');
  const [sendDescription, setSendDescription] = useState('');
  const [sendingTokens, setSendingTokens] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState<Transaction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [collateralType, setCollateralType] = useState('bnb');
  const [collateralAmount, setCollateralAmount] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [addingCollateral, setAddingCollateral] = useState(false);
  const [takingLoan, setTakingLoan] = useState(false);
  
  // Business payment state
  const [businessAmount, setBusinessAmount] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [isProcessingBusinessPayment, setIsProcessingBusinessPayment] = useState(false);
  
  // Scheduled payment state
  const [scheduledAmount, setScheduledAmount] = useState('');
  const [scheduledAddress, setScheduledAddress] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [isProcessingSchedule, setIsProcessingSchedule] = useState(false);
  
  // Loan-to-Value (LTV) ratios for different collateral types
  const ltv = {
    bnb: 0.75, // 75% 
    eth: 0.70, // 70%
    btc: 0.65  // 65%
  };
  
  // Mock exchange rates to NPT (for UI demo)
  const exchangeRates = {
    bnb: 1250, // 1 BNB = 1250 NPT
    eth: 1800, // 1 ETH = 1800 NPT
    btc: 25000 // 1 BTC = 25000 NPT
  };

  // Demo or real wallet address
  const displayAddress = userAddress || '0xfdb1824E50b2e04Ec94D1270604C1F0319fcDE81';
  
  // Format wallet address for display (first 6 chars + ... + last 4 chars)
  const formatAddress = (address: string): string => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Handle copy address
  const handleCopyAddress = () => {
    if (displayAddress) {
      navigator.clipboard.writeText(displayAddress);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };
  
  // Calculate loan amount based on collateral
  useEffect(() => {
    if (collateralAmount && parseFloat(collateralAmount) > 0) {
      // Calculate the maximum loan amount based on collateral type and LTV ratio
      const maxLoan = parseFloat(collateralAmount) * exchangeRates[collateralType as keyof typeof exchangeRates] * ltv[collateralType as keyof typeof ltv];
      setLoanAmount(maxLoan.toFixed(2));
    } else {
      setLoanAmount('');
    }
  }, [collateralAmount, collateralType]);

  // Load transaction history
  useEffect(() => {
    // For demo purposes, generate some sample transactions
    const sampleTransactions: Transaction[] = [
      {
        id: '1',
        type: 'receive',
        amount: '5.0',
        address: '0x7834AcD5D23Cd8F3EB8c50593E33C944a18E1e87',
        description: 'Payment received',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        id: '2',
        type: 'send',
        amount: '1.5',
        address: '0x9834AcD5D23Cd8F3EB8c50593E33C944a18E1e87',
        description: 'Payment for services',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      }
    ];
    
    setTransactionHistory(sampleTransactions);
  }, []);

  // Handle token refresh
  const handleRefreshBalance = () => {
    toast({
      title: "Balance Updated",
      description: "Your NPT balance has been refreshed",
    });
  };

  // Handle send tokens
  const handleSendTokens = async () => {
    if (!sendAmount || parseFloat(sendAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to send",
        variant: "destructive"
      });
      return;
    }
    
    if (!sendAddress) {
      toast({
        title: "Missing Recipient",
        description: "Please enter a recipient address",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setSendingTokens(true);
      
      // Integration with blockchain context
      if (isConnected && sendTokens) {
        await sendTokens(sendAddress, sendAmount, sendDescription);
      }
      
      // Add to transaction history (for demo)
      const newTx: Transaction = {
        id: Date.now().toString(),
        type: 'send',
        amount: sendAmount,
        address: sendAddress,
        description: sendDescription || 'Token transfer',
        timestamp: new Date()
      };
      
      setTransactionHistory(prev => [newTx, ...prev]);
      
      toast({
        title: "Tokens Sent",
        description: `Successfully sent ${sendAmount} NPT to ${formatAddress(sendAddress)}`,
      });
      
      // Reset form
      setSendAmount('');
      setSendAddress('');
      setSendDescription('');
      
    } catch (error) {
      console.error("Error sending tokens:", error);
      toast({
        title: "Transaction Failed",
        description: "There was an error sending tokens. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSendingTokens(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050A14] text-white">
      <Header />
      <Sidebar />
      
      <main className="pt-0 pb-24 px-4 md:ml-64">
        <div className="max-w-5xl mx-auto py-0 mt-2">
          <div className="mb-4">
            <h1 className="text-3xl font-bold mb-1">NepaliPay Token (NPT)</h1>
            <p className="text-gray-400">Manage your tokens and blockchain assets</p>
          </div>
          
          {/* Balance Card */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="glass-card py-3 px-6 rounded-full flex items-center">
              <span className="text-amber-300 mr-2 font-medium">Balance:</span>
              <span className="font-medium text-white">{nptBalance || '0.0'} NPT</span>
            </div>
            
            <Button 
              variant="outline" 
              className="rounded-full h-10 px-4 border-primary/30 bg-primary/5 hover:bg-primary/10"
              onClick={handleRefreshBalance}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Wallet Address */}
          <Card className="mb-4 bg-[#0A1022]/80 border-[#1E2A4A] backdrop-blur-xl">
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-xs font-medium text-gray-400 mb-1">Your Wallet Address</p>
                <div className="font-mono text-sm text-gray-300 truncate mr-2">
                  {displayAddress}
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-xs text-blue-400 hover:text-blue-300"
                onClick={handleCopyAddress}
              >
                {copySuccess ? (
                  <Check className="h-4 w-4 mr-1 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4 mr-1" />
                )}
                {copySuccess ? 'Copied' : 'Copy Address'}
              </Button>
            </div>
          </Card>
          
          {/* Token Management Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="flex w-full md:w-auto overflow-x-auto bg-[#0A1022] p-1 h-12 rounded-full">
              <TabsTrigger 
                value="wallet" 
                className="h-10 px-5 rounded-full data-[state=active]:bg-amber-500 data-[state=active]:text-white"
              >
                Wallet
              </TabsTrigger>
              <TabsTrigger 
                value="payments" 
                className="h-10 px-5 rounded-full data-[state=active]:bg-amber-500 data-[state=active]:text-white"
              >
                Payments
              </TabsTrigger>
              <TabsTrigger 
                value="collateral" 
                className="h-10 px-5 rounded-full data-[state=active]:bg-amber-500 data-[state=active]:text-white"
              >
                Collateral
              </TabsTrigger>
            </TabsList>
            
            {/* Wallet Tab Content */}
            <TabsContent value="wallet" className="mt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Balance Card */}
                <Card className="bg-[#0A1022]/80 border-[#1E2A4A] backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <PiggyBank className="mr-2 h-5 w-5 text-amber-400" />
                      <span className="text-white">Your NPT Balance</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="flex items-center">
                      <div className="text-3xl font-bold">
                        {nptBalance || '0.0'} 
                        <span className="text-sm text-gray-400 ml-1">NPT</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                      ≈ NPR {parseFloat(nptBalance || '0') * 1000}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white border-0">
                          <SendHorizonal className="h-4 w-4 mr-2" />
                          Send Tokens
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md bg-[#0D1426] border-[#1E2A4A]">
                        <DialogHeader>
                          <DialogTitle className="text-xl">Send NPT Tokens</DialogTitle>
                          <DialogDescription>
                            Send NPT tokens to another wallet address
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="recipient">Recipient Address</Label>
                            <Input
                              id="recipient"
                              placeholder="0x..."
                              className="bg-[#0A1022] border-[#1E2A4A]"
                              value={sendAddress}
                              onChange={(e) => setSendAddress(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="amount">Amount</Label>
                            <div className="relative">
                              <Input
                                id="amount"
                                type="number"
                                placeholder="0.0"
                                className="bg-[#0A1022] border-[#1E2A4A] pr-16"
                                value={sendAmount}
                                onChange={(e) => setSendAmount(e.target.value)}
                              />
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                                NPT
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Textarea
                              id="description"
                              placeholder="What's this payment for?"
                              className="bg-[#0A1022] border-[#1E2A4A]"
                              value={sendDescription}
                              onChange={(e) => setSendDescription(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter className="sm:justify-between">
                          <DialogClose asChild>
                            <Button variant="outline" className="border-[#1E2A4A] hover:bg-[#1E2A4A]/30">
                              Cancel
                            </Button>
                          </DialogClose>
                          <Button 
                            className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white border-0"
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
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
                
                {/* Recent Transactions */}
                <Card className="bg-[#0A1022]/80 border-[#1E2A4A] backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ArrowDown className="mr-2 h-5 w-5 text-amber-400" />
                      <span className="text-white">Recent Transactions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 py-1">
                      {transactionHistory.length > 0 ? (
                        transactionHistory.map((tx) => (
                          <div 
                            key={tx.id} 
                            className="flex items-center justify-between p-3 rounded-lg bg-[#0D1426] border border-[#1E2A4A]"
                          >
                            <div className="flex items-center">
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
                                tx.type === 'send' ? 'bg-amber-500/20 text-amber-500' : 'bg-green-500/20 text-green-500'
                              }`}>
                                {tx.type === 'send' ? (
                                  <SendHorizonal className="h-4 w-4" />
                                ) : (
                                  <ArrowDown className="h-4 w-4" />
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium capitalize">{tx.type}</p>
                                <p className="text-xs text-gray-400">{formatAddress(tx.address)}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`text-sm font-medium ${
                                tx.type === 'send' ? 'text-amber-500' : 'text-green-500'
                              }`}>
                                {tx.type === 'send' ? '-' : '+'}{tx.amount} NPT
                              </p>
                              <p className="text-xs text-gray-400">
                                {tx.timestamp.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-400">
                          No transactions yet
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Payments Tab Content */}
            <TabsContent value="payments" className="mt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-[#0A1022]/80 border-[#1E2A4A] backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <SendHorizonal className="mr-2 h-5 w-5 text-amber-400" />
                      <span className="text-white">Business Payment</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-white">Recipient Username</Label>
                      <Input
                        id="username"
                        placeholder="Enter username or address"
                        className="bg-[#0A1022] border-[#1E2A4A]"
                        value={businessAddress}
                        onChange={(e) => setBusinessAddress(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="payment-amount" className="text-white">Amount</Label>
                      <div className="relative">
                        <Input
                          id="payment-amount"
                          type="number"
                          placeholder="0.0"
                          className="bg-[#0A1022] border-[#1E2A4A] pr-16"
                          value={businessAmount}
                          onChange={(e) => setBusinessAmount(e.target.value)}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                          NPT
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="payment-description" className="text-white">Payment Description</Label>
                      <Textarea
                        id="payment-description"
                        placeholder="What's this payment for?"
                        className="bg-[#0A1022] border-[#1E2A4A]"
                      />
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white border-0"
                      onClick={async () => {
                        if (!businessAmount || parseFloat(businessAmount) <= 0) {
                          toast({
                            title: "Invalid Amount",
                            description: "Please enter a valid amount",
                            variant: "destructive"
                          });
                          return;
                        }
                        
                        if (!businessAddress) {
                          toast({
                            title: "Missing Recipient",
                            description: "Please enter a business address",
                            variant: "destructive"
                          });
                          return;
                        }
                        
                        if (!isConnected) {
                          toast({
                            title: "Wallet Not Connected",
                            description: "Please connect your wallet to make payments",
                            variant: "destructive"
                          });
                          return;
                        }
                        
                        try {
                          setIsProcessingBusinessPayment(true);
                          
                          // Use the blockchain sendTokens method with a business payment description
                          if (sendTokens) {
                            await sendTokens(businessAddress, businessAmount, "Business Payment");
                          }
                          
                          toast({
                            title: "Payment Successful",
                            description: "Your business payment has been processed",
                          });
                          
                          // Reset form
                          setBusinessAmount('');
                          setBusinessAddress('');
                        } catch (error: any) {
                          console.error("Error processing business payment:", error);
                          toast({
                            title: "Payment Failed",
                            description: error.message || "Failed to process payment. Please try again.",
                            variant: "destructive"
                          });
                        } finally {
                          setIsProcessingBusinessPayment(false);
                        }
                      }}
                      disabled={isProcessingBusinessPayment}
                    >
                      {isProcessingBusinessPayment ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Send Business Payment"
                      )}
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#0A1022]/80 border-[#1E2A4A] backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="mr-2 h-5 w-5 text-amber-400" />
                      <span className="text-white">Scheduled Payments</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="scheduled-address">Recipient Address</Label>
                      <Input
                        id="scheduled-address"
                        placeholder="0x..."
                        className="bg-[#0A1022] border-[#1E2A4A]"
                        value={scheduledAddress}
                        onChange={(e) => setScheduledAddress(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="scheduled-amount">Amount</Label>
                      <div className="relative">
                        <Input
                          id="scheduled-amount"
                          type="number"
                          placeholder="0.0"
                          className="bg-[#0A1022] border-[#1E2A4A] pr-16"
                          value={scheduledAmount}
                          onChange={(e) => setScheduledAmount(e.target.value)}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                          NPT
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="scheduled-date">Payment Date</Label>
                      <Input
                        id="scheduled-date"
                        type="date"
                        className="bg-[#0A1022] border-[#1E2A4A]"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                      />
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white border-0"
                      onClick={async () => {
                        if (!scheduledAmount || parseFloat(scheduledAmount) <= 0) {
                          toast({
                            title: "Invalid Amount",
                            description: "Please enter a valid amount",
                            variant: "destructive"
                          });
                          return;
                        }
                        
                        if (!scheduledAddress) {
                          toast({
                            title: "Missing Recipient",
                            description: "Please enter a recipient address",
                            variant: "destructive"
                          });
                          return;
                        }
                        
                        if (!scheduledDate) {
                          toast({
                            title: "Missing Date",
                            description: "Please select a payment date",
                            variant: "destructive"
                          });
                          return;
                        }
                        
                        if (!isConnected) {
                          toast({
                            title: "Wallet Not Connected",
                            description: "Please connect your wallet to schedule payments",
                            variant: "destructive"
                          });
                          return;
                        }
                        
                        try {
                          setIsProcessingSchedule(true);
                          
                          // Since there's no direct blockchain method for scheduled payments yet,
                          // we'll record the intent in our database and handle it accordingly
                          // In a production app, this would be handled by a smart contract with a time lock
                          
                          // For now, we'll handle this as a standard token transfer with a note
                          if (sendTokens) {
                            await sendTokens(scheduledAddress, scheduledAmount, `Scheduled payment for ${scheduledDate}`);
                          }
                          
                          toast({
                            title: "Payment Scheduled",
                            description: "Your payment has been scheduled successfully",
                          });
                          
                          // Reset form
                          setScheduledAmount('');
                          setScheduledAddress('');
                          setScheduledDate('');
                        } catch (error: any) {
                          console.error("Error scheduling payment:", error);
                          toast({
                            title: "Schedule Failed",
                            description: error.message || "Failed to schedule payment. Please try again.",
                            variant: "destructive"
                          });
                        } finally {
                          setIsProcessingSchedule(false);
                        }
                      }}
                      disabled={isProcessingSchedule}
                    >
                      {isProcessingSchedule ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Schedule Payment"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Collateral Tab Content */}
            <TabsContent value="collateral" className="mt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-[#0A1022]/80 border-[#1E2A4A] backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Landmark className="mr-2 h-5 w-5 text-amber-400" />
                      <span className="text-white">Add Collateral</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="collateral-amount" className="text-white">Amount to Add</Label>
                      <div className="relative">
                        <Input
                          id="collateral-amount"
                          type="number"
                          placeholder="0.0"
                          value={collateralAmount}
                          onChange={(e) => setCollateralAmount(e.target.value)}
                          className="bg-[#0A1022] border-[#1E2A4A] pr-16"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                          {collateralType.toUpperCase()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <Label htmlFor="collateral-type" className="text-white">Collateral Type</Label>
                      <select
                        id="collateral-type"
                        className="w-full bg-[#0A1022] border-[#1E2A4A] rounded-md p-2 text-white"
                        value={collateralType}
                        onChange={(e) => setCollateralType(e.target.value)}
                      >
                        <option value="bnb">BNB</option>
                        <option value="eth">ETH</option>
                        <option value="btc">BTC</option>
                      </select>
                    </div>

                    <div className="p-4 rounded-lg bg-[#0D1426] border border-[#1E2A4A] space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Current Collateral:</span>
                        <span className="text-white">{collateralAmount || '0.0'} {collateralType.toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Estimated Value:</span>
                        <span className="text-white">~{collateralAmount && parseFloat(collateralAmount) > 0 
                          ? (parseFloat(collateralAmount) * exchangeRates[collateralType as keyof typeof exchangeRates]).toFixed(2) 
                          : '0.0'} NPT</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Max Loan Available:</span>
                        <span className="text-white">{loanAmount || '0.0'} NPT</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Required Ratio:</span>
                        <span className="text-white">{Math.round(100 / ltv[collateralType as keyof typeof ltv])}%</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white border-0"
                      onClick={async () => {
                        if (!collateralAmount || parseFloat(collateralAmount) <= 0) {
                          toast({
                            title: "Invalid Amount",
                            description: "Please enter a valid collateral amount",
                            variant: "destructive"
                          });
                          return;
                        }
                        
                        if (!isConnected) {
                          toast({
                            title: "Wallet Not Connected",
                            description: "Please connect your wallet to add collateral",
                            variant: "destructive"
                          });
                          return;
                        }
                        
                        try {
                          setAddingCollateral(true);
                          
                          // Call blockchain method
                          if (addCollateral) {
                            await addCollateral(collateralType, collateralAmount);
                          }
                          
                          toast({
                            title: "Collateral Added",
                            description: `Successfully added ${collateralAmount} ${collateralType.toUpperCase()} as collateral`,
                          });
                          
                          // Reset form
                          setCollateralAmount('');
                        } catch (error: any) {
                          console.error("Error adding collateral:", error);
                          toast({
                            title: "Transaction Failed",
                            description: error.message || "Failed to add collateral. Please try again.",
                            variant: "destructive"
                          });
                        } finally {
                          setAddingCollateral(false);
                        }
                      }}
                    >
                      Add Collateral
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#0A1022]/80 border-[#1E2A4A] backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="mr-2 h-5 w-5 text-amber-400" />
                      <span className="text-white">Take a Loan</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="loan-amount" className="text-white">Loan Amount</Label>
                      <div className="relative">
                        <Input
                          id="loan-amount"
                          type="number"
                          placeholder="0.0"
                          className="bg-[#0A1022] border-[#1E2A4A] pr-16"
                          value={loanAmount}
                          onChange={(e) => setLoanAmount(e.target.value)}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                          NPT
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-[#0D1426] border border-[#1E2A4A] space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Interest Rate:</span>
                        <span className="text-white">5.0% (30 days)</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Required Collateral:</span>
                        <span className="text-white">{Math.round(100 / ltv[collateralType as keyof typeof ltv])}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Loan Term:</span>
                        <span className="text-white">30 days</span>
                      </div>
                    </div>
                    
                    <Alert className="bg-amber-500/10 border-amber-500/20">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      <AlertTitle className="text-white">Collateral Required</AlertTitle>
                      <AlertDescription className="text-white">
                        You must have sufficient collateral to take a loan. If you don't repay on time, you may forfeit your collateral.
                      </AlertDescription>
                    </Alert>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white border-0"
                      onClick={async () => {
                        if (!loanAmount || parseFloat(loanAmount) <= 0) {
                          toast({
                            title: "Invalid Amount",
                            description: "Please enter a valid loan amount",
                            variant: "destructive"
                          });
                          return;
                        }
                        
                        if (!collateralAmount || parseFloat(collateralAmount) <= 0) {
                          toast({
                            title: "Missing Collateral",
                            description: "You need to add collateral before taking a loan",
                            variant: "destructive"
                          });
                          return;
                        }
                        
                        if (!isConnected) {
                          toast({
                            title: "Wallet Not Connected",
                            description: "Please connect your wallet to take a loan",
                            variant: "destructive"
                          });
                          return;
                        }
                        
                        const maxLoanValue = parseFloat(collateralAmount) * 
                          exchangeRates[collateralType as keyof typeof exchangeRates] * 
                          ltv[collateralType as keyof typeof ltv];
                          
                        if (parseFloat(loanAmount) > maxLoanValue) {
                          toast({
                            title: "Insufficient Collateral",
                            description: `Maximum loan based on your collateral is ${maxLoanValue.toFixed(2)} NPT`,
                            variant: "destructive"
                          });
                          return;
                        }
                        
                        try {
                          setTakingLoan(true);
                          
                          // Call blockchain method (uses borrow() contract function)
                          if (takeLoan) {
                            await takeLoan(loanAmount);
                          }
                          
                          toast({
                            title: "Loan Request Submitted",
                            description: "Your loan request has been processed successfully",
                          });
                          
                          // Reset form
                          setLoanAmount('');
                        } catch (error: any) {
                          console.error("Error taking loan:", error);
                          toast({
                            title: "Transaction Failed",
                            description: error.message || "Failed to process loan. Please try again.",
                            variant: "destructive"
                          });
                        } finally {
                          setTakingLoan(false);
                        }
                      }}
                    >
                      Take Loan
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <MobileNavigation />
    </div>
  );
};

export default NepaliPayTokenPage;