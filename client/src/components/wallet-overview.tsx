import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet, DollarSign, LineChart, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useRealTime } from '@/contexts/real-time-context';
import { Progress } from '@/components/ui/progress';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const WalletOverview: React.FC = () => {
  const { lastMessage, wsStatus } = useRealTime();
  const [animateBalance, setAnimateBalance] = useState(false);
  
  // Fetch wallet data
  const { data: wallet, isLoading } = useQuery({
    queryKey: ['/api/wallet'],
    retry: 1,
  });
  
  // Animation for balance updates
  useEffect(() => {
    if (lastMessage?.type === 'transaction_completed' || lastMessage?.type === 'balance_update') {
      setAnimateBalance(true);
      const timer = setTimeout(() => setAnimateBalance(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [lastMessage]);

  if (isLoading) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="h-5 bg-primary/10 rounded animate-pulse"></div>
            <div className="h-12 bg-primary/10 rounded animate-pulse"></div>
            <div className="h-24 bg-primary/5 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle case when wallet doesn't exist yet
  const walletData = wallet || {
    nptBalance: 0,
    bnbBalance: 0,
    lastTransactions: []
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-medium">Wallet Overview</CardTitle>
          <div className="flex items-center">
            {wsStatus === 'connected' && (
              <div className="flex items-center text-xs text-muted-foreground mr-2">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                Live
              </div>
            )}
            <Wallet className="h-5 w-5 text-primary" />
          </div>
        </div>
        <CardDescription>Your digital asset portfolio</CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="space-y-6">
          {/* Main NPT Balance */}
          <div>
            <div className="text-sm text-muted-foreground mb-1.5">Available NPT</div>
            <div className={`text-3xl font-bold mb-1 flex items-center ${
              animateBalance ? 'text-primary transition-colors duration-1000' : ''
            }`}>
              <span>{Number(walletData.nptBalance).toLocaleString()}</span>
              <span className="text-lg ml-2 text-muted-foreground">NPT</span>
            </div>
            <div className="text-sm text-muted-foreground">
              ≈ {Number(walletData.nptBalance).toLocaleString()} NPR
            </div>
          </div>
          
          {/* Secondary Balances */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card/50 border border-border/50 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">BNB Balance</div>
              <div className="text-lg font-medium">{Number(walletData.bnbBalance).toFixed(4)}</div>
            </div>
            
            <div className="bg-card/50 border border-border/50 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">Current Value</div>
              <div className="text-lg font-medium">
                ${Number(walletData.bnbBalance * 250).toLocaleString()}
              </div>
            </div>
          </div>
          
          {/* Recent Activity Preview */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium">Recent Activity</h4>
              <Link href="/wallet" className="text-xs text-primary hover:underline">View All</Link>
            </div>
            
            {walletData.lastTransactions && walletData.lastTransactions.length > 0 ? (
              <div className="space-y-3">
                {walletData.lastTransactions.slice(0, 2).map((tx: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        tx.type === 'received' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {tx.type === 'received' ? <ArrowDownRight className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                      </div>
                      <div>
                        <div className="font-medium">{tx.type === 'received' ? 'Received' : 'Sent'}</div>
                        <div className="text-xs text-muted-foreground">{tx.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={tx.type === 'received' ? 'text-green-500' : 'text-red-500'}>
                        {tx.type === 'received' ? '+' : '-'}{tx.amount} NPT
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground text-center py-2 border border-dashed border-border/50 rounded-lg">
                No recent transactions
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2 pt-2">
        <Button variant="outline" className="w-full gap-1 bg-card/50" asChild>
          <Link href="/send">
            Send <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="default" className="w-full gap-1 bg-primary" asChild>
          <Link href="/purchase">
            Buy <DollarSign className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WalletOverview;