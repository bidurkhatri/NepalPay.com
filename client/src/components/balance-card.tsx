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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="mt-1 text-2xl font-mono font-semibold">
            {amount.startsWith('NPR') ? amount : `NPR ${amount}`}
          </h3>
        </div>
        <div className={`p-2 ${bgColor} rounded-lg`}>
          {icon}
        </div>
      </div>
      {percentageChange && (
        <div className="mt-3 flex items-center text-sm">
          <span className={changeColor}>
            <ArrowUpIcon className="inline mr-1 h-3 w-3" />
            {percentageChange}
          </span>
          <span className="text-gray-500 ml-1">{changeText}</span>
        </div>
      )}
    </div>
  );
};

export default BalanceCard;
