import React from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRealTime } from '@/contexts/real-time-context';
import WalletOverview from '@/components/wallet-overview';
import { ArrowUpRight, ArrowDownRight, LineChart, ArrowRight, Landmark, Settings, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { AnimatedCard } from '@/components/ui/animated-card';
import { ResponsiveContainer } from '@/components/ui/responsive-container';
import { ResponsiveGrid } from '@/components/layout/responsive-grid';
import { EnhancedButton } from '@/components/ui/enhanced-button';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { wsStatus } = useRealTime();
  
  return (
    <ResponsiveContainer maxWidth="7xl" padding="md">
      <div className="py-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground text-lg">
              Welcome back, {user?.displayName || user?.username || 'User'}
            </p>
          </div>
          
          {wsStatus !== 'connected' && (
            <div className="bg-amber-500/10 text-amber-500 px-4 py-2 rounded-full text-sm flex items-center border border-amber-500/20">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <span>Live updates disconnected</span>
            </div>
          )}
        </div>
        
        <ResponsiveGrid cols={{ default: 1, lg: 3 }} gap="lg">
          {/* Wallet Overview Card */}
          <div className="lg:col-span-2">
            <WalletOverview />
          </div>
          
          {/* Quick Actions */}
          <div className="space-y-6">
          {/* Loan Status */}
          <AnimatedCard variant="glass" animation="fade" delay={0.1}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Loan Status</CardTitle>
              <CardDescription>Your active loans and collateral</CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Active Loans</div>
                  <div className="font-bold text-lg">0</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Collateral Locked</div>
                  <div className="font-bold text-lg">0 NPT</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Next Payment</div>
                  <div className="font-bold text-lg">None</div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <EnhancedButton variant="outline" size="sm" className="w-full" asChild>
                <Link href="/loans">
                  <span>View Loans</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </EnhancedButton>
            </CardFooter>
          </AnimatedCard>
          
          {/* Price Chart */}
          <AnimatedCard variant="glass" animation="fade" delay={0.2}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">NPT Price</CardTitle>
              <CardDescription>1 NPT = 1 NPR (Pegged)</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 pb-0">
              <div className="flex items-center justify-center h-40">
                <div className="flex flex-col items-center justify-center text-center p-6">
                  <LineChart className="h-12 w-12 text-primary mb-3 opacity-60 animate-pulse-slow" />
                  <p className="text-sm text-muted-foreground">
                    NPT is a stablecoin pegged to the Nepalese Rupee (NPR)
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <EnhancedButton variant="outline" size="sm" className="w-full" asChild>
                <Link href="/analytics">
                  <span>View Analytics</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </EnhancedButton>
            </CardFooter>
          </AnimatedCard>
          </div>
        </ResponsiveGrid>
        
        {/* Marketplace Preview */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-6">Marketplace</h2>
          <ResponsiveGrid cols={{ default: 1, sm: 2, md: 3 }} gap="md">
            <AnimatedCard variant="glass" animation="slide" delay={0.1}>
              <CardHeader className="pb-3">
                <div className="bg-primary/10 text-primary w-10 h-10 rounded-full flex items-center justify-center mb-3">
                  <Landmark className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg font-medium">Pay Utilities</CardTitle>
                <CardDescription>Pay bills directly with NPT</CardDescription>
              </CardHeader>
              <CardFooter className="pt-3">
                <EnhancedButton variant="ghost" size="sm" className="w-full" asChild>
                  <Link href="/payments">
                    <span>View Options</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </EnhancedButton>
              </CardFooter>
            </AnimatedCard>
            
            <AnimatedCard variant="glass" animation="slide" delay={0.2}>
              <CardHeader className="pb-3">
                <div className="bg-primary/10 text-primary w-10 h-10 rounded-full flex items-center justify-center mb-3">
                  <Settings className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg font-medium">Settings</CardTitle>
                <CardDescription>Customize your experience</CardDescription>
              </CardHeader>
              <CardFooter className="pt-3">
                <EnhancedButton variant="ghost" size="sm" className="w-full" asChild>
                  <Link href="/settings">
                    <span>Configure</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </EnhancedButton>
              </CardFooter>
            </AnimatedCard>
            
            <AnimatedCard variant="glass" animation="slide" delay={0.3}>
              <CardHeader className="pb-3">
                <div className="bg-primary/10 text-primary w-10 h-10 rounded-full flex items-center justify-center mb-3">
                  <ArrowUpRight className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg font-medium">Send Money</CardTitle>
                <CardDescription>Transfer NPT to other users</CardDescription>
              </CardHeader>
              <CardFooter className="pt-3">
                <EnhancedButton variant="ghost" size="sm" className="w-full" asChild>
                  <Link href="/send">
                    <span>Send NPT</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </EnhancedButton>
              </CardFooter>
            </AnimatedCard>
          </ResponsiveGrid>
        </div>
      </div>
    </ResponsiveContainer>
  );
};

export default Dashboard;