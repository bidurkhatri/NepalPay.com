import React, { createContext, useContext, ReactNode } from 'react';
import { useRealTime } from '@/hooks/use-real-time';
import { Transaction, Wallet, Collateral, Loan, Activity } from '@/types';

interface RealtimeContextValue {
  isConnected: boolean;
  wallet: Wallet | null;
  recentTransactions: Transaction[];
  collaterals: Collateral[];
  loans: Loan[];
  recentActivities: Activity[];
  lastUpdate: Date | null;
  refreshData: () => void;
}

const RealTimeContext = createContext<RealtimeContextValue | undefined>(undefined);

export function RealTimeProvider({ children }: { children: ReactNode }) {
  const { isConnected, data, lastUpdate, refreshData } = useRealTime();

  const value: RealtimeContextValue = {
    isConnected,
    wallet: data.wallet,
    recentTransactions: data.recentTransactions,
    collaterals: data.collaterals,
    loans: data.loans,
    recentActivities: data.recentActivities,
    lastUpdate,
    refreshData,
  };

  return (
    <RealTimeContext.Provider value={value}>
      {children}
    </RealTimeContext.Provider>
  );
}

export function useRealTimeContext() {
  const context = useContext(RealTimeContext);
  if (context === undefined) {
    throw new Error('useRealTimeContext must be used within a RealTimeProvider');
  }
  return context;
}