import React, { useState } from 'react';
import { useWallet } from '@/contexts/wallet-context';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import MobileNavigation from '@/components/mobile-navigation';
import TransactionList from '@/components/transaction-list';
import QuickTransferForm from '@/components/quick-transfer-form';
import NepaliWalletVisualization from '@/components/nepali-wallet-visualization';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WalletIcon } from '@/lib/icons';
import { Link } from 'wouter';
import { Coins, CreditCard, ArrowRight, PieChart, BarChartIcon, RefreshCw } from 'lucide-react';

const WalletPage: React.FC = () => {
  const { wallet, transactions, stats, loading } = useWallet();
  const [visualizationSize, setVisualizationSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [animationEnabled, setAnimationEnabled] = useState(true);

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
            
            {/* Balance Visualization Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Balance Visualization</h2>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 bg-gray-900/50 p-1.5 rounded-lg">
                    <Button 
                      variant={visualizationSize === 'small' ? "secondary" : "ghost"} 
                      size="sm" 
                      onClick={() => setVisualizationSize('small')}
                      className="h-8 px-2"
                    >
                      S
                    </Button>
                    <Button 
                      variant={visualizationSize === 'medium' ? "secondary" : "ghost"} 
                      size="sm" 
                      onClick={() => setVisualizationSize('medium')}
                      className="h-8 px-2"
                    >
                      M
                    </Button>
                    <Button 
                      variant={visualizationSize === 'large' ? "secondary" : "ghost"} 
                      size="sm" 
                      onClick={() => setVisualizationSize('large')}
                      className="h-8 px-2"
                    >
                      L
                    </Button>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setAnimationEnabled(!animationEnabled)}
                    className={`h-8 px-3 ${animationEnabled ? 'bg-primary/20 border-primary/50' : 'bg-gray-800/50 border-gray-700'}`}
                  >
                    <RefreshCw className={`h-4 w-4 mr-1.5 ${animationEnabled ? 'animate-spin' : ''}`} />
                    {animationEnabled ? 'Animated' : 'Static'}
                  </Button>
                </div>
              </div>
              
              <div className="cyber-card glass rounded-xl overflow-hidden p-6 bg-gray-900/30">
                <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center lg:justify-between">
                  <div className="mb-6 lg:mb-0">
                    <h3 className="text-lg font-semibold text-white mb-2">Interactive Nepali Art Style</h3>
                    <p className="text-gray-400 mb-4 max-w-md">
                      This visualization changes dynamically based on your wallet balance, incorporating traditional 
                      Nepali art motifs like mandalas and cultural symbols. Hover over the visualization to see more details.
                    </p>
                    
                    <div className="glass-card p-4 rounded-lg bg-gray-900/30 border border-gray-800 max-w-sm">
                      <h4 className="text-white text-sm font-medium mb-2">Visualization Legend</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                          <span className="text-gray-300 text-xs">Low Balance (red)</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                          <span className="text-gray-300 text-xs">Medium Balance (gold)</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-teal-500 mr-2"></div>
                          <span className="text-gray-300 text-xs">High Balance (teal)</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
                          <span className="text-gray-300 text-xs">Empty Balance (gray)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <NepaliWalletVisualization 
                      size={visualizationSize} 
                      animated={animationEnabled}
                      showDetails={true}
                      className="shadow-lg shadow-primary/20"
                    />
                  </div>
                </div>
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
                    <Link href="/nepalpaytoken">
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