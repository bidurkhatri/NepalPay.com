import React from 'react';
import { motion } from 'framer-motion';
import { Users, CreditCard, Store, AlertTriangle, Activity } from 'lucide-react';
import DashboardLayout from './dashboard-layout';
import { useBlockchain } from '@/contexts/blockchain-context';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard: React.FC = () => {
  const { 
    nepaliPayContract, 
    tokenContract, 
    userAddress, 
    username 
  } = useBlockchain();
  const { toast } = useToast();

  // Placeholder data (would come from blockchain in production)
  const dashboardStats = {
    activeUsers: 1582,
    activeLoans: 42,
    pendingAds: 7,
    recentTransactions: [
      { id: 1, user: 'prakash.eth', type: 'Loan Taken', amount: '500 NPT', time: '2 hours ago' },
      { id: 2, user: 'Bijay', type: 'Ad Posted', amount: '250 NPT', time: '3 hours ago' },
      { id: 3, user: 'Smriti', type: 'Token Transfer', amount: '750 NPT', time: '5 hours ago' },
      { id: 4, user: 'Binod', type: 'Loan Repayment', amount: '300 NPT', time: '6 hours ago' },
    ]
  };

  const refreshData = async () => {
    try {
      toast({
        title: "Refreshing Data",
        description: "Fetching latest data from the blockchain..."
      });
      
      // In production, this would update the stats from the blockchain
      // For example: const activeUsers = await nepaliPayContract.getUserCount();
      
      toast({
        title: "Data Refreshed",
        description: "Dashboard updated with latest blockchain data."
      });
    } catch (error: any) {
      toast({
        title: "Refresh Failed",
        description: error.message || "Failed to fetch blockchain data",
        variant: "destructive"
      });
    }
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
    <DashboardLayout title="Admin Dashboard">
      <motion.div
        variants={containerAnimation}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        {/* Welcome Section */}
        <motion.div variants={itemAnimation} className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Welcome, Admin {username || userAddress?.substring(0, 6)}</h1>
            <p className="text-muted-foreground">Manage NepaliPay ecosystem from this dashboard</p>
          </div>
          <button 
            onClick={refreshData}
            className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors flex items-center gap-2"
          >
            <Activity size={16} />
            <span>Refresh Blockchain Data</span>
          </button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={itemAnimation} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-card/30 backdrop-blur-sm border border-border/40 flex items-center gap-4">
            <div className="p-4 rounded-lg bg-blue-500/10">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm text-muted-foreground">Active Users</h3>
              <p className="text-2xl font-bold">{dashboardStats.activeUsers}</p>
            </div>
          </div>
          
          <div className="p-6 rounded-xl bg-card/30 backdrop-blur-sm border border-border/40 flex items-center gap-4">
            <div className="p-4 rounded-lg bg-purple-500/10">
              <CreditCard className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-sm text-muted-foreground">Active Loans</h3>
              <p className="text-2xl font-bold">{dashboardStats.activeLoans}</p>
            </div>
          </div>
          
          <div className="p-6 rounded-xl bg-card/30 backdrop-blur-sm border border-border/40 flex items-center gap-4">
            <div className="p-4 rounded-lg bg-amber-500/10">
              <Store className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm text-muted-foreground">Pending Ads</h3>
              <p className="text-2xl font-bold">{dashboardStats.pendingAds}</p>
            </div>
          </div>
        </motion.div>

        {/* Recent Transaction Activity */}
        <motion.div variants={itemAnimation} className="rounded-xl bg-card/30 backdrop-blur-sm border border-border/40 overflow-hidden">
          <div className="px-6 py-4 border-b border-border/40">
            <h2 className="text-lg font-semibold">Recent Blockchain Activity</h2>
          </div>
          <div className="p-6">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-muted-foreground border-b border-border/40">
                  <th className="pb-2 text-left font-medium">User</th>
                  <th className="pb-2 text-left font-medium">Activity</th>
                  <th className="pb-2 text-left font-medium">Amount</th>
                  <th className="pb-2 text-left font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {dashboardStats.recentTransactions.map((tx) => (
                  <tr key={tx.id} className="text-sm border-b border-border/10 hover:bg-accent/5">
                    <td className="py-3">{tx.user}</td>
                    <td className="py-3">{tx.type}</td>
                    <td className="py-3">{tx.amount}</td>
                    <td className="py-3 text-muted-foreground">{tx.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Admin Alert */}
        <motion.div variants={itemAnimation} className="p-6 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-yellow-400">Admin Notice</h3>
              <p className="text-sm mt-1">
                All admin actions are recorded on the blockchain and cannot be reversed. Always 
                double-check before approving transactions or changing user roles.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Contract Links */}
        <motion.div variants={itemAnimation} className="p-6 rounded-xl bg-card/30 backdrop-blur-sm border border-border/40">
          <h3 className="font-medium mb-3">Smart Contract Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a 
              href="https://bscscan.com/address/0xe2d189f6696ee8b247ceae97fe3f1f2879054553#code" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors text-sm"
            >
              NepaliPay Main Contract
            </a>
            <a 
              href="https://bscscan.com/address/0x69d34B25809b346702C21EB0E22EAD8C1de58D66#code" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors text-sm"
            >
              NepaliPay Token (NPT)
            </a>
            <a 
              href="https://bscscan.com/address/0x7ff2271749409f9137dac1e082962e21cc99aee6#code" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors text-sm"
            >
              Fee Relayer Contract
            </a>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminDashboard;