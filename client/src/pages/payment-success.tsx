import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function PaymentSuccessPage() {
  const [location, setLocation] = useLocation();
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'succeeded' | 'failed'>('loading');
  const [paymentDetails, setPaymentDetails] = useState<{
    id: string;
    amount: number;
    tokenAmount: string;
    walletAddress: string;
    txHash?: string;
    error?: string;
  } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function getPaymentStatus() {
      try {
        // Get payment intent ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const paymentIntentId = urlParams.get('payment_intent');
        const redirectStatus = urlParams.get('redirect_status');
        
        if (!paymentIntentId) {
          setPaymentStatus('failed');
          toast({
            title: 'Error',
            description: 'Payment information not found',
            variant: 'destructive',
          });
          return;
        }

        // If redirect status is failed, update payment status
        if (redirectStatus === 'failed') {
          setPaymentStatus('failed');
          setPaymentDetails({
            id: paymentIntentId,
            amount: 0,
            tokenAmount: '0',
            walletAddress: '',
            error: 'Payment was not completed successfully',
          });
          return;
        }

        // Fetch payment details from the server
        const response = await apiRequest('GET', `/api/payment/${paymentIntentId}`);
        const data = await response.json();

        if (data.status === 'succeeded') {
          setPaymentStatus('succeeded');
          setPaymentDetails({
            id: data.id,
            amount: data.amount,
            tokenAmount: data.tokenAmount,
            walletAddress: data.walletAddress,
            txHash: data.txHash,
          });
          
          toast({
            title: 'Payment Successful',
            description: `You have successfully purchased ${data.tokenAmount} NPT tokens!`,
            variant: 'default',
          });
        } else {
          setPaymentStatus('failed');
          setPaymentDetails({
            id: data.id,
            amount: data.amount || 0,
            tokenAmount: data.tokenAmount || '0',
            walletAddress: data.walletAddress || '',
            error: data.error || 'An error occurred processing your payment',
          });
          
          toast({
            title: 'Payment Failed',
            description: data.error || 'An error occurred processing your payment',
            variant: 'destructive',
          });
        }
      } catch (error) {
        setPaymentStatus('failed');
        toast({
          title: 'Error',
          description: 'Could not retrieve payment information',
          variant: 'destructive',
        });
      }
    }

    getPaymentStatus();
  }, [toast]);

  const formatWalletAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTxHash = (hash: string) => {
    if (!hash) return '';
    return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
  };
  
  const handleGoToWallet = () => {
    setLocation('/wallet');
  };

  const handleGoToBuyMore = () => {
    setLocation('/buy-tokens');
  };

  if (paymentStatus === 'loading') {
    return (
      <div className="min-h-screen p-6 flex flex-col items-center justify-center bg-background relative overflow-hidden">
        {/* Animated background gradients */}
        <div className="absolute inset-0 bg-background-dark z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-3/4 h-3/4 bg-gradient-to-tl from-secondary/5 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute top-1/4 left-1/3 w-1/2 h-1/2 bg-gradient-to-br from-accent/5 to-transparent rounded-full blur-3xl"></div>
        </div>
        
        <div className="gradient-border w-full max-w-md z-10">
          <div className="glass-card p-8 flex flex-col items-center">
            <div className="w-16 h-16 mb-6 relative">
              <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold text-text-color mb-3">Processing your payment...</h2>
            <p className="text-text-muted text-center">Please wait while we process your transaction</p>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="min-h-screen p-6 flex flex-col items-center justify-center bg-background relative overflow-hidden">
        {/* Animated background gradients */}
        <div className="absolute inset-0 bg-background-dark z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-3/4 h-3/4 bg-gradient-to-tl from-secondary/5 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute top-1/4 left-1/3 w-1/2 h-1/2 bg-gradient-to-br from-accent/5 to-transparent rounded-full blur-3xl"></div>
        </div>
        
        <div className="gradient-border w-full max-w-md z-10">
          <div className="glass-card p-8 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-danger-light/10 flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-danger-light">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-text-color mb-3">Payment Failed</h1>
            <p className="text-text-muted text-center mb-8">{paymentDetails?.error || 'An error occurred during payment processing.'}</p>
            <button 
              onClick={handleGoToBuyMore} 
              className="w-full px-8 py-4 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-lg relative overflow-hidden shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 bg-background-dark z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-3/4 h-3/4 bg-gradient-to-tl from-secondary/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 left-1/3 w-1/2 h-1/2 bg-gradient-to-br from-accent/5 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="gradient-border w-full max-w-lg z-10">
        <div className="glass-card p-8 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-success-light/10 flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-success-light">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-light to-secondary mb-3">
            Payment Successful
          </h1>
          <p className="text-text-muted text-center mb-8">Your token purchase has been completed successfully!</p>
          
          <div className="w-full bg-glass-bg-light backdrop-blur-md rounded-lg border border-border-light p-5 mb-8">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Amount Paid:</span>
                <span className="text-text-color font-medium">${((paymentDetails?.amount || 0) / 100).toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 bg-primary/5 rounded-md">
                <span className="text-text-color font-medium">Tokens Purchased:</span>
                <span className="text-primary font-bold">{paymentDetails?.tokenAmount || '0'} NPT</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Wallet Address:</span>
                <span className="text-text-color font-medium">{formatWalletAddress(paymentDetails?.walletAddress || '')}</span>
              </div>
              {paymentDetails?.txHash && (
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Transaction Hash:</span>
                  <span className="text-text-color font-medium" title={paymentDetails.txHash}>
                    {formatTxHash(paymentDetails.txHash)}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex w-full gap-4">
            <button 
              onClick={handleGoToWallet} 
              className="flex-1 px-8 py-4 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-lg relative overflow-hidden shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1"
            >
              View My Wallet
            </button>
            <button 
              onClick={handleGoToBuyMore} 
              className="flex-1 px-8 py-4 bg-glass-bg-light border border-border-light text-text-color font-medium rounded-lg hover:bg-border-light/10 transition-all hover:-translate-y-1"
            >
              Buy More Tokens
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}