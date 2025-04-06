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

// Using a direct named export for the hook to resolve fast refresh compatibility issues
export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export function WalletProvider({ children }: { children: React.ReactNode }) {
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
      
      // Check for demo mode
      const isDemoMode = localStorage.getItem('demo_mode') === 'true';
      if (isDemoMode) {
        // Create a demo wallet
        const demoWallet: Wallet = {
          id: 999,
          userId: user.id,
          balance: "5000",
          currency: "NPT",
          lastUpdated: new Date().toISOString()
        };
        setWallet(demoWallet);
        
        // Demo mode should return without trying to fetch from API
        return;
      }
      
      try {
        const res = await apiRequest('GET', '/api/wallet');
        const walletData = await res.json();
        setWallet(walletData);
        
        // No error means we successfully fetched the wallet
        return;
      } catch (apiError) {
        console.error('API Error fetching wallet:', apiError);
        
        // If the wallet doesn't exist yet for the user, create one
        if (user) {
          try {
            // Create default wallet with zero balance
            const initWallet = {
              userId: user.id,
              balance: "0",
              currency: "NPT"
            };
            
            // Create wallet
            const createRes = await apiRequest('POST', '/api/wallet', initWallet);
            const newWallet = await createRes.json();
            setWallet(newWallet);
            
            toast({
              title: 'Wallet Created',
              description: 'Your wallet has been initialized',
            });
            return;
          } catch (createError) {
            console.error('Could not create wallet:', createError);
          }
        }
      }
      
      // If we reach here, both fetch and create failed
      setWallet(null);
      toast({
        title: 'Wallet Error',
        description: 'Could not load or create your wallet',
        variant: 'destructive',
      });
    } catch (error) {
      console.error('Error in wallet operations:', error);
      toast({
        title: 'System Error',
        description: 'Failed to process wallet information',
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
      
      // Check for demo mode
      const isDemoMode = localStorage.getItem('demo_mode') === 'true';
      if (isDemoMode) {
        // Generate mock transactions for demo mode
        const demoTransactions: Transaction[] = [
          {
            id: 1001,
            senderId: user.id,
            receiverId: 1002,
            amount: "150",
            type: "TRANSFER",
            status: "COMPLETED",
            note: "Payment for lunch",
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          },
          {
            id: 1002,
            senderId: 1003,
            receiverId: user.id, 
            amount: "300",
            type: "TRANSFER",
            status: "COMPLETED",
            note: "Repayment of loan",
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
          },
          {
            id: 1003,
            senderId: user.id,
            receiverId: null,
            amount: "200",
            type: "MOBILE_TOPUP",
            status: "COMPLETED",
            note: "Mobile recharge",
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
          },
          {
            id: 1004,
            senderId: user.id,
            receiverId: null,
            amount: "500",
            type: "UTILITY_PAYMENT",
            status: "COMPLETED",
            note: "Electricity bill",
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
          }
        ];
        
        setTransactions(demoTransactions);
        // Calculate stats with demo transactions
        calculateStats(demoTransactions);
        return;
      }
      
      const res = await apiRequest('GET', '/api/transactions');
      const transactionsData = await res.json();
      setTransactions(transactionsData);
      
      // Calculate stats
      calculateStats(transactionsData);
    } catch (error) {
      console.error('Error fetching transactions', error);
      setTransactions([]);
      toast({
        title: 'Transaction History',
        description: 'No transactions found in your account yet',
      });
    } finally {
      setLoading(prev => ({ ...prev, transactions: false }));
    }
  };

  const fetchActivities = async () => {
    if (!user) return;

    try {
      setLoading(prev => ({ ...prev, activities: true }));
      
      // Check for demo mode
      const isDemoMode = localStorage.getItem('demo_mode') === 'true';
      if (isDemoMode) {
        // Generate mock activities for demo mode
        const demoActivities: Activity[] = [
          {
            id: 2001,
            userId: user.id,
            action: "LOGIN",
            details: "User logged in",
            ipAddress: "192.168.1.1",
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          },
          {
            id: 2002,
            userId: user.id,
            action: "TRANSFER",
            details: "Sent NPT 150 to user1234",
            ipAddress: "192.168.1.1",
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          },
          {
            id: 2003,
            userId: user.id,
            action: "MOBILE_TOPUP",
            details: "Mobile recharge of NPT 200",
            ipAddress: "192.168.1.1",
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
          },
          {
            id: 2004,
            userId: user.id,
            action: "WALLET_CREATE",
            details: "Wallet initialized",
            ipAddress: "192.168.1.1",
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
          }
        ];
        
        setActivities(demoActivities);
        return;
      }
      
      const res = await apiRequest('GET', '/api/activities');
      const activitiesData = await res.json();
      setActivities(activitiesData);
    } catch (error) {
      console.error('Error fetching activities', error);
      setActivities([]);
      // Don't show error toast for this - just silently fail
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

    // Check for demo mode
    const isDemoMode = localStorage.getItem('demo_mode') === 'true';
    if (isDemoMode) {
      // Simulated delay to mimic transaction processing
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Add a new transaction to the existing transactions
      const newTransaction: Transaction = {
        id: Date.now(), // Use timestamp as temporary ID
        senderId: user.id,
        receiverId: data.receiverId,
        amount: data.amount,
        type: "TRANSFER",
        status: "COMPLETED",
        note: data.note || 'Money transfer',
        createdAt: new Date().toISOString()
      };
      
      // Update transactions
      setTransactions(prev => [newTransaction, ...prev]);
      
      // Update wallet balance (subtract amount)
      if (wallet) {
        const newBalance = (parseFloat(wallet.balance) - parseFloat(data.amount)).toString();
        setWallet({
          ...wallet,
          balance: newBalance
        });
      }
      
      // Recalculate stats
      calculateStats([...transactions, newTransaction]);
      
      toast({
        title: 'Transfer Successful',
        description: `NPT ${data.amount} has been sent successfully`,
      });
      return;
    }
    
    try {
      const res = await apiRequest('POST', '/api/transactions', {
        receiverId: data.receiverId,
        amount: data.amount,
        type: 'TRANSFER',
        note: data.note || 'Money transfer',
      });

      toast({
        title: 'Transfer Successful',
        description: `NPT ${data.amount} has been sent successfully`,
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
    
    // Check for demo mode
    const isDemoMode = localStorage.getItem('demo_mode') === 'true';
    if (isDemoMode) {
      // Simulated delay to mimic transaction processing
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Add a new transaction to the existing transactions
      const newTransaction: Transaction = {
        id: Date.now(), // Use timestamp as temporary ID
        senderId: user.id,
        receiverId: null,
        amount: amount,
        type: "TOPUP",
        status: "COMPLETED",
        note: note || 'Mobile top-up',
        createdAt: new Date().toISOString()
      };
      
      // Update transactions
      setTransactions(prev => [newTransaction, ...prev]);
      
      // Update wallet balance (subtract amount)
      if (wallet) {
        const newBalance = (parseFloat(wallet.balance) - parseFloat(amount)).toString();
        setWallet({
          ...wallet,
          balance: newBalance
        });
      }
      
      // Recalculate stats
      calculateStats([...transactions, newTransaction]);
      
      toast({
        title: 'Top-up Successful',
        description: `Mobile top-up of NPT ${amount} completed`,
      });
      return;
    }

    try {
      const res = await apiRequest('POST', '/api/transactions', {
        amount,
        type: 'TOPUP',
        note: note || 'Mobile top-up',
      });

      toast({
        title: 'Top-up Successful',
        description: `Mobile top-up of NPT ${amount} completed`,
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
    
    // Check for demo mode
    const isDemoMode = localStorage.getItem('demo_mode') === 'true';
    if (isDemoMode) {
      // Simulated delay to mimic transaction processing
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Add a new transaction to the existing transactions
      const newTransaction: Transaction = {
        id: Date.now(), // Use timestamp as temporary ID
        senderId: user.id,
        receiverId: null,
        amount: amount,
        type: "UTILITY",
        status: "COMPLETED",
        note: note || 'Utility payment',
        createdAt: new Date().toISOString()
      };
      
      // Update transactions
      setTransactions(prev => [newTransaction, ...prev]);
      
      // Update wallet balance (subtract amount)
      if (wallet) {
        const newBalance = (parseFloat(wallet.balance) - parseFloat(amount)).toString();
        setWallet({
          ...wallet,
          balance: newBalance
        });
      }
      
      // Recalculate stats
      calculateStats([...transactions, newTransaction]);
      
      toast({
        title: 'Payment Successful',
        description: `Utility payment of NPT ${amount} completed`,
      });
      return;
    }

    try {
      const res = await apiRequest('POST', '/api/transactions', {
        amount,
        type: 'UTILITY',
        note: note || 'Utility payment',
      });

      toast({
        title: 'Payment Successful',
        description: `Utility payment of NPT ${amount} completed`,
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
}