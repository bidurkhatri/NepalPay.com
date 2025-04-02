import React from 'react';
import { Transaction } from '@/types';
import { format } from 'date-fns';
import { 
  SendIcon, 
  ReceiveIcon, 
  MobileIcon, 
  ElectricityIcon 
} from '@/lib/icons';
import { Skeleton } from '@/components/ui/skeleton';

interface TransactionListProps {
  transactions: Transaction[];
  loading: boolean;
  onLoadMore?: () => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions, 
  loading,
  onLoadMore
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-semibold text-lg text-gray-900">Recent Transactions</h3>
          <div className="text-sm font-medium text-primary-500">View All</div>
        </div>
        <div className="divide-y divide-gray-100">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div>
                  <Skeleton className="h-5 w-40 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <div className="text-right">
                <Skeleton className="h-5 w-24 mb-1 ml-auto" />
                <Skeleton className="h-4 w-16 ml-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getTransactionIcon = (type: string, isSender: boolean) => {
    if (type === 'TRANSFER') {
      return isSender ? (
        <div className="p-2 bg-red-50 rounded-lg">
          <SendIcon className="text-red-500 text-xl" />
        </div>
      ) : (
        <div className="p-2 bg-green-50 rounded-lg">
          <ReceiveIcon className="text-green-500 text-xl" />
        </div>
      );
    } else if (type === 'TOPUP') {
      return (
        <div className="p-2 bg-orange-50 rounded-lg">
          <MobileIcon className="text-orange-500 text-xl" />
        </div>
      );
    } else if (type === 'UTILITY') {
      return (
        <div className="p-2 bg-purple-50 rounded-lg">
          <ElectricityIcon className="text-purple-500 text-xl" />
        </div>
      );
    }
    return (
      <div className="p-2 bg-gray-50 rounded-lg">
        <SendIcon className="text-gray-500 text-xl" />
      </div>
    );
  };

  const getTransactionTitle = (transaction: Transaction) => {
    const currentUser = true; // This would come from auth context in a real app

    if (transaction.type === 'TRANSFER') {
      if (transaction.senderId && !transaction.receiverId) {
        return 'Sent Money';
      } else if (!transaction.senderId && transaction.receiverId) {
        return 'Received Money';
      } else if (transaction.sender && transaction.receiver) {
        const isSender = currentUser;
        return isSender 
          ? `Sent to ${transaction.receiver.firstName} ${transaction.receiver.lastName}`
          : `Received from ${transaction.sender.firstName} ${transaction.sender.lastName}`;
      }
    } else if (transaction.type === 'TOPUP') {
      return 'Mobile Recharge';
    } else if (transaction.type === 'UTILITY') {
      return transaction.note || 'Utility Payment';
    }
    
    return 'Transaction';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${format(date, 'hh:mm a')}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${format(date, 'hh:mm a')}`;
    } else {
      return format(date, 'dd MMM, hh:mm a');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-semibold text-lg text-gray-900">Recent Transactions</h3>
        <a href="#" className="text-sm font-medium text-primary-500 hover:text-primary-600">View All</a>
      </div>

      {transactions.length === 0 ? (
        <div className="px-6 py-10 text-center">
          <p className="text-gray-500">No transactions found</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {transactions.map((transaction) => {
            const isSender = !!transaction.senderId;
            const isPositiveAmount = !isSender || transaction.type === 'TOPUP';
            const formattedAmount = isPositiveAmount 
              ? `+NPR ${parseFloat(transaction.amount.toString()).toFixed(2)}`
              : `-NPR ${parseFloat(transaction.amount.toString()).toFixed(2)}`;
            
            return (
              <div key={transaction.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  {getTransactionIcon(transaction.type, isSender)}
                  <div>
                    <p className="font-medium text-gray-900">{getTransactionTitle(transaction)}</p>
                    <p className="text-sm text-gray-500">{formatDate(transaction.createdAt)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-mono font-semibold ${isPositiveAmount ? 'text-green-500' : 'text-red-500'}`}>
                    {formattedAmount}
                  </p>
                  <p className="text-xs text-gray-500">{transaction.status}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {transactions.length > 0 && onLoadMore && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-center">
          <button 
            onClick={onLoadMore}
            className="text-sm font-medium text-primary-500 hover:text-primary-600"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
