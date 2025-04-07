import React from 'react';
import { Link } from 'wouter';
import { useBlockchain } from '@/contexts/blockchain-context';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LoginPage: React.FC = () => {
  const { connectWallet, connecting, isConnected, username } = useBlockchain();
  const { toast } = useToast();
  
  // Handle the wallet connection
  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error: any) {
      toast({
        title: "Connection Error",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex flex-col">
      {/* Header with back button */}
      <header className="border-b border-gray-800/60 bg-gray-900/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            <Link href="/" className="flex items-center text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>Back to Landing</span>
            </Link>
            
            <div className="flex items-center">
              <div className="text-2xl font-bold gradient-text">NepaliPay</div>
              <div className="ml-2 h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">₹</span>
              </div>
            </div>
            
            <div className="w-32"></div> {/* Spacer for balance */}
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="cyber-card">
            <div className="card-highlight"></div>
            <div className="card-content p-8">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Connect Your Wallet to Login</h1>
                <p className="text-gray-400">
                  Use MetaMask or any Web3 wallet configured with Binance Smart Chain (BSC).
                </p>
              </div>
              
              {!isConnected ? (
                <button
                  onClick={handleConnect}
                  disabled={connecting}
                  className="modern-button bg-gradient-to-r from-blue-600 to-blue-500 w-full py-3 flex items-center justify-center"
                >
                  {connecting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    'Connect Wallet'
                  )}
                </button>
              ) : (
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 text-center">
                  <div className="text-green-500 mb-2">Successfully Connected!</div>
                  <div className="text-white font-medium">
                    Logged in as <span className="text-primary">{username || "Unknown User"}</span>
                  </div>
                  <Link href="/sections">
                    <button className="modern-button bg-gradient-to-r from-green-600 to-green-500 mt-4 w-full">
                      Go to Dashboard
                    </button>
                  </Link>
                </div>
              )}
              
              <div className="mt-6 text-center">
                <div className="text-gray-500 text-sm mb-2">New to NepaliPay?</div>
                <Link href="/register" className="text-primary hover:underline">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer with Help Chat */}
      <footer className="py-8 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex justify-center">
          <div className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} NepaliPay. All rights reserved.
          </div>
        </div>
        
        {/* Need Help Chat Bubble - Fixed position */}
        <div className="fixed bottom-6 right-6 z-40">
          <Link href="/support" className="flex items-center glass-card bg-primary/10 py-3 px-5 rounded-full shadow-lg hover:scale-105 transition-transform">
            <div className="relative mr-2 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">?</span>
            </div>
            <span className="font-medium text-primary">Need Help?</span>
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;