import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Send,
  QrCode,
  Search,
  CheckCircle,
  AlertCircle,
  Contact,
  Loader2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const sendFormSchema = z.object({
  recipient: z.string().min(1, 'Recipient address is required'),
  amount: z.string().min(1, 'Amount is required').refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Amount must be a positive number'),
  currency: z.enum(['NPT', 'BNB']),
  description: z.string().optional(),
});

type SendFormData = z.infer<typeof sendFormSchema>;

interface Contact {
  id: string;
  name: string;
  address: string;
  avatar?: string;
}

interface EnhancedSendFormProps {
  wallet?: {
    address?: string;
    nptBalance?: string;
    bnbBalance?: string;
  };
  onSend?: (data: SendFormData) => Promise<void>;
  isLoading?: boolean;
}

export function EnhancedSendForm({ wallet, onSend, isLoading }: EnhancedSendFormProps) {
  const { toast } = useToast();
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [contactSearch, setContactSearch] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Mock contacts data - in real app, this would come from API
  const contacts: Contact[] = [
    { id: '1', name: 'Ram Sharma', address: '0x1234...5678' },
    { id: '2', name: 'Sita Poudel', address: '0x9876...4321' },
    { id: '3', name: 'Krishna Thapa', address: '0x5555...9999' },
  ];

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
    contact.address.toLowerCase().includes(contactSearch.toLowerCase())
  );

  const form = useForm<SendFormData>({
    resolver: zodResolver(sendFormSchema),
    defaultValues: {
      recipient: '',
      amount: '',
      currency: 'NPT',
      description: '',
    },
  });

  const selectedCurrency = form.watch('currency');
  const currentBalance = selectedCurrency === 'NPT' ? wallet?.nptBalance || '0' : wallet?.bnbBalance || '0';

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
    form.setValue('recipient', contact.address);
    setContactSearch('');
  };

  const handleSubmit = async (data: SendFormData) => {
    try {
      // Validate balance
      const amount = Number(data.amount);
      const balance = Number(currentBalance);
      
      if (amount > balance) {
        toast({
          title: "Insufficient Balance",
          description: `You don't have enough ${data.currency} to send this amount.`,
          variant: "destructive",
        });
        return;
      }

      if (onSend) {
        await onSend(data);
        
        // Reset form on success
        form.reset();
        setSelectedContact(null);
        
        toast({
          title: "Transaction Sent",
          description: `Successfully sent ${data.amount} ${data.currency}`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Send Failed",
        description: error.message || "Failed to send transaction",
        variant: "destructive",
      });
    }
  };

  const handleMaxAmount = () => {
    form.setValue('amount', currentBalance);
  };

  return (
    <Card className="bg-card/50 backdrop-blur-md border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center">
          <Send className="mr-2 h-5 w-5 text-primary" />
          Send Tokens
        </CardTitle>
        <CardDescription>
          Transfer NPT or BNB to another wallet address
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Currency Selection */}
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={field.value === 'NPT' ? 'default' : 'outline'}
                      className="flex-1 min-h-[44px]"
                      onClick={() => field.onChange('NPT')}
                    >
                      NPT
                      <Badge variant="secondary" className="ml-2">
                        {wallet?.nptBalance || '0'}
                      </Badge>
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === 'BNB' ? 'default' : 'outline'}
                      className="flex-1 min-h-[44px]"
                      onClick={() => field.onChange('BNB')}
                    >
                      BNB
                      <Badge variant="secondary" className="ml-2">
                        {wallet?.bnbBalance || '0'}
                      </Badge>
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Recipient Selection */}
            <FormField
              control={form.control}
              name="recipient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient</FormLabel>
                  <div className="space-y-3">
                    {/* Contact Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search contacts or enter address..."
                        value={contactSearch}
                        onChange={(e) => setContactSearch(e.target.value)}
                        className="pl-9 min-h-[44px]"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="absolute right-1 top-1 min-h-[42px] min-w-[42px]"
                        onClick={() => setShowQRScanner(true)}
                      >
                        <QrCode className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Contact Results */}
                    {contactSearch && filteredContacts.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-border rounded-md bg-card max-h-40 overflow-y-auto"
                      >
                        {filteredContacts.map((contact) => (
                          <button
                            key={contact.id}
                            type="button"
                            className="w-full p-3 text-left hover:bg-muted transition-colors flex items-center space-x-3"
                            onClick={() => handleContactSelect(contact)}
                          >
                            <div className="rounded-full bg-primary/10 p-2">
                              <Contact className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">{contact.name}</div>
                              <div className="text-sm text-muted-foreground font-mono">
                                {contact.address}
                              </div>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}

                    {/* Selected Contact */}
                    {selectedContact && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-md"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="rounded-full bg-primary/10 p-2">
                            <Contact className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{selectedContact.name}</div>
                            <div className="text-sm text-muted-foreground font-mono">
                              {selectedContact.address}
                            </div>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="min-h-[44px] min-w-[44px]"
                          onClick={() => {
                            setSelectedContact(null);
                            form.setValue('recipient', '');
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    )}

                    {/* Manual Address Input */}
                    <FormControl>
                      <Input
                        placeholder="Or enter wallet address manually"
                        {...field}
                        className="min-h-[44px] font-mono"
                        value={selectedContact ? selectedContact.address : field.value}
                        onChange={(e) => {
                          setSelectedContact(null);
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Amount Input */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <div className="space-y-2">
                    <div className="relative">
                      <FormControl>
                        <Input
                          placeholder="0.00"
                          {...field}
                          className="pr-20 min-h-[44px] text-lg"
                          type="number"
                          step="0.000001"
                        />
                      </FormControl>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                        <span className="text-sm font-medium">{selectedCurrency}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={handleMaxAmount}
                        >
                          MAX
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Available: {currentBalance} {selectedCurrency}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description (Optional) */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="What's this for?"
                      {...field}
                      className="min-h-[44px]"
                    />
                  </FormControl>
                  <FormDescription>
                    Add a note for your transaction history
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full min-h-[44px]"
              disabled={isLoading || !wallet?.address}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send {selectedCurrency}
                </>
              )}
            </Button>

            {!wallet?.address && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You need to create a wallet first before you can send tokens.
                </AlertDescription>
              </Alert>
            )}
          </form>
        </Form>
      </CardContent>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card p-6 rounded-lg max-w-sm w-full mx-4"
          >
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">QR Code Scanner</h3>
              <div className="bg-muted/50 p-8 rounded-lg mb-4">
                <QrCode className="h-16 w-16 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground mt-4">
                  QR scanner functionality would be implemented here
                </p>
              </div>
              <Button onClick={() => setShowQRScanner(false)} className="w-full">
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </Card>
  );
}

export default EnhancedSendForm;