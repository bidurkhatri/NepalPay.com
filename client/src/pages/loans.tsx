import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

const LoansPage: React.FC = () => {
  const { toast } = useToast();

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">Loans & Collateral</h1>
        <p className="text-muted-foreground">Manage your loans and collateral assets</p>
      </div>
      
      <Tabs defaultValue="active">
        <TabsList className="grid w-full grid-cols-4 bg-black/40 backdrop-blur-md">
          <TabsTrigger value="active">Active Loans</TabsTrigger>
          <TabsTrigger value="apply">Apply for Loan</TabsTrigger>
          <TabsTrigger value="collateral">Collateral</TabsTrigger>
          <TabsTrigger value="history">Loan History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <Card className="bg-black/40 backdrop-blur-md border-primary/20">
            <CardHeader>
              <CardTitle>Your Active Loans</CardTitle>
              <CardDescription>View and manage your current loans</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-12">No active loans found</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="apply">
          <Card className="bg-black/40 backdrop-blur-md border-primary/20">
            <CardHeader>
              <CardTitle>Apply for Micro Loan</CardTitle>
              <CardDescription>Fast and easy micro loans with minimal collateral</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4">
                  <div className="p-4 border border-primary/20 rounded-lg bg-black/20 backdrop-blur-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Quick Loan</h3>
                        <p className="text-sm text-muted-foreground">Up to 1,000 NPT • 7-day term • 2% interest</p>
                      </div>
                      <Button 
                        onClick={() => {
                          toast({
                            title: 'Feature Coming Soon',
                            description: 'Loan application will be available in the next update.',
                          });
                        }}
                      >
                        Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-primary/20 rounded-lg bg-black/20 backdrop-blur-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Standard Loan</h3>
                        <p className="text-sm text-muted-foreground">Up to 5,000 NPT • 30-day term • 5% interest</p>
                      </div>
                      <Button 
                        onClick={() => {
                          toast({
                            title: 'Feature Coming Soon',
                            description: 'Loan application will be available in the next update.',
                          });
                        }}
                      >
                        Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-primary/20 rounded-lg bg-black/20 backdrop-blur-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Business Loan</h3>
                        <p className="text-sm text-muted-foreground">Up to 50,000 NPT • 90-day term • 8% interest</p>
                      </div>
                      <Button 
                        onClick={() => {
                          toast({
                            title: 'Feature Coming Soon',
                            description: 'Loan application will be available in the next update.',
                          });
                        }}
                      >
                        Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border border-primary/20 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Loan Eligibility</h3>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Credit Score</span>
                        <span className="text-sm">Good</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Transaction History</span>
                        <span className="text-sm">Limited</span>
                      </div>
                      <Progress value={40} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Collateral Value</span>
                        <span className="text-sm">Moderate</span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="collateral">
          <Card className="bg-black/40 backdrop-blur-md border-primary/20">
            <CardHeader>
              <CardTitle>Your Collateral</CardTitle>
              <CardDescription>Assets you've used as collateral for loans</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-12">No collateral assets found</p>
              <div className="flex justify-center">
                <Button 
                  onClick={() => {
                    toast({
                      title: 'Feature Coming Soon',
                      description: 'Adding collateral will be available in the next update.',
                    });
                  }}
                >
                  Add Collateral
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card className="bg-black/40 backdrop-blur-md border-primary/20">
            <CardHeader>
              <CardTitle>Loan History</CardTitle>
              <CardDescription>Past loans and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-12">No loan history found</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LoansPage;