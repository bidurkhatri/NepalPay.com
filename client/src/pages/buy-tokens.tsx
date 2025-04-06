import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '@/contexts/auth-context';
import { useBlockchain } from '@/contexts/blockchain-context';
import { useWallet } from '@/contexts/wallet-context';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  CreditCard, 
  DollarSign, 
  AlertCircle, 
  CheckCircle, 
  ChevronLeft, 
  AlertTriangle,
  Loader2,
  ExternalLink,
  Copy
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Link } from 'wouter';

// Make sure the Stripe public key is loaded from environment variables
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  console.error("Missing Stripe public key. Payments will not work.");
}

// Predefined token amounts for easy selection
const TOKEN_PACKAGES = [
  { amount: 100, label: '100 NPT', priceNPR: 10000 },
  { amount: 500, label: '500 NPT', priceNPR: 50000 },
  { amount: 1000, label: '1,000 NPT', priceNPR: 100000 },
  { amount: 5000, label: '5,000 NPT', priceNPR: 500000 },
  { amount: 10000, label: '10,000 NPT', priceNPR: 1000000 },
];

// Conversion rate: 1 NPT = 100 NPR
const NPT_TO_NPR_RATE = 100;

const BuyTokensPage: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { userAddress, isConnected } = useBlockchain();
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [tokenAmount, setTokenAmount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [customWalletAddress, setCustomWalletAddress] = useState<string>(userAddress || '');
  const [paymentError, setPaymentError] = useState<string>('');
  const [customAddressEnabled, setCustomAddressEnabled] = useState<boolean>(false);
  
  // Set the token amount when a package is selected
  useEffect(() => {
    if (selectedPackage !== null) {
      setTokenAmount(TOKEN_PACKAGES[selectedPackage].amount);
      setCustomAmount(TOKEN_PACKAGES[selectedPackage].amount.toString());
    }
  }, [selectedPackage]);
  
  // Update token amount when custom amount changes
  useEffect(() => {
    if (customAmount && selectedPackage === null) {
      const amount = parseFloat(customAmount);
      if (!isNaN(amount)) {
        setTokenAmount(amount);
      } else {
        setTokenAmount(0);
      }
    }
  }, [customAmount, selectedPackage]);
  
  // Format NPR price for display
  const formatNPR = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Calculate the price in NPR
  const calculatePrice = (tokenAmount: number) => {
    return tokenAmount * NPT_TO_NPR_RATE;
  };

  // Copy wallet address to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Wallet address copied to clipboard",
      duration: 2000,
    });
  };
  
  // Fee breakdown state
  const [feeBreakdown, setFeeBreakdown] = useState<{
    tokenAmount: number;
    tokenPriceUSD: string;
    gasFeeUSD: string;
    serviceFeeUSD: string;
    totalUSD: string;
  } | null>(null);

  // Initiate Stripe payment process
  const handlePurchase = async () => {
    if (tokenAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid token amount",
        variant: "destructive",
      });
      return;
    }
    
    // Validate wallet address (if using custom one)
    const effectiveWalletAddress = customAddressEnabled ? customWalletAddress : userAddress;
    
    if (!effectiveWalletAddress || !/^0x[a-fA-F0-9]{40}$/.test(effectiveWalletAddress)) {
      toast({
        title: "Invalid wallet address",
        description: "Please connect your wallet or enter a valid wallet address",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    setPaymentStatus('processing');
    setPaymentError('');
    setFeeBreakdown(null);
    
    try {
      // Create payment intent on the server
      const response = await apiRequest("POST", "/api/create-payment-intent", {
        tokenAmount,
        walletAddress: effectiveWalletAddress,
        userId: user?.id,
      });
      
      if (!response.ok) {
        throw new Error("Failed to create payment. Please try again.");
      }
      
      const data = await response.json();
      
      // Store fee breakdown for display
      if (data.breakdown) {
        setFeeBreakdown(data.breakdown);
      }
      
      // Load Stripe and redirect to checkout
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
      
      if (!stripe) {
        throw new Error("Stripe failed to load. Please try again.");
      }
      
      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentStatus('error');
      setPaymentError(error.message || 'An error occurred during payment processing');
      toast({
        title: "Payment error",
        description: error.message || "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <Link href="/sections" className="flex items-center text-primary hover:underline mb-2">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Sections
        </Link>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500 mb-2">
          Purchase NPT Tokens
        </h1>
        <p className="text-gray-400">
          Buy NPT tokens using your credit card or bank account. Tokens will be transferred directly to your connected wallet.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Purchase Form */}
        <div className="md:col-span-2">
          <Card className="cyber-card border-primary/20 bg-gradient-to-br from-gray-900 to-gray-950 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Select Token Amount</CardTitle>
              <CardDescription>
                Choose a predefined package or enter a custom amount
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {/* Predefined Packages */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
                {TOKEN_PACKAGES.map((pkg, index) => (
                  <button
                    key={index}
                    className={`glass-card p-4 rounded-xl transition-all ${
                      selectedPackage === index 
                        ? 'border-2 border-primary bg-primary/10' 
                        : 'border border-gray-800 hover:border-primary/50'
                    }`}
                    onClick={() => {
                      setSelectedPackage(index);
                      setCustomAmount('');
                    }}
                  >
                    <div className="text-lg font-bold text-white">{pkg.label}</div>
                    <div className="text-sm text-primary">{formatNPR(pkg.priceNPR)}</div>
                  </button>
                ))}
              </div>
              
              {/* Custom Amount */}
              <div className="mb-6">
                <Label htmlFor="customAmount" className="text-white mb-2 block">
                  Or enter custom amount
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-500" />
                  </div>
                  <Input
                    id="customAmount"
                    type="number"
                    min="1"
                    placeholder="Enter token amount"
                    className="pl-10 bg-gray-900 border-gray-700 text-white"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedPackage(null);
                    }}
                  />
                </div>
                <div className="mt-2 text-sm text-gray-400">
                  Approximate cost: {formatNPR(calculatePrice(parseFloat(customAmount) || 0))}
                </div>
              </div>
              
              {/* Wallet Address Section */}
              <div className="mb-6 glass-card p-4 rounded-xl border border-gray-800 bg-gray-900/50">
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-white font-medium">Wallet Address for Tokens</Label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="useCustomAddress"
                      className="mr-2"
                      checked={customAddressEnabled}
                      onChange={() => setCustomAddressEnabled(!customAddressEnabled)}
                    />
                    <Label htmlFor="useCustomAddress" className="text-sm text-gray-400 cursor-pointer">
                      Use custom address
                    </Label>
                  </div>
                </div>
                
                {!customAddressEnabled ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`flex-1 text-${userAddress ? 'white' : 'red-400'} font-mono text-sm truncate max-w-md`}>
                        {userAddress || 'No wallet connected'}
                      </div>
                      {userAddress && (
                        <button 
                          onClick={() => copyToClipboard(userAddress)}
                          className="ml-2 p-1 text-gray-400 hover:text-primary"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    {!userAddress && (
                      <button
                        onClick={() => setCustomAddressEnabled(true)}
                        className="text-xs text-primary hover:underline"
                      >
                        Use custom address instead
                      </button>
                    )}
                  </div>
                ) : (
                  <div>
                    <Input
                      placeholder="Enter wallet address (0x...)"
                      className="bg-gray-800 border-gray-700 text-white font-mono"
                      value={customWalletAddress}
                      onChange={(e) => setCustomWalletAddress(e.target.value)}
                    />
                    <div className="mt-2 text-xs text-gray-400">
                      Make sure this is a valid BSC wallet address. Tokens cannot be recovered if sent to the wrong address.
                    </div>
                  </div>
                )}
              </div>
              
              {/* Payment Information */}
              <div className="glass-card p-4 rounded-xl border border-gray-800 bg-gray-900/50 mb-6">
                <h3 className="text-white font-medium mb-2">Payment Information</h3>
                <div className="text-sm text-gray-400 mb-4">
                  You'll be redirected to our secure payment processor to complete your purchase.
                </div>
                <div className="flex items-center mb-2">
                  <CreditCard className="h-5 w-5 text-primary mr-2" />
                  <span className="text-gray-300">Credit/Debit Cards Accepted</span>
                </div>
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="text-gray-300">Your payment info is never stored on our servers</span>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col">
              {/* Fee Breakdown Section */}
              {feeBreakdown ? (
                <div className="w-full border-t border-gray-800 pt-4 mb-4">
                  <h3 className="text-white font-medium mb-2">Payment Details</h3>
                  <div className="glass-card bg-gray-900/30 p-4 rounded-lg mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Token Cost:</span>
                      <span className="text-white">${parseFloat(feeBreakdown.tokenPriceUSD).toFixed(2)} USD</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Network Fee:</span>
                      <span className="text-white">${parseFloat(feeBreakdown.gasFeeUSD).toFixed(2)} USD</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Service Fee:</span>
                      <span className="text-white">${parseFloat(feeBreakdown.serviceFeeUSD).toFixed(2)} USD</span>
                    </div>
                    <div className="border-t border-gray-700 my-2"></div>
                    <div className="flex justify-between font-medium">
                      <span className="text-gray-300">Total:</span>
                      <span className="text-primary text-lg">${parseFloat(feeBreakdown.totalUSD).toFixed(2)} USD</span>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Network fee covers the cost of processing your transaction on the blockchain.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full border-t border-gray-800 pt-4 mb-4">
                  <div className="text-gray-300">Approximate Cost:</div>
                  <div className="text-2xl font-bold text-white">
                    {formatNPR(calculatePrice(tokenAmount))}
                  </div>
                  <div className="text-xs text-gray-500 ml-2">(plus network fees)</div>
                </div>
              )}
              
              <Button
                className="w-full py-6 text-lg bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400"
                onClick={handlePurchase}
                disabled={isProcessing || tokenAmount <= 0 || (!userAddress && !customWalletAddress)}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Purchase {tokenAmount} NPT Tokens
                  </>
                )}
              </Button>
              
              {paymentError && (
                <div className="mt-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-sm">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
                    <div>{paymentError}</div>
                  </div>
                </div>
              )}
            </CardFooter>
          </Card>
        </div>
        
        {/* Right Column: Information and Status */}
        <div className="md:col-span-1">
          {/* What are NPT Tokens */}
          <Card className="cyber-card border-primary/20 bg-gradient-to-br from-gray-900 to-gray-950 shadow-lg mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-white">What are NPT Tokens?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm mb-3">
                NepaliPay Token (NPT) is the native cryptocurrency of the NepaliPay ecosystem, built on the Binance Smart Chain.
              </p>
              <p className="text-gray-400 text-sm mb-3">
                NPT tokens can be used for:
              </p>
              <ul className="text-gray-400 text-sm list-disc pl-5 mb-4 space-y-1">
                <li>Payments within the NepaliPay ecosystem</li>
                <li>Rewards and cashbacks</li>
                <li>Collateral for loans</li>
                <li>Governance voting</li>
                <li>Reduced fees on transactions</li>
              </ul>
              <a 
                href="https://bscscan.com/token/0x69d34B25809b346702C21EB0E22EAD8C1de58D66" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center text-sm"
              >
                View Token Contract
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </CardContent>
          </Card>
          
          {/* Conversion Rates */}
          <Card className="cyber-card border-primary/20 bg-gradient-to-br from-gray-900 to-gray-950 shadow-lg mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-white">Token Conversion Rates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="glass-card p-3 rounded-lg mb-3 bg-gray-800/50">
                <div className="text-center mb-1">
                  <span className="text-lg font-bold text-white">1 NPT</span>
                </div>
                <div className="text-center text-primary">
                  = {formatNPR(NPT_TO_NPR_RATE)}
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-2">
                Rates are updated daily based on market conditions. Purchases are subject to the rate at the time of transaction.
              </p>
              <div className="text-xs text-gray-500">
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
          
          {/* Security Information */}
          <Card className="cyber-card border-primary/20 bg-gradient-to-br from-gray-900 to-gray-950 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-white">Purchase Security</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start mb-3">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-gray-400 text-sm">
                  All payments are processed securely through Stripe, a PCI-compliant payment processor.
                </p>
              </div>
              <div className="flex items-start mb-3">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-gray-400 text-sm">
                  Tokens are transferred automatically to your wallet after successful payment.
                </p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-gray-400 text-sm">
                  All transactions are recorded on the blockchain for transparency and security.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BuyTokensPage;