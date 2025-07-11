import React from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/auth-context';
import { WalletIcon, CardIcon, PaymentIcon, SendIcon } from '@/lib/icons';
import { 
  Coins, 
  LayoutDashboard, 
  BarChart3, 
  User, 
  Settings, 
  LogOut, 
  BadgePercent, 
  Store
} from 'lucide-react';
import { motion } from 'framer-motion';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { StatusIndicator } from '@/components/ui/status-indicator';

const Sidebar: React.FC = () => {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();

  if (!user) return null;

  // Get user initials from first and last name
  const getInitials = (firstName: string | null | undefined, lastName: string | null | undefined) => {
    if (!firstName && !lastName) return '';
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;
  };

  const initials = getInitials(user.firstName, user.lastName);

  const menuItems = [
    { href: '/dashboard', icon: <LayoutDashboard className="mr-2 h-5 w-5" />, label: 'Dashboard' },
    { href: '/wallet', icon: <WalletIcon className="mr-2 h-5 w-5" />, label: 'My Wallet' },
    { href: '/send', icon: <SendIcon className="mr-2 h-5 w-5" />, label: 'Send Funds' },
    { href: '/purchase', icon: <CardIcon className="mr-2 h-5 w-5" />, label: 'Purchase NPT' },
    { href: '/loans', icon: <Coins className="mr-2 h-5 w-5" />, label: 'Loans' },
    { href: '/analytics', icon: <BarChart3 className="mr-2 h-5 w-5" />, label: 'Analytics' },
    { href: '/rewards', icon: <BadgePercent className="mr-2 h-5 w-5" />, label: 'Rewards' },
    { href: '/marketplace', icon: <Store className="mr-2 h-5 w-5" />, label: 'Marketplace' },
    { href: '/profile', icon: <User className="mr-2 h-5 w-5" />, label: 'Profile' },
    { href: '/settings', icon: <Settings className="mr-2 h-5 w-5" />, label: 'Settings' },
  ];

  const handleLogout = async () => {
    logoutMutation.mutate();
  };

  return (
    <motion.aside 
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="hidden md:flex flex-col w-64 bg-card/90 backdrop-blur-md border-r border-border/50 h-screen sticky top-0"
    >
      <div className="p-6 border-b border-border/30">
        <div className="flex items-center justify-center">
          <motion.h1 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="font-bold text-2xl gradient-text"
          >
            <span>Nepal</span>Pay
          </motion.h1>
        </div>
      </div>
      
      {/* User info */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="px-6 py-4 border-b border-border/30"
      >
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center ring-2 ring-primary/30">
            <span className="text-white font-semibold text-lg">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-white truncate">{user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            <div className="flex items-center mt-1">
              <StatusIndicator status="online" size="sm" />
              <span className="text-xs text-muted-foreground ml-2">Online</span>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-2">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.href}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 + index * 0.05, duration: 0.3 }}
          >
            <Link 
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg cursor-pointer transition-all duration-300 group ${
              location === item.href 
                ? 'bg-primary/20 text-white glow' 
                : 'text-gray-300 hover:bg-primary/10 hover:text-white'
            }`}
            >
              <span className="flex items-center transition-transform duration-300 group-hover:translate-x-1">
                {item.icon}
                {item.label}
              </span>
            </Link>
          </motion.div>
        ))}
      </nav>
      
      {/* Logout */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.3 }}
        className="px-3 py-4 border-t border-border/30"
      >
        <EnhancedButton 
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-white"
          disabled={logoutMutation.isPending}
          loading={logoutMutation.isPending}
          loadingText="Logging out..."
        >
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </EnhancedButton>
      </motion.div>
    </motion.aside>
  );
};

export default Sidebar;
