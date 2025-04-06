import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ExternalLink, ChevronLeft } from 'lucide-react';

const PaymentSuccessPage: React.FC = () => {
  const [location] = useLocation();
  const [paymentDetails, setPaymentDetails] = useState<{
    payment_intent: string;
    payment_intent_client_secret: string;
    redirect_status: string;
  } | null>(null);
  
  // Parse URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentIntent = params.get('payment_intent');
    const paymentIntentClientSecret = params.get('payment_intent_client_secret');
    const redirectStatus = params.get('redirect_status');
    
    if (paymentIntent && paymentIntentClientSecret && redirectStatus) {
      setPaymentDetails({
        payment_intent: paymentIntent,
        payment_intent_client_secret: paymentIntentClientSecret,
        redirect_status: redirectStatus
      });
    }
  }, [location]);
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-green-500 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Your payment has been successfully processed. Tokens will be transferred to your wallet shortly.
        </p>
      </div>
      
      <Card className="cyber-card border-primary/20 bg-gradient-to-br from-gray-900 to-gray-950 shadow-lg mb-8">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Transaction Complete</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="glass-card p-4 rounded-lg bg-green-900/20 border border-green-700/30">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              <p className="text-green-400">
                Your purchase has been confirmed and tokens are being transferred to your wallet.
              </p>
            </div>
          </div>
          
          {paymentDetails && (
            <div className="glass-card p-4 rounded-lg bg-gray-900/50 border border-gray-800">
              <h3 className="text-white font-medium mb-2">Payment Details</h3>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex justify-between py-1 border-b border-gray-800">
                  <span className="text-gray-400">Payment ID:</span>
                  <span className="text-white font-mono">{paymentDetails.payment_intent}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-800">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-green-400 uppercase">{paymentDetails.redirect_status}</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="glass-card p-4 rounded-lg bg-blue-900/20 border border-blue-700/30">
            <h3 className="text-white font-medium mb-2">What happens next?</h3>
            <ul className="text-gray-300 space-y-2 pl-6 list-disc">
              <li>Your transaction is being processed on the blockchain</li>
              <li>Tokens will be transferred to your wallet automatically</li>
              <li>You'll receive a notification when the tokens arrive</li>
              <li>This process usually takes 1-2 minutes to complete</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
          <Button
            asChild
            className="w-full md:w-auto bg-gradient-to-r from-primary to-blue-600"
          >
            <Link href="/sections">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Return to Dashboard
            </Link>
          </Button>
          
          <Button 
            asChild
            variant="outline" 
            className="w-full md:w-auto border-gray-700"
          >
            <Link href="/buy-tokens">
              Buy More Tokens
            </Link>
          </Button>
          
          {paymentDetails && (
            <Button
              variant="ghost"
              className="w-full md:w-auto text-gray-400 hover:text-white"
              onClick={() => {
                window.open(`https://dashboard.stripe.com/test/payments/${paymentDetails.payment_intent}`, '_blank');
              }}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              View Payment Details
            </Button>
          )}
        </CardFooter>
      </Card>
      
      <div className="text-center text-sm text-gray-500">
        <p>Having issues? Please contact support at support@nepalipay.com</p>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;