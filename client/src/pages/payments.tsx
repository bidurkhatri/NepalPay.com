import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const PaymentsPage: React.FC = () => {
  const { toast } = useToast();

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">Payments</h1>
        <p className="text-muted-foreground">Manage your payments and subscriptions</p>
      </div>
      
      <Tabs defaultValue="utility">
        <TabsList className="grid w-full grid-cols-3 bg-black/40 backdrop-blur-md">
          <TabsTrigger value="utility">Utility Bills</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Payments</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="utility">
          <Card className="bg-black/40 backdrop-blur-md border-primary/20">
            <CardHeader>
              <CardTitle>Pay Utility Bills</CardTitle>
              <CardDescription>Pay your electricity, water, and internet bills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="p-4 border border-primary/20 rounded-lg bg-black/20 backdrop-blur-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Electricity Bill</h3>
                      <p className="text-sm text-muted-foreground">Nepal Electricity Authority</p>
                    </div>
                    <Button 
                      onClick={() => {
                        toast({
                          title: 'Feature Coming Soon',
                          description: 'This feature will be available in the next update.',
                        });
                      }}
                    >
                      Pay Bill
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 border border-primary/20 rounded-lg bg-black/20 backdrop-blur-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Water Bill</h3>
                      <p className="text-sm text-muted-foreground">Kathmandu Upatyaka Khanepani Limited</p>
                    </div>
                    <Button 
                      onClick={() => {
                        toast({
                          title: 'Feature Coming Soon',
                          description: 'This feature will be available in the next update.',
                        });
                      }}
                    >
                      Pay Bill
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 border border-primary/20 rounded-lg bg-black/20 backdrop-blur-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Internet Bill</h3>
                      <p className="text-sm text-muted-foreground">WorldLink Communications</p>
                    </div>
                    <Button 
                      onClick={() => {
                        toast({
                          title: 'Feature Coming Soon',
                          description: 'This feature will be available in the next update.',
                        });
                      }}
                    >
                      Pay Bill
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="scheduled">
          <Card className="bg-black/40 backdrop-blur-md border-primary/20">
            <CardHeader>
              <CardTitle>Scheduled Payments</CardTitle>
              <CardDescription>Manage your recurring payments</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-12">No scheduled payments found</p>
              <div className="flex justify-center">
                <Button 
                  onClick={() => {
                    toast({
                      title: 'Feature Coming Soon',
                      description: 'This feature will be available in the next update.',
                    });
                  }}
                >
                  Create Scheduled Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card className="bg-black/40 backdrop-blur-md border-primary/20">
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>View your payment history</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-12">No payment history found</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentsPage;