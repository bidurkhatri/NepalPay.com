import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRealTime } from '@/contexts/real-time-context';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Search,
  Filter,
  Copy,
  ExternalLink,
  Loader2,
  AlertCircle,
  Info,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import {
  Badge,
} from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const WalletPage: React.FC = () => {
  const { user } = useAuth();
  const { wsStatus, lastMessage } = useRealTime();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [transactionType, setTransactionType] = useState<'all' | 'sent' | 'received' | 'purchase'>('all');
  
  // Fetch wallet data
  const { 
    data: wallet,
    isLoading: walletLoading,
    error: walletError,
    refetch: refetchWallet
  } = useQuery({
    queryKey: ['/api/wallet'],
    retry: 1,
  });
  
  // Fetch transactions
  const {
    data: transactions,
    isLoading: transactionsLoading,
    error: transactionsError,
    refetch: refetchTransactions
  } = useQuery({
    queryKey: ['/api/transactions'],
    retry: 1,
  });
  
  // Listen for real-time updates
  React.useEffect(() => {
    if (lastMessage?.type === 'transaction_completed' || lastMessage?.type === 'balance_update') {
      refetchWallet();
      refetchTransactions();
    }
  }, [lastMessage, refetchWallet, refetchTransactions]);
  
  // Copy wallet address to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard',
      description: 'Wallet address copied to clipboard',
    });
  };
  
  // Filter transactions based on search and type filter
  const filteredTransactions = React.useMemo(() => {
    if (!transactions) return [];
    
    return transactions.filter((tx: any) => {
      // Filter by type
      if (transactionType !== 'all') {
        if (transactionType === 'sent' && tx.type !== 'sent') return false;
        if (transactionType === 'received' && tx.type !== 'received') return false;
        if (transactionType === 'purchase' && tx.type !== 'purchase') return false;
      }
      
      // Filter by search query
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
  }, [transactions, searchQuery, transactionType]);
  
  // Format transaction date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM dd, yyyy • HH:mm');
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  // Render transaction status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Completed</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pending</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
        <p className="text-muted-foreground">
          Manage your NPT tokens and view transaction history
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wallet Card */}
        <div className="lg:col-span-1">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wallet className="mr-2 h-5 w-5 text-primary" />
                Your Wallet
              </CardTitle>
              <CardDescription>Manage your digital assets</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {walletLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : walletError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>Failed to load wallet information</AlertDescription>
                </Alert>
              ) : (
                <>
                  <div className="bg-primary/5 rounded-lg p-4">
                    <div className="text-sm text-muted-foreground mb-1">NPT Balance</div>
                    <div className="text-3xl font-bold mb-1">{wallet?.nptBalance || 0} NPT</div>
                    <div className="text-sm text-muted-foreground">≈ {wallet?.nptBalance || 0} NPR</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Wallet Address</div>
                    <div className="flex items-center">
                      <div className="text-sm font-mono bg-muted p-2 rounded flex-1 truncate">
                        {wallet?.address || '0x...'}
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => copyToClipboard(wallet?.address || '')}
                              className="ml-1"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Copy Address</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="ml-1"
                              asChild
                            >
                              <a 
                                href={`https://bscscan.com/address/${wallet?.address}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View on BscScan</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Button asChild>
                      <Link href="/purchase">
                        Buy NPT Tokens
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/send">
                        Send Tokens
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Transactions Section */}
        <div className="lg:col-span-2">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View your past transactions</CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setTransactionType(value as any)}>
                <div className="flex items-center justify-between mb-4">
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="sent">Sent</TabsTrigger>
                    <TabsTrigger value="received">Received</TabsTrigger>
                    <TabsTrigger value="purchase">Purchases</TabsTrigger>
                  </TabsList>
                  
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search transactions..."
                      className="pl-9 w-[250px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <TabsContent value="all" className="mt-0">
                  {transactionsLoading ? (
                    <div className="flex items-center justify-center py-10">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : transactionsError ? (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>Failed to load transaction history</AlertDescription>
                    </Alert>
                  ) : !filteredTransactions.length ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <div className="rounded-full bg-primary/10 p-3 mb-4">
                        <Info className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-medium mb-1">No transactions found</h3>
                      <p className="text-sm text-muted-foreground max-w-sm">
                        {searchQuery 
                          ? 'No transactions match your search criteria. Try adjusting your search terms.'
                          : 'You have not made any transactions yet. Start by buying tokens or sending them to others.'}
                      </p>
                      {!searchQuery && (
                        <Button className="mt-4" asChild>
                          <Link href="/purchase">
                            Buy NPT Tokens <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Details</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredTransactions.map((tx: any) => (
                            <TableRow key={tx.id}>
                              <TableCell>
                                <div className="flex items-center">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                                    tx.type === 'received' ? 'bg-green-500/10 text-green-500' :
                                    tx.type === 'sent' ? 'bg-blue-500/10 text-blue-500' :
                                    'bg-purple-500/10 text-purple-500'
                                  }`}>
                                    {tx.type === 'received' ? <ArrowDownRight className="h-4 w-4" /> :
                                     tx.type === 'sent' ? <ArrowUpRight className="h-4 w-4" /> :
                                     <Download className="h-4 w-4" />}
                                  </div>
                                  <div>
                                    <div className="font-medium capitalize">{tx.type}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className={`font-medium ${
                                  tx.type === 'received' ? 'text-green-500' :
                                  tx.type === 'sent' ? 'text-blue-500' :
                                  ''
                                }`}>
                                  {tx.type === 'received' ? '+' : tx.type === 'sent' ? '-' : ''}
                                  {tx.amount} {tx.currency}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="max-w-[200px]">
                                  {tx.type === 'sent' && (
                                    <div className="text-sm">To: {tx.recipientName || 'Unknown'}</div>
                                  )}
                                  {tx.type === 'received' && (
                                    <div className="text-sm">From: {tx.senderName || 'Unknown'}</div>
                                  )}
                                  {tx.type === 'purchase' && (
                                    <div className="text-sm">Purchase via {tx.paymentMethod || 'Stripe'}</div>
                                  )}
                                  {tx.description && (
                                    <div className="text-xs text-muted-foreground truncate" title={tx.description}>
                                      {tx.description}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">{formatDate(tx.createdAt)}</div>
                              </TableCell>
                              <TableCell>
                                {renderStatusBadge(tx.status)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="sent" className="mt-0">
                  {/* Same content as "all" tab, filtered for sent transactions */}
                </TabsContent>
                
                <TabsContent value="received" className="mt-0">
                  {/* Same content as "all" tab, filtered for received transactions */}
                </TabsContent>
                
                <TabsContent value="purchase" className="mt-0">
                  {/* Same content as "all" tab, filtered for purchase transactions */}
                </TabsContent>
              </Tabs>
            </CardContent>
            
            {!transactionsLoading && filteredTransactions.length > 0 && (
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredTransactions.length} transactions
                </div>
                <Button variant="outline" size="sm">
                  Export CSV <Download className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;