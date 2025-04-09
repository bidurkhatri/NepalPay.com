import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

const sendFundsSchema = z.object({
  recipient: z.string().min(1, { message: 'Recipient address is required' }),
  amount: z.string().min(1, { message: 'Amount is required' }),
  note: z.string().optional(),
});

type SendFundsFormValues = z.infer<typeof sendFundsSchema>;

const SendFundsPage: React.FC = () => {
  const { toast } = useToast();
  
  const form = useForm<SendFundsFormValues>({
    resolver: zodResolver(sendFundsSchema),
    defaultValues: {
      recipient: '',
      amount: '',
      note: '',
    },
  });

  const onSubmit = async (data: SendFundsFormValues) => {
    try {
      // Connect to blockchain and send funds
      toast({
        title: 'Transaction Initiated',
        description: `Sending ${data.amount} NPT to ${data.recipient}...`,
      });
      
      // Mock successful transaction for now
      setTimeout(() => {
        toast({
          title: 'Transaction Successful',
          description: `Successfully sent ${data.amount} NPT to ${data.recipient}`,
        });
        form.reset();
      }, 2000);
      
    } catch (error) {
      toast({
        title: 'Transaction Failed',
        description: 'Failed to send funds. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">Send Funds</h1>
        <p className="text-muted-foreground">Send NPT tokens to any wallet address</p>
      </div>
      
      <div className="grid gap-6">
        <Card className="bg-black/40 backdrop-blur-md border-primary/20">
          <CardHeader>
            <CardTitle>Transfer Details</CardTitle>
            <CardDescription>Enter the recipient address and amount to send</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="recipient"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipient Address</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="0x..." 
                          className="bg-background/50" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount (NPT)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          step="0.01" 
                          placeholder="0.00" 
                          className="bg-background/50" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Note (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Add a note to this transaction" 
                          className="bg-background/50" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full gradient-button"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? 'Sending...' : 'Send Funds'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 backdrop-blur-md border-primary/20">
          <CardHeader>
            <CardTitle>Recent Transfers</CardTitle>
            <CardDescription>Your recent fund transfers</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-6">No recent transfers</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SendFundsPage;