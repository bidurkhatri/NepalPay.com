import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useAuth } from '@/contexts/auth-context';
import { useBlockchain } from '@/contexts/blockchain-context';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, HelpCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'wouter';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Token Purchase Form
const TokenPurchaseForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [wallet, setWallet] = useState('');
  const { userAddress } = useBlockchain();

  useEffect(() => {
    if (userAddress) {
      setWallet(userAddress);
    }
  }, [userAddress]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/sections',
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message || "An error occurred during payment processing",
        variant: "destructive",
      });
      setProcessing(false);
    } else {
      // If no error, then the server knows about the payment
      // and will credit tokens to the user's blockchain wallet
      setCompleted(true);
      toast({
        title: "Payment Successful",
        description: "Your NPT tokens will be minted shortly",
      });
    }
  };

  if (completed) {
    return (
      <div className="py-12 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Purchase Successful!</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Your NPT tokens will be minted to your wallet shortly. It may take a few minutes for the transaction to be confirmed on the blockchain.
        </p>
        <Link href="/sections">
          <a className="modern-button inline-flex items-center">
            Go to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="glass-card bg-gray-900/70">
        <div className="card-highlight"></div>
        <div className="card-content">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Connected Wallet</label>
            <input
              type="text"
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              className="w-full py-2 px-3 bg-gray-800/70 border border-gray-700 rounded-lg"
              placeholder="Your wallet address"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              NPT tokens will be minted to this wallet address
            </p>
          </div>
          
          <PaymentElement />
        </div>
      </div>
      
      <div className="flex justify-between">
        <Link href="/sections">
          <a className="modern-button-outline inline-flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </a>
        </Link>
        <button 
          type="submit" 
          disabled={!stripe || processing} 
          className="modern-button inline-flex items-center"
        >
          {processing ? "Processing..." : "Buy NPT Tokens"}
          {!processing && <ArrowRight className="ml-2 h-4 w-4" />}
        </button>
      </div>
    </form>
  );
};

// Main Buy Tokens Page
const BuyTokensPage: React.FC = () => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(100);
  const [step, setStep] = useState<number>(1);
  const { user } = useAuth();
  const { userAddress } = useBlockchain();
  const { toast } = useToast();

  // Calculate USD equivalent (rough conversion for display)
  const nprToUsd = 0.0075; // NPR to USD conversion rate
  const usdAmount = (amount * nprToUsd).toFixed(2);

  const createPaymentIntent = async () => {
    try {
      const response = await apiRequest('POST', '/api/create-payment-intent', {
        amount,
        walletAddress: userAddress
      });
      
      const data = await response.json();
      setClientSecret(data.clientSecret);
      setStep(2);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Predefined token amounts
  const tokenOptions = [100, 500, 1000, 5000, 10000];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-gray-800/60">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/sections">
            <a className="flex items-center">
              <span className="text-xl font-bold gradient-text">NepaliPay</span>
            </a>
          </Link>
          <div className="flex items-center gap-4">
            {userAddress ? (
              <div className="glass-card bg-primary/10 py-1.5 px-4 text-sm">
                <span className="text-primary font-medium truncate max-w-[120px] md:max-w-[200px] inline-block">
                  {userAddress}
                </span>
              </div>
            ) : (
              <div className="text-gray-400 text-sm">
                Wallet not connected
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-bold gradient-text mb-3">
              {step === 1 ? "Buy NPT Tokens" : "Complete Your Purchase"}
            </h1>
            <p className="text-gray-400">
              {step === 1 
                ? "Purchase NPT tokens using your credit card. Tokens will be minted directly to your blockchain wallet."
                : "Provide your payment details to complete the purchase."}
            </p>
          </div>
          
          {step === 1 ? (
            <>
              {/* Step 1: Select amount */}
              <div className="glass-card bg-gray-900/70 mb-6">
                <div className="card-highlight"></div>
                <div className="card-content">
                  <h2 className="text-lg font-semibold mb-6">Select Token Amount</h2>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      {tokenOptions.map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setAmount(value)}
                          className={`py-2 px-3 rounded-lg border ${
                            amount === value
                              ? 'bg-primary/20 border-primary/50 text-primary'
                              : 'bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-800/70'
                          }`}
                        >
                          {value} NPT
                        </button>
                      ))}
                    </div>
                    
                    <div className="mt-6">
                      <label className="block text-sm font-medium mb-1">
                        Custom Amount (NPT)
                      </label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        min="10"
                        max="100000"
                        className="w-full py-2 px-3 bg-gray-800/70 border border-gray-700 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Summary */}
              <div className="glass-card bg-gray-900/70 mb-6">
                <div className="card-highlight"></div>
                <div className="card-content">
                  <h2 className="text-lg font-semibold mb-4">Purchase Summary</h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-800">
                      <span className="text-gray-400">Amount</span>
                      <span className="font-medium">{amount} NPT</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-800">
                      <span className="text-gray-400">Value in USD</span>
                      <span className="font-medium">${usdAmount}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-400">Fee</span>
                      <span className="font-medium">0 NPT</span>
                    </div>
                    <div className="flex justify-between py-3 mt-2 border-t border-gray-800">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-primary">${usdAmount}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Info Box */}
              <div className="mb-6 bg-blue-900/20 border border-blue-800/30 rounded-lg p-4 flex">
                <HelpCircle className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-300">
                  <p>NPT tokens are pegged 1:1 with NPR. After purchase, tokens will be minted directly to your connected wallet.</p>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Link href="/sections">
                  <a className="modern-button-outline inline-flex items-center">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </a>
                </Link>
                <button 
                  type="button" 
                  onClick={createPaymentIntent}
                  disabled={amount < 10} 
                  className="modern-button inline-flex items-center"
                >
                  Continue to Payment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            /* Step 2: Payment */
            clientSecret && (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <TokenPurchaseForm />
              </Elements>
            )
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-6 px-4 border-t border-gray-800 mt-10">
        <div className="max-w-5xl mx-auto text-center text-sm text-gray-500">
          <p>
            &copy; 2025 NepaliPay. All transactions are secured on the Binance Smart Chain.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default BuyTokensPage;