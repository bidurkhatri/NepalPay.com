import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useBlockchain } from '@/contexts/blockchain-context';
import { 
  ArrowLeft, 
  Loader2, 
  Info, 
  CreditCard, 
  RefreshCw,
  Clock,
  AlertTriangle,
  Calculator,
  DollarSign,
  Check,
  ChevronRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Collateral type interface
interface CollateralOption {
  type: string;
  name: string;
  description: string;
  rate: number;
  icon: React.ReactNode;
}

const BorrowPage: React.FC = () => {
  const { 
    isConnected, 
    nptBalance, 
    userCollaterals,
    userDebt,
    loanStartTimestamp,
    addCollateral,
    takeLoan,
    repayLoan 
  } = useBlockchain();
  
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  // Tab state
  const [activeTab, setActiveTab] = useState<'borrow' | 'repay'>('borrow');
  
  // Form state for borrowing
  const [selectedCollateral, setSelectedCollateral] = useState<string>('bnb');
  const [collateralAmount, setCollateralAmount] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [processingBorrow, setProcessingBorrow] = useState(false);
  
  // Form state for repaying
  const [repayAmount, setRepayAmount] = useState('');
  const [processingRepay, setProcessingRepay] = useState(false);
  
  // Derived values
  const collateralAmountNumber = parseFloat(collateralAmount) || 0;
  const loanAmountNumber = parseFloat(loanAmount) || 0;
  const repayAmountNumber = parseFloat(repayAmount) || 0;
  
  // Collateral options
  const collateralOptions: CollateralOption[] = [
    {
      type: 'bnb',
      name: 'BNB',
      description: 'Binance Coin',
      rate: 0.75, // Can borrow up to 75% of collateral value
      icon: <div className="bg-amber-500 rounded-full h-8 w-8 flex items-center justify-center font-bold text-white">B</div>,
    },
    {
      type: 'eth',
      name: 'ETH',
      description: 'Ethereum',
      rate: 0.7, // Can borrow up to 70% of collateral value
      icon: <div className="bg-blue-500 rounded-full h-8 w-8 flex items-center justify-center font-bold text-white">E</div>,
    },
    {
      type: 'btc',
      name: 'BTC',
      description: 'Bitcoin',
      rate: 0.8, // Can borrow up to 80% of collateral value
      icon: <div className="bg-orange-500 rounded-full h-8 w-8 flex items-center justify-center font-bold text-white">₿</div>,
    },
  ];
  
  // Get selected collateral option
  const selectedCollateralOption = collateralOptions.find(option => option.type === selectedCollateral) || collateralOptions[0];
  
  // Calculate loan values
  const maxLoanAmount = collateralAmountNumber * selectedCollateralOption.rate * 100; // Example conversion rate
  const interestRate = 0.12; // 12% annual interest rate
  
  // Calculate repayment values
  const hasActiveLoan = parseFloat(userDebt) > 0;
  const currentDebt = parseFloat(userDebt);
  
  // Calculate interest based on time passed
  const calculateInterest = () => {
    if (loanStartTimestamp === 0 || currentDebt === 0) return 0;
    
    const now = Date.now() / 1000; // current timestamp in seconds
    const secondsPassed = now - loanStartTimestamp;
    const yearInSeconds = 31536000; // 365 days in seconds
    
    // Calculate accrued interest
    return currentDebt * (interestRate * (secondsPassed / yearInSeconds));
  };
  
  const accruedInterest = calculateInterest();
  const totalRepayment = currentDebt + accruedInterest;
  
  // Format date from timestamp
  const formatDate = (timestamp: number) => {
    if (timestamp === 0) return 'N/A';
    
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Validation for borrow
  const isValidCollateralAmount = collateralAmountNumber > 0;
  const isValidLoanAmount = loanAmountNumber > 0 && loanAmountNumber <= maxLoanAmount;
  const canBorrow = isValidCollateralAmount && isValidLoanAmount && !processingBorrow;
  
  // Validation for repay
  const isValidRepayAmount = repayAmountNumber > 0 && repayAmountNumber <= parseFloat(nptBalance);
  const canRepay = hasActiveLoan && isValidRepayAmount && !processingRepay;
  
  // Handle borrowing
  const handleBorrow = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canBorrow) return;
    
    try {
      setProcessingBorrow(true);
      
      // First add collateral
      await addCollateral(selectedCollateral, collateralAmount);
      
      // Then take the loan
      await takeLoan(loanAmount);
      
      toast({
        title: "Loan Successful",
        description: `You've successfully borrowed ${loanAmount} NPT!`,
        variant: "default",
      });
      
      // Reset form
      setCollateralAmount('');
      setLoanAmount('');
      
      // Redirect to dashboard after successful loan
      setTimeout(() => {
        navigate('/sections');
      }, 2000);
      
    } catch (error: any) {
      toast({
        title: "Loan Failed",
        description: error.message || "Failed to process loan",
        variant: "destructive",
      });
    } finally {
      setProcessingBorrow(false);
    }
  };
  
  // Handle repaying
  const handleRepay = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canRepay) return;
    
    try {
      setProcessingRepay(true);
      
      await repayLoan(repayAmount);
      
      toast({
        title: "Repayment Successful",
        description: `You've successfully repaid ${repayAmount} NPT!`,
        variant: "default",
      });
      
      // Reset form
      setRepayAmount('');
      
      // Redirect to dashboard after successful repayment
      setTimeout(() => {
        navigate('/sections');
      }, 2000);
      
    } catch (error: any) {
      toast({
        title: "Repayment Failed",
        description: error.message || "Failed to process repayment",
        variant: "destructive",
      });
    } finally {
      setProcessingRepay(false);
    }
  };
  
  // Redirect if not connected
  useEffect(() => {
    if (!isConnected) {
      navigate('/login');
    }
  }, [isConnected, navigate]);
  
  // Set initial repay amount
  useEffect(() => {
    if (hasActiveLoan) {
      setRepayAmount(totalRepayment.toFixed(2));
    }
  }, [hasActiveLoan, totalRepayment]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex flex-col">
      {/* Header with back button and balance */}
      <header className="border-b border-gray-800/60 bg-gray-900/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            <Link href="/sections" className="flex items-center text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>Back to Dashboard</span>
            </Link>
            
            <div className="flex items-center">
              <div className="text-2xl font-bold gradient-text">
                {activeTab === 'borrow' ? 'Borrow NPT' : 'Repay Loan'}
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="text-sm text-gray-400 mr-2">Balance:</div>
              <div className="text-white font-medium">{parseFloat(nptBalance).toLocaleString()} NPT</div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Tabs */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('borrow')}
              className={`py-4 px-6 focus:outline-none transition-colors ${
                activeTab === 'borrow'
                  ? 'text-primary border-b-2 border-primary font-medium'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Borrow
            </button>
            <button
              onClick={() => setActiveTab('repay')}
              className={`py-4 px-6 flex items-center focus:outline-none transition-colors ${
                activeTab === 'repay'
                  ? 'text-primary border-b-2 border-primary font-medium'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Repay
              {hasActiveLoan && (
                <div className="ml-2 h-2 w-2 bg-amber-500 rounded-full"></div>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <main className="flex-grow flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {/* Borrow Tab */}
          {activeTab === 'borrow' && (
            <div className="cyber-card">
              <div className="card-highlight"></div>
              <div className="card-content p-8">
                <form onSubmit={handleBorrow} className="space-y-6">
                  {/* Collateral Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Select Collateral Type
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {collateralOptions.map((option) => (
                        <button
                          key={option.type}
                          type="button"
                          onClick={() => setSelectedCollateral(option.type)}
                          className={`p-3 rounded-lg border flex flex-col items-center ${
                            selectedCollateral === option.type
                              ? 'bg-primary/10 border-primary'
                              : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800'
                          }`}
                        >
                          {option.icon}
                          <div className="mt-2 font-medium text-white">{option.name}</div>
                          <div className="text-xs text-gray-400">{option.rate * 100}% LTV</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Collateral Amount */}
                  <div>
                    <label htmlFor="collateralAmount" className="block text-sm font-medium text-gray-300 mb-1">
                      Collateral Amount
                    </label>
                    <div className="relative">
                      <input
                        id="collateralAmount"
                        type="number"
                        value={collateralAmount}
                        onChange={(e) => setCollateralAmount(e.target.value)}
                        min="0.01"
                        step="0.01"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder={`Enter amount (${selectedCollateralOption.name})`}
                        required
                      />
                      <div className="absolute right-4 top-3 text-gray-400">{selectedCollateralOption.name}</div>
                    </div>
                    
                    {/* Current collateral balance */}
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <div>Available: {
                        selectedCollateral === 'bnb' ? userCollaterals.bnb :
                        selectedCollateral === 'eth' ? userCollaterals.eth :
                        userCollaterals.btc
                      } {selectedCollateralOption.name}</div>
                      <div>1 {selectedCollateralOption.name} ≈ 100 NPT</div>
                    </div>
                  </div>
                  
                  {/* Loan Amount */}
                  <div>
                    <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-300 mb-1">
                      Loan Amount (NPT)
                    </label>
                    <div className="relative">
                      <input
                        id="loanAmount"
                        type="number"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(e.target.value)}
                        min="1"
                        max={maxLoanAmount}
                        step="1"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="Enter loan amount (NPT)"
                        required
                      />
                      <div className="absolute right-4 top-3 text-gray-400">NPT</div>
                    </div>
                    
                    {/* Max loan amount */}
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <div>Max Loan: {maxLoanAmount.toLocaleString()} NPT</div>
                      <button
                        type="button"
                        onClick={() => setLoanAmount(maxLoanAmount.toString())}
                        className="text-primary hover:text-primary-dark"
                      >
                        Max
                      </button>
                    </div>
                  </div>
                  
                  {/* Loan terms */}
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div className="text-gray-400">Collateral:</div>
                      <div className="text-white">{collateralAmountNumber.toLocaleString()} {selectedCollateralOption.name}</div>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="flex items-center text-gray-400">
                        <span>Loan Amount:</span>
                      </div>
                      <div className="text-white">{loanAmountNumber.toLocaleString()} NPT</div>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="flex items-center text-gray-400">
                        <span>Interest Rate:</span>
                        <Info className="h-3.5 w-3.5 ml-1 text-gray-500" />
                      </div>
                      <div className="text-gray-300">{interestRate * 100}% APR</div>
                    </div>
                    <div className="border-t border-gray-700 my-2"></div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="text-gray-400">LTV Ratio:</div>
                      <div className="text-gray-300">
                        {collateralAmountNumber > 0 && loanAmountNumber > 0
                          ? `${((loanAmountNumber / (collateralAmountNumber * 100)) * 100).toFixed(2)}%`
                          : '0%'}
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="text-gray-400">Collateral Release:</div>
                      <div className="text-gray-300">Full amount on repayment</div>
                    </div>
                  </div>
                  
                  {/* Legal disclaimer */}
                  <div className="text-xs text-gray-500">
                    By taking a loan, you agree to the terms that your collateral may be liquidated if your LTV exceeds 85% due to market fluctuations.
                  </div>
                  
                  {/* Borrow Button */}
                  <button
                    type="submit"
                    disabled={!canBorrow}
                    className={`modern-button w-full py-3 flex items-center justify-center 
                      ${canBorrow ? 'bg-gradient-to-r from-purple-600 to-indigo-500' : 'bg-gray-700 cursor-not-allowed'}`}
                  >
                    {processingBorrow ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-5 w-5" />
                        Borrow NPT
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}
          
          {/* Repay Tab */}
          {activeTab === 'repay' && (
            <div className="cyber-card">
              <div className="card-highlight"></div>
              <div className="card-content p-8">
                {!hasActiveLoan ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
                      <Check className="h-8 w-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">No Active Loans</h3>
                    <p className="text-gray-400 mb-6">You don't have any active loans to repay.</p>
                    <button
                      onClick={() => setActiveTab('borrow')}
                      className="modern-button bg-gradient-to-r from-purple-600 to-indigo-500"
                    >
                      Borrow Now
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleRepay} className="space-y-6">
                    {/* Active Loan Details */}
                    <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 mb-6">
                      <div className="text-sm font-medium text-gray-300 mb-3">Active Loan Details</div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="text-gray-400">Principal:</div>
                          <div className="text-white">{parseFloat(userDebt).toLocaleString()} NPT</div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-gray-400">
                            <span>Accrued Interest:</span>
                            <Info className="h-3.5 w-3.5 ml-1 text-gray-500" />
                          </div>
                          <div className="text-gray-300">{accruedInterest.toFixed(2)} NPT</div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-gray-400">Loan Date:</div>
                          <div className="text-gray-300">{formatDate(loanStartTimestamp)}</div>
                        </div>
                        <div className="border-t border-gray-700 my-2"></div>
                        <div className="flex justify-between items-center font-medium">
                          <div className="text-gray-200">Total Repayment:</div>
                          <div className="text-white">{totalRepayment.toFixed(2)} NPT</div>
                        </div>
                      </div>
                      
                      {/* Collateral to be released */}
                      <div className="mt-4 p-3 bg-gray-900/70 rounded border border-gray-700/50">
                        <div className="text-xs text-gray-400 mb-2">Collateral to be released upon full repayment:</div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-amber-500 rounded-full h-5 w-5 flex items-center justify-center font-bold text-white text-xs mr-2">B</div>
                            <span className="text-gray-300">BNB:</span>
                          </div>
                          <div className="text-white">{userCollaterals.bnb}</div>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center">
                            <div className="bg-blue-500 rounded-full h-5 w-5 flex items-center justify-center font-bold text-white text-xs mr-2">E</div>
                            <span className="text-gray-300">ETH:</span>
                          </div>
                          <div className="text-white">{userCollaterals.eth}</div>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center">
                            <div className="bg-orange-500 rounded-full h-5 w-5 flex items-center justify-center font-bold text-white text-xs mr-2">₿</div>
                            <span className="text-gray-300">BTC:</span>
                          </div>
                          <div className="text-white">{userCollaterals.btc}</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Repayment Amount */}
                    <div>
                      <label htmlFor="repayAmount" className="block text-sm font-medium text-gray-300 mb-1">
                        Repayment Amount
                      </label>
                      <div className="relative">
                        <input
                          id="repayAmount"
                          type="number"
                          value={repayAmount}
                          onChange={(e) => setRepayAmount(e.target.value)}
                          min="1"
                          max={Math.min(parseFloat(nptBalance), totalRepayment)}
                          step="1"
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="Enter repayment amount"
                          required
                        />
                        <div className="absolute right-4 top-3 text-gray-400">NPT</div>
                      </div>
                      
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <div>Your Balance: {parseFloat(nptBalance).toLocaleString()} NPT</div>
                        <button
                          type="button"
                          onClick={() => setRepayAmount(Math.min(parseFloat(nptBalance), totalRepayment).toFixed(2))}
                          className="text-primary hover:text-primary-dark"
                        >
                          Max
                        </button>
                      </div>
                    </div>
                    
                    {/* Repayment Breakdown */}
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div className="text-gray-400">Your Repayment:</div>
                        <div className="text-white">{repayAmountNumber.toLocaleString()} NPT</div>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <div className="text-gray-400">Remaining Debt:</div>
                        <div className="text-gray-300">
                          {Math.max(0, totalRepayment - repayAmountNumber).toFixed(2)} NPT
                        </div>
                      </div>
                      <div className="border-t border-gray-700 my-2"></div>
                      <div className="flex items-center justify-between">
                        <div className="text-gray-400">Status:</div>
                        <div className={`flex items-center font-medium ${
                          repayAmountNumber >= totalRepayment ? 'text-green-500' : 'text-amber-500'
                        }`}>
                          {repayAmountNumber >= totalRepayment ? (
                            <>
                              <Check className="h-4 w-4 mr-1" />
                              Full Repayment
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              Partial Repayment
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Repay Button */}
                    <button
                      type="submit"
                      disabled={!canRepay}
                      className={`modern-button w-full py-3 flex items-center justify-center 
                        ${canRepay ? 'bg-gradient-to-r from-green-600 to-green-500' : 'bg-gray-700 cursor-not-allowed'}`}
                    >
                      {processingRepay ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-5 w-5" />
                          Repay Loan
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Footer with Help Chat */}
      <footer className="py-8 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex justify-center">
          <div className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} NepaliPay. All rights reserved.
          </div>
        </div>
        
        {/* Need Help Chat Bubble - Fixed position */}
        <div className="fixed bottom-6 right-6 z-40">
          <Link href="/support" className="flex items-center glass-card bg-primary/10 py-3 px-5 rounded-full shadow-lg hover:scale-105 transition-transform">
            <div className="relative mr-2 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">?</span>
            </div>
            <span className="font-medium text-primary">Need Help?</span>
          </Link>
        </div>
      </footer>
      
      {/* Processing animation */}
      {(processingBorrow || processingRepay) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full text-center">
            <Loader2 className="h-12 w-12 mx-auto mb-4 text-primary animate-spin" />
            <h3 className="text-xl font-bold text-white mb-2">Processing transaction...</h3>
            <p className="text-gray-400">Please wait while your transaction is being confirmed on the blockchain.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowPage;