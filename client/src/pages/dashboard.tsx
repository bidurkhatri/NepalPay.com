import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRealTime } from '@/contexts/real-time-context';
import WalletOverview from '@/components/wallet-overview';
import { ArrowUpRight, ArrowDownRight, LineChart, ArrowRight, Landmark, Settings, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { wsStatus } = useRealTime();
  
  return (
    <div className="py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.displayName || user?.username || 'User'}
          </p>
        </div>
        
        {wsStatus !== 'connected' && (
          <div className="bg-amber-500/10 text-amber-500 px-3 py-1.5 rounded-full text-xs flex items-center">
            <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
            <span>Live updates disconnected</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Wallet Overview Card */}
        <div className="md:col-span-2">
          <WalletOverview />
        </div>
        
        {/* Quick Actions */}
        <div className="space-y-6">
          {/* Loan Status */}
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Loan Status</CardTitle>
              <CardDescription>Your active loans and collateral</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Active Loans</div>
                  <div className="font-bold">0</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Collateral Locked</div>
                  <div className="font-bold">0 NPT</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Next Payment</div>
                  <div className="font-bold">None</div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/loans">
                  <span>View Loans</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          {/* Price Chart */}
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">NPT Price</CardTitle>
              <CardDescription>1 NPT = 1 NPR (Pegged)</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 pb-0">
              <div className="flex items-center justify-center h-40">
                <div className="flex flex-col items-center justify-center text-center p-6">
                  <LineChart className="h-12 w-12 text-primary mb-2 opacity-50" />
                  <p className="text-sm text-muted-foreground">
                    NPT is a stablecoin pegged to the Nepalese Rupee (NPR)
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/analytics">
                  <span>View Analytics</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Marketplace Preview */}
      <div>
        <h2 className="text-xl font-bold tracking-tight mb-4">Marketplace</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
            <CardHeader className="pb-2">
              <div className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center mb-2">
                <Landmark className="h-4 w-4" />
              </div>
              <CardTitle className="text-lg font-medium">Pay Utilities</CardTitle>
              <CardDescription>Pay bills directly with NPT</CardDescription>
            </CardHeader>
            <CardFooter className="pt-2">
              <Button variant="ghost" size="sm" className="w-full" asChild>
                <Link href="/payments">
                  <span>View Options</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
            <CardHeader className="pb-2">
              <div className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center mb-2">
                <Settings className="h-4 w-4" />
              </div>
              <CardTitle className="text-lg font-medium">Account Settings</CardTitle>
              <CardDescription>Manage your profile and preferences</CardDescription>
            </CardHeader>
            <CardFooter className="pt-2">
              <Button variant="ghost" size="sm" className="w-full" asChild>
                <Link href="/settings">
                  <span>Settings</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
            <CardHeader className="pb-2">
              <div className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center mb-2">
                <ArrowUpRight className="h-4 w-4" />
              </div>
              <CardTitle className="text-lg font-medium">Send to Anyone</CardTitle>
              <CardDescription>Transfer NPT tokens to any user</CardDescription>
            </CardHeader>
            <CardFooter className="pt-2">
              <Button variant="ghost" size="sm" className="w-full" asChild>
                <Link href="/send">
                  <span>Send Now</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;