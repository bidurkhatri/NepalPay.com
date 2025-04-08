import React, { useState } from 'react';
import DashboardLayout from './dashboard-layout';
import { useBlockchain } from '@/contexts/blockchain-context';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp,
  PieChart,
  Calendar,
  Filter,
  ArrowUpRight,
  ChevronDown,
  Users,
  Wallet,
  CreditCard,
  AlertTriangle,
  Flag,
  FileBox,
  Settings,
  DollarSign
} from 'lucide-react';

const SuperAdminAnalyticsPage: React.FC = () => {
  const { nepaliPayContract, tokenContract, feeRelayerContract } = useBlockchain();
  const [dateRange, setDateRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Helper function to generate sample chart data
  const generateChartData = (max: number, count: number, isUp = true) => {
    const data = [];
    let current = Math.floor(Math.random() * max * 0.3) + max * 0.2;
    
    for (let i = 0; i < count; i++) {
      // Generate next value with some randomness but trending in the desired direction
      const change = (Math.random() * 0.2) * max;
      current = isUp 
        ? current + change - (Math.random() * 0.1 * max) 
        : current - change + (Math.random() * 0.1 * max);
      
      // Keep within reasonable bounds
      current = Math.max(max * 0.1, Math.min(max, current));
      
      data.push(Math.floor(current));
    }
    
    return data;
  };
  
  // Sample data for the charts
  const transactionData = {
    values: generateChartData(1000, 7, true),
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  };
  
  const loanData = {
    disbursed: generateChartData(500, 7, true),
    repaid: generateChartData(400, 7, false),
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  };
  
  const adData = {
    values: generateChartData(200, 7, true),
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  };
  
  // Function to render a simple bar chart
  const renderBarChart = (data: number[], labels: string[], height: number = 120, color: string = 'primary') => {
    const max = Math.max(...data);
    
    return (
      <div className="flex items-end h-[120px] w-full gap-1">
        {data.map((value, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div 
              className={`w-full rounded-t ${color === 'primary' ? 'bg-primary/80' : color === 'green' ? 'bg-green-500/80' : 'bg-red-500/80'}`}
              style={{ height: `${(value / max) * 100}%` }}
            ></div>
            <div className="text-xs text-gray-500 mt-1">{labels[index]}</div>
          </div>
        ))}
      </div>
    );
  };
  
  // Function to render a dual bar chart (for loans)
  const renderDualBarChart = (data1: number[], data2: number[], labels: string[]) => {
    const max = Math.max(...data1, ...data2) * 1.1;
    
    return (
      <div className="flex items-end h-[120px] w-full gap-3">
        {labels.map((label, index) => (
          <div key={index} className="flex items-end gap-1 flex-1">
            <div className="flex flex-col items-center w-1/2">
              <div 
                className="w-full rounded-t bg-green-500/80"
                style={{ height: `${(data1[index] / max) * 100}%` }}
              ></div>
            </div>
            <div className="flex flex-col items-center w-1/2">
              <div 
                className="w-full rounded-t bg-blue-500/80"
                style={{ height: `${(data2[index] / max) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
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
    <DashboardLayout title="Analytics Dashboard">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* Filters */}
        <motion.div variants={item} className="flex justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Blockchain Analytics</h2>
            <p className="text-gray-400">Comprehensive on-chain data for the NepaliPay ecosystem</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-gray-800/50 hover:bg-gray-800 text-gray-300 px-3 py-1.5 rounded-lg text-sm"
                >
                  {dateRange === 'daily' ? 'Daily' : dateRange === 'weekly' ? 'Weekly' : 'Monthly'}
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {dropdownOpen && (
                  <div className="absolute top-full right-0 mt-1 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-10">
                    <div className="py-1">
                      <button
                        onClick={() => { setDateRange('daily'); setDropdownOpen(false); }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                      >
                        Daily
                      </button>
                      <button
                        onClick={() => { setDateRange('weekly'); setDropdownOpen(false); }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                      >
                        Weekly
                      </button>
                      <button
                        onClick={() => { setDateRange('monthly'); setDropdownOpen(false); }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                      >
                        Monthly
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <button className="flex items-center gap-2 bg-primary/20 hover:bg-primary/30 text-primary px-3 py-1.5 rounded-lg text-sm">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </motion.div>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div variants={item} className="nepal-card p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">Total Users</h3>
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            <p className="text-2xl font-bold">14,358</p>
            <div className="flex items-center mt-1 text-green-400 text-xs">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>+12.5% from last week</span>
            </div>
          </motion.div>
          
          <motion.div variants={item} className="nepal-card p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">Transaction Volume</h3>
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Wallet className="w-4 h-4 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold">1.24M NPT</p>
            <div className="flex items-center mt-1 text-green-400 text-xs">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>+8.3% from last week</span>
            </div>
          </motion.div>
          
          <motion.div variants={item} className="nepal-card p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">Active Loans</h3>
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-green-400" />
              </div>
            </div>
            <p className="text-2xl font-bold">3,452</p>
            <div className="flex items-center mt-1 text-green-400 text-xs">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>+5.2% from last week</span>
            </div>
          </motion.div>
          
          <motion.div variants={item} className="nepal-card p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">Active Ads</h3>
              <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <Flag className="w-4 h-4 text-yellow-400" />
              </div>
            </div>
            <p className="text-2xl font-bold">128</p>
            <div className="flex items-center mt-1 text-green-400 text-xs">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>+15.8% from last week</span>
            </div>
          </motion.div>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Transaction Volume Chart */}
          <motion.div variants={item} className="cyber-card">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-primary" />
                <h3 className="text-lg font-bold">Transaction Volumes</h3>
              </div>
              <a href="#" className="text-primary text-sm flex items-center">
                View Details <ArrowUpRight className="w-3 h-3 ml-1" />
              </a>
            </div>
            
            <div className="mb-8">
              {renderBarChart(transactionData.values, transactionData.labels)}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-gray-400 text-xs">Total Transactions</p>
                <p className="text-xl font-bold">54,892</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Avg. Transaction</p>
                <p className="text-xl font-bold">145 NPT</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Peak Day</p>
                <p className="text-xl font-bold">Friday</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Growth Rate</p>
                <p className="text-xl font-bold text-green-400">+12.4%</p>
              </div>
            </div>
          </motion.div>
          
          {/* Loan Management Chart */}
          <motion.div variants={item} className="cyber-card">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-green-400" />
                <h3 className="text-lg font-bold">Loan Activity</h3>
              </div>
              <a href="#" className="text-primary text-sm flex items-center">
                View Details <ArrowUpRight className="w-3 h-3 ml-1" />
              </a>
            </div>
            
            <div className="mb-6">
              {renderDualBarChart(loanData.disbursed, loanData.repaid, loanData.labels)}
            </div>
            
            <div className="flex justify-between mb-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-sm mr-2"></div>
                <span className="text-sm">Loans Disbursed</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-sm mr-2"></div>
                <span className="text-sm">Loans Repaid</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-gray-400 text-xs">Total Loaned</p>
                <p className="text-xl font-bold">423,560 NPT</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Total Repaid</p>
                <p className="text-xl font-bold">385,120 NPT</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Default Rate</p>
                <p className="text-xl font-bold text-red-400">2.4%</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Avg. Interest</p>
                <p className="text-xl font-bold">5.8%</p>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ad Revenue */}
          <motion.div variants={item} className="cyber-card">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Flag className="w-5 h-5 mr-2 text-yellow-400" />
                <h3 className="text-lg font-bold">Ad Performance</h3>
              </div>
              <a href="#" className="text-primary text-sm flex items-center">
                View Details <ArrowUpRight className="w-3 h-3 ml-1" />
              </a>
            </div>
            
            <div className="mb-6">
              {renderBarChart(adData.values, adData.labels, 120, 'green')}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-gray-400 text-xs">Active Campaigns</p>
                <p className="text-xl font-bold">128</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Revenue Generated</p>
                <p className="text-xl font-bold">35,250 NPT</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Top Campaign</p>
                <p className="text-lg font-bold truncate">Kathmandu Coffee</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Approval Rate</p>
                <p className="text-xl font-bold">92.5%</p>
              </div>
            </div>
          </motion.div>
          
          {/* Real-Time Alerts */}
          <motion.div variants={item} className="cyber-card">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
                <h3 className="text-lg font-bold">Real-Time Alerts</h3>
              </div>
              <div className="bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded-full text-xs">
                3 Active
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-yellow-900/20 border border-yellow-800/30">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Peg Fluctuation</h4>
                    <p className="text-sm text-gray-300 mt-1">NPT peg is showing 1.2% deviation from target. Monitoring required.</p>
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-gray-400">5 minutes ago</span>
                      <button className="text-xs text-primary">Address</button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-blue-900/20 border border-blue-800/30">
                <div className="flex items-start">
                  <Settings className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Gas Price Spike</h4>
                    <p className="text-sm text-gray-300 mt-1">BSC gas prices have increased by 30% in the last hour. May affect transaction relaying.</p>
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-gray-400">15 minutes ago</span>
                      <button className="text-xs text-primary">Monitor</button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-green-900/20 border border-green-800/30">
                <div className="flex items-start">
                  <FileBox className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Smart Contract Activity</h4>
                    <p className="text-sm text-gray-300 mt-1">Unusual volume of loan transactions detected. No security issues found.</p>
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-gray-400">1 hour ago</span>
                      <button className="text-xs text-primary">Details</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <a href="#" className="text-primary text-sm">View all alerts</a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default SuperAdminAnalyticsPage;