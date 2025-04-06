import { useState, useEffect } from 'react';
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
      <div className="payment-details-summary">
        <p>Amount: {amount} USD</p>
        <p>Wallet Address: {walletAddress}</p>
      </div>
      <button 
        disabled={isProcessing || !stripe || !elements} 
        className="payment-button"
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}

export default function BuyTokensPage() {
  const [tokenAmount, setTokenAmount] = useState<number>(100);
  const [tokenPrice, setTokenPrice] = useState<number>(1); // 1 USD per token
  const [gasFee, setGasFee] = useState<number>(0.5); // Fixed gas fee in USD
  const [serviceFee, setServiceFee] = useState<number>(0); // 2% service fee
  const [totalCost, setTotalCost] = useState<number>(0);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const { walletAddress, isConnected, connectWallet } = useBlockchain();
  const { toast } = useToast();

  // Calculate fees and total cost when token amount changes
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
      const response = await apiRequest('POST', '/api/create-payment-intent', {
        amount: Math.round(totalCost * 100), // Convert to cents
        walletAddress,
        tokenAmount,
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
    <div className="buy-tokens-container">
      {!showPaymentForm ? (
        <div className="token-purchase-form">
          <h1>Buy NPT Tokens</h1>
          <p>Purchase NPT tokens with your credit/debit card</p>
          
          <div className="form-group">
            <label htmlFor="tokenAmount">Token Amount</label>
            <input
              id="tokenAmount"
              type="number"
              min="1"
              value={tokenAmount}
              onChange={handleAmountChange}
            />
          </div>
          
          <div className="fee-breakdown">
            <div className="fee-item">
              <span>Token Cost</span>
              <span>${(tokenAmount * tokenPrice).toFixed(2)}</span>
            </div>
            <div className="fee-item">
              <span>Gas Fee</span>
              <span>${gasFee.toFixed(2)}</span>
            </div>
            <div className="fee-item">
              <span>Service Fee (2%)</span>
              <span>${serviceFee.toFixed(2)}</span>
            </div>
            <div className="fee-item total">
              <span>Total Cost</span>
              <span>${totalCost.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="wallet-info">
            <h3>Wallet Information</h3>
            {isConnected ? (
              <div>
                <p>Connected Wallet: {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}</p>
              </div>
            ) : (
              <p>You need to connect your wallet to continue</p>
            )}
          </div>
          
          <button 
            onClick={handleContinue}
            disabled={!tokenAmount || tokenAmount <= 0}
            className="continue-button"
          >
            Continue to Payment
          </button>
        </div>
      ) : (
        <div className="payment-form-container">
          <h1>Complete Payment</h1>
          <p>Please enter your payment information below</p>
          
          {clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm amount={totalCost} walletAddress={walletAddress} />
            </Elements>
          )}
          
          <button 
            onClick={() => setShowPaymentForm(false)}
            className="back-button"
          >
            Back to Token Selection
          </button>
        </div>
      )}
    </div>
  );
}