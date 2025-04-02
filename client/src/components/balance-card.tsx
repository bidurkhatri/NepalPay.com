import React from 'react';
import { 
  WalletIcon, 
  FundsIcon, 
  ShoppingIcon, 
  SafeIcon, 
  ArrowUpIcon 
} from '@/lib/icons';

interface BalanceCardProps {
  title: string;
  amount: string;
  percentageChange?: string;
  changeText?: string;
  type: 'balance' | 'income' | 'expense' | 'savings';
}

const BalanceCard: React.FC<BalanceCardProps> = ({
  title,
  amount,
  percentageChange = '+0%',
  changeText = 'this month',
  type
}) => {
  const getIconAndColor = () => {
    switch (type) {
      case 'balance':
        return {
          icon: <WalletIcon className="text-primary-500 text-xl" />,
          bgColor: 'bg-primary-50',
          textColor: 'text-primary-500'
        };
      case 'income':
        return {
          icon: <FundsIcon className="text-green-500 text-xl" />,
          bgColor: 'bg-green-50',
          textColor: 'text-green-500'
        };
      case 'expense':
        return {
          icon: <ShoppingIcon className="text-red-500 text-xl" />,
          bgColor: 'bg-red-50',
          textColor: 'text-red-500'
        };
      case 'savings':
        return {
          icon: <SafeIcon className="text-blue-500 text-xl" />,
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-500'
        };
      default:
        return {
          icon: <WalletIcon className="text-primary-500 text-xl" />,
          bgColor: 'bg-primary-50',
          textColor: 'text-primary-500'
        };
    }
  };

  const { icon, bgColor, textColor } = getIconAndColor();
  const isPositiveChange = percentageChange.startsWith('+');
  const changeColor = isPositiveChange ? 'text-green-500' : 'text-red-500';

  return (
    <div className="glass cyber-card p-5 relative overflow-hidden glow">
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-sm font-medium text-white/80">{title}</p>
          <h3 className="mt-1 text-2xl font-mono font-semibold text-white">
            {amount.startsWith('NPR') ? amount : `NPR ${amount}`}
          </h3>
        </div>
        <div className={`p-2 bg-primary/20 rounded-lg border border-primary/30`}>
          {React.cloneElement(icon as React.ReactElement, { className: "text-primary text-xl" })}
        </div>
      </div>
      {percentageChange && (
        <div className="mt-3 flex items-center text-sm">
          <span className={`${isPositiveChange ? 'text-green-400' : 'text-red-400'}`}>
            <ArrowUpIcon className="inline mr-1 h-3 w-3" />
            {percentageChange}
          </span>
          <span className="text-white/60 ml-1">{changeText}</span>
        </div>
      )}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full filter blur-xl -mr-16 -mt-16 z-0"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full filter blur-xl -ml-12 -mb-12 z-0"></div>
    </div>
  );
};

export default BalanceCard;
