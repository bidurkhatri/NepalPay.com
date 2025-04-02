import React from 'react';
import { Link, useLocation } from 'wouter';
import {
  HomeIcon,
  WalletIcon,
  SendIcon,
  TransactionIcon,
  UserIcon
} from '@/lib/icons';

const MobileNavigation: React.FC = () => {
  const [location] = useLocation();
  
  return (
    <nav className="md:hidden bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-10">
      <div className="grid grid-cols-5">
        <Link href="/dashboard">
          <a className={`flex flex-col items-center justify-center py-3 ${
            location === '/dashboard' ? 'text-primary-500' : 'text-gray-500'
          }`}>
            <HomeIcon className="text-xl" />
            <span className="text-xs mt-1">Home</span>
          </a>
        </Link>
        <Link href="/wallet">
          <a className={`flex flex-col items-center justify-center py-3 ${
            location === '/wallet' ? 'text-primary-500' : 'text-gray-500'
          }`}>
            <WalletIcon className="text-xl" />
            <span className="text-xs mt-1">Wallet</span>
          </a>
        </Link>
        <div className="flex items-center justify-center">
          <Link href="/send-money">
            <a className="bg-primary-500 text-white rounded-full p-3 -mt-6 shadow-lg">
              <SendIcon className="text-xl" />
            </a>
          </Link>
        </div>
        <Link href="/transactions">
          <a className={`flex flex-col items-center justify-center py-3 ${
            location === '/transactions' ? 'text-primary-500' : 'text-gray-500'
          }`}>
            <TransactionIcon className="text-xl" />
            <span className="text-xs mt-1">History</span>
          </a>
        </Link>
        <Link href="/profile">
          <a className={`flex flex-col items-center justify-center py-3 ${
            location === '/profile' ? 'text-primary-500' : 'text-gray-500'
          }`}>
            <UserIcon className="text-xl" />
            <span className="text-xs mt-1">Profile</span>
          </a>
        </Link>
      </div>
    </nav>
  );
};

export default MobileNavigation;
