import { useState, useEffect } from 'react';
import { useWallet } from '@/contexts/wallet-context';
import { useBlockchain } from '@/contexts/blockchain-context';
import { useToast } from '@/hooks/use-toast';
import { Transaction } from '@/types';
import NepaliWalletVisualization from '@/components/nepali-wallet-visualization';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Wallet, 
  ArrowRightLeft, 
  Download, 
  Upload, 
  Send, 
  Loader2, 
  Check, 
  X,
  Clock,
  Info,
  CreditCard,
  History,
  Link as LinkIcon
} from 'lucide-react';
import { Link } from 'wouter';
import { formatDistanceToNow } from 'date-fns';

// Transaction component
const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
  const getStatusIcon = () => {
    switch (transaction.status) {
      case 'completed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'failed':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getTransactionTypeIcon = () => {
    switch (transaction.type) {
      case 'send':
        return <Send className="h-4 w-4" />;
      case 'receive':
        return <Download className="h-4 w-4" />;
      case 'deposit':
        return <Upload className="h-4 w-4" />;
      case 'withdraw':
        return <Download className="h-4 w-4" />;
      case 'purchase':
        return <CreditCard className="h-4 w-4" />;
      default:
        return <ArrowRightLeft className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div className={`
          rounded-full p-2 
          ${transaction.type === 'receive' || transaction.type === 'withdraw' 
            ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
            : 'bg-primary/10 text-primary'}
        `}>
          {getTransactionTypeIcon()}
        </div>
        <div>
          <div className="font-medium">{transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</div>
          <div className="text-xs text-muted-foreground truncate max-w-[150px]">
            {transaction.description || 
              (transaction.type === 'send' 
                ? `To: ${transaction.to.substring(0, 6)}...${transaction.to.substring(transaction.to.length - 4)}` 
                : transaction.type === 'receive' 
                  ? `From: ${transaction.from.substring(0, 6)}...${transaction.from.substring(transaction.from.length - 4)}`
                  : `${transaction.hash.substring(0, 8)}...${transaction.hash.substring(transaction.hash.length - 6)}`
              )
            }
          </div>
        </div>
      </div>
      
      <div className="flex flex-col items-end">
        <div className="flex items-center gap-1.5">
          <span className={`font-medium ${transaction.type === 'receive' || transaction.type === 'withdraw' ? 'text-green-600 dark:text-green-400' : ''}`}>
            {transaction.type === 'send' ? '-' : transaction.type === 'receive' ? '+' : ''}
            {transaction.amount} {transaction.token}
          </span>
          <div className="text-muted-foreground">{getStatusIcon()}</div>
        </div>
        <div className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(transaction.timestamp), { addSuffix: true })}
        </div>
      </div>
    </div>
  );
};

// Send Tokens Dialog
const SendTokensDialog = ({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (isOpen: boolean) => void }) => {
  const { toast } = useToast();
  const blockchain = useBlockchain();
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Basic validation
      if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        throw new Error('Please enter a valid amount');
      }

      if (!recipient || !/^0x[a-fA-F0-9]{40}$/.test(recipient)) {
        throw new Error('Please enter a valid recipient address');
      }

      // Check if amount is greater than balance
      if (parseFloat(amount) > parseFloat(blockchain.tokenBalance)) {
        throw new Error('Insufficient balance');
      }

      // Send tokens using blockchain context
      const txHash = await blockchain.sendTokens(recipient, amount);

      toast({
        title: 'Tokens Sent',
        description: `Successfully sent ${amount} NPT to ${recipient.substring(0, 6)}...${recipient.substring(recipient.length - 4)}`,
        variant: 'default',
      });

      // Reset form and close dialog
      setAmount('');
      setRecipient('');
      setIsOpen(false);

    } catch (error: any) {
      console.error('Error sending tokens:', error);
      setError(error.message || 'Failed to send tokens');
      toast({
        title: 'Transaction Failed',
        description: error.message || 'Failed to send tokens',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send NPT Tokens</DialogTitle>
          <DialogDescription>
            Enter the recipient's wallet address and the amount of NPT tokens to send.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="recipient">Recipient Address</Label>
            <Input
              id="recipient"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount (NPT)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Available: {blockchain.tokenBalance} NPT
            </p>
          </div>
          
          {error && (
            <div className="text-sm font-medium text-destructive">{error}</div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Tokens
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Wallet Page
const WalletPage = () => {
  const { toast } = useToast();
  const { 
    address, 
    balance, 
    transactions, 
    isConnected, 
    isLoading, 
    connectWallet, 
    fetchTransactions 
  } = useWallet();
  
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  
  // Fetch transactions on mount
  useEffect(() => {
    if (isConnected) {
      fetchTransactions();
    }
  }, [isConnected, fetchTransactions]);
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <h1 className="text-3xl font-bold tracking-tight mb-6">My Wallet</h1>
      
      {!isConnected ? (
        <Card className="bg-background/30 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>
              Connect your wallet to view your balance and transactions.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Wallet className="h-16 w-16 text-primary/70 mb-4" />
            <p className="text-center text-muted-foreground mb-6">
              Your wallet is not connected. Connect your wallet to access all features.
            </p>
            <Button onClick={connectWallet} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect Wallet
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Wallet Info */}
          <Card className="md:col-span-1 bg-background/30 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Wallet Details</CardTitle>
              <CardDescription>
                Your wallet info and quick actions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground">Wallet Address</Label>
                <div className="flex items-center mt-1 bg-muted/40 rounded-md p-2">
                  <code className="text-xs font-mono truncate flex-1">
                    {address}
                  </code>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => {
                      if (address) navigator.clipboard.writeText(address);
                      toast({
                        title: "Address Copied",
                        description: "Your wallet address has been copied to clipboard.",
                      });
                    }}
                  >
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">NPT Balance</Label>
                  <p className="text-xl font-semibold">{parseFloat(balance.npt).toLocaleString()} NPT</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">BNB Balance</Label>
                  <p className="text-xl font-semibold">{parseFloat(balance.bnb).toLocaleString()} BNB</p>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground mt-2">
                <Info className="h-3 w-3 inline mr-1 mb-0.5" />
                BNB is used for gas fees. Make sure you have enough BNB to perform transactions.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <div className="grid grid-cols-2 gap-2 w-full">
                <Button onClick={() => setIsSendDialogOpen(true)}>
                  <Send className="mr-2 h-4 w-4" />
                  Send
                </Button>
                <Link href="/buy-tokens">
                  <Button variant="outline" className="w-full">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Buy Tokens
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-2 gap-2 w-full">
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Deposit
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Withdraw
                </Button>
              </div>
            </CardFooter>
          </Card>
          
          {/* Transactions */}
          <Card className="md:col-span-2 bg-background/30 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Transactions</CardTitle>
              <CardDescription>
                Your recent transaction history
              </CardDescription>
            </CardHeader>
            <Tabs defaultValue="all">
              <div className="px-6">
                <TabsList className="w-full">
                  <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                  <TabsTrigger value="sent" className="flex-1">Sent</TabsTrigger>
                  <TabsTrigger value="received" className="flex-1">Received</TabsTrigger>
                  <TabsTrigger value="other" className="flex-1">Other</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="all" className="m-0">
                <ScrollArea className="h-[400px]">
                  <CardContent>
                    {transactions.length > 0 ? (
                      <div className="space-y-1">
                        {transactions.map((transaction) => (
                          <div key={transaction.id}>
                            <TransactionItem transaction={transaction} />
                            <Separator />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 flex flex-col items-center justify-center text-center">
                        <History className="h-10 w-10 text-muted-foreground mb-3" />
                        <p className="text-muted-foreground">No transactions found</p>
                        <p className="text-xs text-muted-foreground">
                          Your transaction history will appear here
                        </p>
                      </div>
                    )}
                  </CardContent>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="sent" className="m-0">
                <ScrollArea className="h-[400px]">
                  <CardContent>
                    {transactions.filter(t => t.type === 'send').length > 0 ? (
                      <div className="space-y-1">
                        {transactions
                          .filter(t => t.type === 'send')
                          .map((transaction) => (
                            <div key={transaction.id}>
                              <TransactionItem transaction={transaction} />
                              <Separator />
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="py-12 flex flex-col items-center justify-center text-center">
                        <Send className="h-10 w-10 text-muted-foreground mb-3" />
                        <p className="text-muted-foreground">No sent transactions</p>
                        <p className="text-xs text-muted-foreground">
                          Transactions you send will appear here
                        </p>
                      </div>
                    )}
                  </CardContent>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="received" className="m-0">
                <ScrollArea className="h-[400px]">
                  <CardContent>
                    {transactions.filter(t => t.type === 'receive').length > 0 ? (
                      <div className="space-y-1">
                        {transactions
                          .filter(t => t.type === 'receive')
                          .map((transaction) => (
                            <div key={transaction.id}>
                              <TransactionItem transaction={transaction} />
                              <Separator />
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="py-12 flex flex-col items-center justify-center text-center">
                        <Download className="h-10 w-10 text-muted-foreground mb-3" />
                        <p className="text-muted-foreground">No received transactions</p>
                        <p className="text-xs text-muted-foreground">
                          Transactions you receive will appear here
                        </p>
                      </div>
                    )}
                  </CardContent>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="other" className="m-0">
                <ScrollArea className="h-[400px]">
                  <CardContent>
                    {transactions.filter(t => t.type !== 'send' && t.type !== 'receive').length > 0 ? (
                      <div className="space-y-1">
                        {transactions
                          .filter(t => t.type !== 'send' && t.type !== 'receive')
                          .map((transaction) => (
                            <div key={transaction.id}>
                              <TransactionItem transaction={transaction} />
                              <Separator />
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="py-12 flex flex-col items-center justify-center text-center">
                        <ArrowRightLeft className="h-10 w-10 text-muted-foreground mb-3" />
                        <p className="text-muted-foreground">No other transactions</p>
                        <p className="text-xs text-muted-foreground">
                          Deposits, withdrawals and other transactions will appear here
                        </p>
                      </div>
                    )}
                  </CardContent>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </Card>
          
          {/* Wallet Visualization */}
          <div className="md:col-span-3">
            <NepaliWalletVisualization />
          </div>
        </div>
      )}
      
      <SendTokensDialog 
        isOpen={isSendDialogOpen} 
        setIsOpen={setIsSendDialogOpen} 
      />
    </div>
  );
};

export default WalletPage;