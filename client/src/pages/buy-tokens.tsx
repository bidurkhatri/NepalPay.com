import { useState, useEffect } from 'react';
import { 
  useStripe, 
  useElements, 
  PaymentElement,
  Elements
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWallet } from '@/contexts/wallet-context';
import { useBlockchain } from '@/contexts/blockchain-context';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import { Label } from '@/components/ui/label';

// Make sure to call loadStripe outside of a component's render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function CheckoutForm({ amount }: { amount: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const result = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard?payment_success=true`,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (result.error) {
      if (result.error.type === "card_error" || result.error.type === "validation_error") {
        toast({
          title: "Payment Failed",
          description: result.error.message || "Something went wrong with your payment",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <PaymentElement id="payment-element" options={{
        layout: {
          type: 'tabs',
          defaultCollapsed: false,
        }
      }} />
      
      <CardFooter className="px-0 pt-4">
        <Button 
          disabled={isLoading || !stripe || !elements} 
          type="submit"
          className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-500"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            `Buy NPT Tokens Now`
          )}
        </Button>
      </CardFooter>
    </form>
  );
}

export default function BuyTokensPage() {
  const [clientSecret, setClientSecret] = useState<string>("");
  const [amount, setAmount] = useState<number>(50);
  const [tokens, setTokens] = useState<number>(100);
  const { toast } = useToast();
  const { nptBalance } = useBlockchain();
  const [step, setStep] = useState<'select' | 'payment'>('select');

  // Calculate token amount based on price ($0.50 per token)
  useEffect(() => {
    // Calculate tokens at $0.50 per token
    setTokens(amount * 2);
  }, [amount]);

  const createPaymentIntent = async () => {
    try {
      const response = await apiRequest('POST', '/api/create-payment-intent', { amount });
      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);
      setStep('payment');
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not create payment intent. Please try again.",
        variant: "destructive",
      });
    }
  };

  const appearance = {
    theme: 'night',
    variables: {
      colorPrimary: '#8a2be2',
      colorBackground: '#000000',
      colorText: '#ffffff',
      colorDanger: '#ff5555',
      fontFamily: 'Poppins, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen relative">
      <Sidebar />
      
      <main className="flex-1 flex flex-col pb-16 md:pb-0">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col space-y-8 max-w-3xl mx-auto">
            <div className="flex flex-col space-y-2">
              <h1 className="text-3xl font-bold text-white">Buy NPT Tokens</h1>
              <p className="text-gray-400">
                Purchase NPT tokens with your credit card to use in the NepaliPay ecosystem
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-black/40 border-primary/20 text-white md:col-span-2">
                <CardHeader>
                  <CardTitle>
                    {step === 'select' ? 'Select Token Amount' : 'Complete Payment'}
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    {step === 'select' 
                      ? 'Choose how many NPT tokens you want to purchase' 
                      : 'Enter your payment details to complete the purchase'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {step === 'select' ? (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="amount" className="text-white">Amount in USD</Label>
                        <div className="flex space-x-2">
                          <Input
                            id="amount"
                            type="number"
                            value={amount}
                            min={5}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="bg-black/30 border-primary/30 text-white"
                          />
                          <Button 
                            variant="outline" 
                            className="border-primary/50 text-white bg-primary/10"
                            onClick={() => setAmount(amount + 10)}
                          >
                            +10
                          </Button>
                          <Button 
                            variant="outline" 
                            className="border-primary/50 text-white bg-primary/10"
                            onClick={() => setAmount(amount + 50)}
                          >
                            +50
                          </Button>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 p-4 rounded-lg border border-primary/20">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white/70">Token Price:</span>
                          <span className="text-white">$0.50 USD</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white/70">You Pay:</span>
                          <span className="text-white">${amount.toFixed(2)} USD</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-primary/20">
                          <span className="text-white/70">You Receive:</span>
                          <span className="text-xl font-semibold text-primary">{tokens} NPT</span>
                        </div>
                      </div>

                      <Button 
                        onClick={createPaymentIntent}
                        className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-500"
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  ) : (
                    clientSecret && (
                      <Elements stripe={stripePromise} options={{ 
                        clientSecret,
                        appearance: appearance as any
                      }}>
                        <CheckoutForm amount={amount} />
                      </Elements>
                    )
                  )}
                </CardContent>
              </Card>

              <div className="md:col-span-1">
                <Card className="bg-black/40 border-primary/20 text-white sticky top-4">
                  <CardHeader>
                    <CardTitle>Your NPT Balance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary mb-2">
                      {nptBalance} NPT
                    </div>
                    <p className="text-white/70 text-sm">
                      NPT tokens can be used for transfers, payments, staking, and other activities in the NepaliPay ecosystem.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 border-primary/20 text-white mt-6">
                  <CardHeader>
                    <CardTitle>Why Buy NPT?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>Fee-free international transfers between NPT holders</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>Earn rewards through staking</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>Participate in governance decisions</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>Access special features like loans and crowdfunding</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}