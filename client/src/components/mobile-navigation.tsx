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
    <nav className="md:hidden bg-black/80 backdrop-blur-lg border-t border-primary/20 fixed bottom-0 left-0 right-0 z-10 glass">
      <div className="grid grid-cols-5">
        <Link href="/sections">
          <div className={`flex flex-col items-center justify-center py-3 cursor-pointer transition-all duration-300 ${
            location === '/sections' ? 'text-primary glow' : 'text-gray-400 hover:text-white'
          }`}>
            <HomeIcon className="h-5 w-5" />
            <span className="text-xs mt-1">Sections</span>
          </div>
        </Link>
        <Link href="/wallet">
          <div className={`flex flex-col items-center justify-center py-3 cursor-pointer transition-all duration-300 ${
            location === '/wallet' ? 'text-primary glow' : 'text-gray-400 hover:text-white'
          }`}>
            <WalletIcon className="h-5 w-5" />
            <span className="text-xs mt-1">Wallet</span>
          </div>
        </Link>
        <div className="flex items-center justify-center">
          <Link href="/borrow">
            <div className="bg-gradient-to-tr from-primary to-purple-500 text-white rounded-full p-3 -mt-6 shadow-lg cursor-pointer glow hover:scale-110 transition-all duration-300">
              <SendIcon className="h-5 w-5" />
            </div>
          </Link>
        </div>
        <Link href="/transactions">
          <div className={`flex flex-col items-center justify-center py-3 cursor-pointer transition-all duration-300 ${
            location === '/transactions' ? 'text-primary glow' : 'text-gray-400 hover:text-white'
          }`}>
            <TransactionIcon className="h-5 w-5" />
            <span className="text-xs mt-1">History</span>
          </div>
        </Link>
        <Link href="/nepalipaytoken">
          <div className={`flex flex-col items-center justify-center py-3 cursor-pointer transition-all duration-300 ${
            location === '/nepalipaytoken' ? 'text-primary glow' : 'text-gray-400 hover:text-white'
          }`}>
            <Coins className="h-5 w-5" />
            <span className="text-xs mt-1">NPT</span>
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default MobileNavigation;
