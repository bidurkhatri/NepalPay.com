import React, { useState, useEffect } from 'react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import MobileNavigation from '@/components/mobile-navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpDown, Download, Filter, Search } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from '@/components/ui/input';

// Define transaction types
interface Transaction {
  id: number;
  senderId: number;
  receiverId: number;
  amount: string;
  currency: string;
  status: string;
  type: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
  sender?: {
    firstName?: string;
    lastName?: string;
  };
  receiver?: {
    firstName?: string;
    lastName?: string;
  };
}

// Define TransactionType as a string type
type TransactionType = string;

const TransactionsPage: React.FC = () => {
  // Fetch transactions using React Query
  const { data: transactions = [], isLoading: loading } = useQuery({
    queryKey: ['/api/transactions'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/transactions');
      return response.json();
    }
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getTransactionTypeDisplay = (type: string) => {
    switch(type) {
      case 'TRANSFER': return 'Transfer';
      case 'TOPUP': return 'Top Up';
      case 'UTILITY': return 'Utility';
      default: return type;
    }
  };

  const getTransactionStatusColor = (status: string) => {
    switch(status) {
      case 'COMPLETED': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'PENDING': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'FAILED': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const filteredTransactions = transactions.filter((transaction: Transaction) => {
    // Apply category filter
    if (activeTab !== 'all' && transaction.type !== activeTab) {
      return false;
    }
    
    // Apply search filter
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      return (
        transaction.amount.toLowerCase().includes(searchLower) ||
        transaction.type.toLowerCase().includes(searchLower) ||
        transaction.status.toLowerCase().includes(searchLower) ||
        (transaction.note && transaction.note.toLowerCase().includes(searchLower)) ||
        (transaction.sender?.firstName && transaction.sender.firstName.toLowerCase().includes(searchLower)) ||
        (transaction.sender?.lastName && transaction.sender.lastName.toLowerCase().includes(searchLower)) ||
        (transaction.receiver?.firstName && transaction.receiver.firstName.toLowerCase().includes(searchLower)) ||
        (transaction.receiver?.lastName && transaction.receiver.lastName.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen relative">
      <Sidebar />
      
      <main className="flex-1 flex flex-col pb-16 md:pb-0">
        <Header />

        <div className="flex-1 py-6 px-4 sm:px-6 lg:px-8 bg-black/80">
          <div className="max-w-7xl mx-auto">
            {/* Page Heading */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold gradient-text">Transactions</h1>
                <p className="text-gray-400 mt-1">View and manage your transaction history</p>
              </div>
              <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm" className="text-xs flex items-center border-primary/50 bg-primary/10 text-white hover:bg-primary/20 transition-all duration-300">
                  <Download className="h-3.5 w-3.5 mr-1" /> Export
                </Button>
                <Button variant="outline" size="sm" className="text-xs flex items-center border-primary/50 bg-primary/10 text-white hover:bg-primary/20 transition-all duration-300">
                  <Filter className="h-3.5 w-3.5 mr-1" /> Filter
                </Button>
                <Button variant="outline" size="sm" className="text-xs flex items-center border-primary/50 bg-primary/10 text-white hover:bg-primary/20 transition-all duration-300">
                  <ArrowUpDown className="h-3.5 w-3.5 mr-1" /> Sort
                </Button>
              </div>
            </div>

            {/* Tabs and Search */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
              <Tabs 
                defaultValue="all" 
                className="w-full sm:w-auto"
                onValueChange={value => setActiveTab(value)}
              >
                <TabsList className="grid grid-cols-4 w-full sm:w-auto bg-black/50 border border-primary/30">
                  <TabsTrigger value="all" className="data-[state=active]:bg-primary/20">All</TabsTrigger>
                  <TabsTrigger value="TRANSFER" className="data-[state=active]:bg-primary/20">Transfers</TabsTrigger>
                  <TabsTrigger value="TOPUP" className="data-[state=active]:bg-primary/20">Top Up</TabsTrigger>
                  <TabsTrigger value="UTILITY" className="data-[state=active]:bg-primary/20">Utilities</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary/60" />
                <Input 
                  type="text" 
                  placeholder="Search transactions..." 
                  className="pl-8 bg-black/30 border-primary/30 focus-visible:ring-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Transactions Table */}
            <div className="cyber-card glass rounded-xl overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-white/60">Loading transactions...</p>
                </div>
              ) : filteredTransactions.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-white/60">No transactions found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-primary/10">
                      <TableRow>
                        <TableHead className="text-white/70">Date</TableHead>
                        <TableHead className="text-white/70">Type</TableHead>
                        <TableHead className="text-white/70">Amount</TableHead>
                        <TableHead className="text-white/70">With</TableHead>
                        <TableHead className="text-white/70">Note</TableHead>
                        <TableHead className="text-white/70">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((transaction: Transaction) => (
                        <TableRow 
                          key={transaction.id} 
                          className="border-b border-primary/10 hover:bg-primary/5 transition-colors cursor-pointer"
                        >
                          <TableCell className="text-white/80 font-mono text-sm">
                            {formatDate(transaction.createdAt)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-primary/10 border-primary/30 text-white">
                              {getTransactionTypeDisplay(transaction.type)}
                            </Badge>
                          </TableCell>
                          <TableCell className={`font-semibold ${transaction.senderId === 1 ? 'text-red-400' : 'text-green-400'}`}>
                            {transaction.senderId === 1 ? '-' : '+'}{transaction.amount} NPR
                          </TableCell>
                          <TableCell className="text-white/80">
                            {transaction.senderId === 1
                              ? `To: ${transaction.receiver?.firstName || ''} ${transaction.receiver?.lastName || ''}`
                              : `From: ${transaction.sender?.firstName || ''} ${transaction.sender?.lastName || ''}`}
                          </TableCell>
                          <TableCell className="text-white/60 max-w-[200px] truncate">
                            {transaction.note || '-'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`${getTransactionStatusColor(transaction.status)}`}>
                              {transaction.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        </div>
        <MobileNavigation />
      </main>
    </div>
  );
};

export default TransactionsPage;