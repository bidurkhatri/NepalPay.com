import { useState } from 'react';
import { useWallet } from '@/contexts/wallet-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBlockchain } from '@/contexts/blockchain-context';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';

// Analytics data for income/expenses over time
const monthlyData = [
  { name: 'Jan', income: 2400, expenses: 1800 },
  { name: 'Feb', income: 1398, expenses: 1000 },
  { name: 'Mar', income: 9800, expenses: 8200 },
  { name: 'Apr', income: 3908, expenses: 2500 },
  { name: 'May', income: 4800, expenses: 3000 },
  { name: 'Jun', income: 3800, expenses: 3300 },
  { name: 'Jul', income: 6000, expenses: 4000 },
  { name: 'Aug', income: 8900, expenses: 7000 },
  { name: 'Sep', income: 7000, expenses: 5500 },
  { name: 'Oct', income: 5300, expenses: 3800 },
  { name: 'Nov', income: 6200, expenses: 4300 },
  { name: 'Dec', income: 8100, expenses: 6500 },
];

// Category breakdown data
const categoryData = [
  { name: 'Utilities', value: 400 },
  { name: 'Food', value: 300 },
  { name: 'Entertainment', value: 300 },
  { name: 'Transport', value: 200 },
  { name: 'Shopping', value: 150 },
  { name: 'Healthcare', value: 100 },
];

// Colors for category pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#a174f2'];

// Transaction activity data (daily)
const activityData = [
  { day: 'Mon', transactions: 10 },
  { day: 'Tue', transactions: 15 },
  { day: 'Wed', transactions: 8 },
  { day: 'Thu', transactions: 12 },
  { day: 'Fri', transactions: 20 },
  { day: 'Sat', transactions: 18 },
  { day: 'Sun', transactions: 5 },
];

// Token price history (example for NPT token)
const tokenPriceData = [
  { date: '2023-01', price: 0.50 },
  { date: '2023-02', price: 0.55 },
  { date: '2023-03', price: 0.48 },
  { date: '2023-04', price: 0.60 },
  { date: '2023-05', price: 0.75 },
  { date: '2023-06', price: 0.85 },
  { date: '2023-07', price: 0.80 },
  { date: '2023-08', price: 0.95 },
  { date: '2023-09', price: 1.10 },
  { date: '2023-10', price: 1.25 },
  { date: '2023-11', price: 1.30 },
  { date: '2023-12', price: 1.45 },
];

export default function AnalyticsPage() {
  const { wallet, stats } = useWallet();
  const { tokenBalance, nptBalance } = useBlockchain();
  const [activeSection, setActiveSection] = useState('financial');

  return (
    <div className="flex flex-col md:flex-row min-h-screen relative">
      <Sidebar />
      
      <main className="flex-1 flex flex-col pb-16 md:pb-0">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col space-y-8">
            <div className="flex flex-col space-y-2">
              <h1 className="text-3xl font-bold text-white">Analytics</h1>
              <p className="text-gray-400">Track and analyze your financial activities</p>
            </div>

            {/* Analytics Navigation */}
            <div className="flex flex-wrap space-x-2 sm:space-x-4 pb-4 border-b border-primary/30">
              <button 
                className={`px-3 sm:px-4 py-2 rounded-md ${activeSection === 'financial' ? 'bg-primary/20 border border-primary/50 text-primary' : 'text-white hover:bg-primary/10'}`}
                onClick={() => setActiveSection('financial')}
              >
                Financial Overview
              </button>
              <button 
                className={`px-3 sm:px-4 py-2 rounded-md ${activeSection === 'spending' ? 'bg-primary/20 border border-primary/50 text-primary' : 'text-white hover:bg-primary/10'}`}
                onClick={() => setActiveSection('spending')}
              >
                Spending Analysis
              </button>
              <button 
                className={`px-3 sm:px-4 py-2 rounded-md ${activeSection === 'crypto' ? 'bg-primary/20 border border-primary/50 text-primary' : 'text-white hover:bg-primary/10'}`}
                onClick={() => setActiveSection('crypto')}
              >
                Crypto Analytics
              </button>
            </div>

            {/* Financial Overview Section */}
            {activeSection === 'financial' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-black/40 border-primary/20 text-white">
                  <CardHeader>
                    <CardTitle>Income vs Expenses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={monthlyData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                          <XAxis dataKey="name" stroke="#888" />
                          <YAxis stroke="#888" />
                          <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333' }} />
                          <Legend />
                          <Line type="monotone" dataKey="income" stroke="#00C49F" activeDot={{ r: 8 }} />
                          <Line type="monotone" dataKey="expenses" stroke="#FF8042" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 border-primary/20 text-white">
                  <CardHeader>
                    <CardTitle>Transaction Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={activityData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                          <XAxis dataKey="day" stroke="#888" />
                          <YAxis stroke="#888" />
                          <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333' }} />
                          <Legend />
                          <Bar dataKey="transactions" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Spending Analysis Section */}
            {activeSection === 'spending' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-black/40 border-primary/20 text-white">
                  <CardHeader>
                    <CardTitle>Spending by Category</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333' }} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 border-primary/20 text-white">
                  <CardHeader>
                    <CardTitle>Monthly Spending Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={monthlyData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                          <XAxis dataKey="name" stroke="#888" />
                          <YAxis stroke="#888" />
                          <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333' }} />
                          <Legend />
                          <Line type="monotone" dataKey="expenses" stroke="#FF8042" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Crypto Analytics Section */}
            {activeSection === 'crypto' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-black/40 border-primary/20 text-white">
                  <CardHeader>
                    <CardTitle>NPT Token Price History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={tokenPriceData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                          <XAxis dataKey="date" stroke="#888" />
                          <YAxis stroke="#888" />
                          <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333' }} />
                          <Legend />
                          <Line type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 border-primary/20 text-white">
                  <CardHeader>
                    <CardTitle>Your Crypto Portfolio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'NPT Balance', value: parseFloat(nptBalance) || 0 },
                              { name: 'Other Tokens', value: parseFloat(tokenBalance) || 0 },
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            <Cell fill="#0088FE" />
                            <Cell fill="#FFBB28" />
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333' }} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}