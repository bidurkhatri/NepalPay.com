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
    { href: '/dashboard', icon: <DashboardIcon className="mr-3 text-lg" />, label: 'Dashboard' },
    { href: '/wallet', icon: <WalletIcon className="mr-3 text-lg" />, label: 'My Wallet' },
    { href: '/crypto', icon: <Coins className="mr-3 text-lg text-orange-500" />, label: 'NPT Tokens' },
    { href: '/transactions', icon: <TransactionIcon className="mr-3 text-lg" />, label: 'Transactions' },
    { href: '/analytics', icon: <ChartIcon className="mr-3 text-lg" />, label: 'Analytics' },
    { href: '/profile', icon: <UserIcon className="mr-3 text-lg" />, label: 'Profile' },
    { href: '/settings', icon: <SettingsIcon className="mr-3 text-lg" />, label: 'Settings' },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-center">
          <h1 className="font-bold text-2xl text-primary-500">
            <span className="text-orange-500">Nepal</span>Pay
          </h1>
        </div>
      </div>
      
      {/* User info */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-primary-500 font-semibold">{initials}</span>
          </div>
          <div>
            <p className="font-medium">{`${user.firstName} ${user.lastName}`}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div 
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md cursor-pointer ${
                location === item.href 
                  ? 'bg-primary-50 text-primary-500' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-primary-500'
              }`}
            >
              {item.icon}
              {item.label}
            </div>
          </Link>
        ))}
      </nav>
      
      {/* Logout */}
      <div className="px-6 py-4 border-t border-gray-200">
        <button 
          onClick={handleLogout}
          className="flex items-center text-sm font-medium text-gray-600 hover:text-primary-500"
        >
          <LogoutIcon className="mr-2 text-lg" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
