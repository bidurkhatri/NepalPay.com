import React from 'react';
import { Link, useLocation } from 'wouter';
import {
  HomeIcon,
  WalletIcon,
  SendIcon,
  TransactionIcon,
  UserIcon
} from '@/lib/icons';
import { Coins } from 'lucide-react';

const MobileNavigation: React.FC = () => {
  const [location] = useLocation();
  
  return (
    <nav className="md:hidden bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-10">
      <div className="grid grid-cols-5">
        <Link href="/dashboard">
          <div className={`flex flex-col items-center justify-center py-3 cursor-pointer ${
            location === '/dashboard' ? 'text-primary-500' : 'text-gray-500'
          }`}>
            <HomeIcon className="text-xl" />
            <span className="text-xs mt-1">Home</span>
          </div>
        </Link>
        <Link href="/wallet">
          <div className={`flex flex-col items-center justify-center py-3 cursor-pointer ${
            location === '/wallet' ? 'text-primary-500' : 'text-gray-500'
          }`}>
            <WalletIcon className="text-xl" />
            <span className="text-xs mt-1">Wallet</span>
          </div>
        </Link>
        <div className="flex items-center justify-center">
          <Link href="/send-money">
            <div className="bg-primary-500 text-white rounded-full p-3 -mt-6 shadow-lg cursor-pointer">
              <SendIcon className="text-xl" />
            </div>
          </Link>
        </div>
        <Link href="/transactions">
          <div className={`flex flex-col items-center justify-center py-3 cursor-pointer ${
            location === '/transactions' ? 'text-primary-500' : 'text-gray-500'
          }`}>
            <TransactionIcon className="text-xl" />
            <span className="text-xs mt-1">History</span>
          </div>
        </Link>
        <Link href="/crypto">
          <div className={`flex flex-col items-center justify-center py-3 cursor-pointer ${
            location === '/crypto' ? 'text-orange-500' : 'text-gray-500'
          }`}>
            <Coins className="text-xl" />
            <span className="text-xs mt-1">Crypto</span>
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default MobileNavigation;
