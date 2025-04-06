import { useAuth } from '@/hooks/use-auth';
import { useRealTimeContext } from '@/contexts/real-time-context';
import { Link } from 'wouter';
import TransactionList from '@/components/transaction-list';
import ActivityLog from '@/components/activity-log';
import { Loader2, Signal, SignalZero, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  const { 
    isConnected, 
    wallet, 
    recentTransactions, 
    recentActivities,
    lastUpdate,
    refreshData
  } = useRealTimeContext();
  
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading state for initial data fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Format NPT balance for display
  const formatBalance = (balance: string | undefined) => {
    if (!balance) return "0.00";
    return parseFloat(balance).toFixed(2);
  };
  
  const handleRefresh = () => {
    setIsLoading(true);
    refreshData();
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <header className="backdrop-blur-md border-b border-primary/20 p-4 fixed top-0 left-0 right-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
            NepaliPay
          </div>
          <nav className="space-x-6 hidden md:flex">
            <Link href="/" className="text-white hover:text-primary transition-colors">Dashboard</Link>
            <Link href="/wallet" className="text-white hover:text-primary transition-colors">Wallet</Link>
            <Link href="/buy-tokens" className="text-white hover:text-primary transition-colors">Buy Tokens</Link>
            <Link href="/transactions" className="text-white hover:text-primary transition-colors">Transactions</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <div className="connection-status hidden md:flex items-center">
              {isConnected ? (
                <span className="flex items-center text-xs text-green-400">
                  <Signal className="h-3 w-3 mr-1" />
                  Connected
                </span>
              ) : (
                <span className="flex items-center text-xs text-red-400">
                  <SignalZero className="h-3 w-3 mr-1" />
                  Disconnected
                </span>
              )}
            </div>
            <button 
              onClick={handleLogout}
              className="px-3 py-1 rounded border border-primary/50 hover:bg-primary/20 transition-colors text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto pt-24 px-4 pb-10">
        <section className="mb-8">
          <div className="glass cyber-card p-6 rounded-xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-2xl font-bold">Welcome, {user?.username}!</h1>
                <p className="text-white/60">Manage your digital finances with NepaliPay</p>
              </div>
              <div className="mt-4 md:mt-0">
                <button 
                  onClick={handleRefresh} 
                  className="inline-flex items-center px-4 py-2 bg-primary/20 border border-primary/30 rounded-lg text-primary hover:bg-primary/30 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <span>Refresh Data</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {lastUpdate && (
              <div className="mt-2 text-xs text-white/40">
                Last updated: {new Date(lastUpdate).toLocaleTimeString()}
              </div>
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass cyber-card rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Wallet Balance</h3>
              
              {isLoading ? (
                <div className="h-24 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
                </div>
              ) : wallet ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="backdrop-blur-lg bg-gradient-to-r from-primary/10 to-purple-500/10 p-4 rounded-lg border border-primary/20">
                    <div className="text-white/70 text-sm">NPT Balance</div>
                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
                      {formatBalance(wallet.nptBalance)} NPT
                    </div>
                  </div>
                  
                  <div className="backdrop-blur-lg bg-gradient-to-r from-orange-500/10 to-yellow-500/10 p-4 rounded-lg border border-orange-500/20">
                    <div className="text-white/70 text-sm">BNB Balance</div>
                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
                      {formatBalance(wallet.bnbBalance)} BNB
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-24 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-center text-red-400">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <span>Wallet not connected</span>
                  </div>
                </div>
              )}
              
              <div className="mt-4 flex justify-end">
                <Link 
                  href="/wallet" 
                  className="px-4 py-2 bg-primary/20 rounded-lg text-primary hover:bg-primary/30 transition-colors text-sm"
                >
                  View Wallet
                </Link>
              </div>
            </div>
            
            <TransactionList 
              transactions={recentTransactions || []} 
              loading={isLoading}
              onLoadMore={() => {}} 
            />
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            <div className="glass cyber-card rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Link 
                  to="/buy-tokens" 
                  className="cyber-btn primary-glass-btn text-center py-2 rounded-lg"
                >
                  Buy Tokens
                </Link>
                <Link 
                  to="/send" 
                  className="cyber-btn secondary-glass-btn text-center py-2 rounded-lg"
                >
                  Send
                </Link>
                <Link 
                  to="/receive" 
                  className="cyber-btn secondary-glass-btn text-center py-2 rounded-lg"
                >
                  Receive
                </Link>
                <Link 
                  to="/loans" 
                  className="cyber-btn secondary-glass-btn text-center py-2 rounded-lg"
                >
                  Loans
                </Link>
              </div>
            </div>
            
            <ActivityLog 
              activities={recentActivities || []} 
              loading={isLoading}
              onViewAll={() => {}} 
            />
          </div>
        </div>
      </main>
    </div>
  );
}