import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRealTime } from '@/contexts/real-time-context';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Wallet,
  Plus,
  Send,
  History,
  Info,
  AlertCircle,
  Loader2,
  ArrowRight,
  QrCode,
  Shield,
  CheckCircle,
  Copy,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { TypographyH1, TypographyBody } from '@/components/ui/typography';
import EnhancedWalletCard from '@/components/ui/enhanced-wallet-card';
import EnhancedTransactionTable from '@/components/ui/enhanced-transaction-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { QRCodeSVG as QRCode } from 'qrcode.react';

const EnhancedWalletPage: React.FC = () => {
  const { user } = useAuth();
  const { wsStatus, lastMessage } = useRealTime();
  const { toast } = useToast();
  const [refreshing, setRefreshing] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [copyingAddress, setCopyingAddress] = useState(false);

  // Fetch wallet data
  const { 
    data: wallet,
    isLoading: walletLoading,
    error: walletError,
    refetch: refetchWallet,
    isFetching: walletRefetching
  } = useQuery({
    queryKey: ['/api/v1/wallet/status'],
    enabled: !!user,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch transactions
  const { 
    data: transactions = [],
    isLoading: transactionsLoading,
    error: transactionsError,
    refetch: refetchTransactions 
  } = useQuery({
    queryKey: ['/api/user/transactions'],
    enabled: !!user,
    refetchInterval: 30000,
  });

  // Create wallet if it doesn't exist
  const createWallet = async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/v1/wallet/create', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to create wallet');
      }

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Wallet Created",
          description: "Your new wallet has been generated successfully!",
        });
        await refetchWallet();
      } else {
        throw new Error(data.error || 'Failed to create wallet');
      }
    } catch (error: any) {
      toast({
        title: "Wallet Creation Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchWallet(), refetchTransactions()]);
      toast({
        title: "Data Refreshed",
        description: "Wallet and transaction data has been updated",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Could not refresh wallet data",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  // Copy wallet address to clipboard
  const copyAddress = async () => {
    if (!wallet?.address) return;
    
    setCopyingAddress(true);
    try {
      await navigator.clipboard.writeText(wallet.address);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy address to clipboard",
        variant: "destructive",
      });
    } finally {
      setCopyingAddress(false);
    }
  };

  // Open BSCScan for wallet address
  const openInExplorer = () => {
    if (!wallet?.address) return;
    window.open(`https://bscscan.com/address/${wallet.address}`, '_blank');
  };

  return (
    <motion.div 
      className="py-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="space-y-4">
        <TypographyH1>Wallet</TypographyH1>
        <TypographyBody className="text-muted-foreground">
          Manage your NPT tokens and view transaction history
        </TypographyBody>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Enhanced Wallet Card */}
        <div className="lg:col-span-1">
          {walletError ? (
            <Card className="bg-card/50 backdrop-blur-md border-warning/20">
              <CardContent className="py-8">
                <div className="text-center space-y-4">
                  <div className="rounded-full p-3 mx-auto w-fit" 
                       style={{ backgroundColor: 'rgba(255, 143, 0, 0.1)' }}>
                    <AlertCircle className="h-6 w-6" style={{ color: '#FF8F00' }} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">No Wallet Found</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      You don't have a wallet yet. Create one to start using NepaliPay.
                    </p>
                    <Button 
                      onClick={createWallet} 
                      disabled={refreshing}
                      className="min-h-[44px] w-full"
                    >
                      {refreshing ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Wallet className="mr-2 h-4 w-4" />
                      )}
                      Create Wallet
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <EnhancedWalletCard 
              wallet={wallet}
              isLoading={walletLoading}
              onRefresh={handleRefresh}
              isRefreshing={refreshing || walletRefetching}
            />
          )}

          {/* Quick Actions */}
          {wallet?.address && (
            <motion.div 
              className="mt-4 space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              <Button asChild className="w-full min-h-[44px]">
                <Link href="/purchase">
                  <Plus className="mr-2 h-4 w-4" />
                  Buy NPT Tokens
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full min-h-[44px]">
                <Link href="/send">
                  <Send className="mr-2 h-4 w-4" />
                  Send Tokens
                </Link>
              </Button>
              
              {/* Wallet Actions */}
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={copyAddress}
                  disabled={copyingAddress}
                  className="min-h-[40px]"
                >
                  <Copy className="mr-2 h-3 w-3" />
                  Copy
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowQRCode(true)}
                  className="min-h-[40px]"
                >
                  <QrCode className="mr-2 h-3 w-3" />
                  QR Code
                </Button>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={openInExplorer}
                className="w-full min-h-[40px]"
              >
                <ExternalLink className="mr-2 h-3 w-3" />
                View on BSCScan
              </Button>
            </motion.div>
          )}
        </div>

        {/* Enhanced Transaction History */}
        <div className="lg:col-span-2">
          <Card className="bg-card/50 backdrop-blur-md border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center">
                <History className="mr-2 h-5 w-5" style={{ color: '#1A73E8' }} />
                Transaction History
              </CardTitle>
              <CardDescription>Recent wallet transactions and activity</CardDescription>
            </CardHeader>
            
            <CardContent>
              {transactionsError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error Loading Transactions</AlertTitle>
                  <AlertDescription>
                    Failed to load transaction history. Please try refreshing the page.
                  </AlertDescription>
                </Alert>
              ) : !wallet?.address ? (
                <div className="text-center py-12">
                  <div className="rounded-full bg-muted/50 p-3 mx-auto w-fit mb-4">
                    <Info className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">Create Your Wallet First</h3>
                  <p className="text-sm text-muted-foreground">
                    You need to create a wallet before you can view transactions.
                  </p>
                </div>
              ) : !transactions.length && !transactionsLoading ? (
                <div className="text-center py-12">
                  <div className="rounded-full p-3 mx-auto w-fit mb-4" 
                       style={{ backgroundColor: 'rgba(26, 115, 232, 0.1)' }}>
                    <History className="h-6 w-6" style={{ color: '#1A73E8' }} />
                  </div>
                  <h3 className="font-semibold mb-2">No Transactions Yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    You haven't made any transactions yet. Start by buying tokens or sending them to others.
                  </p>
                  <Button asChild>
                    <Link href="/purchase">
                      Buy NPT Tokens <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <EnhancedTransactionTable 
                  transactions={transactions} 
                  isLoading={transactionsLoading}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRCode && wallet?.address && (
        <motion.div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowQRCode(false)}
        >
          <motion.div 
            className="bg-card border rounded-xl p-6 max-w-sm w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center mb-4">
                <Shield className="h-5 w-5 mr-2" style={{ color: '#009688' }} />
                <h3 className="font-semibold">Wallet Address</h3>
              </div>
              
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <QRCode 
                  value={wallet.address}
                  size={200}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="M"
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
              
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Wallet Address:</p>
                <p className="text-sm font-mono bg-muted p-2 rounded break-all">
                  {wallet.address}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={copyAddress}
                  disabled={copyingAddress}
                  className="flex-1"
                >
                  <Copy className="mr-2 h-3 w-3" />
                  Copy Address
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowQRCode(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
              
              <div className="flex items-center justify-center text-xs text-muted-foreground">
                <CheckCircle className="h-3 w-3 mr-1" style={{ color: '#009688' }} />
                Custodial Wallet - Secured by NepaliPay
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Real-time Status Indicator */}
      {wsStatus !== 'connected' && (
        <motion.div 
          className="fixed bottom-20 right-4 md:bottom-4 md:right-4 z-40"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Alert className="bg-warning/10 border-warning/20 backdrop-blur-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Real-time updates unavailable
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EnhancedWalletPage;