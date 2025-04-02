import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './auth-context';
import { Wallet, Transaction, Activity, TransferFormData } from '@/types';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';

interface WalletContextType {
  wallet: Wallet | null;
  transactions: Transaction[];
  activities: Activity[];
  loading: {
    wallet: boolean;
    transactions: boolean;
    activities: boolean;
  };
  stats: {
    income: string;
    expenses: string;
    savings: string;
    percentageChange: string;
  };
  fetchWallet: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  fetchActivities: () => Promise<void>;
  transferMoney: (data: TransferFormData) => Promise<void>;
  mobileTopup: (amount: string, note?: string) => Promise<void>;
  utilityPayment: (amount: string, note?: string) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState({
    wallet: false,
    transactions: false,
    activities: false,
  });
  const [stats, setStats] = useState({
    income: '0',
    expenses: '0',
    savings: '0',
    percentageChange: '+0%',
  });

  const fetchWallet = async () => {
    if (!user) return;

    try {
      setLoading(prev => ({ ...prev, wallet: true }));
      const res = await fetch('/api/wallet', {
        credentials: 'include',
      });

      if (res.ok) {
        const walletData = await res.json();
        setWallet(walletData);
      } else {
        setWallet(null);
        toast({
          title: 'Error',
          description: 'Could not fetch wallet data',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching wallet', error);
      toast({
        title: 'Error',
        description: 'Failed to load wallet information',
        variant: 'destructive',
      });
    } finally {
      setLoading(prev => ({ ...prev, wallet: false }));
    }
  };

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      setLoading(prev => ({ ...prev, transactions: true }));
      const res = await fetch('/api/transactions', {
        credentials: 'include',
      });

      if (res.ok) {
        const transactionsData = await res.json();
        setTransactions(transactionsData);
        
        // Calculate stats
        calculateStats(transactionsData);
      } else {
        setTransactions([]);
        toast({
          title: 'Error',
          description: 'Could not fetch transaction data',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching transactions', error);
      toast({
        title: 'Error',
        description: 'Failed to load transaction history',
        variant: 'destructive',
      });
    } finally {
      setLoading(prev => ({ ...prev, transactions: false }));
    }
  };

  const fetchActivities = async () => {
    if (!user) return;

    try {
      setLoading(prev => ({ ...prev, activities: true }));
      const res = await fetch('/api/activities', {
        credentials: 'include',
      });

      if (res.ok) {
        const activitiesData = await res.json();
        setActivities(activitiesData);
      } else {
        setActivities([]);
        toast({
          title: 'Error',
          description: 'Could not fetch activity data',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching activities', error);
      toast({
        title: 'Error',
        description: 'Failed to load activity log',
        variant: 'destructive',
      });
    } finally {
      setLoading(prev => ({ ...prev, activities: false }));
    }
  };

  const calculateStats = (transactions: Transaction[]) => {
    if (!user || !transactions.length) return;

    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    // Filter transactions for this month
    const thisMonthTransactions = transactions.filter(tx => {
      const txDate = new Date(tx.createdAt);
      return txDate.getMonth() === thisMonth && txDate.getFullYear() === thisYear;
    });

    // Calculate income (money received)
    const income = thisMonthTransactions
      .filter(tx => tx.receiverId === user.id)
      .reduce((sum, tx) => sum + parseFloat(tx.amount.toString()), 0);

    // Calculate expenses (money sent out)
    const expenses = thisMonthTransactions
      .filter(tx => tx.senderId === user.id)
      .reduce((sum, tx) => sum + parseFloat(tx.amount.toString()), 0);

    // Calculate savings
    const savings = income - expenses;

    // Calculate percentage change (mock calculation for now)
    const percentageChange = '+2.5%';

    setStats({
      income: income.toFixed(2),
      expenses: expenses.toFixed(2),
      savings: savings.toFixed(2),
      percentageChange,
    });
  };

  const transferMoney = async (data: TransferFormData) => {
    if (!user) return;

    try {
      const res = await apiRequest('POST', '/api/transactions', {
        receiverId: data.receiverId,
        amount: data.amount,
        type: 'TRANSFER',
        note: data.note || 'Money transfer',
      });

      toast({
        title: 'Transfer Successful',
        description: `NPR ${data.amount} has been sent successfully`,
      });

      // Invalidate and refetch data
      queryClient.invalidateQueries({ queryKey: ['/api/wallet'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      await fetchWallet();
      await fetchTransactions();
    } catch (error) {
      console.error('Transfer error', error);
      toast({
        title: 'Transfer Failed',
        description: error instanceof Error ? error.message : 'Could not complete the transfer',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const mobileTopup = async (amount: string, note?: string) => {
    if (!user) return;

    try {
      const res = await apiRequest('POST', '/api/transactions', {
        amount,
        type: 'TOPUP',
        note: note || 'Mobile top-up',
      });

      toast({
        title: 'Top-up Successful',
        description: `Mobile top-up of NPR ${amount} completed`,
      });

      // Invalidate and refetch data
      queryClient.invalidateQueries({ queryKey: ['/api/wallet'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      await fetchWallet();
      await fetchTransactions();
    } catch (error) {
      console.error('Mobile top-up error', error);
      toast({
        title: 'Top-up Failed',
        description: error instanceof Error ? error.message : 'Could not complete the mobile top-up',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const utilityPayment = async (amount: string, note?: string) => {
    if (!user) return;

    try {
      const res = await apiRequest('POST', '/api/transactions', {
        amount,
        type: 'UTILITY',
        note: note || 'Utility payment',
      });

      toast({
        title: 'Payment Successful',
        description: `Utility payment of NPR ${amount} completed`,
      });

      // Invalidate and refetch data
      queryClient.invalidateQueries({ queryKey: ['/api/wallet'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      await fetchWallet();
      await fetchTransactions();
    } catch (error) {
      console.error('Utility payment error', error);
      toast({
        title: 'Payment Failed',
        description: error instanceof Error ? error.message : 'Could not complete the utility payment',
        variant: 'destructive',
      });
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchWallet();
      fetchTransactions();
      fetchActivities();
    } else {
      setWallet(null);
      setTransactions([]);
      setActivities([]);
    }
  }, [user]);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        transactions,
        activities,
        loading,
        stats,
        fetchWallet,
        fetchTransactions,
        fetchActivities,
        transferMoney,
        mobileTopup,
        utilityPayment,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
