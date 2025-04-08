import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useBlockchain } from '@/contexts/blockchain-context';
import { ArrowLeft, Loader2, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RegisterPage: React.FC = () => {
  const { connectWallet, connecting, isConnected, username, setUsername } = useBlockchain();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  const [newUsername, setNewUsername] = useState('');
  const [referrer, setReferrer] = useState('');
  const [registering, setRegistering] = useState(false);
  const [step, setStep] = useState(1); // 1: Connect Wallet, 2: Set Username
  
  // Handle the wallet connection
  const handleConnect = async () => {
    try {
      await connectWallet();
      if (isConnected) {
        setStep(2);
      }
    } catch (error: any) {
      toast({
        title: "Connection Error",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };
  
  // Handle the username registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUsername) {
      toast({
        title: "Username Required",
        description: "Please enter a username to continue",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setRegistering(true);
      
      await setUsername(newUsername, referrer || undefined);
      
      toast({
        title: "Registration Successful",
        description: `Welcome, ${newUsername}! You're ready to use NepaliPay.`,
        variant: "default",
      });
      
      // Redirect to dashboard
      navigate('/sections');
      
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register username",
        variant: "destructive",
      });
    } finally {
      setRegistering(false);
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
                <h1 className="text-2xl font-bold text-white mb-2">Let's Get You Started!</h1>
                <p className="text-gray-400">
                  Create your account to start using NepaliPay's features.
                </p>
              </div>
              
              {/* Step 1: Connect Wallet */}
              {step === 1 && (
                <div>
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
                  
                  <div className="mt-8">
                    <div className="border-t border-gray-800 pt-6">
                      <h3 className="text-sm font-medium text-gray-400 mb-4">Make sure you have:</h3>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-gray-300">
                            MetaMask or another Web3 wallet installed
                          </span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-gray-300">
                            Binance Smart Chain (BSC) configured in your wallet
                          </span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-gray-300">
                            Some BNB for gas fees (very minimal amount needed)
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Step 2: Set Username */}
              {step === 2 && (
                <form onSubmit={handleRegister}>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                        Username <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="username"
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="Pick a unique username (e.g., RajuKtm)"
                        required
                        minLength={3}
                        maxLength={32}
                      />
                      <p className="text-xs text-gray-500 mt-1">3-32 characters, no spaces</p>
                    </div>
                    
                    <div>
                      <label htmlFor="referrer" className="block text-sm font-medium text-gray-300 mb-1">
                        Referrer (Optional)
                      </label>
                      <input
                        id="referrer"
                        type="text"
                        value={referrer}
                        onChange={(e) => setReferrer(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="Enter a friend's username (e.g., SitaPkr)"
                      />
                      <p className="text-xs text-gray-500 mt-1">Both you and your referrer earn rewards!</p>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={registering || !newUsername}
                      className="modern-button bg-gradient-to-r from-green-600 to-green-500 w-full py-3 flex items-center justify-center"
                    >
                      {registering ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Registering...
                        </>
                      ) : (
                        'Register'
                      )}
                    </button>
                  </div>
                </form>
              )}
              
              <div className="mt-6 text-center">
                <div className="text-gray-500 text-sm mb-2">Already have an account?</div>
                <Link href="/login" className="text-primary hover:underline">
                  Login
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

export default RegisterPage;