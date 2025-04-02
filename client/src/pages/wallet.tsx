import React from 'react';
import { useWallet } from '@/contexts/wallet-context';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import MobileNavigation from '@/components/mobile-navigation';
import TransactionList from '@/components/transaction-list';
import QuickTransferForm from '@/components/quick-transfer-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WalletIcon } from '@/lib/icons';
import { Link } from 'wouter';
import { Coins, CreditCard, ArrowRight } from 'lucide-react';

const WalletPage: React.FC = () => {
  const { wallet, transactions, stats, loading } = useWallet();

  return (
    <div className="flex flex-col md:flex-row min-h-screen relative">
      <Sidebar />
      
      <main className="flex-1 flex flex-col pb-16 md:pb-0">
        <Header />

        <div className="flex-1 py-6 px-4 sm:px-6 lg:px-8 bg-black/80">
          <div className="max-w-7xl mx-auto">
            {/* Page Heading */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold gradient-text">My Wallet</h1>
                <p className="text-gray-400 mt-1">Manage your accounts and transactions</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-2">
                <Badge variant="outline" className="py-2 flex items-center gap-1 border-primary bg-primary/10 text-white hover:text-white glow">
                  <WalletIcon className="h-3.5 w-3.5" />
                  <span>Balance:</span>
                  <span className="font-semibold">
                    {wallet?.balance ? `NPR ${parseFloat(wallet.balance.toString()).toFixed(2)}` : 'NPR 0.00'}
                  </span>
                </Badge>
                <Button variant="outline" size="sm" className="text-xs flex items-center border-primary/50 bg-primary/10 text-white hover:bg-primary/20 transition-all duration-300 glow">
                  <Coins className="h-3.5 w-3.5 mr-1" /> Add Funds
                </Button>
              </div>
            </div>

            {/* Wallet Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="cyber-card glass rounded-xl overflow-hidden p-6 relative glow">
                <div className="absolute top-0 right-0 h-24 w-24 bg-primary/10 rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 h-16 w-16 bg-primary/10 rounded-tr-full"></div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-white font-semibold text-lg">Main Account</h3>
                    <p className="text-white/60 text-sm">Personal wallet</p>
                  </div>
                  <CreditCard className="text-primary h-6 w-6" />
                </div>
                <div className="mb-4">
                  <p className="text-white/60 text-sm">Balance</p>
                  <p className="text-white text-2xl font-bold">
                    {wallet?.balance ? `NPR ${parseFloat(wallet.balance.toString()).toFixed(2)}` : 'NPR 0.00'}
                  </p>
                </div>
                <div className="flex justify-between">
                  <Button className="bg-gradient-to-r from-primary to-purple-500 hover:opacity-90">
                    Send Money
                  </Button>
                  <Button variant="outline" className="border-primary/50 text-white hover:bg-primary/20">
                    View Details
                  </Button>
                </div>
              </div>

              <div className="cyber-card glass rounded-xl overflow-hidden p-6 relative">
                <div className="absolute top-0 right-0 h-24 w-24 bg-blue-500/10 rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 h-16 w-16 bg-blue-500/10 rounded-tr-full"></div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-white font-semibold text-lg">NPT Tokens</h3>
                    <p className="text-white/60 text-sm">Cryptocurrency wallet</p>
                  </div>
                  <Coins className="text-blue-400 h-6 w-6" />
                </div>
                <div className="mb-4">
                  <p className="text-white/60 text-sm">Balance</p>
                  <p className="text-white text-2xl font-bold">1.23 NPT</p>
                </div>
                <div className="flex justify-between">
                  <Button className="bg-gradient-to-r from-blue-500 to-blue-700 hover:opacity-90">
                    Trade
                  </Button>
                  <Button variant="outline" className="border-blue-500/50 text-white hover:bg-blue-500/20" asChild>
                    <Link href="/crypto">
                      <span className="flex items-center">View Details <ArrowRight className="ml-1 h-4 w-4" /></span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TransactionList 
                  transactions={transactions} 
                  loading={loading.transactions}
                  onLoadMore={() => console.log('Loading more transactions')}
                />
              </div>
              <div className="lg:col-span-1">
                <QuickTransferForm />
              </div>
            </div>
          </div>
        </div>
        <MobileNavigation />
      </main>
    </div>
  );
};

export default WalletPage;