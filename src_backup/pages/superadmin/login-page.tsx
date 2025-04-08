import React, { useState } from 'react';
import { useBlockchain } from '@/contexts/blockchain-context';
import { useCustomToast } from '@/lib/toast-wrapper';
import { Loader2, Shield, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const SuperAdminLoginPage: React.FC = () => {
  const { connectWallet, connecting, isConnected, userRole, userAddress } = useBlockchain();
  const [isVerifying, setIsVerifying] = useState(false);
  const toast = useCustomToast();

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      setIsVerifying(true);
      
      // Simulate verification delay (this would normally check the blockchain for owner status)
      setTimeout(() => {
        setIsVerifying(false);
        if (userRole !== 'OWNER') {
          toast({
            title: "Access Denied",
            description: "This portal is restricted to the contract owner only.",
            variant: "destructive"
          });
        } else {
          window.location.href = "/superadmin/dashboard";
        }
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect to wallet",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="nepal-card relative overflow-hidden"
        >
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-3">
              <Shield className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-2xl font-bold nepal-gradient-text">NepaliPay Owner Portal</h1>
            <p className="text-gray-400 mt-2">Superadmin access only</p>
          </div>

          {/* Warning */}
          <div className="bg-yellow-900/20 border border-yellow-800/30 rounded-lg p-4 mb-6 flex items-start">
            <AlertTriangle className="text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-yellow-200 text-sm">
              This portal provides full control over the NepaliPay ecosystem. 
              Owner authentication is verified through your blockchain wallet.
            </p>
          </div>

          {/* Connect Button */}
          <button
            onClick={handleConnectWallet}
            disabled={connecting || isVerifying}
            className="w-full modern-button relative overflow-hidden group"
          >
            {connecting || isVerifying ? (
              <div className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                <span>{isVerifying ? "Verifying Owner Status..." : "Connecting Wallet..."}</span>
              </div>
            ) : (
              <>
                <span className="flex items-center justify-center">
                  <img src="https://metamask.io/images/metamask-fox.svg" className="w-5 h-5 mr-2" alt="MetaMask" />
                  Connect with MetaMask
                </span>
              </>
            )}
          </button>

          <div className="mt-5 text-center">
            <p className="text-sm text-gray-500">
              Connect with the wallet authorized as contract owner on BSC.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SuperAdminLoginPage;