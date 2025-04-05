import React, { useState } from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/contexts/auth-context';
import { useWallet } from '@/contexts/wallet-context';
import { useBlockchain } from '@/contexts/blockchain-context';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import MobileNavigation from '@/components/mobile-navigation';
import BalanceCard from '@/components/balance-card';
import ActionButton from '@/components/action-button';
import TransactionList from '@/components/transaction-list';
import QuickTransferForm from '@/components/quick-transfer-form';
import ActivityLog from '@/components/activity-log';
import {
  SendIcon,
  ReceiveIcon,
  CardIcon,
  MobileIcon,
  ElectricityIcon,
  MoreIcon
} from '@/lib/icons';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowRight, RefreshCw, Wallet as WalletIcon, Coins } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { wallet, transactions, activities, loading, stats, mobileTopup, utilityPayment } = useWallet();
  const { nptBalance, isConnected, connectWallet } = useBlockchain();
  const { toast } = useToast();
  
  const [mobileTopupOpen, setMobileTopupOpen] = useState(false);
  const [utilityPaymentOpen, setUtilityPaymentOpen] = useState(false);
  const [cryptoDialogOpen, setCryptoDialogOpen] = useState(false);
  const [topupAmount, setTopupAmount] = useState('');
  const [utilityAmount, setUtilityAmount] = useState('');
  const [topupNote, setTopupNote] = useState('');
  const [utilityNote, setUtilityNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMobileTopup = async () => {
    if (!topupAmount || isNaN(parseFloat(topupAmount)) || parseFloat(topupAmount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsProcessing(true);
      await mobileTopup(topupAmount, topupNote);
      setMobileTopupOpen(false);
      setTopupAmount('');
      setTopupNote('');
    } catch (error) {
      console.error('Mobile top-up error', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUtilityPayment = async () => {
    if (!utilityAmount || isNaN(parseFloat(utilityAmount)) || parseFloat(utilityAmount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsProcessing(true);
      await utilityPayment(utilityAmount, utilityNote);
      setUtilityPaymentOpen(false);
      setUtilityAmount('');
      setUtilityNote('');
    } catch (error) {
      console.error('Utility payment error', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen relative">
      <Sidebar />
      
      <main className="flex-1 flex flex-col pb-16 md:pb-0">
        <Header />

        <div className="flex-1 py-6 px-4 sm:px-6 lg:px-8 bg-black/80">
          <div className="max-w-7xl mx-auto">
            {/* Page Heading with NPT Token */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
                <p className="text-gray-400 mt-1">Welcome back, manage your finances with blockchain security</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-2">
                <Badge variant="outline" className="py-2 flex items-center gap-1 border-primary bg-primary/10 text-white hover:text-white glow">
                  <WalletIcon className="h-3.5 w-3.5" />
                  <span>NPT Token:</span>
                  <span className="font-semibold">{nptBalance} NPT</span>
                </Badge>
                {isConnected ? (
                  <Button variant="outline" size="sm" className="text-xs flex items-center border-primary/50 bg-primary/10 text-white hover:bg-primary/20 transition-all duration-300 glow" asChild>
                    <Link href="/crypto">
                      <Coins className="h-3.5 w-3.5 mr-1" /> Manage
                    </Link>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="text-xs flex items-center border-primary/50 bg-primary/10 text-white hover:bg-primary/20 transition-all duration-300 glow" onClick={connectWallet}>
                    <Coins className="h-3.5 w-3.5 mr-1" /> Connect Wallet
                  </Button>
                )}
              </div>
            </div>

            {/* Balance Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <BalanceCard
                title="Total Balance"
                amount={wallet?.balance ? `NPR ${parseFloat(wallet.balance.toString()).toFixed(2)}` : 'NPR 0.00'}
                percentageChange={stats.percentageChange}
                type="balance"
              />
              
              <BalanceCard
                title="Income"
                amount={`NPR ${stats.income}`}
                percentageChange="+4.3%"
                type="income"
              />
              
              <BalanceCard
                title="Expenses"
                amount={`NPR ${stats.expenses}`}
                percentageChange="+1.8%"
                type="expense"
              />
              
              <BalanceCard
                title="Savings"
                amount={`NPR ${stats.savings}`}
                percentageChange="+6.2%"
                type="savings"
              />
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <ActionButton
                  icon={<SendIcon className="text-primary-500 text-xl" />}
                  label="Send Money"
                  onClick={() => {
                    // This will open the QuickTransferForm which is already displayed on the page
                    document.getElementById('quick-transfer-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                />
                
                <ActionButton
                  icon={<ReceiveIcon className="text-green-500 text-xl" />}
                  label="Receive"
                  onClick={() => {
                    toast({
                      title: 'Receive Money',
                      description: 'Share your username with others to receive money',
                    });
                  }}
                />
                
                <Link href="/nepalipaytoken">
                  <ActionButton
                    icon={<CardIcon className="text-blue-500 text-xl" />}
                    label="Buy NPT"
                    onClick={() => {}}
                  />
                </Link>
                
                <Dialog open={mobileTopupOpen} onOpenChange={setMobileTopupOpen}>
                  <DialogTrigger asChild>
                    <div>
                      <ActionButton
                        icon={<MobileIcon className="text-orange-500 text-xl" />}
                        label="Mobile Top-up"
                        onClick={() => setMobileTopupOpen(true)}
                      />
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Mobile Top-up</DialogTitle>
                      <DialogDescription>
                        Enter the amount you want to top-up
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Amount (NPR)</label>
                        <Input
                          type="text"
                          inputMode="decimal"
                          placeholder="Enter amount"
                          value={topupAmount}
                          onChange={(e) => setTopupAmount(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Note (Optional)</label>
                        <Input
                          placeholder="e.g. NTC recharge"
                          value={topupNote}
                          onChange={(e) => setTopupNote(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setMobileTopupOpen(false)}>
                        Cancel
                      </Button>
                      <Button disabled={isProcessing} onClick={handleMobileTopup}>
                        {isProcessing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          'Top-up'
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Dialog open={utilityPaymentOpen} onOpenChange={setUtilityPaymentOpen}>
                  <DialogTrigger asChild>
                    <div>
                      <ActionButton
                        icon={<ElectricityIcon className="text-purple-500 text-xl" />}
                        label="Electricity"
                        onClick={() => setUtilityPaymentOpen(true)}
                      />
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Electricity Bill Payment</DialogTitle>
                      <DialogDescription>
                        Enter the bill amount
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Amount (NPR)</label>
                        <Input
                          type="text"
                          inputMode="decimal"
                          placeholder="Enter amount"
                          value={utilityAmount}
                          onChange={(e) => setUtilityAmount(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Note (Optional)</label>
                        <Input
                          placeholder="e.g. March electricity bill"
                          value={utilityNote}
                          onChange={(e) => setUtilityNote(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setUtilityPaymentOpen(false)}>
                        Cancel
                      </Button>
                      <Button disabled={isProcessing} onClick={handleUtilityPayment}>
                        {isProcessing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          'Pay Bill'
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <ActionButton
                  icon={<MoreIcon className="text-gray-500 text-xl" />}
                  label="More"
                  onClick={() => {
                    toast({
                      title: 'More Services',
                      description: 'Additional services will be available soon',
                    });
                  }}
                />
              </div>
            </div>

            {/* Main Two-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Recent Transactions */}
              <div className="lg:col-span-2">
                <TransactionList 
                  transactions={transactions} 
                  loading={loading.transactions}
                  onLoadMore={() => {
                    toast({
                      title: 'Load More',
                      description: 'Loading more transactions will be available soon',
                    });
                  }}
                />
              </div>

              {/* Right Column: Quick Transfer and Activity */}
              <div className="space-y-8" id="quick-transfer-section">
                <QuickTransferForm />
                
                <ActivityLog 
                  activities={activities} 
                  loading={loading.activities}
                  onViewAll={() => {
                    toast({
                      title: 'View All Activity',
                      description: 'Full activity log will be available soon',
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        
        <MobileNavigation />
      </main>
      
      {/* NPT Token Dialog */}
      <Dialog open={cryptoDialogOpen} onOpenChange={setCryptoDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>NPT Token Management</DialogTitle>
            <DialogDescription>
              Manage your NepaliPay Token (NPT) - the native cryptocurrency for NepaliPay
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-500">Current Balance</span>
                <Badge variant="outline" className="py-1 border-orange-500 text-orange-500">Blockchain</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <WalletIcon className="h-6 w-6 text-primary" />
                <span className="text-2xl font-bold">{nptBalance} NPT</span>
              </div>
              <div className="mt-1 text-xs text-gray-500">
                ≈ NPR {(parseFloat(nptBalance) * 1000).toLocaleString(undefined, {maximumFractionDigits: 2})}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Link href="/nepalipaytoken">
                  <Button className="w-full">
                    <ArrowRight className="mr-2 h-4 w-4" /> Send NPT
                  </Button>
                </Link>
                <Link href="/nepalipaytoken">
                  <Button variant="outline" className="w-full">
                    Receive NPT
                  </Button>
                </Link>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Other Actions</h4>
                <div className="space-y-2">
                  <Link href="/nepalipaytoken">
                    <Button variant="ghost" className="w-full justify-start">
                      Add Collateral
                    </Button>
                  </Link>
                  <Link href="/nepalipaytoken">
                    <Button variant="ghost" className="w-full justify-start">
                      Take Loan
                    </Button>
                  </Link>
                  <Link href="/nepalipaytoken">
                    <Button variant="ghost" className="w-full justify-start">
                      Crowdfunding
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCryptoDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
