import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRealTime } from '@/contexts/real-time-context';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import {
  Send,
  User,
  ArrowRight,
  Info,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useQuery } from '@tanstack/react-query';

// Form validation schema
const formSchema = z.object({
  recipient: z.string()
    .min(1, { message: 'Recipient address or username is required' }),
  amount: z.string()
    .min(1, { message: 'Please enter an amount' })
    .refine((val) => !isNaN(Number(val)), { 
      message: 'Amount must be a number' 
    })
    .refine((val) => Number(val) > 0, { 
      message: 'Amount must be greater than 0' 
    }),
  memo: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const SendFundsPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { sendMessage } = useRealTime();
  const [isTransferring, setIsTransferring] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [transferDetails, setTransferDetails] = useState<FormData | null>(null);
  const [recipientResolved, setRecipientResolved] = useState<{ id: number, username: string } | null>(null);
  const [transferComplete, setTransferComplete] = useState(false);
  
  // Fetch wallet data for balance check
  const { data: wallet, isLoading: walletLoading } = useQuery({
    queryKey: ['/api/wallet'],
    retry: 1,
  });
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipient: '',
      amount: '',
      memo: '',
    },
  });
  
  const lookupRecipient = async (recipient: string) => {
    try {
      const response = await apiRequest('GET', `/api/users/lookup?identifier=${encodeURIComponent(recipient)}`);
      if (!response.ok) {
        return null;
      }
      return await response.json();
    } catch (error) {
      return null;
    }
  };
  
  const onSubmit = async (data: FormData) => {
    try {
      // Validate balance
      if (wallet && Number(data.amount) > Number(wallet.nptBalance)) {
        toast({
          title: 'Insufficient Balance',
          description: 'You do not have enough NPT tokens for this transfer',
          variant: 'destructive',
        });
        return;
      }
      
      // Lookup recipient
      const recipient = await lookupRecipient(data.recipient);
      if (!recipient) {
        toast({
          title: 'Recipient Not Found',
          description: 'The recipient address or username could not be found',
          variant: 'destructive',
        });
        return;
      }
      
      // Don't allow sending to self
      if (recipient.id === user?.id) {
        toast({
          title: 'Invalid Recipient',
          description: 'You cannot send tokens to yourself',
          variant: 'destructive',
        });
        return;
      }
      
      setRecipientResolved(recipient);
      setTransferDetails(data);
      setShowConfirmation(true);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'An error occurred while preparing the transaction',
        variant: 'destructive',
      });
    }
  };
  
  const confirmTransfer = async () => {
    if (!transferDetails || !recipientResolved) return;
    
    setIsTransferring(true);
    try {
      const response = await apiRequest('POST', '/api/transactions', {
        recipientId: recipientResolved.id,
        amount: Number(transferDetails.amount),
        currency: 'NPT',
        description: transferDetails.memo || 'Token transfer',
        type: 'transfer',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to process transaction');
      }
      
      const result = await response.json();
      
      // Notify via WebSocket
      sendMessage({
        type: 'transaction_completed',
        data: {
          transactionId: result.id,
          amount: transferDetails.amount,
          recipient: recipientResolved.username,
        }
      });
      
      setTransferComplete(true);
      
      toast({
        title: 'Transfer Complete',
        description: `Successfully sent ${transferDetails.amount} NPT to ${recipientResolved.username}`,
      });
    } catch (err: any) {
      toast({
        title: 'Transfer Failed',
        description: err.message || 'Failed to send tokens',
        variant: 'destructive',
      });
      setShowConfirmation(false);
    } finally {
      setIsTransferring(false);
    }
  };
  
  const resetForm = () => {
    form.reset();
    setShowConfirmation(false);
    setTransferDetails(null);
    setRecipientResolved(null);
    setTransferComplete(false);
  };

  return (
    <div className="py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Send Funds</h1>
        <p className="text-muted-foreground">
          Transfer NPT tokens to another user or address
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Send className="mr-2 h-5 w-5 text-primary" />
                Send NPT Tokens
              </CardTitle>
              <CardDescription>Transfer tokens to another user</CardDescription>
            </CardHeader>
            
            <CardContent>
              {walletLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="bg-primary/5 rounded-lg p-3 flex justify-between mb-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Available Balance</div>
                        <div className="text-xl font-medium">{walletLoading ? '-' : wallet?.nptBalance || 0} NPT</div>
                      </div>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="recipient"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recipient</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                              <Input
                                placeholder="Enter username or wallet address"
                                className="pl-10"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Enter the recipient's username or wallet address
                          </FormDescription>
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
                              placeholder="Enter amount to send"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Enter the amount of NPT tokens to send
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="memo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Memo (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Add a message or description"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Add a message or reason for this transfer
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full">
                      Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Info Section */}
        <div className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="mr-2 h-5 w-5 text-primary" />
                About Transferring Tokens
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <Alert className="bg-primary/5 border-primary/10">
                <Info className="h-4 w-4" />
                <AlertTitle>Instant Transfers</AlertTitle>
                <AlertDescription>
                  All transfers on NepaliPay are processed instantly and securely via blockchain.
                </AlertDescription>
              </Alert>
              
              <div>
                <h3 className="font-medium mb-1">Transfer Details</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex justify-between">
                    <span>Fee:</span>
                    <span className="font-medium">0 NPT (No fees)</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Processing Time:</span>
                    <span className="font-medium">Instant</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Network:</span>
                    <span className="font-medium">Binance Smart Chain</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Security:</span>
                    <span className="font-medium">Blockchain verified</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Important Notes</h3>
                <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                  <li>Double-check the recipient's information before confirming</li>
                  <li>Transactions cannot be reversed once completed</li>
                  <li>Transfer records are stored on the blockchain for transparency</li>
                  <li>You can track all your transactions in the Wallet section</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-[425px]">
          {!transferComplete ? (
            <>
              <DialogHeader>
                <DialogTitle>Confirm Transfer</DialogTitle>
                <DialogDescription>
                  Please review the transfer details before confirming.
                </DialogDescription>
              </DialogHeader>
              
              {transferDetails && recipientResolved && (
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Recipient:</span>
                      <span className="font-medium">{recipientResolved.username}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-medium">{transferDetails.amount} NPT</span>
                    </div>
                    {transferDetails.memo && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Memo:</span>
                        <span className="font-medium">{transferDetails.memo}</span>
                      </div>
                    )}
                  </div>
                  
                  <Alert className="bg-primary/5 border-primary/10">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      This transaction cannot be reversed once confirmed.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowConfirmation(false)}>
                  Cancel
                </Button>
                <Button onClick={confirmTransfer} disabled={isTransferring}>
                  {isTransferring ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Confirm Transfer"
                  )}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Transfer Complete</DialogTitle>
                <DialogDescription>
                  Your tokens have been successfully transferred.
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex flex-col items-center justify-center py-6">
                <div className="rounded-full bg-green-100 p-3 mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                
                {transferDetails && recipientResolved && (
                  <div className="text-center">
                    <p className="text-xl font-medium mb-1">{transferDetails.amount} NPT</p>
                    <p className="text-muted-foreground">Sent to {recipientResolved.username}</p>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button onClick={resetForm}>
                  Done
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SendFundsPage;