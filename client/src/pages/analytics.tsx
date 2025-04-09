import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AnalyticsPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">Analytics</h1>
        <p className="text-muted-foreground">Track your financial activity and performance</p>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4 bg-black/40 backdrop-blur-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="spending">Spending</TabsTrigger>
          <TabsTrigger value="savings">Savings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-6">
            <Card className="bg-black/40 backdrop-blur-md border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0.00 NPT</div>
                <p className="text-xs text-muted-foreground">≈ 0.00 NPR</p>
              </CardContent>
            </Card>
            
            <Card className="bg-black/40 backdrop-blur-md border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Monthly Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">No activity this month</p>
              </CardContent>
            </Card>
            
            <Card className="bg-black/40 backdrop-blur-md border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">NPT Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1 NPT = 1 NPR</div>
                <p className="text-xs text-muted-foreground">Stablecoin pegged to NPR</p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-black/40 backdrop-blur-md border-primary/20 mb-6">
            <CardHeader>
              <CardTitle>Transaction Activity</CardTitle>
              <CardDescription>Your transaction activity over time</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <p className="text-muted-foreground">No transaction data available</p>
            </CardContent>
          </Card>
          
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <Card className="bg-black/40 backdrop-blur-md border-primary/20">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your most recent transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-12">No recent transactions</p>
              </CardContent>
            </Card>
            
            <Card className="bg-black/40 backdrop-blur-md border-primary/20">
              <CardHeader>
                <CardTitle>Spending Categories</CardTitle>
                <CardDescription>Where your money goes</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-12">No spending data available</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="transactions">
          <Card className="bg-black/40 backdrop-blur-md border-primary/20">
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>All your transactions in one place</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-12">No transactions found</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="spending">
          <Card className="bg-black/40 backdrop-blur-md border-primary/20">
            <CardHeader>
              <CardTitle>Spending Analytics</CardTitle>
              <CardDescription>Analyze your spending patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-12">No spending data available</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="savings">
          <Card className="bg-black/40 backdrop-blur-md border-primary/20">
            <CardHeader>
              <CardTitle>Savings Analytics</CardTitle>
              <CardDescription>Track your savings growth</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-12">No savings data available</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsPage;