import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

// Dummy implementation for testing purposes
const useBlockchain = () => ({
  walletAddress: '0x1234567890123456789012345678901234567890',
  isConnected: true,
  connectWallet: () => Promise.resolve(),
  tokenBalance: '100.0',
  getTokenBalance: () => Promise.resolve('100.0'),
});

// Make sure to call loadStripe outside of a component's render to avoid
// recreating the Stripe object on every render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

function CheckoutForm({ amount, walletAddress }: { amount: number; walletAddress: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
    });

    if (error) {
      toast({
        title: 'Payment Failed',
        description: error.message,
        variant: 'destructive',
      });
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <div className="mt-6 p-4 bg-glass-bg-light rounded-lg border border-border-light backdrop-blur-md">
        <p className="mb-2 text-text-color"><span className="font-semibold">Amount:</span> ${amount.toFixed(2)} USD</p>
        <p className="text-text-color"><span className="font-semibold">Wallet Address:</span> {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
      </div>
      <button 
        disabled={isProcessing || !stripe || !elements} 
        className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-lg relative overflow-hidden shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0"
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}

export default function BuyTokensPage() {
  const [tokenAmount, setTokenAmount] = useState<number>(100);
  const [tokenPrice, setTokenPrice] = useState<number>(1); // Default value before fetching
  const [gasFee, setGasFee] = useState<number>(0.5); // Fixed gas fee in USD
  const [serviceFee, setServiceFee] = useState<number>(0); // 2% service fee
  const [totalCost, setTotalCost] = useState<number>(0);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const { walletAddress, isConnected, connectWallet } = useBlockchain();
  const { toast } = useToast();
  const [isLoadingPrice, setIsLoadingPrice] = useState<boolean>(true);

  // Fetch token price from blockchain
  useEffect(() => {
    const fetchTokenPrice = async () => {
      try {
        setIsLoadingPrice(true);
        // Call the API to get the token price from the blockchain contract
        const response = await apiRequest('GET', '/api/token-price');
        const data = await response.json();
        
        if (data.price) {
          setTokenPrice(data.price);
        }
      } catch (error) {
        console.error("Failed to fetch token price:", error);
        toast({
          title: "Price Fetch Error",
          description: "Could not fetch the current token price. Using default value instead.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingPrice(false);
      }
    };

    fetchTokenPrice();
  }, [toast]);

  // Calculate fees and total cost when token amount or price changes
  useEffect(() => {
    const tokenCost = tokenAmount * tokenPrice;
    const serviceFeeAmount = tokenCost * 0.02; // 2% service fee
    setServiceFee(serviceFeeAmount);
    setTotalCost(tokenCost + gasFee + serviceFeeAmount);
  }, [tokenAmount, tokenPrice, gasFee]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseInt(e.target.value, 10);
    if (!isNaN(amount) && amount > 0) {
      setTokenAmount(amount);
    } else {
      setTokenAmount(0);
    }
  };

  const handleContinue = async () => {
    if (!isConnected) {
      try {
        await connectWallet();
      } catch (error) {
        toast({
          title: 'Wallet Connection Failed',
          description: 'Could not connect to your wallet. Please try again.',
          variant: 'destructive',
        });
        return;
      }
    }

    try {
      const response = await apiRequest('POST', '/api/purchase-npt', {
        amount: totalCost, // The server will handle conversion to cents
        walletAddress,
        nptAmount: tokenAmount,
      });

      const data = await response.json();
      
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setShowPaymentForm(true);
      } else {
        throw new Error('Failed to create payment intent');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create payment. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen p-6 flex items-center justify-center bg-background relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 bg-background-dark z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-3/4 h-3/4 bg-gradient-to-tl from-secondary/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 left-1/3 w-1/2 h-1/2 bg-gradient-to-br from-accent/5 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="gradient-border w-full max-w-4xl z-10">
        <div className="glass-card p-8 md:p-12">
          {!showPaymentForm ? (
            <div className="w-full">
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-light to-secondary mb-3">
                  Buy NPT Tokens
                </h1>
                <p className="text-text-muted text-lg">
                  Purchase NPT tokens with your credit/debit card
                </p>
              </div>
              
              <div className="form-group mb-8">
                <label htmlFor="tokenAmount" className="block text-text-color mb-2 font-medium">
                  Token Amount
                </label>
                <div className="relative">
                  <input
                    id="tokenAmount"
                    type="number"
                    min="1"
                    value={tokenAmount}
                    onChange={handleAmountChange}
                    className="w-full px-4 py-3 bg-glass-bg-light border border-border-light rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-text-color backdrop-blur-md transition-all"
                  />
                </div>
              </div>
              
              <div className="bg-glass-bg-light border border-border-light rounded-lg p-5 backdrop-blur-md mb-8">
                <h3 className="text-lg font-semibold mb-4 text-text-color">Fee Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Token Cost</span>
                    <span className="text-text-color font-medium">${(tokenAmount * tokenPrice).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Gas Fee</span>
                    <span className="text-text-color font-medium">${gasFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Service Fee (2%)</span>
                    <span className="text-text-color font-medium">${serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="h-px w-full bg-border-light my-2"></div>
                  <div className="flex justify-between">
                    <span className="text-text-color font-semibold">Total Cost</span>
                    <span className="text-primary font-bold">${totalCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-glass-bg-light border border-border-light rounded-lg p-5 backdrop-blur-md mb-8">
                <h3 className="text-lg font-semibold mb-4 text-text-color">Wallet Information</h3>
                {isConnected ? (
                  <div className="text-text-muted">
                    <p>Connected Wallet: <span className="text-text-color font-medium">{`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}</span></p>
                  </div>
                ) : (
                  <p className="text-danger-light">You need to connect your wallet to continue</p>
                )}
              </div>
              
              <button 
                onClick={handleContinue}
                disabled={!tokenAmount || tokenAmount <= 0}
                className="w-full px-8 py-4 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-lg relative overflow-hidden shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                Continue to Payment
              </button>
            </div>
          ) : (
            <div className="w-full">
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-light to-secondary mb-3">
                  Complete Payment
                </h1>
                <p className="text-text-muted text-lg">
                  Please enter your payment information below
                </p>
              </div>
              
              {clientSecret && (
                <div className="mb-8">
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm amount={totalCost} walletAddress={walletAddress} />
                  </Elements>
                </div>
              )}
              
              <button 
                onClick={() => setShowPaymentForm(false)}
                className="w-full px-8 py-3 bg-glass-bg-light border border-border-light text-text-color font-medium rounded-lg hover:bg-border-light/10 transition-all"
              >
                Back to Token Selection
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}