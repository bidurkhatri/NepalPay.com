import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Transaction {
  id: string;
  type: 'sent' | 'received' | 'purchase';
  amount: string;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  txHash?: string;
  description?: string;
  senderName?: string;
  recipientName?: string;
  createdAt: string;
}

interface EnhancedTransactionTableProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

const ITEMS_PER_PAGE = 15;

export function EnhancedTransactionTable({ 
  transactions, 
  isLoading 
}: EnhancedTransactionTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'sent' | 'received' | 'purchase'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter transactions
  const filteredTransactions = React.useMemo(() => {
    return transactions.filter((tx) => {
      // Type filter
      if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
      
      // Status filter
      if (statusFilter !== 'all' && tx.status !== statusFilter) return false;
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          tx.txHash?.toLowerCase().includes(query) ||
          tx.description?.toLowerCase().includes(query) ||
          tx.senderName?.toLowerCase().includes(query) ||
          tx.recipientName?.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  }, [transactions, searchQuery, typeFilter, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM dd, yyyy • HH:mm');
    } catch (e) {
      return 'Invalid date';
    }
  };

  const renderStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" style={{ color: '#2E7D32' }} />;
      case 'pending':
        return <Clock className="h-4 w-4" style={{ color: '#FF8F00' }} />;
      case 'failed':
        return <AlertCircle className="h-4 w-4" style={{ color: '#C62828' }} />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="outline" style={{ 
            backgroundColor: 'rgba(46, 125, 50, 0.1)', 
            color: '#2E7D32', 
            borderColor: 'rgba(46, 125, 50, 0.2)' 
          }}>
            Completed
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" style={{ 
            backgroundColor: 'rgba(255, 143, 0, 0.1)', 
            color: '#FF8F00', 
            borderColor: 'rgba(255, 143, 0, 0.2)' 
          }}>
            Pending
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="outline" style={{ 
            backgroundColor: 'rgba(198, 40, 40, 0.1)', 
            color: '#C62828', 
            borderColor: 'rgba(198, 40, 40, 0.2)' 
          }}>
            Failed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderTypeIcon = (type: string) => {
    switch (type) {
      case 'sent':
        return <ArrowUpRight className="h-4 w-4" style={{ color: '#C62828' }} />;
      case 'received':
        return <ArrowDownRight className="h-4 w-4" style={{ color: '#2E7D32' }} />;
      case 'purchase':
        return <Download className="h-4 w-4" style={{ color: '#1A73E8' }} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="min-h-[44px]">
                <Filter className="mr-2 h-4 w-4" />
                Type: {typeFilter === 'all' ? 'All' : typeFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setTypeFilter('all')}>
                All Types
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter('sent')}>
                Sent
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter('received')}>
                Received
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter('purchase')}>
                Purchase
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="min-h-[44px]">
                <Filter className="mr-2 h-4 w-4" />
                Status: {statusFilter === 'all' ? 'All' : statusFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                All Status
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('completed')}>
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('failed')}>
                Failed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="rounded-md border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead className="w-[100px]">Type</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="w-[180px]">Date</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span className="ml-2 text-muted-foreground">Loading transactions...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginatedTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTransactions.map((tx, index) => (
                  <motion.tr
                    key={tx.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="border-border/50 hover:bg-muted/20 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center">
                        {renderTypeIcon(tx.type)}
                        <span className="ml-2 text-sm font-medium capitalize">
                          {tx.type}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">
                          {tx.description || `${tx.type} transaction`}
                        </div>
                        {tx.txHash && (
                          <div className="text-xs text-muted-foreground font-mono">
                            {`${tx.txHash.substring(0, 10)}...${tx.txHash.substring(tx.txHash.length - 8)}`}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="font-medium">
                        {tx.amount} {tx.currency}
                      </div>
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center space-x-2">
                              {renderStatusIcon(tx.status)}
                              {renderStatusBadge(tx.status)}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Transaction {tx.status}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(tx.createdAt)}
                    </TableCell>
                    <TableCell>
                      {tx.txHash && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                asChild
                              >
                                <a
                                  href={`https://bscscan.com/tx/${tx.txHash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label="View transaction on BscScan"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View on BscScan</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredTransactions.length)} of {filteredTransactions.length} transactions
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="min-h-[44px]"
            >
              Previous
            </Button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="min-h-[44px] min-w-[44px]"
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="min-h-[44px]"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EnhancedTransactionTable;