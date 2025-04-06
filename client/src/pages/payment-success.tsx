import { useState, useEffect } from 'react';
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
      <div className="payment-success-page loading">
        <div className="loading-spinner"></div>
        <h2>Processing your payment...</h2>
        <p>Please wait while we process your transaction</p>
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="payment-success-page failed">
        <div className="error-icon">❌</div>
        <h1>Payment Failed</h1>
        <p>{paymentDetails?.error || 'An error occurred during payment processing.'}</p>
        <div className="actions">
          <button onClick={handleGoToBuyMore} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-success-page success">
      <div className="success-icon">✅</div>
      <h1>Payment Successful</h1>
      <p>Your token purchase has been completed successfully!</p>
      
      <div className="payment-details">
        <div className="detail-item">
          <span>Amount Paid:</span>
          <span>${((paymentDetails?.amount || 0) / 100).toFixed(2)} USD</span>
        </div>
        <div className="detail-item highlight">
          <span>Tokens Purchased:</span>
          <span>{paymentDetails?.tokenAmount || '0'} NPT</span>
        </div>
        <div className="detail-item">
          <span>Wallet Address:</span>
          <span>{formatWalletAddress(paymentDetails?.walletAddress || '')}</span>
        </div>
        {paymentDetails?.txHash && (
          <div className="detail-item">
            <span>Transaction Hash:</span>
            <span title={paymentDetails.txHash}>{formatTxHash(paymentDetails.txHash)}</span>
          </div>
        )}
      </div>
      
      <div className="actions">
        <button onClick={handleGoToWallet} className="primary-button">
          View My Wallet
        </button>
        <button onClick={handleGoToBuyMore} className="secondary-button">
          Buy More Tokens
        </button>
      </div>
    </div>
  );
}