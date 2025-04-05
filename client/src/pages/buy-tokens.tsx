import { useEffect, useState } from "react";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { motion } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CreditCard, Shield, Wallet } from "lucide-react";
import { Link } from "wouter";
import { useBlockchain } from "@/contexts/blockchain-context";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const TokenPurchaseForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const { userAddress } = useBlockchain();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/sections`,
          payment_method_data: {
            billing_details: {
              address: {
                country: 'NP',
              },
            },
          },
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message || "Something went wrong with your payment",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Payment Processing",
          description: "Your payment is being processed. NPT tokens will be sent to your wallet soon.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <PaymentElement 
          options={{
            layout: {
              type: 'tabs',
              defaultCollapsed: false,
            }
          }}
        />
        
        <div className="glass-card p-4 mb-6">
          <h3 className="text-sm font-medium text-gray-300 mb-2">Important Information:</h3>
          <ul className="text-sm text-gray-400 space-y-1">
            <li className="flex items-start">
              <Shield className="h-4 w-4 mr-2 mt-0.5 text-primary" />
              <span>Your payment information is securely processed by Stripe.</span>
            </li>
            <li className="flex items-start">
              <Wallet className="h-4 w-4 mr-2 mt-0.5 text-primary" />
              <span>NPT tokens will be sent to your connected wallet address: {userAddress ? `${userAddress.substring(0, 6)}...${userAddress.substring(userAddress.length - 4)}` : "No wallet connected"}</span>
            </li>
            <li className="flex items-start">
              <CreditCard className="h-4 w-4 mr-2 mt-0.5 text-primary" />
              <span>The exchange rate is 1 NPT = 1 NPR. Minimum purchase is 500 NPT.</span>
            </li>
          </ul>
        </div>
        
        <div className="flex justify-between">
          <Link href="/sections">
            <a className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </a>
          </Link>
          <button
            type="submit"
            disabled={!stripe || !elements || isProcessing}
            className="modern-button py-2 px-6"
          >
            {isProcessing ? "Processing..." : "Purchase Tokens"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default function BuyTokensPage() {
  const [clientSecret, setClientSecret] = useState("");
  const [amount, setAmount] = useState(500); // Default to 500 NPR/NPT
  const [isLoading, setIsLoading] = useState(false);
  const { isConnected, userAddress } = useBlockchain();
  const { toast } = useToast();

  const createPaymentIntent = async (amount: number) => {
    if (!isConnected || !userAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet in the Sections page before buying tokens.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Create PaymentIntent with the current amount
      const response = await apiRequest("POST", "/api/create-payment-intent", { 
        amount, 
        walletAddress: userAddress 
      });
      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (error) {
      toast({
        title: "Failed to Initialize Payment",
        description: "Could not connect to payment service. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle amount change with debounce
  const handleAmountChange = (newAmount: number) => {
    setAmount(newAmount);
    // Clear any existing client secret when amount changes
    setClientSecret("");
  };

  // Create payment intent on component mount
  useEffect(() => {
    if (isConnected && userAddress) {
      createPaymentIntent(amount);
    }
  }, [isConnected, userAddress]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Link href="/sections">
            <a className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6">
              <ArrowLeft className="h-5 w-5 mr-2" /> Back to Sections
            </a>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-4">Buy NPT Tokens</h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Purchase NPT tokens securely using your credit card or debit card.
              Tokens will be transferred to your connected wallet.
            </p>
          </motion.div>

          {!isConnected && (
            <div className="glass-card p-6 text-center">
              <h2 className="text-xl font-semibold mb-4">Please Connect Your Wallet</h2>
              <p className="mb-6">You need to connect your wallet before purchasing tokens.</p>
              <Link href="/sections">
                <a className="modern-button-outline py-2 px-6">
                  Go to Sections Page
                </a>
              </Link>
            </div>
          )}

          {isConnected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-card p-6"
            >
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Purchase Amount</h2>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="amount" className="text-gray-300">Amount (NPT)</label>
                  <span className="text-white font-medium">{amount} NPT = {amount} NPR</span>
                </div>
                <input
                  type="range"
                  id="amount"
                  min="500"
                  max="10000"
                  step="100"
                  value={amount}
                  onChange={(e) => handleAmountChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-400 mt-1">
                  <span>500 NPT</span>
                  <span>10,000 NPT</span>
                </div>
                {!clientSecret && (
                  <button
                    onClick={() => createPaymentIntent(amount)}
                    disabled={isLoading}
                    className="modern-button w-full mt-4 py-2"
                  >
                    {isLoading ? "Processing..." : "Proceed with this amount"}
                  </button>
                )}
              </div>

              {!clientSecret ? (
                isLoading ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4" />
                    <p className="text-gray-300">Initializing payment form...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10">
                    <p className="text-gray-300 mb-4">Adjust the amount above and click "Proceed" to continue.</p>
                  </div>
                )
              ) : (
                <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
                  <TokenPurchaseForm />
                </Elements>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}