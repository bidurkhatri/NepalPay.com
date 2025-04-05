import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useBlockchain } from '@/contexts/blockchain-context';
import { Loader2, CreditCard, ArrowRight, Check, AlertTriangle } from 'lucide-react';
import ContractLinks from '@/components/contract-links';

// Initialize Stripe
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing Stripe public key. Please check your environment variables.');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface CheckoutFormProps {
  amount: number;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      toast({
        title: "Payment Not Ready",
        description: "Please wait for Stripe to initialize.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/sections',
        },
      });
      
      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message || "An error occurred with your payment",
          variant: "destructive",
        });
      } else {
        // Payment succeeded
        setIsCompleted(true);
        toast({
          title: "Payment Successful",
          description: "Your NPT tokens will be added to your account shortly.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error?.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
      <div className="mb-6">
        <PaymentElement className="stripe-element" />
      </div>
      
      {isCompleted ? (
        <div className="glass-card bg-green-900/20 border-green-800/30 flex items-center justify-center p-4">
          <Check className="mr-2 h-5 w-5 text-green-500" />
          <span>Payment completed successfully!</span>
        </div>
      ) : (
        <button 
          type="submit" 
          disabled={!stripe || !elements || isLoading}
          className="modern-button w-full py-3 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Pay ${amount.toFixed(2)} with Stripe
              <CreditCard className="ml-2 h-5 w-5" />
            </>
          )}
        </button>
      )}
      
      <div className="mt-4 text-xs text-gray-400 text-center">
        Your payment information is securely processed by Stripe.
      </div>
    </form>
  );
};

const BuyTokensPage: React.FC = () => {
  const [clientSecret, setClientSecret] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState(50);
  const [tokenAmount, setTokenAmount] = useState(6666.67);
  const { toast } = useToast();
  const { nptBalance } = useBlockchain();
  
  // Calculate NPT amount based on USD price (1 NPT = $0.0075 USD)
  const calculateTokenAmount = (usdAmount: number) => {
    const rate = 0.0075; // $0.0075 per NPT
    return usdAmount / rate;
  };
  
  useEffect(() => {
    setTokenAmount(calculateTokenAmount(amount));
  }, [amount]);
  
  // Create a payment intent when the component mounts
  useEffect(() => {
    const createPaymentIntent = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await apiRequest('POST', '/api/create-payment-intent', { amount });
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error: any) {
        console.error('Error creating payment intent:', error);
        setError(error?.message || 'Failed to initialize payment');
        toast({
          title: "Payment Setup Failed",
          description: "Could not connect to payment service. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    createPaymentIntent();
  }, [amount, toast]);
  
  // Define contract information
  const contracts = [
    {
      name: "NepaliPay Token (NPT)",
      address: "0x69d34B25809b346702C21EB0E22EAD8C1de58D66",
      description: "The main token used in the NepaliPay ecosystem",
    },
    {
      name: "NepaliPay",
      address: "0xe2d189f6696ee8b247ceae97fe3f1f2879054553",
      description: "Core functionality contract for user management",
    },
    {
      name: "Fee Relayer",
      address: "0x7ff2271749409f9137dac1e082962e21cc99aee6",
      description: "Handles gas fee relaying for transactions",
    },
  ];
  
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text">Buy NPT Tokens</h1>
          <p className="mt-2 text-gray-400">
            Purchase NPT tokens using your credit card via our secure payment system
          </p>
        </div>
        
        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="cyber-card">
              <div className="card-highlight"></div>
              <div className="card-content space-y-4">
                <h3 className="text-xl font-semibold">Purchase Amount</h3>
                <div className="space-y-2">
                  <label className="block text-sm text-gray-400">Select amount (USD)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[10, 50, 100, 250, 500, 1000].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setAmount(val)}
                        className={`py-2 px-4 rounded-lg font-medium text-sm ${
                          amount === val 
                            ? 'bg-primary/20 text-primary border border-primary/30'
                            : 'bg-gray-800/50 text-gray-300 border border-gray-700/50 hover:bg-gray-800'
                        }`}
                      >
                        ${val}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm text-gray-400 mb-1">Custom amount (USD)</label>
                  <input
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                    className="modern-input w-full"
                  />
                </div>
                
                <div className="mt-4 glass p-4 bg-primary/10 border-primary/20">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Exchange Rate:</span>
                    <span className="text-white">1 NPT = $0.0075 USD</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">You'll receive:</span>
                    <div className="flex items-center text-white">
                      <span className="text-xl font-bold">{tokenAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                      <span className="ml-1">NPT</span>
                      <ArrowRight className="ml-1 h-4 w-4 text-primary" />
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-xs text-gray-500">
                  Note: Actual token amount may vary slightly due to exchange rate fluctuations
                </div>
              </div>
            </div>
            
            <div className="cyber-card">
              <div className="card-highlight"></div>
              <div className="card-content">
                <h3 className="text-xl font-semibold mb-2">Current Balance</h3>
                <div className="flex items-end">
                  <span className="text-2xl font-bold">{parseFloat(nptBalance).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  <span className="ml-2 text-gray-400">NPT</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-3">
            <div className="cyber-card h-full">
              <div className="card-highlight"></div>
              <div className="card-content">
                <h3 className="text-xl font-semibold mb-6">Payment Details</h3>
                
                {loading ? (
                  <div className="py-12 flex flex-col items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                    <p className="text-gray-400">Initializing payment system...</p>
                  </div>
                ) : error ? (
                  <div className="py-12 flex flex-col items-center justify-center">
                    <AlertTriangle className="h-10 w-10 text-red-500 mb-4" />
                    <p className="text-red-400 mb-2">{error}</p>
                    <button 
                      onClick={() => window.location.reload()}
                      className="modern-button-outline mt-4"
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  clientSecret && (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <CheckoutForm amount={amount} />
                    </Elements>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12">
          <ContractLinks contracts={contracts} />
        </div>
        
        <div className="mt-8 cyber-card bg-gray-900/50 border-gray-700/30">
          <div className="card-content">
            <h3 className="text-lg font-semibold mb-2">Important Information</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex">
                <span className="mr-2">•</span>
                <span>Your NPT tokens will be delivered to your NepaliPay wallet after payment confirmation</span>
              </li>
              <li className="flex">
                <span className="mr-2">•</span>
                <span>Transactions typically take 1-5 minutes to complete on the blockchain</span>
              </li>
              <li className="flex">
                <span className="mr-2">•</span>
                <span>NPT tokens can be used within the NepaliPay ecosystem for payments, loans, and other services</span>
              </li>
              <li className="flex">
                <span className="mr-2">•</span>
                <span>For questions or support, please contact our team at support@nepalipay.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyTokensPage;