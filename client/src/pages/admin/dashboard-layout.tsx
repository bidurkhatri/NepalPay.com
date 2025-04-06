import React, { useState, ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Users, 
  CreditCard, 
  Store, 
  BarChart3, 
  Home, 
  Settings, 
  LogOut, 
  Menu, 
  X
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/contexts/auth-context';
import { useBlockchain } from '@/contexts/blockchain-context';
import { useToast } from '@/hooks/use-toast';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const [location] = useLocation();
  const { logout } = useAuth();
  const { disconnectWallet, userAddress } = useBlockchain();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navigationItems = [
    { icon: <Home size={20} />, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: <Users size={20} />, label: 'Users', path: '/admin/users' },
    { icon: <CreditCard size={20} />, label: 'Loans', path: '/admin/loans' },
    { icon: <Store size={20} />, label: 'Ad Bazaar', path: '/admin/ads' },
    { icon: <BarChart3 size={20} />, label: 'Analytics', path: '/admin/analytics' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/admin/settings' },
  ];

  const handleLogout = async () => {
    try {
      await disconnectWallet();
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const formatWalletAddress = (address: string | null) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-background to-background/80 text-foreground">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col w-64 border-r border-border/40 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <img src="/logo.png" alt="NepaliPay" className="w-8 h-8" />
            <h1 className="text-xl font-bold">NepaliPay <span className="text-primary">Admin</span></h1>
          </div>
          
          <nav className="space-y-1 mt-8">
            {navigationItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <a
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    location === item.path
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-accent/50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {location === item.path && (
                    <motion.div
                      layoutId="sidebar-highlight"
                      className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
                    />
                  )}
                </a>
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-border/40">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <span>Wallet Connected</span>
            <span className="font-mono">{formatWalletAddress(userAddress)}</span>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span>Disconnect Wallet</span>
          </button>
        </div>
      </div>
      
      {/* Mobile Header */}
      <div className="flex flex-col flex-1">
        <header className="flex items-center justify-between p-4 lg:px-8 lg:py-4 border-b border-border/40 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <button 
              className="lg:hidden p-2 rounded-lg hover:bg-accent/50"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
            <h1 className="text-xl font-bold hidden sm:block">{title}</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="bg-accent/50 px-3 py-1 rounded-full text-sm font-mono hidden sm:block">
              {formatWalletAddress(userAddress)}
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              title="Disconnect Wallet"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
      
      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-background border-r border-border/40 z-50"
            >
              <div className="flex justify-between items-center p-4 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <img src="/logo.png" alt="NepaliPay" className="w-6 h-6" />
                  <h1 className="text-lg font-bold">NepaliPay Admin</h1>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-accent/50"
                >
                  <X size={18} />
                </button>
              </div>
              
              <nav className="p-4 space-y-1">
                {navigationItems.map((item) => (
                  <Link key={item.path} href={item.path}>
                    <a
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        location === item.path
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-accent/50'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </a>
                  </Link>
                ))}
              </nav>
              
              <div className="mt-auto p-4 border-t border-border/40">
                <div className="text-sm text-muted-foreground mb-2">
                  <div>Wallet Connected</div>
                  <div className="font-mono">{formatWalletAddress(userAddress)}</div>
                </div>
                
                <button 
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <LogOut size={18} />
                  <span>Disconnect Wallet</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;