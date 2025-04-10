import React, { ReactNode, useEffect, useRef } from 'react';
import Sidebar from './sidebar';
import MobileNavigation from './mobile-navigation';
import { useLocation } from 'wouter';
import { useBlockchain } from '@/contexts/blockchain-context';
import { useToast } from '@/hooks/use-toast';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [location] = useLocation();
  const { 
    isConnected, 
    demoMode, 
    toggleDemoMode, 
    nepaliPayContract 
  } = useBlockchain();
  const { toast } = useToast();
  
  // Auto-activate demo mode if not connected to a wallet
  const attemptedDemoActivation = useRef(false);
  
  useEffect(() => {
    // Only attempt to activate demo mode on initial render if we haven't already tried
    if (!isConnected && !demoMode && !attemptedDemoActivation.current) {
      console.log("No wallet connection detected, auto-activating demo mode");
      attemptedDemoActivation.current = true;
      
      // Use setTimeout to ensure this runs after component is fully mounted
      setTimeout(() => {
        toggleDemoMode();
        
        toast({
          title: "Demo Mode Activated",
          description: "You're using NepaliPay in demo mode with a simulated blockchain. Connect a wallet to use real blockchain features.",
          duration: 5000,
        });
      }, 100);
    }
  }, [isConnected, demoMode, toggleDemoMode, toast]);
  
  // Log when dashboard layout renders and if contracts are available
  useEffect(() => {
    console.log(`Dashboard Layout rendered at location: ${location}`);
    console.log("Contract status:", { isConnected, demoMode, hasNepaliPayContract: !!nepaliPayContract });
  }, [location, isConnected, demoMode, nepaliPayContract]);
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          {children}
        </main>
        <MobileNavigation />
      </div>
    </div>
  );
};

export default DashboardLayout;