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
  Landmark, CreditCard
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
    sendTokens
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
              <span className="text-blue-400 mr-2">Balance:</span>
              <span className="font-medium">{nptBalance || '0.0'} NPT</span>
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
                className="h-10 px-5 rounded-full data-[state=active]:bg-blue-500/90 data-[state=active]:text-white"
              >
                Wallet
              </TabsTrigger>
              <TabsTrigger 
                value="loans" 
                className="h-10 px-5 rounded-full data-[state=active]:bg-blue-500/90 data-[state=active]:text-white"
              >
                Loans
              </TabsTrigger>
              <TabsTrigger 
                value="funding" 
                className="h-10 px-5 rounded-full data-[state=active]:bg-blue-500/90 data-[state=active]:text-white"
              >
                Funding
              </TabsTrigger>
            </TabsList>
            
            {/* Wallet Tab Content */}
            <TabsContent value="wallet" className="mt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Balance Card */}
                <Card className="bg-[#0A1022]/80 border-[#1E2A4A] backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <PiggyBank className="mr-2 h-5 w-5 text-blue-400" />
                      Your NPT Balance
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
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white border-0">
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
                            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white border-0"
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
                      <ArrowDown className="mr-2 h-5 w-5 text-blue-400" />
                      Recent Transactions
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
            
            {/* Loans Tab Content */}
            <TabsContent value="loans" className="mt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-[#0A1022]/80 border-[#1E2A4A] backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Landmark className="mr-2 h-5 w-5 text-blue-400" />
                      Take a Loan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="loan-amount">Loan Amount</Label>
                      <div className="relative">
                        <Input
                          id="loan-amount"
                          type="number"
                          placeholder="0.0"
                          className="bg-[#0A1022] border-[#1E2A4A] pr-16"
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
                        <span className="text-white">120%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Loan Term:</span>
                        <span className="text-white">30 days</span>
                      </div>
                    </div>
                    
                    <Alert className="bg-amber-500/10 border-amber-500/20">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      <AlertTitle>Collateral Required</AlertTitle>
                      <AlertDescription>
                        You must have sufficient collateral to take a loan. If you don't repay on time, you may forfeit your collateral.
                      </AlertDescription>
                    </Alert>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white border-0"
                      onClick={() => {
                        toast({
                          title: "Loan Feature Coming Soon",
                          description: "This feature will be available in the next update",
                        });
                      }}
                    >
                      Take Loan
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#0A1022]/80 border-[#1E2A4A] backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="mr-2 h-5 w-5 text-blue-400" />
                      Your Active Loans
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center h-48 text-gray-400">
                      No active loans
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Funding Tab Content */}
            <TabsContent value="funding" className="mt-6">
              <Card className="bg-[#0A1022]/80 border-[#1E2A4A] backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PiggyBank className="mr-2 h-5 w-5 text-blue-400" />
                    Crowdfunding Campaigns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-48 text-gray-400">
                    No active crowdfunding campaigns
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <MobileNavigation />
    </div>
  );
};

export default NepaliPayTokenPage;