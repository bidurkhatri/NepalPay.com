import React, { useState, useEffect } from 'react';
import { Redirect } from 'wouter';
import { motion } from 'framer-motion';
import { useBlockchain } from '@/contexts/blockchain-context';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const AdminLoginPage: React.FC = () => {
  const { connectWallet, userAddress, isConnected, userRole } = useBlockchain();
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);

  // Check if user is an admin
  const isAdmin = userRole === 'ADMIN' || userRole === 'OWNER';

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      await connectWallet();
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been connected successfully."
      });
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  // If user is admin, redirect to admin dashboard
  if (isConnected && isAdmin) {
    return <Redirect to="/admin-dashboard" />;
  }

  // If user is connected but not admin, show error
  if (isConnected && !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/90 p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md p-8 rounded-xl bg-card/30 backdrop-blur-lg border border-border/50 shadow-xl"
        >
          <div className="flex flex-col items-center text-center">
            <img src="/logo.png" alt="NepaliPay" className="w-16 h-16 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Admin Access Denied</h1>
            <p className="text-muted-foreground mb-6">
              Your wallet does not have admin permissions.
            </p>
            <div className="bg-yellow-500/10 text-yellow-400 p-4 rounded-lg mb-6 text-sm">
              The connected wallet address ({userAddress?.substring(0, 6)}...{userAddress?.substring(userAddress.length - 4)}) 
              does not have admin privileges in the NepaliPay system. Please connect with an admin wallet or contact the owner.
            </div>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full py-3 px-4 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
            >
              Return to User Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Default login screen
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/90 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 rounded-xl bg-card/30 backdrop-blur-lg border border-border/50 shadow-xl"
      >
        <div className="flex flex-col items-center text-center">
          <img src="/logo.png" alt="NepaliPay" className="w-16 h-16 mb-4" />
          <h1 className="text-2xl font-bold mb-2">NepaliPay Admin Portal</h1>
          <p className="text-muted-foreground mb-8">
            Admin Access Required
          </p>
          
          <button
            onClick={handleConnectWallet}
            disabled={isConnecting}
            className="w-full py-3 px-4 flex items-center justify-center gap-2 bg-gradient-to-r from-primary/80 to-primary hover:opacity-90 text-white rounded-lg transition-colors"
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <img src="/metamask.svg" alt="MetaMask" className="w-5 h-5" />
                <span>Connect Wallet (MetaMask)</span>
              </>
            )}
          </button>
          
          <div className="mt-8 text-sm text-muted-foreground">
            <p>Only wallets with admin role in the NepaliPay contract can access this portal.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;