import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/contexts/wallet-context';
import { useAuth } from '@/contexts/auth-context';
import { TransferFormData, User } from '@/types';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from "lucide-react";

const transferSchema = z.object({
  receiverId: z.union([z.string().min(1, 'Please select a recipient'), z.number()]),
  amount: z.string().min(1, 'Amount is required')
    .refine(val => !isNaN(parseFloat(val)), {
      message: 'Amount must be a valid number',
    })
    .refine(val => parseFloat(val) > 0, {
      message: 'Amount must be greater than 0',
    }),
  note: z.string().optional(),
});

const QuickTransferForm: React.FC = () => {
  const { user } = useAuth();
  const { wallet, transferMoney } = useWallet();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const form = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      receiverId: '',
      amount: '',
      note: '',
    },
  });

  useEffect(() => {
    const fetchContacts = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const res = await fetch('/api/users', {
          credentials: 'include',
        });
        
        if (res.ok) {
          const data = await res.json();
          setContacts(data);
        }
      } catch (error) {
        console.error('Error fetching contacts', error);
        toast({
          title: 'Error',
          description: 'Failed to load contacts',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchContacts();
  }, [user, toast]);

  const onSubmit = async (data: TransferFormData) => {
    if (!wallet) {
      toast({
        title: 'Error',
        description: 'Wallet not available',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setSubmitLoading(true);
      
      // Convert receiverId from string to number
      const formData = {
        ...data,
        receiverId: parseInt(data.receiverId as unknown as string),
      };
      
      await transferMoney(formData);
      
      // Reset form
      form.reset({
        receiverId: '',
        amount: '',
        note: '',
      });
      
      toast({
        title: 'Success',
        description: `NPR ${data.amount} sent successfully!`,
      });
    } catch (error) {
      console.error('Transfer error', error);
      toast({
        title: 'Transfer Failed',
        description: error instanceof Error ? error.message : 'Could not complete the transfer',
        variant: 'destructive',
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="glass cyber-card rounded-xl overflow-hidden glow">
      <div className="px-6 py-4 border-b border-primary/20 animated-border">
        <h3 className="font-semibold text-lg text-white">Quick Transfer</h3>
      </div>
      <div className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="receiverId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Recipient</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={typeof field.value === 'number' ? field.value.toString() : field.value}
                    disabled={loading || contacts.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-black/30 border-primary/20 text-white focus:ring-primary/50">
                        <SelectValue placeholder="Select recipient" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-black/90 border-primary/30 text-white">
                      {loading ? (
                        <div className="p-2 text-center">
                          <Loader2 className="h-4 w-4 animate-spin mx-auto text-primary" />
                          <p className="text-sm text-primary/80 mt-1">Loading contacts...</p>
                        </div>
                      ) : contacts.length === 0 ? (
                        <div className="p-2 text-center text-sm text-primary/80">
                          No contacts found
                        </div>
                      ) : (
                        contacts.map(contact => (
                          <SelectItem key={contact.id} value={contact.id.toString()} className="hover:bg-primary/20 focus:bg-primary/20">
                            {`${contact.firstName} ${contact.lastName}`}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Amount (NPR)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0.00"
                      {...field}
                      type="text"
                      inputMode="decimal"
                      className="bg-black/30 border-primary/20 text-white focus:ring-primary/50 focus:border-primary"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Note (optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Add a note" 
                      {...field} 
                      className="bg-black/30 border-primary/20 text-white focus:ring-primary/50 focus:border-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-purple-500 hover:opacity-90 glow"
              disabled={submitLoading}
            >
              {submitLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Money'
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default QuickTransferForm;
