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
  
  // Force demo mode activation directly without relying on state updates
  useEffect(() => {
    const activateDemoMode = () => {
      // Only attempt to activate demo mode on initial render if we haven't already tried
      // and only if we're not already connected or in demo mode
      if (!isConnected && !demoMode && !attemptedDemoActivation.current) {
        console.log("No wallet connection detected, forcing demo mode activation");
        attemptedDemoActivation.current = true;
        
        // Call toggleDemoMode - don't rely on state for condition
        try {
          toggleDemoMode();
          
          toast({
            title: "Demo Mode Activated",
            description: "You're using NepaliPay in demo mode with a simulated blockchain. All contract functions will work for demonstration purposes.",
            duration: 5000,
          });
        } catch (err) {
          console.error("Error activating demo mode:", err);
        }
      }
    };
    
    // Slight delay to ensure component is fully mounted and blockchain context is initialized
    const timer = setTimeout(activateDemoMode, 200);
    
    return () => clearTimeout(timer);
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