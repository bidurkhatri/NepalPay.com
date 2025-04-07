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
      <div className="glass cyber-card rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-primary/20 flex justify-between items-center animated-border">
          <h3 className="font-semibold text-lg text-white">Recent Transactions</h3>
          <div className="text-sm font-medium text-primary">View All</div>
        </div>
        <div className="divide-y divide-primary/10">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-lg bg-primary/20" />
                <div>
                  <Skeleton className="h-5 w-40 mb-1 bg-primary/20" />
                  <Skeleton className="h-4 w-24 bg-primary/10" />
                </div>
              </div>
              <div className="text-right">
                <Skeleton className="h-5 w-24 mb-1 ml-auto bg-primary/20" />
                <Skeleton className="h-4 w-16 ml-auto bg-primary/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getTransactionIcon = (type: string, isSender: boolean) => {
    switch (type) {
      case 'send':
        return (
          <div className="p-2 bg-red-500/20 border border-red-500/30 rounded-lg">
            <SendIcon className="text-red-400 h-5 w-5" />
          </div>
        );
      case 'receive':
        return (
          <div className="p-2 bg-green-500/20 border border-green-500/30 rounded-lg">
            <ReceiveIcon className="text-green-400 h-5 w-5" />
          </div>
        );
      case 'deposit':
      case 'purchase':
        return (
          <div className="p-2 bg-blue-500/20 border border-blue-500/30 rounded-lg">
            <ReceiveIcon className="text-blue-400 h-5 w-5" />
          </div>
        );
      case 'withdraw':
        return (
          <div className="p-2 bg-orange-500/20 border border-orange-500/30 rounded-lg">
            <SendIcon className="text-orange-400 h-5 w-5" />
          </div>
        );
      case 'loan':
      case 'repayment':
      case 'collateral':
        return (
          <div className="p-2 bg-purple-500/20 border border-purple-500/30 rounded-lg">
            <ElectricityIcon className="text-purple-400 h-5 w-5" />
          </div>
        );
      default:
        return (
          <div className="p-2 bg-primary/20 border border-primary/30 rounded-lg">
            <SendIcon className="text-primary h-5 w-5" />
          </div>
        );
    }
  };

  const getTransactionTitle = (transaction: Transaction) => {
    // Get transaction type based on our type definition
    switch (transaction.type) {
      case 'send':
        return 'Sent Money';
      case 'receive':
        return 'Received Money';
      case 'deposit':
        return 'Deposit';
      case 'withdraw':
        return 'Withdrawal';
      case 'loan':
        return 'Loan';
      case 'repayment':
        return 'Loan Repayment';
      case 'collateral':
        return 'Collateral';
      case 'purchase':
        return 'Token Purchase';
      default:
        return transaction.description || 'Transaction';
    }
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
    <div className="glass cyber-card rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-primary/20 flex justify-between items-center animated-border">
        <h3 className="font-semibold text-lg text-white">Recent Transactions</h3>
        <a href="#" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">View All</a>
      </div>

      {transactions.length === 0 ? (
        <div className="px-6 py-10 text-center">
          <p className="text-white/60">No transactions found</p>
        </div>
      ) : (
        <div className="divide-y divide-primary/10">
          {transactions.map((transaction) => {
            // Determine if transaction is outgoing based on type
            const isSender = transaction.type === 'send' || transaction.type === 'withdraw';
            const isPositiveAmount = !isSender;
            const formattedAmount = isPositiveAmount 
              ? `+NPR ${parseFloat(transaction.amount.toString()).toFixed(2)}`
              : `-NPR ${parseFloat(transaction.amount.toString()).toFixed(2)}`;
            
            return (
              <div key={transaction.id} className="px-6 py-4 flex items-center justify-between hover:bg-primary/5 transition-colors group">
                <div className="flex items-center space-x-4">
                  {getTransactionIcon(transaction.type, isSender)}
                  <div>
                    <p className="font-medium text-white group-hover:text-primary transition-colors duration-300">{getTransactionTitle(transaction)}</p>
                    <p className="text-sm text-white/60">{formatDate(transaction.timestamp)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-mono font-semibold ${isPositiveAmount ? 'text-green-400' : 'text-red-400'}`}>
                    {formattedAmount}
                  </p>
                  <p className="text-xs text-white/60">{transaction.status}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {transactions.length > 0 && onLoadMore && (
        <div className="px-6 py-3 bg-black/30 border-t border-primary/20 text-center">
          <button 
            onClick={onLoadMore}
            className="text-sm font-medium text-primary hover:text-white transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
