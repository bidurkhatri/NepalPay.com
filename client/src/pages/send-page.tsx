import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useBlockchain } from '@/contexts/blockchain-context';
import { ArrowLeft, Send, Loader2, Info, Wallet, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// For autocomplete functionality
interface UserSuggestion {
  username: string;
}

const SendPage: React.FC = () => {
  const { isConnected, nptBalance, sendTokens } = useBlockchain();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  // Form state
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [sending, setSending] = useState(false);
  const [suggestions, setSuggestions] = useState<UserSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Derived values
  const amountNumber = parseFloat(amount) || 0;
  const fee = Math.min(5, amountNumber * 0.01); // 1% fee, min 5 NPT
  const total = amountNumber + fee;
  
  // Validation
  const maxAmount = parseFloat(nptBalance);
  const isValidAmount = amountNumber > 0 && amountNumber <= maxAmount;
  const isValidRecipient = recipient.length >= 3;
  const canSubmit = isValidAmount && isValidRecipient && !sending;
  
  // Demo autocomplete function (in a real app, this would fetch from the blockchain or API)
  const searchUsers = (query: string) => {
    // Sample users for demo
    const sampleUsers = [
      { username: 'SitaPkr' },
      { username: 'RajuKtm' },
      { username: 'AnishM' },
      { username: 'Binod123' },
      { username: 'NepalUser' },
    ];
    
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    
    const filtered = sampleUsers.filter(user => 
      user.username.toLowerCase().includes(query.toLowerCase())
    );
    
    setSuggestions(filtered);
  };
  
  // Handle recipient input with autocomplete
  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRecipient(value);
    searchUsers(value);
    setShowSuggestions(true);
  };
  
  // Select a suggestion
  const selectSuggestion = (username: string) => {
    setRecipient(username);
    setShowSuggestions(false);
  };
  
  // Handle the send transaction
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canSubmit) return;
    
    try {
      setSending(true);
      
      const result = await sendTokens(recipient, amount, description);
      
      toast({
        title: "Transaction Successful",
        description: "Your NPT tokens have been sent successfully!",
        variant: "success",
      });
      
      // Show avatar animation (this would be replaced with a proper animation component)
      setTimeout(() => {
        // Redirect back to dashboard after successful transaction
        navigate('/sections');
      }, 2000);
      
    } catch (error: any) {
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to send tokens",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };
  
  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowSuggestions(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  
  // Redirect if not connected
  useEffect(() => {
    if (!isConnected) {
      navigate('/login');
    }
  }, [isConnected, navigate]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex flex-col">
      {/* Header with back button and balance */}
      <header className="border-b border-gray-800/60 bg-gray-900/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            <Link href="/sections" className="flex items-center text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>Back to Dashboard</span>
            </Link>
            
            <div className="flex items-center">
              <div className="text-2xl font-bold gradient-text">Send NPT</div>
            </div>
            
            <div className="flex items-center">
              <div className="text-sm text-gray-400 mr-2">Balance:</div>
              <div className="text-white font-medium">{parseFloat(nptBalance).toLocaleString()} NPT</div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="cyber-card">
            <div className="card-highlight"></div>
            <div className="card-content p-8">
              <form onSubmit={handleSend} className="space-y-6">
                {/* Recipient field with autocomplete */}
                <div className="relative">
                  <label htmlFor="recipient" className="block text-sm font-medium text-gray-300 mb-1">
                    Recipient
                  </label>
                  <div className="relative">
                    <input
                      id="recipient"
                      type="text"
                      value={recipient}
                      onChange={handleRecipientChange}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowSuggestions(true);
                      }}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="Enter username (e.g., SitaPkr)"
                      required
                    />
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                        {suggestions.map((user) => (
                          <div
                            key={user.username}
                            className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                            onClick={() => selectSuggestion(user.username)}
                          >
                            {user.username}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Amount field */}
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
                    Amount
                  </label>
                  <div className="relative">
                    <input
                      id="amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min="1"
                      max={maxAmount}
                      step="1"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="Enter amount (1-50,000 NPT)"
                      required
                    />
                    <div className="absolute right-4 top-3 text-gray-400">NPT</div>
                  </div>
                  
                  {/* Amount slider */}
                  <div className="mt-2">
                    <input
                      type="range"
                      min="1"
                      max={Math.min(50000, maxAmount)}
                      value={amountNumber || 1}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full h-2 rounded-full bg-gray-700 appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <div>1 NPT</div>
                      <div>{Math.min(50000, maxAmount)} NPT</div>
                    </div>
                  </div>
                </div>
                
                {/* Description field */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="e.g., For momos"
                  ></textarea>
                </div>
                
                {/* Fee preview */}
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div className="text-gray-400">Amount:</div>
                    <div className="text-white">{amountNumber.toLocaleString()} NPT</div>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <div className="flex items-center text-gray-400">
                      <span>Fee:</span>
                      <Info className="h-3.5 w-3.5 ml-1 text-gray-500" />
                    </div>
                    <div className="text-gray-300">{fee.toLocaleString()} NPT</div>
                  </div>
                  <div className="border-t border-gray-700 my-2"></div>
                  <div className="flex justify-between items-center font-medium">
                    <div className="text-gray-200">Total:</div>
                    <div className="text-white">{total.toLocaleString()} NPT</div>
                  </div>
                </div>
                
                {/* Send button */}
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={`modern-button w-full py-3 flex items-center justify-center 
                    ${canSubmit ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-gray-700 cursor-not-allowed'}`}
                >
                  {sending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Send
                    </>
                  )}
                </button>
              </form>
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
      
      {/* Avatar animation (would be replaced with a proper component) */}
      {sending && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full text-center">
            <Loader2 className="h-12 w-12 mx-auto mb-4 text-primary animate-spin" />
            <h3 className="text-xl font-bold text-white mb-2">Sending NPT...</h3>
            <p className="text-gray-400">Please wait while your transaction is being processed.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SendPage;