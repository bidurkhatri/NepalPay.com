import { useAuth } from '@/hooks/use-auth';
import { useRealTimeContext } from '@/contexts/real-time-context';
import { Link, useLocation } from 'wouter';
import TransactionList from '@/components/transaction-list';
import ActivityLog from '@/components/activity-log';
import { 
  Loader2, 
  Signal, 
  SignalZero, 
  AlertCircle, 
  Home, 
  Wallet, 
  CreditCard, 
  BarChart3, 
  Send, 
  DollarSign, 
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Gift,
  Users,
  HelpCircle
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();
  const { 
    isConnected, 
    wallet, 
    recentTransactions, 
    recentActivities,
    lastUpdate,
    refreshData
  } = useRealTimeContext();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Simulate loading state for initial data fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Format NPT balance for display
  const formatBalance = (balance: string | undefined) => {
    if (!balance) return "0.00";
    
    try {
      const value = parseFloat(balance);
      if (isNaN(value)) return "0.00";
      
      // For large numbers, abbreviate with K, M, etc.
      if (value >= 1000000) {
        return (value / 1000000).toFixed(2) + 'M';
      } else if (value >= 1000) {
        return (value / 1000).toFixed(2) + 'K';
      }
      return value.toFixed(2);
    } catch (error) {
      console.error('Error formatting balance:', error);
      return "0.00";
    }
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
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Navigation items for both sidebar and mobile menu
  const navItems = [
    { icon: <Home className="h-5 w-5" />, label: 'Dashboard', href: '/dashboard', current: location === '/dashboard' },
    { icon: <Wallet className="h-5 w-5" />, label: 'Wallet', href: '/wallet', current: location === '/wallet' },
    { icon: <CreditCard className="h-5 w-5" />, label: 'Buy Tokens', href: '/buy-tokens', current: location === '/buy-tokens' },
    { icon: <Send className="h-5 w-5" />, label: 'Send & Receive', href: '/send', current: location === '/send' },
    { icon: <BarChart3 className="h-5 w-5" />, label: 'Transactions', href: '/transactions', current: location === '/transactions' },
    { icon: <Gift className="h-5 w-5" />, label: 'Rewards', href: '/rewards', current: location === '/rewards' },
    { icon: <Users className="h-5 w-5" />, label: 'Referrals', href: '/referrals', current: location === '/referrals' },
    { icon: <HelpCircle className="h-5 w-5" />, label: 'Help & Support', href: '/support', current: location === '/support' || location.startsWith('/support/') }
  ];

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 bg-gradient-to-b from-gray-900 to-black border-r border-white/5">
        <div className="flex items-center justify-center h-16 px-4 border-b border-white/5">
          <div className="flex items-center">
            <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-400 to-purple-400">NepaliPay</div>
            <div className="ml-2 h-5 w-5 bg-gradient-to-r from-primary to-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white font-bold text-xs">₹</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col flex-grow overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-lg text-sm transition-all ${item.current ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
              >
                <span className={`mr-3 ${item.current ? 'text-primary' : 'text-white/70'}`}>{item.icon}</span>
                <span>{item.label}</span>
                {item.current && (
                  <div className="ml-auto w-1.5 h-6 bg-primary rounded-full"></div>
                )}
              </Link>
            ))}
          </nav>
          
          <div className="p-4 mt-auto border-t border-white/5">
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                <Avatar className="h-9 w-9 bg-primary/20 border border-primary/30">
                  <span className="text-lg font-semibold text-white">{user?.username?.charAt(0).toUpperCase()}</span>
                </Avatar>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{user?.username}</p>
                  <p className="text-xs text-white/50">User</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              <Link 
                href="/settings"
                className="flex items-center px-4 py-2 text-sm text-white/70 rounded-lg hover:text-white hover:bg-white/5 transition-all"
              >
                <Settings className="h-4 w-4 mr-3" />
                Settings
              </Link>
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 text-sm text-white/70 rounded-lg hover:text-white hover:bg-white/5 transition-all"
              >
                <LogOut className="h-4 w-4 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`fixed inset-0 z-50 lg:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={toggleMobileMenu}></div>
        <div className="fixed right-0 top-0 bottom-0 w-full max-w-xs bg-gradient-to-b from-gray-900 to-black overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b border-white/5">
            <div className="flex items-center">
              <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-400 to-purple-400">NepaliPay</div>
              <div className="ml-2 h-5 w-5 bg-gradient-to-r from-primary to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">₹</span>
              </div>
            </div>
            <button 
              onClick={toggleMobileMenu}
              className="p-2 text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="px-2 py-4">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg text-sm ${item.current ? 'bg-white/10 text-white' : 'text-white/70'}`}
                  onClick={toggleMobileMenu}
                >
                  <span className={`mr-3 ${item.current ? 'text-primary' : ''}`}>{item.icon}</span>
                  <span>{item.label}</span>
                  {item.current && (
                    <div className="ml-auto w-1 h-5 bg-primary rounded-full"></div>
                  )}
                </Link>
              ))}
            </nav>
            
            <div className="mt-6 pt-6 border-t border-white/5">
              <div className="px-4 mb-4">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 bg-primary/20 border border-primary/30">
                    <span className="text-lg font-semibold text-white">{user?.username?.charAt(0).toUpperCase()}</span>
                  </Avatar>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">{user?.username}</p>
                    <p className="text-xs text-white/50">User</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-1 px-2">
                <Link 
                  href="/settings"
                  className="flex items-center px-4 py-2 text-sm text-white/70 rounded-lg hover:bg-white/5"
                  onClick={toggleMobileMenu}
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Settings
                </Link>
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2 text-sm text-white/70 rounded-lg hover:bg-white/5"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-b from-gray-900 to-black">
        {/* Top navigation bar - Mobile & Tablet */}
        <header className="bg-black/60 backdrop-blur-md border-b border-white/5 lg:border-b-0">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-400 to-purple-400">
                NepaliPay
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="connection-status hidden sm:flex items-center rounded-full px-2 py-1 bg-black/30 border border-white/10">
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
              
              <div className="lg:hidden">
                <Avatar className="h-8 w-8 bg-primary/20 border border-primary/30">
                  <span className="text-sm font-semibold text-white">{user?.username?.charAt(0).toUpperCase()}</span>
                </Avatar>
              </div>
              
              <button 
                onClick={toggleMobileMenu}
                className="p-2 text-white lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome & Header Section */}
            <section>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">Welcome, {user?.username}!</h1>
                  <p className="text-white/60">Your NepaliPay dashboard</p>
                </div>
                
                <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                  <button 
                    onClick={handleRefresh} 
                    className="inline-flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        <span>Refreshing...</span>
                      </>
                    ) : (
                      <span>Refresh Data</span>
                    )}
                  </button>
                </div>
              </div>
              
              {lastUpdate && (
                <div className="text-xs text-white/40 mb-4">
                  Last updated: {new Date(lastUpdate).toLocaleTimeString()}
                </div>
              )}
            </section>
            
            {/* Wallet Balance Section - Card with gradient background */}
            <section>
              <div className="relative rounded-2xl overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-600/20 to-blue-600/20"></div>
                
                {/* Glass overlay */}
                <div className="relative backdrop-blur-md bg-black/20 p-6 sm:p-8 border border-white/10">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <h2 className="text-xl font-bold text-white mb-1">Your Wallet <Badge variant="outline" className="ml-2 bg-white/10">Live</Badge></h2>
                    
                    <Link 
                      href="/wallet"
                      className="inline-flex items-center text-sm text-white/70 hover:text-white transition-colors mt-2 sm:mt-0"
                    >
                      View Details
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                  
                  {isLoading ? (
                    <div className="h-36 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
                    </div>
                  ) : wallet ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl p-6 transition-all hover:bg-black/40">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20 mr-3">
                              <span className="text-white font-bold">₹</span>
                            </div>
                            <div>
                              <h3 className="text-lg font-medium text-white">NPT Tokens</h3>
                              <p className="text-xs text-white/50">Stablecoin ≈ 1 NPR</p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
                            {formatBalance(wallet.nptBalance)} <span className="text-lg">NPT</span>
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <Link 
                              href="/buy-tokens"
                              className="text-sm px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
                            >
                              Buy More
                            </Link>
                            <Link 
                              href="/send"
                              className="text-sm px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
                            >
                              Send
                            </Link>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl p-6 transition-all hover:bg-black/40">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center shadow-lg shadow-orange-500/20 mr-3">
                              <DollarSign className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-medium text-white">BNB Balance</h3>
                              <p className="text-xs text-white/50">For gas fees</p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
                            {formatBalance(wallet.bnbBalance)} <span className="text-lg">BNB</span>
                          </div>
                          <div className="mt-4 text-sm text-white/60">
                            <div className="flex justify-between items-center">
                              <span>Est. Gas Balance:</span>
                              <span className="text-white">~ {parseInt(wallet.bnbBalance || '0') * 10} transactions</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-black/40 border border-red-500/20 rounded-xl p-6">
                      <div className="flex items-center text-center justify-center text-red-400 flex-col">
                        <AlertCircle className="h-8 w-8 mb-2" />
                        <h3 className="text-lg font-medium">Wallet Not Connected</h3>
                        <p className="text-sm text-white/60 mt-1 max-w-md">
                          Please connect your wallet to see your balance and transactions.
                        </p>
                        <button className="mt-4 px-4 py-2 bg-primary/20 border border-primary/30 rounded-lg text-primary hover:bg-primary/30 transition-colors">
                          Connect Wallet
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Animated elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -z-10"></div>
              </div>
            </section>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <div className="lg:col-span-1 lg:order-last">
                <div className="space-y-6">
                  <div className="bg-black/60 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { icon: <CreditCard className="h-5 w-5" />, label: 'Buy Tokens', href: '/buy-tokens', primary: true },
                          { icon: <Send className="h-5 w-5" />, label: 'Send', href: '/send' },
                          { icon: <Wallet className="h-5 w-5" />, label: 'Receive', href: '/receive' },
                          { icon: <Gift className="h-5 w-5" />, label: 'Rewards', href: '/rewards' }
                        ].map((action, index) => (
                          <Link 
                            key={index} 
                            href={action.href}
                            className={`flex flex-col items-center justify-center py-3 px-2 rounded-lg text-sm text-center transition-all ${
                              action.primary 
                                ? 'bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30' 
                                : 'bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            <span className="mb-1">{action.icon}</span>
                            <span>{action.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <ActivityLog 
                    activities={recentActivities || []} 
                    loading={isLoading}
                    onViewAll={() => {}} 
                  />
                </div>
              </div>
              
              {/* Recent Transactions */}
              <div className="lg:col-span-2">
                <TransactionList 
                  transactions={recentTransactions || []} 
                  loading={isLoading}
                  onLoadMore={() => {}} 
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}