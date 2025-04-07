import React, { useState } from 'react';
import DashboardLayout from './dashboard-layout';
import { useBlockchain } from '@/contexts/blockchain-context';
import { useCustomToast } from '@/lib/toast-wrapper';
import { motion } from 'framer-motion';
import { 
  RefreshCw, 
  DollarSign,
  ArrowRightLeft,
  CheckCircle,
  XCircle,
  Flame,
  Award,
  Share,
  HelpCircle,
  ArrowUpRight
} from 'lucide-react';

interface CommunityProject {
  id: number;
  name: string;
  description: string;
  requestedAmount: string;
  votesFor: number;
  votesAgainst: number;
  status: 'pending' | 'approved' | 'rejected';
}

const SuperAdminFinancePage: React.FC = () => {
  const { feeRelayerContract } = useBlockchain();
  const toast = useCustomToast();
  const [isLoading, setIsLoading] = useState({
    swap: false,
    approve: false,
    reject: false
  });
  
  const [swapAmount, setSwapAmount] = useState('');
  const [selectedProject, setSelectedProject] = useState<CommunityProject | null>(null);
  
  // Sample community projects (this would come from the blockchain in a real implementation)
  const [communityProjects, setCommunityProjects] = useState<CommunityProject[]>([
    {
      id: 1,
      name: "Pokhara Village Clinic Fund",
      description: "Funding for medical supplies and equipment for the Pokhara village clinic.",
      requestedAmount: "25,000 NPT",
      votesFor: 14,
      votesAgainst: 3,
      status: 'pending'
    },
    {
      id: 2,
      name: "Kathmandu School Computers",
      description: "Provide computers for underprivileged schools in Kathmandu.",
      requestedAmount: "45,000 NPT",
      votesFor: 18,
      votesAgainst: 2,
      status: 'pending'
    },
    {
      id: 3,
      name: "Annapurna Clean Water Initiative",
      description: "Installing water filters in remote villages in the Annapurna region.",
      requestedAmount: "30,000 NPT",
      votesFor: 9,
      votesAgainst: 8,
      status: 'pending'
    }
  ]);

  const handleSwapFees = async () => {
    if (!feeRelayerContract) {
      toast({
        title: "Contract Not Connected",
        description: "The FeeRelayer contract is not connected.",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(swapAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount of NPT to swap.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading({...isLoading, swap: true});
    try {
      // This would be a real call to swapFeesToStable() or similar on the contract
      // await feeRelayerContract.swapFeesToStable(ethers.utils.parseUnits(swapAmount, 18));
      
      // For demo purposes:
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Fees Swapped",
        description: `Successfully swapped ${amount.toLocaleString()} NPT to USDT.`,
        variant: "default"
      });
      setSwapAmount('');
    } catch (error: any) {
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to swap fees",
        variant: "destructive"
      });
    } finally {
      setIsLoading({...isLoading, swap: false});
    }
  };

  const handleApproveProject = async (project: CommunityProject) => {
    if (!feeRelayerContract) {
      toast({
        title: "Contract Not Connected",
        description: "The contract is not connected.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading({...isLoading, approve: true});
    setSelectedProject(project);
    
    try {
      // This would be a real call to approveProject() or similar on the contract
      // await contract.approveProject(project.id);
      
      // For demo purposes:
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the projects list
      setCommunityProjects(communityProjects.map(p => 
        p.id === project.id 
          ? {...p, status: 'approved'} 
          : p
      ));
      
      toast({
        title: "Project Approved",
        description: `${project.name} has been approved for funding.`,
        variant: "default"
      });
    } catch (error: any) {
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to approve project",
        variant: "destructive"
      });
    } finally {
      setIsLoading({...isLoading, approve: false});
      setSelectedProject(null);
    }
  };

  const handleRejectProject = async (project: CommunityProject) => {
    if (!feeRelayerContract) {
      toast({
        title: "Contract Not Connected",
        description: "The contract is not connected.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading({...isLoading, reject: true});
    setSelectedProject(project);
    
    try {
      // This would be a real call to rejectProject() or similar on the contract
      // await contract.rejectProject(project.id);
      
      // For demo purposes:
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the projects list
      setCommunityProjects(communityProjects.map(p => 
        p.id === project.id 
          ? {...p, status: 'rejected'} 
          : p
      ));
      
      toast({
        title: "Project Rejected",
        description: `${project.name} has been rejected for funding.`,
        variant: "default"
      });
    } catch (error: any) {
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to reject project",
        variant: "destructive"
      });
    } finally {
      setIsLoading({...isLoading, reject: false});
      setSelectedProject(null);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <DashboardLayout title="Financial Control Panel">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* Fees Overview */}
        <motion.div variants={item} className="cyber-card">
          <h2 className="text-xl font-bold mb-4">Fees Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="nepal-card-alt p-4 flex flex-col">
              <h3 className="text-sm text-gray-400 mb-1">Collected NPT Fees</h3>
              <p className="text-2xl font-semibold">123,450 NPT</p>
              <p className="text-sm text-gray-400 mt-1">~$925.87 USD</p>
            </div>
            
            <div className="nepal-card-alt p-4 flex flex-col">
              <h3 className="text-sm text-gray-400 mb-1">Swapped to USDT</h3>
              <p className="text-2xl font-semibold">31,260 NPT</p>
              <p className="text-sm text-gray-400 mt-1">$234.45 USDT</p>
            </div>
            
            <div className="nepal-card-alt p-4 flex flex-col">
              <h3 className="text-sm text-gray-400 mb-1">Allocated to Community</h3>
              <p className="text-2xl font-semibold">18,075 NPT</p>
              <p className="text-sm text-gray-400 mt-1">14.6% of total</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold mb-3">Convert Fees to USDT</h3>
              <p className="text-sm text-gray-400 mb-4">
                Convert collected NPT fees to USDT for operational expenses or ecosystem reserves.
              </p>
              
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <input
                    type="number"
                    value={swapAmount}
                    onChange={(e) => setSwapAmount(e.target.value)}
                    className="modern-input w-full pr-14"
                    placeholder="Amount to swap"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    NPT
                  </span>
                </div>
                
                <button
                  onClick={handleSwapFees}
                  disabled={isLoading.swap}
                  className="modern-button flex items-center whitespace-nowrap"
                >
                  {isLoading.swap ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <ArrowRightLeft className="w-4 h-4 mr-2" />
                  )}
                  Swap to USDT
                </button>
              </div>
              
              <div className="mt-3 text-xs text-gray-400 flex items-center">
                <HelpCircle className="w-3 h-3 mr-1" />
                <span>Fee swap uses PancakeSwap for best rates</span>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold">Fee Distribution</h3>
                <a href="#" className="text-primary text-sm flex items-center">
                  Full Report <ArrowUpRight className="w-3 h-3 ml-1" />
                </a>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                      <DollarSign className="w-4 h-4 text-primary" />
                    </div>
                    <span>Operational Costs</span>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">45%</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center mr-3">
                      <Award className="w-4 h-4 text-cyan-500" />
                    </div>
                    <span>User Rewards</span>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">30%</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center mr-3">
                      <Flame className="w-4 h-4 text-red-500" />
                    </div>
                    <span>Community Fund</span>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">15%</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                      <Share className="w-4 h-4 text-green-500" />
                    </div>
                    <span>Ecosystem Growth</span>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">10%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Ember Pool (Community Fund) */}
        <motion.div variants={item} className="cyber-card">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mr-3">
              <Flame className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Ember Pool (Community Fund)</h2>
              <p className="text-sm text-gray-400">Decentralized funding for community projects and initiatives</p>
            </div>
          </div>
          
          <div className="mb-6 p-4 rounded-lg border border-primary/20 bg-primary/5">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Available Funding</h3>
                <p className="text-2xl font-bold mt-1">100,000 NPT</p>
              </div>
              <div className="text-right">
                <h3 className="font-medium">Current Projects</h3>
                <p className="text-2xl font-bold mt-1">{communityProjects.length}</p>
              </div>
            </div>
          </div>
          
          <h3 className="text-lg font-bold mb-4">Active Community Projects</h3>
          
          <div className="space-y-4 mb-4">
            {communityProjects.map((project) => (
              <div 
                key={project.id} 
                className={`nepal-card relative rounded-lg overflow-hidden ${
                  project.status === 'approved' 
                    ? 'border border-green-500/30' 
                    : project.status === 'rejected'
                    ? 'border border-red-500/30 opacity-75'
                    : ''
                }`}
              >
                {project.status === 'approved' && (
                  <div className="absolute top-0 right-0 bg-green-500 text-white px-2 py-1 text-xs">
                    Approved
                  </div>
                )}
                {project.status === 'rejected' && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs">
                    Rejected
                  </div>
                )}
                
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="mb-4 md:mb-0">
                    <h4 className="text-lg font-medium">{project.name}</h4>
                    <p className="text-gray-400 mt-1 mb-3">{project.description}</p>
                    
                    <div className="flex items-center text-sm">
                      <span className="text-gray-400 mr-2">Requested:</span>
                      <span className="font-medium">{project.requestedAmount}</span>
                    </div>
                    
                    <div className="flex items-center mt-2 space-x-4 text-sm">
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center mr-1">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        </div>
                        <span>{project.votesFor} votes</span>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center mr-1">
                          <XCircle className="w-3 h-3 text-red-500" />
                        </div>
                        <span>{project.votesAgainst} votes</span>
                      </div>
                    </div>
                  </div>
                  
                  {project.status === 'pending' && (
                    <div className="flex flex-row md:flex-col space-x-3 md:space-x-0 md:space-y-2 justify-end">
                      <button
                        onClick={() => handleApproveProject(project)}
                        disabled={isLoading.approve && selectedProject?.id === project.id}
                        className="modern-button flex-1 flex items-center justify-center bg-green-600 hover:bg-green-700"
                      >
                        {isLoading.approve && selectedProject?.id === project.id ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            <span>Approve</span>
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleRejectProject(project)}
                        disabled={isLoading.reject && selectedProject?.id === project.id}
                        className="modern-button flex-1 flex items-center justify-center bg-red-600 hover:bg-red-700"
                      >
                        {isLoading.reject && selectedProject?.id === project.id ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 mr-1" />
                            <span>Reject</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-sm text-center text-gray-400">
            <p>All project approvals/rejections are recorded on the blockchain for transparency.</p>
            <p className="mt-1">Approved projects automatically receive funding from the Ember Pool.</p>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default SuperAdminFinancePage;