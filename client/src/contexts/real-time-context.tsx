import React, { createContext, useContext, ReactNode, useState } from 'react';
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
  // Using mock data instead of WebSocket connection
  const [isConnected] = useState(true);
  const [lastUpdate] = useState<Date | null>(new Date());
  const [data] = useState({
    wallet: null,
    recentTransactions: [],
    collaterals: [],
    loans: [],
    recentActivities: []
  });

  const refreshData = () => {
    console.log('Refresh data called - using mock data for now');
  };

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