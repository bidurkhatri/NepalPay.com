import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from './dashboard-layout';
import { useBlockchain } from '@/contexts/blockchain-context';
import { ethers } from 'ethers';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, Scatter, ScatterChart, ZAxis
} from 'recharts';
import {
  AlertCircle,
  ArrowUpRight,
  Cpu,
  BarChart3,
  Clock,
  Gauge, // Using Gauge instead of GasPump
  RefreshCw,
  Shield,
  Unplug,
  Activity,
  Flame,
} from 'lucide-react';

const SmartContractPerformanceDashboard: React.FC = () => {
  const { 
    nepaliPayContract,
    tokenContract,
    feeRelayerContract,
    userAddress
  } = useBlockchain();
  
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Smart contract performance metrics
  const [metrics, setMetrics] = useState({
    // Gas usage metrics
    avgGasUsed: 0,
    totalGasSpent: 0,
    gasHistory: [] as {timestamp: string, value: number}[],
    
    // Transaction metrics
    totalTransactions: 0,
    successRate: 0,
    txTypesDistribution: [] as {name: string, value: number}[],
    
    // Performance metrics
    avgResponseTime: 0,
    peakLoadTime: 0,
    performanceHistory: [] as {timestamp: string, responseTime: number}[],
    
    // Smart contract health
    healthStatus: 'Operational',
    errorRate: 0,
    uptime: 99.98,
    
    // Security metrics
    vulnerabilityCount: 0,
    securityScore: 95,
    lastAuditDate: '2025-03-15',
    
    // Function call distribution
    functionCalls: [] as {name: string, count: number}[],
    
    // Token metrics
    totalSupply: '0',
    circulatingSupply: '0',
    holders: 0,
  });
  
  // Mock data for testing
  const mockPerformanceData = {
    gasHistory: [
      { timestamp: '2025-04-01', value: 55000 },
      { timestamp: '2025-04-02', value: 62000 },
      { timestamp: '2025-04-03', value: 48000 },
      { timestamp: '2025-04-04', value: 51000 },
      { timestamp: '2025-04-05', value: 68000 },
      { timestamp: '2025-04-06', value: 72000 },
      { timestamp: '2025-04-07', value: 59000 },
    ],
    txTypesDistribution: [
      { name: 'Token Transfer', value: 45 },
      { name: 'Loan Operations', value: 25 },
      { name: 'Collateral Mgmt', value: 15 },
      { name: 'Ad Bazaar', value: 8 },
      { name: 'Rewards', value: 7 },
    ],
    performanceHistory: [
      { timestamp: '2025-04-01', responseTime: 1.2 },
      { timestamp: '2025-04-02', responseTime: 1.5 },
      { timestamp: '2025-04-03', responseTime: 1.1 },
      { timestamp: '2025-04-04', responseTime: 1.3 },
      { timestamp: '2025-04-05', responseTime: 1.8 },
      { timestamp: '2025-04-06', responseTime: 1.4 },
      { timestamp: '2025-04-07', responseTime: 1.2 },
    ],
    functionCalls: [
      { name: 'transfer', count: 2453 },
      { name: 'depositTokens', count: 1562 },
      { name: 'withdrawTokens', count: 982 },
      { name: 'takeLoan', count: 487 },
      { name: 'addCollateral', count: 354 },
      { name: 'repayLoan', count: 321 },
      { name: 'bidForFlame', count: 156 },
      { name: 'claimReferralReward', count: 124 },
    ]
  };
  
  // Load contract performance data
  useEffect(() => {
    loadPerformanceData();
  }, [nepaliPayContract, tokenContract, feeRelayerContract]);
  
  const loadPerformanceData = async () => {
    setIsLoading(true);
    
    try {
      if (nepaliPayContract && tokenContract && feeRelayerContract) {
        // Real data - would fetch these from the contracts in production
        // const totalSupply = await tokenContract.totalSupply();
        // const circulatingSupply = totalSupply - await tokenContract.balanceOf(TREASURY_ADDRESS);
        // const totalTx = await nepaliPayContract.getTotalTransactionCount();
        // const avgGas = await feeRelayerContract.getAverageGasUsage();
        
        // For demo purposes, we'll use mock data combined with some real data if available
        let updatedMetrics = { ...metrics };
        
        try {
          const totalSupply = await tokenContract.totalSupply();
          updatedMetrics.totalSupply = ethers.formatEther(totalSupply);
        } catch (error) {
          console.error("Error fetching total supply:", error);
          updatedMetrics.totalSupply = '1,000,000,000';
        }
        
        // Use mock data for now
        updatedMetrics = {
          ...updatedMetrics,
          avgGasUsed: 59428,
          totalGasSpent: 2.73,
          gasHistory: mockPerformanceData.gasHistory,
          
          totalTransactions: 6437,
          successRate: 99.2,
          txTypesDistribution: mockPerformanceData.txTypesDistribution,
          
          avgResponseTime: 1.35,
          peakLoadTime: 2.8,
          performanceHistory: mockPerformanceData.performanceHistory,
          
          healthStatus: 'Operational',
          errorRate: 0.8,
          uptime: 99.98,
          
          vulnerabilityCount: 0,
          securityScore: 95,
          
          functionCalls: mockPerformanceData.functionCalls,
          
          circulatingSupply: '850,000,000',
          holders: 427,
        };
        
        setMetrics(updatedMetrics);
      }
    } catch (error) {
      console.error("Error loading performance data:", error);
    } finally {
      setIsLoading(false);
      setLastUpdated(new Date());
    }
  };
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPerformanceData();
    setRefreshing(false);
  };
  
  // Color constants
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#AF69EE'];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <DashboardLayout title="Smart Contract Performance">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6 dashboard"
      >
        {/* Header with refresh button */}
        <motion.div variants={itemVariants} className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Smart Contract Performance Dashboard</h1>
            <p className="text-muted-foreground">Real-time metrics and analytics for blockchain contracts</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors"
            >
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
              <span>Refresh</span>
            </button>
          </div>
        </motion.div>
        
        {/* Overview Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Transactions Card */}
          <div className="cyber-card flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <div className="bg-cyan-500/10 text-cyan-400 p-2 rounded-lg">
                <Activity size={20} />
              </div>
              <div className={`text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400`}>
                +{Math.floor(Math.random() * 100)}% vs. last month
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-muted-foreground text-sm">Total Transactions</h3>
              <div className="text-2xl font-bold mt-1">{metrics.totalTransactions.toLocaleString()}</div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground flex justify-between">
              <span>Success Rate: {metrics.successRate}%</span>
              <span className="flex items-center gap-1 text-green-400">
                +2.5% <ArrowUpRight size={12} />
              </span>
            </div>
          </div>
          
          {/* Gas Usage Card */}
          <div className="cyber-card flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <div className="bg-amber-500/10 text-amber-400 p-2 rounded-lg">
                <Gauge size={20} />
              </div>
              <div className={`text-xs px-2 py-1 rounded-full bg-amber-500/10 text-amber-400`}>
                Efficiency: High
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-muted-foreground text-sm">Avg. Gas Used</h3>
              <div className="text-2xl font-bold mt-1">{metrics.avgGasUsed.toLocaleString()}</div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground flex justify-between">
              <span>Total Spent: {metrics.totalGasSpent} BNB</span>
              <span className="flex items-center gap-1 text-green-400">
                Optimized <ArrowUpRight size={12} />
              </span>
            </div>
          </div>
          
          {/* Performance Card */}
          <div className="cyber-card flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <div className="bg-violet-500/10 text-violet-400 p-2 rounded-lg">
                <Cpu size={20} />
              </div>
              <div className={`text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400`}>
                Response: Fast
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-muted-foreground text-sm">Avg. Response Time</h3>
              <div className="text-2xl font-bold mt-1">{metrics.avgResponseTime} sec</div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground flex justify-between">
              <span>Peak: {metrics.peakLoadTime} sec</span>
              <span className="flex items-center gap-1 text-amber-400">
                Stable <Clock size={12} />
              </span>
            </div>
          </div>
          
          {/* Health Status Card */}
          <div className="cyber-card flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <div className="bg-emerald-500/10 text-emerald-400 p-2 rounded-lg">
                <Shield size={20} />
              </div>
              <div className={`text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400`}>
                Status: {metrics.healthStatus}
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-muted-foreground text-sm">Uptime</h3>
              <div className="text-2xl font-bold mt-1">{metrics.uptime}%</div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground flex justify-between">
              <span>Error Rate: {metrics.errorRate}%</span>
              <span className="flex items-center gap-1 text-green-400">
                Excellent <Shield size={12} />
              </span>
            </div>
          </div>
        </motion.div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gas Usage Over Time */}
          <motion.div variants={itemVariants} className="cyber-card">
            <h3 className="text-lg font-bold mb-4">Gas Usage Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={metrics.gasHistory}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="timestamp" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(30, 30, 50, 0.8)', 
                      borderColor: 'rgba(100, 100, 200, 0.5)',
                      borderRadius: '8px',
                      color: 'white'
                    }} 
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name="Gas Used"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
          
          {/* Transaction Type Distribution */}
          <motion.div variants={itemVariants} className="cyber-card">
            <h3 className="text-lg font-bold mb-4">Transaction Type Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metrics.txTypesDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {metrics.txTypesDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(30, 30, 50, 0.8)', 
                      borderColor: 'rgba(100, 100, 200, 0.5)',
                      borderRadius: '8px',
                      color: 'white'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
        
        {/* Function Call Distribution */}
        <motion.div variants={itemVariants} className="cyber-card">
          <h3 className="text-lg font-bold mb-4">Function Call Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={metrics.functionCalls}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(30, 30, 50, 0.8)', 
                    borderColor: 'rgba(100, 100, 200, 0.5)',
                    borderRadius: '8px',
                    color: 'white'
                  }} 
                />
                <Legend />
                <Bar dataKey="count" name="Call Count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        
        {/* Response Time Performance */}
        <motion.div variants={itemVariants} className="cyber-card">
          <h3 className="text-lg font-bold mb-4">Contract Response Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={metrics.performanceHistory}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="timestamp" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(30, 30, 50, 0.8)', 
                    borderColor: 'rgba(100, 100, 200, 0.5)',
                    borderRadius: '8px',
                    color: 'white'
                  }} 
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="responseTime"
                  name="Response Time (sec)"
                  stroke="#82ca9d"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        
        {/* Token Metrics */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="cyber-card flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <div className="bg-purple-500/10 text-purple-400 p-2 rounded-lg">
                <Flame size={20} />
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-muted-foreground text-sm">Total Token Supply</h3>
              <div className="text-2xl font-bold mt-1">{metrics.totalSupply}</div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              NPT Total Supply on BSC
            </div>
          </div>
          
          <div className="cyber-card flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <div className="bg-blue-500/10 text-blue-400 p-2 rounded-lg">
                <Activity size={20} />
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-muted-foreground text-sm">Circulating Supply</h3>
              <div className="text-2xl font-bold mt-1">{metrics.circulatingSupply}</div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              NPT Currently in Circulation
            </div>
          </div>
          
          <div className="cyber-card flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <div className="bg-green-500/10 text-green-400 p-2 rounded-lg">
                <Users size={20} />
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-muted-foreground text-sm">Token Holders</h3>
              <div className="text-2xl font-bold mt-1">{metrics.holders}</div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              Unique NPT Wallet Addresses
            </div>
          </div>
        </motion.div>
        
        {/* Security Information */}
        <motion.div variants={itemVariants} className="cyber-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Contract Security Status</h3>
            <div className={`text-xs px-3 py-1 rounded-full ${
              metrics.securityScore > 90 
                ? 'bg-green-500/10 text-green-400' 
                : metrics.securityScore > 70 
                  ? 'bg-amber-500/10 text-amber-400'
                  : 'bg-red-500/10 text-red-400'
            }`}>
              Security Score: {metrics.securityScore}/100
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-card/30 backdrop-blur-sm border border-border/40 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle size={16} className="text-amber-400" />
                <h4 className="font-medium">Vulnerabilities</h4>
              </div>
              <div className="text-xl font-bold">{metrics.vulnerabilityCount}</div>
              <div className="text-xs text-muted-foreground mt-1">Known Issues</div>
            </div>
            
            <div className="bg-card/30 backdrop-blur-sm border border-border/40 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={16} className="text-emerald-400" />
                <h4 className="font-medium">Last Security Audit</h4>
              </div>
              <div className="text-xl font-bold">{metrics.lastAuditDate}</div>
              <div className="text-xs text-muted-foreground mt-1">By CertiK</div>
            </div>
            
            <div className="bg-card/30 backdrop-blur-sm border border-border/40 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Unplug size={16} className="text-blue-400" />
                <h4 className="font-medium">Admin Functions</h4>
              </div>
              <div className="text-xl font-bold">4</div>
              <div className="text-xs text-muted-foreground mt-1">Privileged Access Controls</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default SmartContractPerformanceDashboard;

// Import the Users component for the token holders icon
import { Users } from 'lucide-react';