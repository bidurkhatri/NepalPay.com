import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import MobileNavigation from '@/components/mobile-navigation';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Copy, Check, ArrowRight, ArrowLeft, RefreshCw, PiggyBank, Coins, SendHorizonal } from 'lucide-react';
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
  DialogTrigger 
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

const CryptoPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('wallet');
  const [tokenBalance, setTokenBalance] = useState(1.23); // Mock data, would be fetched from blockchain
  const [copySuccess, setCopySuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sendingTokens, setSendingTokens] = useState(false);
  const [sendAmount, setSendAmount] = useState('');
  const [sendAddress, setSendAddress] = useState('');
  const [sendDescription, setSendDescription] = useState('');
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [activeLoans, setActiveLoans] = useState([
    { id: 1, amount: 5.0, interest: 0.25, dueDate: '2025-06-01' }
  ]);
  const [activeCampaigns, setActiveCampaigns] = useState([
    { 
      id: 1, 
      title: 'Community Education Project', 
      creator: 'education_ngo',
      description: 'Funding educational resources for rural communities',
      target: 500, 
      raised: 320, 
      contributors: 28,
      deadline: '2025-05-15'
    },
    { 
      id: 2, 
      title: 'Tech Startup Accelerator', 
      creator: 'tech_hub',
      description: 'Supporting innovative tech startups in Nepal',
      target: 1000, 
      raised: 650, 
      contributors: 42,
      deadline: '2025-06-10'
    }
  ]);

  const walletAddress = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'; // Example address
  
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

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
      // In a real implementation, this would call the blockchain
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate blockchain operation
      
      toast({
        title: 'Tokens Sent',
        description: `Successfully sent ${sendAmount} NPT to ${sendAddress}`,
      });
      
      setIsSendDialogOpen(false);
      setSendAmount('');
      setSendAddress('');
      setSendDescription('');
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

  // This would be replaced with actual blockchain integration
  const handleContribute = (campaignId: number) => {
    toast({
      title: 'Contribution Pending',
      description: 'Your contribution will be processed once blockchain integration is complete',
    });
  };

  const handleTakeLoan = () => {
    toast({
      title: 'Feature Coming Soon',
      description: 'Decentralized loans will be available in the next update',
    });
  };

  const handleRepayLoan = (loanId: number) => {
    toast({
      title: 'Feature Coming Soon',
      description: 'Loan repayment will be available in the next update',
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen relative">
      <Sidebar />
      
      <main className="flex-1 flex flex-col pb-16 md:pb-0">
        <Header />

        <div className="flex-1 py-6 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {/* Page Heading with NPT Token */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Cryptocurrency</h1>
                <p className="text-gray-500 mt-1">Manage your NPT tokens and blockchain assets</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-2">
                <Badge variant="outline" className="py-2 flex items-center gap-1 border-orange-500 text-orange-500 hover:text-orange-500">
                  <Coins className="h-3.5 w-3.5" />
                  <span>NPT Balance:</span>
                  <span className="font-semibold">{tokenBalance.toFixed(2)} NPT</span>
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={handleRefreshBalance}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            </div>

            {/* Wallet Address Display */}
            <div className="mb-6 bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-2 md:mb-0">
                  <h2 className="text-sm font-medium text-gray-500">Your Wallet Address</h2>
                  <div className="mt-1 font-mono text-sm">{walletAddress}</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs gap-1"
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
              </div>
            </div>

            {/* Main Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid grid-cols-4 w-full md:w-auto">
                <TabsTrigger value="wallet">Wallet</TabsTrigger>
                <TabsTrigger value="loans">Loans</TabsTrigger>
                <TabsTrigger value="crowdfunding">Crowdfunding</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              {/* Wallet Tab */}
              <TabsContent value="wallet" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Token Management</CardTitle>
                    <CardDescription>
                      Send, receive, and manage your NPT tokens
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Current Balance</h3>
                        <div className="flex items-center bg-gray-50 p-4 rounded-lg border">
                          <Coins className="h-10 w-10 text-orange-500 mr-4" />
                          <div>
                            <p className="text-2xl font-bold">{tokenBalance.toFixed(2)} NPT</p>
                            <p className="text-xs text-gray-500">≈ NPR {(tokenBalance * 1000).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2">Token Information</h3>
                        <div className="bg-gray-50 p-4 rounded-lg border h-[calc(100%-28px)]">
                          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm">
                            <dt className="text-gray-500">Name:</dt>
                            <dd>NepalPay Token</dd>
                            <dt className="text-gray-500">Symbol:</dt>
                            <dd>NPT</dd>
                            <dt className="text-gray-500">Decimals:</dt>
                            <dd>18</dd>
                          </dl>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2">Token Value</h3>
                        <div className="bg-gray-50 p-4 rounded-lg border h-[calc(100%-28px)] flex flex-col justify-center">
                          <p className="text-center text-lg font-semibold">1 NPT = 1,000 NPR</p>
                          <p className="text-center text-xs text-gray-500 mt-1">Last updated: April 2, 2025</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Dialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="gap-2">
                          <SendHorizonal className="h-4 w-4" />
                          Send Tokens
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Send NPT Tokens</DialogTitle>
                          <DialogDescription>
                            Enter recipient details and amount to send
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label>Recipient Address or Username</Label>
                            <Input
                              placeholder="0x... or username"
                              value={sendAddress}
                              onChange={(e) => setSendAddress(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Amount (NPT)</Label>
                            <Input
                              type="text"
                              inputMode="decimal"
                              placeholder="Enter amount"
                              value={sendAmount}
                              onChange={(e) => setSendAmount(e.target.value)}
                            />
                            {sendAmount && !isNaN(parseFloat(sendAmount)) && (
                              <p className="text-xs text-gray-500">
                                ≈ NPR {(parseFloat(sendAmount) * 1000).toFixed(2)}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label>Description (Optional)</Label>
                            <Input
                              placeholder="e.g. Payment for services"
                              value={sendDescription}
                              onChange={(e) => setSendDescription(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsSendDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button disabled={sendingTokens} onClick={handleSendTokens}>
                            {sendingTokens ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              'Send Tokens'
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline">
                      Buy NPT Tokens
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Loans Tab */}
              <TabsContent value="loans" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Decentralized Loans</CardTitle>
                    <CardDescription>
                      Borrow and lend NPT tokens with blockchain-based security
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium mb-4">Take a Loan</h3>
                        <div className="bg-gray-50 p-4 rounded-lg border">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Loan Amount (NPT)</Label>
                              <Input type="text" placeholder="Enter amount" />
                            </div>
                            <div className="space-y-2">
                              <Label>Collateral Amount (NPT)</Label>
                              <Input type="text" placeholder="Enter collateral amount" />
                              <p className="text-xs text-gray-500">
                                Minimum collateral: 110% of loan amount
                              </p>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-md text-sm border border-blue-100">
                              <p className="font-medium text-blue-700">Loan Terms</p>
                              <ul className="mt-1 text-blue-600 space-y-1">
                                <li>• 5% annual interest rate</li>
                                <li>• 30-day loan duration</li>
                                <li>• No early repayment penalty</li>
                              </ul>
                            </div>
                            <Button onClick={handleTakeLoan} className="w-full">
                              <PiggyBank className="mr-2 h-4 w-4" />
                              Take Loan
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-4">Active Loans</h3>
                        {activeLoans.length > 0 ? (
                          <div className="divide-y border rounded-lg overflow-hidden">
                            {activeLoans.map(loan => (
                              <div key={loan.id} className="p-4 bg-white">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h4 className="font-medium">Loan #{loan.id}</h4>
                                    <p className="text-xs text-gray-500">Due: {loan.dueDate}</p>
                                  </div>
                                  <Badge variant="secondary">Active</Badge>
                                </div>
                                <div className="mb-3">
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>Amount:</span>
                                    <span className="font-medium">{loan.amount} NPT</span>
                                  </div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>Interest:</span>
                                    <span className="font-medium">{loan.interest} NPT</span>
                                  </div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>Total Due:</span>
                                    <span className="font-medium">{loan.amount + loan.interest} NPT</span>
                                  </div>
                                </div>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-full"
                                  onClick={() => handleRepayLoan(loan.id)}
                                >
                                  Repay Loan
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-gray-50 p-4 rounded-lg border text-center">
                            <p className="text-gray-500">No active loans</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Crowdfunding Tab */}
              <TabsContent value="crowdfunding" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Crowdfunding Campaigns</CardTitle>
                    <CardDescription>
                      Contribute to campaigns or start your own fundraising project
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {activeCampaigns.map(campaign => (
                        <div key={campaign.id} className="border rounded-lg overflow-hidden">
                          <div className="p-4 bg-white">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="font-medium text-lg">{campaign.title}</h3>
                              <Badge variant="secondary" className="ml-2">Active</Badge>
                            </div>
                            
                            <div className="mb-4">
                              <div className="flex items-center mb-2">
                                <Avatar className="h-6 w-6 mr-2">
                                  <AvatarFallback>{campaign.creator.slice(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm text-gray-600">@{campaign.creator}</span>
                              </div>
                              <p className="text-sm text-gray-600">{campaign.description}</p>
                            </div>
                            
                            <div className="mb-4">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Progress</span>
                                <span>{Math.round(campaign.raised / campaign.target * 100)}%</span>
                              </div>
                              <Progress value={campaign.raised / campaign.target * 100} className="h-2" />
                              <div className="flex justify-between text-sm mt-1">
                                <span>{campaign.raised} NPT raised</span>
                                <span>Target: {campaign.target} NPT</span>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                              <span>{campaign.contributors} contributors</span>
                              <span>Deadline: {campaign.deadline}</span>
                            </div>
                            
                            <Button 
                              className="w-full" 
                              onClick={() => handleContribute(campaign.id)}
                            >
                              Contribute
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Create New Campaign
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>
                      View your past blockchain transactions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="divide-y border rounded-lg overflow-hidden">
                      {[1, 2, 3].map((_, i) => (
                        <div key={i} className="p-4 bg-white flex items-start justify-between">
                          <div className="flex items-start">
                            {i % 2 === 0 ? (
                              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                <ArrowLeft className="h-4 w-4 text-green-600" />
                              </div>
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                <ArrowRight className="h-4 w-4 text-blue-600" />
                              </div>
                            )}
                            <div>
                              <h4 className="font-medium">
                                {i % 2 === 0 ? 'Received' : 'Sent'} {Math.random().toFixed(2)} NPT
                              </h4>
                              <p className="text-xs text-gray-500">
                                {i % 2 === 0 ? 'From' : 'To'}: 0x71C7...976F
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Transaction Hash: 0xfb3a...d78e
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-sm">
                              {i % 2 === 0 ? (
                                <span className="text-green-600">+{Math.random().toFixed(2)} NPT</span>
                              ) : (
                                <span className="text-blue-600">-{Math.random().toFixed(2)} NPT</span>
                              )}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">April {i + 1}, 2025</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Button variant="outline" size="sm">
                      Load More Transactions
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <MobileNavigation />
      </main>
    </div>
  );
};

export default CryptoPage;