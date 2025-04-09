import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { 
  Home, 
  Wallet, 
  CreditCard, 
  Send, 
  BarChart3, 
  Gift, 
  Users, 
  HelpCircle, 
  Settings, 
  Menu, 
  X, 
  LogOut
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import MobileNavigation from './mobile-navigation';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Navigation items for sidebar
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

  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // If not logged in, just render the children (no layout needed for auth/public pages)
  if (!user) {
    return <>{children}</>;
  }

  // User initials for avatar
  const getInitials = (firstName: string | null | undefined, lastName: string | null | undefined) => {
    if (!firstName && !lastName) return 'NP';
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`;
  };
  
  const userInitials = getInitials(user.firstName || '', user.lastName || '');

  return (
    <div className="flex h-screen bg-background text-white overflow-hidden">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className="fixed md:static top-0 bottom-0 z-40 md:z-auto w-64 border-r border-primary/20 md:translate-x-0 glass"
        initial={{ x: -280 }}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
        style={{ translateX: 'var(--sidebar-translate, 0)' }}
      >
        <div className="flex flex-col h-full bg-black/60 backdrop-blur-lg">
          {/* Sidebar header */}
          <div className="flex items-center justify-between p-4 border-b border-primary/20">
            <Link href="/dashboard">
              <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-light to-secondary cursor-pointer">
                NepaliPay
              </h2>
            </Link>
            <button 
              className="text-gray-400 md:hidden" 
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User profile */}
          <div className="p-4 border-b border-primary/20">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
                {userInitials}
              </div>
              <div className="ml-3">
                <p className="font-medium">{user.firstName} {user.lastName}</p>
                <p className="text-sm text-gray-400">{user.email || user.username}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link href={item.href}>
                    <a className={`flex items-center py-2 px-3 rounded-lg transition-all duration-200 cursor-pointer
                      ${item.current 
                        ? 'bg-primary/20 text-primary font-medium' 
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
                    >
                      <span className={`${item.current ? 'text-primary' : 'text-gray-400'}`}>
                        {item.icon}
                      </span>
                      <span className="ml-3">{item.label}</span>
                      {item.current && (
                        <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
                      )}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sidebar footer */}
          <div className="p-4 border-t border-primary/20">
            <button
              onClick={handleLogout}
              className="w-full flex items-center py-2 px-3 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-all duration-200"
            >
              <LogOut className="h-5 w-5 text-gray-400" />
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar */}
        <header className="py-2 px-4 border-b border-primary/20 flex items-center justify-between glass">
          <button
            className="text-gray-400 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="ml-auto flex items-center space-x-4">
            <Link href="/settings">
              <a className="text-gray-400 hover:text-white">
                <Settings className="h-5 w-5" />
              </a>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

        {/* Mobile navigation */}
        <MobileNavigation />
      </div>
    </div>
  );
}