import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, RefreshCw, Link, AlertTriangle, Calendar, Banknote, Info } from 'lucide-react';
import DashboardLayout from './dashboard-layout';
import { useBlockchain } from '@/contexts/blockchain-context';
import { useToast } from '@/hooks/use-toast';

interface Loan {
  id: number;
  walletAddress: string;
  username: string;
  borrowedAmount: string;
  collateralType: string;
  collateralAmount: string;
  startDate: string;
  dueDate: string;
  status: 'Active' | 'Overdue' | 'Repaid';
}

interface CollateralDetails {
  bnb: string;
  eth: string;
  btc: string;
  nptValue: string;
}

const LoanManagementPage: React.FC = () => {
  const { nepaliPayContract } = useBlockchain();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [isLoading, setIsLoading] = useState({
    refreshStatus: false,
    liquidate: false,
    viewDetails: false
  });
  const [viewingCollateral, setViewingCollateral] = useState<CollateralDetails | null>(null);
  const [isCollateralDialogOpen, setIsCollateralDialogOpen] = useState(false);

  // Mock data - in production this would come from blockchain calls
  const [loans, setLoans] = useState<Loan[]>([
    {
      id: 1,
      walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
      username: 'prakash.eth',
      borrowedAmount: '500 NPT',
      collateralType: 'Mixed',
      collateralAmount: '750 NPT Value',
      startDate: '2025-03-15',
      dueDate: '2025-04-15',
      status: 'Active'
    },
    {
      id: 2,
      walletAddress: '0x7890abcdef1234567890abcdef1234567890abcd',
      username: 'smriti',
      borrowedAmount: '750 NPT',
      collateralType: 'BNB',
      collateralAmount: '1,125 NPT Value',
      startDate: '2025-03-01',
      dueDate: '2025-04-01',
      status: 'Overdue'
    },
    {
      id: 3,
      walletAddress: '0xef1234567890abcdef1234567890abcdef123456',
      username: 'hari',
      borrowedAmount: '300 NPT',
      collateralType: 'ETH',
      collateralAmount: '450 NPT Value',
      startDate: '2025-02-20',
      dueDate: '2025-03-20',
      status: 'Repaid'
    },
    {
      id: 4,
      walletAddress: '0x567890abcdef1234567890abcdef1234567890ab',
      username: 'sabin',
      borrowedAmount: '1,000 NPT',
      collateralType: 'BTC',
      collateralAmount: '1,500 NPT Value',
      startDate: '2025-03-10',
      dueDate: '2025-04-10',
      status: 'Active'
    }
  ]);

  // Filter loans based on search term
  const filteredLoans = loans.filter(loan => {
    const searchLower = searchTerm.toLowerCase();
    return (
      loan.username.toLowerCase().includes(searchLower) ||
      loan.walletAddress.toLowerCase().includes(searchLower) ||
      loan.borrowedAmount.toLowerCase().includes(searchLower) ||
      loan.status.toLowerCase().includes(searchLower)
    );
  });

  const handleRefreshStatus = async (loan: Loan) => {
    if (!nepaliPayContract) {
      toast({
        title: "Contract Not Connected",
        description: "The NepaliPay contract is not connected.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading({...isLoading, refreshStatus: true});
    setSelectedLoan(loan);
    
    try {
      // In production, this would fetch updated loan status from the blockchain
      // const updatedStatus = await nepaliPayContract.getLoanStatus(loan.walletAddress);
      
      // For demo purposes:
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Randomly update status for demo
      const statusOptions: ('Active' | 'Overdue' | 'Repaid')[] = ['Active', 'Overdue', 'Repaid'];
      const newStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
      
      // Update the loans list
      setLoans(loans.map(l => 
        l.id === loan.id 
          ? {...l, status: newStatus} 
          : l
      ));
      
      toast({
        title: "Status Refreshed",
        description: `Loan status updated to: ${newStatus}`,
        variant: "default"
      });
    } catch (error: any) {
      toast({
        title: "Refresh Failed",
        description: error.message || "Failed to refresh loan status",
        variant: "destructive"
      });
    } finally {
      setIsLoading({...isLoading, refreshStatus: false});
      setSelectedLoan(null);
    }
  };

  const handleLiquidateLoan = async (loan: Loan) => {
    if (!nepaliPayContract) {
      toast({
        title: "Contract Not Connected",
        description: "The NepaliPay contract is not connected.",
        variant: "destructive"
      });
      return;
    }

    if (loan.status !== 'Overdue') {
      toast({
        title: "Cannot Liquidate",
        description: "Only overdue loans can be liquidated.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading({...isLoading, liquidate: true});
    setSelectedLoan(loan);
    
    try {
      // In production, this would call the liquidateLoan method on the contract
      // await nepaliPayContract.liquidateLoan(loan.walletAddress);
      
      // For demo purposes:
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update the loans list (remove the liquidated loan)
      setLoans(loans.filter(l => l.id !== loan.id));
      
      toast({
        title: "Loan Liquidated",
        description: `The loan for ${loan.username} has been successfully liquidated.`,
        variant: "default"
      });
    } catch (error: any) {
      toast({
        title: "Liquidation Failed",
        description: error.message || "Failed to liquidate loan",
        variant: "destructive"
      });
    } finally {
      setIsLoading({...isLoading, liquidate: false});
      setSelectedLoan(null);
    }
  };

  const handleViewCollateral = async (loan: Loan) => {
    setIsLoading({...isLoading, viewDetails: true});
    setSelectedLoan(loan);
    
    try {
      // In production, this would fetch collateral details from the blockchain
      // const collateralDetails = await nepaliPayContract.getCollateralDetails(loan.walletAddress);
      
      // For demo purposes:
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock collateral details
      let details: CollateralDetails;
      
      if (loan.collateralType === 'BNB') {
        details = {
          bnb: '0.75 BNB',
          eth: '0',
          btc: '0',
          nptValue: loan.collateralAmount
        };
      } else if (loan.collateralType === 'ETH') {
        details = {
          bnb: '0',
          eth: '0.25 ETH',
          btc: '0',
          nptValue: loan.collateralAmount
        };
      } else if (loan.collateralType === 'BTC') {
        details = {
          bnb: '0',
          eth: '0',
          btc: '0.015 BTC',
          nptValue: loan.collateralAmount
        };
      } else {
        // Mixed
        details = {
          bnb: '0.25 BNB',
          eth: '0.1 ETH',
          btc: '0.005 BTC',
          nptValue: loan.collateralAmount
        };
      }
      
      setViewingCollateral(details);
      setIsCollateralDialogOpen(true);
    } catch (error: any) {
      toast({
        title: "View Failed",
        description: error.message || "Failed to view collateral details",
        variant: "destructive"
      });
    } finally {
      setIsLoading({...isLoading, viewDetails: false});
      setSelectedLoan(null);
    }
  };

  const viewTransactionHistory = (walletAddress: string) => {
    window.open(`https://bscscan.com/address/${walletAddress}`, '_blank');
  };

  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <DashboardLayout title="Loan Management">
      <motion.div
        variants={containerAnimation}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <motion.div variants={itemAnimation} className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Loan Management</h1>
            <p className="text-muted-foreground">Manage user loans and collateral in the NepaliPay ecosystem</p>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-card/30 backdrop-blur-sm border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Search loans..."
            />
          </div>
        </motion.div>

        <motion.div variants={itemAnimation} className="overflow-x-auto rounded-xl bg-card/30 backdrop-blur-sm border border-border/40">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-muted-foreground border-b border-border/40">
                <th className="px-6 py-4 text-left font-medium">User</th>
                <th className="px-6 py-4 text-left font-medium">Borrowed</th>
                <th className="px-6 py-4 text-left font-medium">Collateral</th>
                <th className="px-6 py-4 text-left font-medium">Loan Start</th>
                <th className="px-6 py-4 text-left font-medium">Due Date</th>
                <th className="px-6 py-4 text-left font-medium">Status</th>
                <th className="px-6 py-4 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.length > 0 ? (
                filteredLoans.map((loan) => (
                  <tr key={loan.id} className="border-b border-border/10 hover:bg-accent/5">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium">{loan.username}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <span className="font-mono">{loan.walletAddress.substring(0, 6)}...{loan.walletAddress.substring(loan.walletAddress.length - 4)}</span>
                          <button 
                            onClick={() => viewTransactionHistory(loan.walletAddress)}
                            className="p-1 rounded-md hover:bg-accent/30 text-primary"
                            title="View on BSCscan"
                          >
                            <Link size={12} />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Banknote className="w-4 h-4 mr-2 text-primary" />
                        {loan.borrowedAmount}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <span>{loan.collateralAmount}</span>
                        <button
                          onClick={() => handleViewCollateral(loan)}
                          disabled={isLoading.viewDetails && selectedLoan?.id === loan.id}
                          className="ml-2 p-1 rounded-md hover:bg-accent/30 text-primary"
                          title="View Collateral Details"
                        >
                          {isLoading.viewDetails && selectedLoan?.id === loan.id ? (
                            <RefreshCw size={14} className="animate-spin" />
                          ) : (
                            <Info size={14} />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                        {loan.startDate}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                        {loan.dueDate}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        loan.status === 'Active' 
                          ? 'bg-green-500/10 text-green-400'
                          : loan.status === 'Overdue'
                            ? 'bg-red-500/10 text-red-400'
                            : 'bg-blue-500/10 text-blue-400'
                      }`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleRefreshStatus(loan)}
                          disabled={isLoading.refreshStatus && selectedLoan?.id === loan.id}
                          className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                          title="Refresh Status"
                        >
                          {isLoading.refreshStatus && selectedLoan?.id === loan.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <RefreshCw className="w-4 h-4" />
                          )}
                        </button>
                        
                        {loan.status === 'Overdue' && (
                          <button
                            onClick={() => handleLiquidateLoan(loan)}
                            disabled={isLoading.liquidate && selectedLoan?.id === loan.id}
                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                            title="Liquidate Loan"
                          >
                            {isLoading.liquidate && selectedLoan?.id === loan.id ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <AlertTriangle className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-muted-foreground">
                    {searchTerm ? (
                      <div className="flex flex-col items-center py-6">
                        <Search className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p>No loans found matching "{searchTerm}"</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center py-6">
                        <AlertTriangle className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p>No active loans found</p>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>

        {/* Collateral Details Dialog */}
        {isCollateralDialogOpen && viewingCollateral && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            <div className="bg-card rounded-xl border border-border/40 p-6 w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">Collateral Details</h3>
              
              <div className="space-y-3">
                {viewingCollateral.bnb !== '0' && (
                  <div className="flex justify-between items-center p-3 bg-accent/30 rounded-lg">
                    <span>BNB</span>
                    <span className="font-mono">{viewingCollateral.bnb}</span>
                  </div>
                )}
                
                {viewingCollateral.eth !== '0' && (
                  <div className="flex justify-between items-center p-3 bg-accent/30 rounded-lg">
                    <span>ETH</span>
                    <span className="font-mono">{viewingCollateral.eth}</span>
                  </div>
                )}
                
                {viewingCollateral.btc !== '0' && (
                  <div className="flex justify-between items-center p-3 bg-accent/30 rounded-lg">
                    <span>BTC</span>
                    <span className="font-mono">{viewingCollateral.btc}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg font-medium text-primary">
                  <span>Total NPT Value</span>
                  <span>{viewingCollateral.nptValue}</span>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsCollateralDialogOpen(false)}
                  className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <motion.div variants={itemAnimation} className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-yellow-400 font-medium">Liquidation Notice</p>
              <p className="mt-1">
                Loan liquidation is an irreversible blockchain action that transfers the borrower's 
                collateral to the NepaliPay treasury. Only use for overdue loans after due notice.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default LoanManagementPage;