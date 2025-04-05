import React from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/auth-context';
import { getInitials } from '@/lib/icons';
import {
  DashboardIcon,
  WalletIcon,
  TransactionIcon,
  CardIcon,
  ChartIcon,
  UserIcon,
  SettingsIcon,
  LogoutIcon
} from '@/lib/icons';
import { Coins } from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  if (!user) return null;

  const initials = getInitials(user.firstName, user.lastName);

  const menuItems = [
    { href: '/dashboard', icon: <DashboardIcon className="mr-2 h-5 w-5" />, label: 'Dashboard' },
    { href: '/wallet', icon: <WalletIcon className="mr-2 h-5 w-5" />, label: 'My Wallet' },
    { href: '/nepaliplaytoken', icon: <Coins className="mr-2 h-5 w-5 text-blue-500" />, label: 'NPT Tokens' },
    { href: '/transactions', icon: <TransactionIcon className="mr-2 h-5 w-5" />, label: 'Transactions' },
    { href: '/analytics', icon: <ChartIcon className="mr-2 h-5 w-5" />, label: 'Analytics' },
    { href: '/profile', icon: <UserIcon className="mr-2 h-5 w-5" />, label: 'Profile' },
    { href: '/settings', icon: <SettingsIcon className="mr-2 h-5 w-5" />, label: 'Settings' },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-black/80 border-r border-primary/20 h-screen sticky top-0 cyber-card">
      <div className="p-6 border-b border-primary/30 animated-border">
        <div className="flex items-center justify-center">
          <h1 className="font-bold text-2xl gradient-text">
            <span>Nepal</span>Pay
          </h1>
        </div>
      </div>
      
      {/* User info */}
      <div className="px-6 py-4 border-b border-primary/30">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/30 flex items-center justify-center glow">
            <span className="text-white font-semibold">{initials}</span>
          </div>
          <div>
            <p className="font-medium text-white">{`${user.firstName} ${user.lastName}`}</p>
            <p className="text-xs text-primary/80">{user.email}</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div 
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md cursor-pointer backdrop-blur-sm transition-all duration-300 ${
                location === item.href 
                  ? 'bg-primary/20 text-white glow' 
                  : 'text-gray-300 hover:bg-primary/10 hover:text-white'
              }`}
            >
              {item.icon}
              {item.label}
            </div>
          </Link>
        ))}
      </nav>
      
      {/* Logout */}
      <div className="px-6 py-4 border-t border-primary/30">
        <button 
          onClick={handleLogout}
          className="flex items-center text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300"
        >
          <LogoutIcon className="mr-2 h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
