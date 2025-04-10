import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRealTime } from '@/contexts/real-time-context';
import { useBlockchain } from '@/contexts/blockchain-context';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import {
  CreditCard,
  DollarSign,
  ArrowRight,
  Wallet,
  Info,
  Shield,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Make sure STRIPE_PUBLIC_KEY is available
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  console.error('Missing required environment variable: VITE_STRIPE_PUBLIC_KEY');
}

// Initialize Stripe outside of component render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

// Form validation schema
const formSchema = z.object({
  amount: z.string()
    .min(1, { message: 'Please enter an amount' })
    .refine((val) => !isNaN(Number(val)), { 
      message: 'Amount must be a number' 
    })
    .refine((val) => Number(val) >= 100, { 
      message: 'Minimum purchase amount is 100 NPT' 
    }),
  paymentMethod: z.enum(['card', 'bank'], {
    required_error: 'Please select a payment method',
  }),
});

type FormData = z.infer<typeof formSchema>;

const CheckoutForm = ({ 
  clientSecret, 
  amount, 
  walletAddress 
}: { 
  clientSecret: string, 
  amount: string, 
  walletAddress: string | null 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const { sendMessage } = useRealTime();
  const { 
    account, 
    isConnected, 
    connectWallet 
  } = useBlockchain();
  
  // Check if wallet is connected
  useEffect(() => {
    if (!isConnected && !isProcessing) {
      // Prompt user to connect wallet if not already connected
      toast({
        title: 'Connect Wallet',
        description: 'Please connect your wallet to receive tokens after payment',
        action: (
          <Button size="sm" variant="outline" onClick={connectWallet}>
            Connect
          </Button>
        ),
      });
    }
  }, [isConnected, isProcessing, connectWallet, toast]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    if (!isConnected || !account) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet to receive tokens',
        variant: 'destructive',
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
        confirmParams: {
          return_url: `${window.location.origin}/dashboard`,
        },
      });
      
      if (error) {
        toast({
          title: 'Payment Failed',
          description: error.message || 'An error occurred during payment processing',
          variant: 'destructive',
        });
        
        // Notify via WebSocket
        sendMessage({
          type: 'payment_failed',
          data: {
            amount,
            error: error.message,
          }
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment successful, now transfer tokens from treasury
        try {
          // Record the successful payment in the database
          await apiRequest('POST', '/api/token-purchase-success', {
            amount,
            paymentIntentId: paymentIntent.id,
            walletAddress: account,
          });
          
          // Notify via WebSocket for real-time updates
          sendMessage({
            type: 'payment_succeeded',
            data: {
              amount,
              walletAddress: account,
              txId: paymentIntent.id,
            }
          });
          
          toast({
            title: 'Payment Successful',
            description: `You've successfully purchased ${amount} NPT tokens!`,
          });
          
          window.location.href = '/dashboard';
        } catch (transferError: any) {
          console.error('Token transfer error:', transferError);
          toast({
            title: 'Payment Succeeded, Token Transfer Pending',
            description: 'Your payment was successful, but token transfer is still processing. Tokens will be sent to your wallet soon.',
            variant: 'default',
          });
        }
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      <div className="pt-4">
        <Button 
          type="submit" 
          disabled={!stripe || isProcessing} 
          className="w-full"
        >
          {isProcessing ? 'Processing...' : `Pay and Purchase ${amount} NPT`}
        </Button>
      </div>
      
      <div className="text-xs text-muted-foreground flex items-start space-x-2">
        <Shield className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <p>Your payment information is securely processed by Stripe. NepaliPay does not store your card details.</p>
      </div>
    </form>
  );
};

const PurchaseTokensPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    isConnected, 
    getTokenPrice, 
    tokenPrice, 
    calculateFiatAmount,
    feeStructure,
    account
  } = useBlockchain();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [purchaseAmount, setPurchaseAmount] = useState<string>('');
  const [realTimePrice, setRealTimePrice] = useState<{
    nptAmount: number;
    fiatAmount: number;
    fiatCurrency: string;
    exchangeRate: number;
    fees: number;
    total: number;
  }>({
    nptAmount: 0,
    fiatAmount: 0,
    fiatCurrency: 'NPR',
    exchangeRate: 1, // 1 NPT = 1 NPR
    fees: 0,
    total: 0,
  });
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: '',
      paymentMethod: 'card',
    },
  });
  
  const onSubmit = async (data: FormData) => {
    try {
      // Create payment intent on the server
      const response = await apiRequest('POST', '/api/create-payment-intent', {
        amount: Number(data.amount),
        currency: 'npr',
        paymentMethod: data.paymentMethod,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create payment intent');
      }
      
      const { clientSecret: secret } = await response.json();
      setClientSecret(secret);
      setPurchaseAmount(data.amount);
      
      toast({
        title: 'Ready for Payment',
        description: `Please complete your purchase of ${data.amount} NPT`,
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to create payment intent',
        variant: 'destructive',
      });
    }
  };

  // Get token prices from blockchain when component mounts
  useEffect(() => {
    if (isConnected) {
      getTokenPrice();
    }
  }, [isConnected]);

  // Calculate price in real-time when amount changes
  useEffect(() => {
    const amount = form.watch('amount');
    const paymentMethod = form.watch('paymentMethod');
    
    console.log("Price calculation inputs:", { 
      amount, 
      paymentMethod, 
      tokenPrice, 
      feeStructure, 
      isConnected,
      hasTokenContract: !!tokenContract,
      hasPriceFunction: tokenContract && typeof tokenContract.getTokenPrice === 'function'
    });
    
    if (amount && !isNaN(Number(amount)) && Number(amount) > 0) {
      try {
        // First try to use real smart contract functions, even in demo mode
        if (tokenContract && typeof tokenContract.getExchangeRate === 'function') {
          console.log("Using real smart contract for price calculations");
          
          // Use fee from smart contract, adjusted for payment method
          // Smart contract's purchaseFee is the base fee
          // Add a small additional fee for card payments
          const feePercentage = paymentMethod === 'card' 
            ? (feeStructure.purchaseFee + 0.01) || 0.02 // Card payment adds 1% extra
            : feeStructure.purchaseFee || 0.01;         // Base fee for bank transfers
          
          console.log("Using fee percentage from contract:", feePercentage);
          
          // Get token amount using smart contract exchange rate
          const nptAmount = Number(amount);
          
          // Convert to fiat amount using the exchange rate from smart contract
          // When purchasing, users pay in fiat, so we need to calculate how much NPT they'll get
          const fiatAmount = calculateFiatAmount(nptAmount, 'NPR');
          console.log("Calculated fiat amount from contract:", fiatAmount);
          
          // If fiat amount is still 0, use direct conversion as fallback
          const finalFiatAmount = fiatAmount > 0 ? fiatAmount : nptAmount;
          
          // Calculate processing fee using the smart contract's fee structure
          const fees = finalFiatAmount * feePercentage;
          
          // Calculate total (fiat amount + fees)
          const total = finalFiatAmount + fees;
          
          // Set real-time price data using blockchain values
          setRealTimePrice({
            nptAmount,
            fiatAmount: finalFiatAmount,
            fiatCurrency: 'NPR',
            exchangeRate: tokenPrice.nprRate || 1,
            fees,
            total
          });
          
          console.log("Real smart contract calculation results:", {
            nptAmount,
            fiatAmount: finalFiatAmount,
            feePercentage,
            fees,
            total,
            exchangeRate: tokenPrice.nprRate || 1
          });
        } else {
          // Fallback if contract isn't available
          console.log("Smart contract not available, using fallback calculations");
          const nptAmount = Number(amount);
          const fiatAmount = nptAmount; // 1:1 rate for NPR as fallback
          const feePercentage = 0.02; // 2% fee as fallback
          const fees = fiatAmount * feePercentage;
          const total = fiatAmount + fees;
          
          console.log("Fallback price calculation results:", {
            nptAmount,
            fiatAmount,
            feePercentage,
            fees,
            total
          });
          
          setRealTimePrice({
            nptAmount,
            fiatAmount,
            fiatCurrency: 'NPR',
            exchangeRate: 1,
            fees,
            total
          });
        }
      } catch (error) {
        console.error("Error calculating token prices:", error);
        
        // Fallback calculation on error
        const nptAmount = Number(amount);
        const fiatAmount = nptAmount; // 1:1 rate for NPR as fallback on error
        const feePercentage = 0.02; // 2% fee as fallback
        const fees = fiatAmount * feePercentage;
        const total = fiatAmount + fees;
        
        // Current exchange rate from smart contract
        const currentRate = tokenPrice.nprRate || 1;
        
        console.log("Error handler price calculation results:", {
          nptAmount,
          fiatAmount,
          feePercentage,
          fees,
          total,
          currentRate
        });
        
        setRealTimePrice({
          nptAmount,
          fiatAmount,
          fiatCurrency: 'NPR',
          exchangeRate: currentRate,
          fees,
          total
        });
      }
    } else {
      console.log("Invalid amount input, setting zeros");
      setRealTimePrice({
        nptAmount: 0,
        fiatAmount: 0,
        fiatCurrency: 'NPR',
        exchangeRate: tokenPrice.nprRate || 1,
        fees: 0,
        total: 0
      });
    }
  }, [form.watch('amount'), form.watch('paymentMethod'), tokenPrice, feeStructure, calculateFiatAmount, isConnected]);

  return (
    <div className="py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Purchase NPT Tokens</h1>
        <p className="text-muted-foreground">
          Buy NPT tokens using credit card or bank transfer
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          {!clientSecret ? (
            <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
              <CardHeader>
                <CardTitle>Token Purchase</CardTitle>
                <CardDescription>Buy NPT tokens with card or bank transfer</CardDescription>
              </CardHeader>
              
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount (NPT)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                              <Input
                                placeholder="Enter amount"
                                className="pl-10"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            1 NPT = 1 NPR (Nepalese Rupee)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Real-time price calculation display */}
                    {realTimePrice.nptAmount > 0 && (
                      <div className="rounded-md bg-primary/5 p-3 space-y-2 border border-primary/10">
                        <h4 className="text-sm font-medium">Real-time Calculation</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-muted-foreground">NPT Amount:</div>
                          <div className="text-right font-medium">{realTimePrice.nptAmount.toFixed(2)} NPT</div>
                          
                          <div className="text-muted-foreground">In Fiat:</div>
                          <div className="text-right font-medium">{realTimePrice.fiatAmount.toFixed(2)} {realTimePrice.fiatCurrency}</div>
                          
                          <div className="text-muted-foreground">Processing Fee:</div>
                          <div className="text-right font-medium">{realTimePrice.fees.toFixed(2)} {realTimePrice.fiatCurrency}</div>
                          
                          <div className="text-muted-foreground">Total Payment:</div>
                          <div className="text-right font-medium">{realTimePrice.total.toFixed(2)} {realTimePrice.fiatCurrency}</div>
                        </div>
                      </div>
                    )}
                    
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Method</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select payment method" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="card">
                                <div className="flex items-center">
                                  <CreditCard className="mr-2 h-4 w-4" />
                                  <span>Credit/Debit Card</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="bank">
                                <div className="flex items-center">
                                  <Wallet className="mr-2 h-4 w-4" />
                                  <span>Bank Transfer</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full">
                      Continue to Payment <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
              <CardHeader>
                <CardTitle>Complete Your Payment</CardTitle>
                <CardDescription>Purchasing {purchaseAmount} NPT tokens</CardDescription>
              </CardHeader>
              
              <CardContent>
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm 
                    clientSecret={clientSecret} 
                    amount={purchaseAmount} 
                    walletAddress={account} 
                  />
                </Elements>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Info Section */}
        <div className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="mr-2 h-5 w-5 text-primary" />
                About NPT Tokens
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">What are NPT Tokens?</h3>
                <p className="text-sm text-muted-foreground">
                  NPT (NepaliPay Token) is a stablecoin pegged to the Nepalese Rupee (NPR). Each NPT token is worth exactly 1 NPR.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Token Details</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex justify-between">
                    <span>Token Name:</span>
                    <span className="font-medium">NepaliPay Token (NPT)</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Blockchain:</span>
                    <span className="font-medium">Binance Smart Chain</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Price:</span>
                    <span className="font-medium">1 NPT = 1 NPR</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Minimum Purchase:</span>
                    <span className="font-medium">100 NPT</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">What can you do with NPT?</h3>
                <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                  <li>Send money instantly to anyone in Nepal</li>
                  <li>Pay utility bills and merchant payments</li>
                  <li>Apply for micro-loans and earn interest</li>
                  <li>Participate in the NepaliPay ecosystem</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Fee Structure</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex justify-between">
                    <span>Purchase Fee:</span>
                    <span className="font-medium">{(feeStructure.purchaseFee * 100).toFixed(2)}%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Transfer Fee:</span>
                    <span className="font-medium">{(feeStructure.transferFee * 100).toFixed(2)}%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Payment Fee:</span>
                    <span className="font-medium">{(feeStructure.paymentFee * 100).toFixed(2)}%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Withdrawal Fee:</span>
                    <span className="font-medium">{(feeStructure.withdrawalFee * 100).toFixed(2)}%</span>
                  </li>
                </ul>
                <p className="text-xs text-muted-foreground mt-2">
                  Fees are retrieved directly from the smart contract and may change based on market conditions.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-primary" />
                Security Guarantee
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm text-muted-foreground">
                All purchases are protected with enterprise-grade security. Transactions are securely processed through Stripe and recorded on the blockchain for complete transparency.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PurchaseTokensPage;