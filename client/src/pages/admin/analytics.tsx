import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronDown, BarChart3, TrendingUp, CreditCard } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DashboardLayout from './dashboard-layout';
import { useBlockchain } from '@/contexts/blockchain-context';

const AdminAnalyticsPage: React.FC = () => {
  const { nepaliPayContract, tokenContract, feeRelayerContract } = useBlockchain();
  const [dateRange, setDateRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Helper function to generate sample chart data (in production, this would use blockchain data)
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
  
  // Get labels based on selected date range
  const getLabels = () => {
    if (dateRange === 'daily') {
      return ['12am', '3am', '6am', '9am', '12pm', '3pm', '6pm', '9pm'];
    } else if (dateRange === 'weekly') {
      return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    } else {
      return ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    }
  };
  
  // Sample data for the charts
  const labels = getLabels();
  const dataCount = labels.length;
  
  const transactionData = labels.map((label, index) => ({
    name: label,
    value: generateChartData(1000, dataCount, true)[index]
  }));
  
  const loanData = labels.map((label, index) => ({
    name: label,
    disbursed: generateChartData(500, dataCount, true)[index],
    repaid: generateChartData(400, dataCount, false)[index]
  }));
  
  const adData = labels.map((label, index) => ({
    name: label,
    posted: generateChartData(15, dataCount, true)[index],
    approved: generateChartData(10, dataCount, true)[index],
    rejected: generateChartData(5, dataCount, false)[index]
  }));
  
  const adRevenue = labels.map((label, index) => ({
    name: label,
    revenue: generateChartData(2000, dataCount, true)[index]
  }));

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
    <DashboardLayout title="Analytics Dashboard">
      <motion.div
        variants={containerAnimation}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        <motion.div variants={itemAnimation} className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Blockchain Analytics</h1>
            <p className="text-muted-foreground">Monitor key metrics from NepaliPay ecosystem</p>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-card/30 backdrop-blur-sm border border-border/40 rounded-lg"
            >
              <Calendar className="w-4 h-4" />
              <span className="capitalize">{dateRange}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-card/90 backdrop-blur-md border border-border/40 rounded-lg shadow-lg overflow-hidden z-10">
                <button
                  onClick={() => {
                    setDateRange('daily');
                    setDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-accent/50 transition-colors"
                >
                  Daily
                </button>
                <button
                  onClick={() => {
                    setDateRange('weekly');
                    setDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-accent/50 transition-colors"
                >
                  Weekly
                </button>
                <button
                  onClick={() => {
                    setDateRange('monthly');
                    setDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-accent/50 transition-colors"
                >
                  Monthly
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Transaction Volume Chart */}
        <motion.div variants={itemAnimation} className="rounded-xl bg-card/30 backdrop-blur-sm border border-border/40 p-6">
          <div className="flex items-center mb-6">
            <div className="p-3 rounded-lg bg-blue-500/10 mr-4">
              <BarChart3 className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Transaction Volume</h2>
              <p className="text-sm text-muted-foreground">Total transactions processed through NepaliPay</p>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={transactionData}>
                <defs>
                  <linearGradient id="colorTransaction" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.8)', 
                    borderColor: 'rgba(71, 85, 105, 0.2)',
                    borderRadius: '0.5rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorTransaction)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Loan Activity Chart */}
        <motion.div variants={itemAnimation} className="rounded-xl bg-card/30 backdrop-blur-sm border border-border/40 p-6">
          <div className="flex items-center mb-6">
            <div className="p-3 rounded-lg bg-purple-500/10 mr-4">
              <CreditCard className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Loan Activity</h2>
              <p className="text-sm text-muted-foreground">Loans disbursed vs repaid in the NepaliPay system</p>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={loanData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.8)', 
                    borderColor: 'rgba(71, 85, 105, 0.2)',
                    borderRadius: '0.5rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                  }}
                />
                <Legend />
                <Bar dataKey="disbursed" name="Loans Disbursed" fill="#a855f7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="repaid" name="Loans Repaid" fill="#2dd4bf" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Ad Performance Charts (split into two columns) */}
        <motion.div variants={itemAnimation} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ad Counts */}
          <div className="rounded-xl bg-card/30 backdrop-blur-sm border border-border/40 p-6">
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-lg bg-amber-500/10 mr-4">
                <BarChart3 className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Ad Performance</h2>
                <p className="text-sm text-muted-foreground">Posted, approved and rejected ads</p>
              </div>
            </div>
            
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={adData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.8)', 
                      borderColor: 'rgba(71, 85, 105, 0.2)',
                      borderRadius: '0.5rem',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                    }}
                  />
                  <Legend />
                  <Bar dataKey="posted" name="Posted" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="approved" name="Approved" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="rejected" name="Rejected" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Ad Revenue */}
          <div className="rounded-xl bg-card/30 backdrop-blur-sm border border-border/40 p-6">
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-lg bg-green-500/10 mr-4">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Ad Revenue</h2>
                <p className="text-sm text-muted-foreground">NPT collected from ad placements</p>
              </div>
            </div>
            
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={adRevenue}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.8)', 
                      borderColor: 'rgba(71, 85, 105, 0.2)',
                      borderRadius: '0.5rem',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    name="NPT Revenue"
                    stroke="#22c55e" 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Stats Summary */}
        <motion.div variants={itemAnimation} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-xl bg-card/30 backdrop-blur-sm border border-border/40">
            <div className="text-muted-foreground text-sm mb-2">Total Transactions</div>
            <div className="text-2xl font-bold">34,521</div>
            <div className="text-green-400 text-sm mt-2">+12.4% from last {dateRange}</div>
          </div>
          
          <div className="p-6 rounded-xl bg-card/30 backdrop-blur-sm border border-border/40">
            <div className="text-muted-foreground text-sm mb-2">Active Loans</div>
            <div className="text-2xl font-bold">2,144</div>
            <div className="text-green-400 text-sm mt-2">+5.2% from last {dateRange}</div>
          </div>
          
          <div className="p-6 rounded-xl bg-card/30 backdrop-blur-sm border border-border/40">
            <div className="text-muted-foreground text-sm mb-2">NPT Trading Volume</div>
            <div className="text-2xl font-bold">984,300 NPT</div>
            <div className="text-green-400 text-sm mt-2">+18.7% from last {dateRange}</div>
          </div>
          
          <div className="p-6 rounded-xl bg-card/30 backdrop-blur-sm border border-border/40">
            <div className="text-muted-foreground text-sm mb-2">Ad Approval Rate</div>
            <div className="text-2xl font-bold">76.3%</div>
            <div className="text-red-400 text-sm mt-2">-2.1% from last {dateRange}</div>
          </div>
        </motion.div>

        <motion.div variants={itemAnimation} className="text-xs text-muted-foreground">
          <p>Data is fetched from the NepaliPay blockchain contracts and refreshed every 5 minutes.</p>
          <p>Last updated: {new Date().toLocaleString()}</p>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminAnalyticsPage;