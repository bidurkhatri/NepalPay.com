import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const purchaseSchema = z.object({
  amount: z.string().min(1, { message: 'Amount is required' }),
  walletAddress: z.string().min(1, { message: 'Wallet address is required' }),
});

type PurchaseFormValues = z.infer<typeof purchaseSchema>;

// Make sure to call loadStripe outside of a component
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Payment form component that uses Stripe Elements
const CheckoutForm = ({ amount }: { amount: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: `You have purchased ${amount} NPT tokens!`,
      });
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button 
        type="submit" 
        className="w-full gradient-button mt-6" 
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? "Processing..." : "Pay Now"}
      </Button>
    </form>
  );
};

const PurchaseTokensPage: React.FC = () => {
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [purchaseAmount, setPurchaseAmount] = useState<string>("");
  
  const form = useForm<PurchaseFormValues>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      amount: '',
      walletAddress: '',
    },
  });

  const onSubmit = async (data: PurchaseFormValues) => {
    try {
      // Convert amount to cents for Stripe
      const amountInUSD = parseFloat(data.amount) * 100;
      
      // Create a payment intent
      const response = await apiRequest("POST", "/api/create-payment-intent", {
        amount: amountInUSD,
        walletAddress: data.walletAddress
      });
      
      const responseData = await response.json();
      
      if (responseData.clientSecret) {
        setClientSecret(responseData.clientSecret);
        setPurchaseAmount(data.amount);
        toast({
          title: 'Ready for Payment',
          description: 'Please complete your payment to receive NPT tokens',
        });
      } else {
        throw new Error('Failed to initialize payment');
      }
    } catch (error) {
      toast({
        title: 'Payment Setup Failed',
        description: 'Could not initialize payment. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">Purchase NPT Tokens</h1>
        <p className="text-muted-foreground">Buy NPT tokens with your credit or debit card</p>
      </div>
      
      <div className="grid gap-6">
        {!clientSecret ? (
          <Card className="bg-black/40 backdrop-blur-md border-primary/20">
            <CardHeader>
              <CardTitle>Purchase Details</CardTitle>
              <CardDescription>Enter the amount of NPT tokens you want to purchase</CardDescription>
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
                          <Input 
                            type="number" 
                            min="1" 
                            step="1" 
                            placeholder="0" 
                            className="bg-background/50" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="walletAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Wallet Address</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="0x..." 
                            className="bg-background/50" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full gradient-button"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? 'Processing...' : 'Continue to Payment'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-black/40 backdrop-blur-md border-primary/20">
            <CardHeader>
              <CardTitle>Complete Your Payment</CardTitle>
              <CardDescription>You are purchasing {purchaseAmount} NPT tokens</CardDescription>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm amount={purchaseAmount} />
              </Elements>
            </CardContent>
          </Card>
        )}
        
        <Card className="bg-black/40 backdrop-blur-md border-primary/20">
          <CardHeader>
            <CardTitle>Token Information</CardTitle>
            <CardDescription>About NPT tokens</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">What are NPT tokens?</h3>
                <p className="text-sm text-muted-foreground">NPT tokens are the native cryptocurrency of the NepaliPay platform. Each NPT is pegged to 1 NPR (Nepalese Rupee).</p>
              </div>
              <div>
                <h3 className="font-medium">Token Utility</h3>
                <p className="text-sm text-muted-foreground">NPT tokens can be used for payments, transfers, loans, and other financial services within the NepaliPay ecosystem.</p>
              </div>
              <div>
                <h3 className="font-medium">Security</h3>
                <p className="text-sm text-muted-foreground">NPT tokens are secured by blockchain technology running on the Binance Smart Chain.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PurchaseTokensPage;