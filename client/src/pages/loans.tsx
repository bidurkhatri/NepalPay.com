import React, { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRealTime } from '@/contexts/real-time-context';
import { useBlockchain } from '@/contexts/blockchain-context';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { format } from 'date-fns';
import {
  Coins,
  CircleDollarSign,
  ArrowRight,
  Info,
  Plus,
  Loader2,
  AlertCircle,
  PieChart,
  Clock,
  BadgeDollarSign,
  LockIcon,
  UnlockIcon,
  Calculator,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import {
  Badge,
} from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Progress,
} from '@/components/ui/progress';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Form validation schema for loan application
const loanFormSchema = z.object({
  amount: z.string()
    .min(1, { message: 'Please enter an amount' })
    .refine((val) => !isNaN(Number(val)), { 
      message: 'Amount must be a number' 
    })
    .refine((val) => Number(val) >= 100, { 
      message: 'Minimum loan amount is 100 NPT' 
    }),
  termDays: z.coerce.number()
    .min(7, { message: 'Minimum loan term is 7 days' })
    .max(365, { message: 'Maximum loan term is 365 days' }),
  collateralType: z.enum(['BNB', 'ETH', 'BTC']),
  collateralAmount: z.string()
    .min(1, { message: 'Please enter a collateral amount' })
    .refine((val) => !isNaN(Number(val)), { 
      message: 'Collateral amount must be a number' 
    })
    .refine((val) => Number(val) > 0, { 
      message: 'Collateral amount must be greater than 0' 
    }),
});

type LoanFormData = z.infer<typeof loanFormSchema>;

const LoansPage: React.FC = () => {
  const { user } = useAuth();
  const { wsStatus, lastMessage, sendMessage } = useRealTime();
  const { toast } = useToast();
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [currentLoan, setCurrentLoan] = useState<any>(null);
  const [currentTab, setCurrentTab] = useState<string>('active');
  
  // Use the blockchain contract for rates
  const { tokenContract, nepaliPayContract } = useBlockchain();
  
  // Calculate loan amount based on collateral
  const [calculatedLoanAmount, setCalculatedLoanAmount] = useState<number>(0);
  const [calculatedLtvRatio, setCalculatedLtvRatio] = useState<number>(0);
  const [calculatedCollateralValueInNpt, setCalculatedCollateralValueInNpt] = useState<number>(0);
  
  // Fetch loans
  const {
    data: loans,
    isLoading: loansLoading,
    error: loansError,
    refetch: refetchLoans
  } = useQuery({
    queryKey: ['/api/loans'],
    retry: 1,
  });
  
  // Fetch collaterals
  const {
    data: collaterals,
    isLoading: collateralsLoading,
    error: collateralsError,
    refetch: refetchCollaterals
  } = useQuery({
    queryKey: ['/api/collaterals'],
    retry: 1,
  });
  
  // Fetch wallet data for balance check
  const { 
    data: wallet,
    isLoading: walletLoading,
  } = useQuery({
    queryKey: ['/api/wallet'],
    retry: 1,
  });
  
  // Listen for real-time updates
  React.useEffect(() => {
    if (
      lastMessage?.type === 'loan_approved' || 
      lastMessage?.type === 'loan_rejected' ||
      lastMessage?.type === 'collateral_locked'
    ) {
      refetchLoans();
      refetchCollaterals();
    }
  }, [lastMessage, refetchLoans, refetchCollaterals]);
  
  // Loan application form
  const form = useForm<LoanFormData>({
    resolver: zodResolver(loanFormSchema),
    defaultValues: {
      amount: '',
      termDays: 30,
      collateralType: 'BNB',
      collateralAmount: '',
    },
  });
  
  // Update calculated loan amount and LTV when form changes
  const collateralType = form.watch('collateralType');
  const collateralAmount = form.watch('collateralAmount');
  
  // Remove these unused helper functions that are causing errors
  
  // Use blockchain contract to get collateral calculations
  const updateCollateralCalculations = useCallback(async () => {
    try {
      if (collateralType && collateralAmount && !isNaN(Number(collateralAmount)) && Number(collateralAmount) > 0 && nepaliPayContract) {
        // Get rates from smart contract
        const collateralValue = await nepaliPayContract.getCollateralValue(
          collateralType,
          ethers.parseEther(collateralAmount.toString())
        );
        
        // Get loan-to-value ratio from smart contract
        const ltvRatio = await nepaliPayContract.getLoanToValueRatio(collateralType);
        
        // Convert from BigNumber to numbers
        const collateralValueInNpt = Number(ethers.formatEther(collateralValue));
        const ltvRatioDecimal = Number(ethers.formatUnits(ltvRatio, 2));
        
        // Calculate max loan amount based on contract values
        const maxLoanAmount = collateralValueInNpt * (ltvRatioDecimal / 100);
        
        // Update state with calculated values from blockchain
        setCalculatedLoanAmount(maxLoanAmount);
        setCalculatedLtvRatio(ltvRatioDecimal);
        setCalculatedCollateralValueInNpt(collateralValueInNpt);
      } else {
        setCalculatedLoanAmount(0);
        setCalculatedLtvRatio(0);
        setCalculatedCollateralValueInNpt(0);
      }
    } catch (error) {
      console.error("Error calculating collateral values from blockchain:", error);
      // Set default values in case of error
      setCalculatedLoanAmount(0);
      setCalculatedLtvRatio(0);
      setCalculatedCollateralValueInNpt(0);
    }
  }, [collateralType, collateralAmount, nepaliPayContract]);
  
  React.useEffect(() => {
    updateCollateralCalculations();
  }, [updateCollateralCalculations]);
  
  const onSubmit = async (data: LoanFormData) => {
    try {
      // Validate loan amount against calculated maximum
      if (Number(data.amount) > calculatedLoanAmount) {
        toast({
          title: 'Invalid Loan Amount',
          description: `The maximum loan amount for your collateral is ${calculatedLoanAmount.toFixed(2)} NPT`,
          variant: 'destructive',
        });
        return;
      }
      
      // Create loan and collateral
      const loanResponse = await apiRequest('POST', '/api/loans', {
        amount: data.amount,
        interestRate: '0.05', // 5% interest rate
        termDays: data.termDays,
        collateralRequired: true,
      });
      
      if (!loanResponse.ok) {
        const errorData = await loanResponse.json();
        throw new Error(errorData.message || 'Failed to create loan application');
      }
      
      const loanData = await loanResponse.json();
      
      // Create collateral
      const collateralResponse = await apiRequest('POST', '/api/collaterals', {
        loanId: loanData.id,
        collateralType: data.collateralType,
        amount: data.collateralAmount,
        valueInNpt: calculatedCollateralValueInNpt.toString(),
        valueToLoanRatio: (calculatedCollateralValueInNpt / Number(data.amount)).toString(),
      });
      
      if (!collateralResponse.ok) {
        const errorData = await collateralResponse.json();
        throw new Error(errorData.message || 'Failed to create collateral');
      }
      
      // Notify via WebSocket
      sendMessage({
        type: 'loan_application',
        data: {
          loanId: loanData.id,
          amount: data.amount,
          termDays: data.termDays,
        }
      });
      
      setApplyDialogOpen(false);
      form.reset();
      
      toast({
        title: 'Loan Application Submitted',
        description: 'Your loan application has been submitted for review',
      });
      
      // Refetch loans and collaterals
      refetchLoans();
      refetchCollaterals();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to submit loan application',
        variant: 'destructive',
      });
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return format(date, 'MMM dd, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  // Render loan status badge
  const renderLoanStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Active</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pending</Badge>;
      case 'repaid':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Repaid</Badge>;
      case 'defaulted':
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Defaulted</Badge>;
      case 'liquidated':
        return <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">Liquidated</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Filter loans by status
  const filteredLoans = React.useMemo(() => {
    // Convert loans to array if it's not already one
    const loansArray = loans ? (Array.isArray(loans) ? loans : []) : [];
    
    if (currentTab === 'active') {
      return loansArray.filter((loan: any) => loan.status === 'active' || loan.status === 'pending');
    } else if (currentTab === 'history') {
      return loansArray.filter((loan: any) => loan.status === 'repaid' || loan.status === 'defaulted' || loan.status === 'liquidated');
    }
    
    return loansArray;
  }, [loans, currentTab]);
  
  // Get loan collateral
  const getLoanCollateral = (loanId: number) => {
    if (!collaterals || !Array.isArray(collaterals)) return null;
    return collaterals.find((c: any) => c.loanId === loanId);
  };
  
  // Calculate repayment amount
  const calculateRepaymentAmount = (loan: any) => {
    const principal = parseFloat(loan.amount);
    const interest = principal * parseFloat(loan.interestRate);
    const originationFee = parseFloat(loan.originationFee);
    return (principal + interest + originationFee).toFixed(2);
  };
  
  return (
    <div className="py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Loans</h1>
          <p className="text-muted-foreground">
            Borrow NPT tokens using crypto collateral
          </p>
        </div>
        
        <Button onClick={() => setApplyDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Apply for Loan
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Loans Overview */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Coins className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Active Loans</div>
                  <div className="text-2xl font-bold">
                    {loansLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    ) : (
                      (Array.isArray(loans) ? loans.filter((loan: any) => loan.status === 'active').length : 0)
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <CircleDollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Total Borrowed</div>
                  <div className="text-2xl font-bold">
                    {loansLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    ) : (
                      `${(Array.isArray(loans) ? loans.reduce((acc: number, loan: any) => acc + parseFloat(loan.amount), 0) : 0).toFixed(2)} NPT`
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <LockIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Collateral Locked</div>
                  <div className="text-2xl font-bold">
                    {collateralsLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    ) : (
                      `${(Array.isArray(collaterals) ? collaterals.reduce((acc: number, c: any) => acc + parseFloat(c.valueInNpt), 0) : 0).toFixed(2)} NPT`
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-3">
          <Tabs defaultValue="active" className="w-full" onValueChange={setCurrentTab}>
            <TabsList>
              <TabsTrigger value="active">Active Loans</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="mt-6">
              {loansLoading || collateralsLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : loansError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>Failed to load loans</AlertDescription>
                </Alert>
              ) : !filteredLoans.length ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="rounded-full bg-primary/10 p-3 mb-4">
                    <Info className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No active loans</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    You don't have any active loans. Apply for a loan to get started.
                  </p>
                  <Button className="mt-4" onClick={() => setApplyDialogOpen(true)}>
                    Apply for Loan <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {filteredLoans.map((loan: any) => {
                    const collateral = getLoanCollateral(loan.id);
                    return (
                      <Card key={loan.id} className="bg-card/50 backdrop-blur-sm border-primary/10">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-lg">Loan #{loan.id}</CardTitle>
                            {renderLoanStatusBadge(loan.status)}
                          </div>
                          <CardDescription>
                            Application Date: {formatDate(loan.createdAt)}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-0">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <div className="text-sm text-muted-foreground mb-1">Loan Amount</div>
                                <div className="text-xl font-bold">{parseFloat(loan.amount).toFixed(2)} NPT</div>
                              </div>
                              
                              <div>
                                <div className="text-sm text-muted-foreground mb-1">Interest Rate</div>
                                <div className="font-medium">{(parseFloat(loan.interestRate) * 100).toFixed(2)}%</div>
                              </div>
                              
                              <div>
                                <div className="text-sm text-muted-foreground mb-1">Term</div>
                                <div className="font-medium">{loan.termDays} days</div>
                              </div>
                              
                              <div>
                                <div className="text-sm text-muted-foreground mb-1">Repayment Amount</div>
                                <div className="font-medium">{calculateRepaymentAmount(loan)} NPT</div>
                              </div>
                              
                              {loan.status === 'active' && loan.dueDate && (
                                <div>
                                  <div className="text-sm text-muted-foreground mb-1">Due Date</div>
                                  <div className="font-medium">{formatDate(loan.dueDate)}</div>
                                </div>
                              )}
                            </div>
                            
                            <div className="space-y-4">
                              <div>
                                <div className="text-sm text-muted-foreground mb-1">Collateral</div>
                                {collateral ? (
                                  <>
                                    <div className="font-medium">
                                      {parseFloat(collateral.amount).toFixed(4)} {collateral.collateralType}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      Value: {parseFloat(collateral.valueInNpt).toFixed(2)} NPT
                                    </div>
                                  </>
                                ) : (
                                  <div className="text-sm">No collateral found</div>
                                )}
                              </div>
                              
                              {loan.status === 'active' && (
                                <div>
                                  <div className="text-sm text-muted-foreground mb-1">Repayment Progress</div>
                                  <Progress 
                                    value={(parseFloat(loan.repaidAmount) / parseFloat(loan.amount)) * 100} 
                                    className="h-2"
                                  />
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {parseFloat(loan.repaidAmount).toFixed(2)} NPT of {parseFloat(loan.amount).toFixed(2)} NPT repaid
                                  </div>
                                </div>
                              )}
                              
                              {loan.status === 'pending' && (
                                <div className="rounded-md bg-yellow-500/10 border border-yellow-500/20 p-3">
                                  <div className="text-sm font-medium text-yellow-500 mb-1">Pending Approval</div>
                                  <div className="text-xs text-muted-foreground">
                                    Your loan application is currently under review. You will be notified once it's approved.
                                  </div>
                                </div>
                              )}
                              
                              {loan.status === 'active' && (
                                <div className="flex flex-col space-y-2">
                                  <Button>
                                    Repay Loan
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="history" className="mt-6">
              {loansLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : !filteredLoans.length ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="rounded-full bg-primary/10 p-3 mb-4">
                    <Info className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No loan history</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    You haven't completed any loans yet.
                  </p>
                </div>
              ) : (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Loan ID</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Term</TableHead>
                        <TableHead>Applied Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLoans.map((loan: any) => (
                        <TableRow key={loan.id}>
                          <TableCell>#{loan.id}</TableCell>
                          <TableCell>{parseFloat(loan.amount).toFixed(2)} NPT</TableCell>
                          <TableCell>{loan.termDays} days</TableCell>
                          <TableCell>{formatDate(loan.createdAt)}</TableCell>
                          <TableCell>{formatDate(loan.endDate || loan.repaymentDate)}</TableCell>
                          <TableCell>{renderLoanStatusBadge(loan.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Loan Application Dialog */}
      <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Apply for a Loan</DialogTitle>
            <DialogDescription>
              Provide collateral to borrow NPT tokens. Your collateral will be locked until you repay the loan.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="collateralType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Collateral Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select collateral type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="BNB">BNB</SelectItem>
                            <SelectItem value="ETH">ETH</SelectItem>
                            <SelectItem value="BTC">BTC</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose the cryptocurrency you want to use as collateral
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="collateralAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Collateral Amount</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={`Enter ${form.getValues('collateralType')} amount`}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Amount of {form.getValues('collateralType')} to lock as collateral
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="rounded-md bg-muted p-3">
                    <div className="text-sm font-medium mb-1">Collateral Value</div>
                    <div className="text-xl font-bold">{calculatedCollateralValueInNpt.toFixed(2)} NPT</div>
                    <div className="text-xs text-muted-foreground">
                      Value calculated directly from NepaliPay smart contract
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loan Amount</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter loan amount"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Maximum: {calculatedLoanAmount.toFixed(2)} NPT ({calculatedLtvRatio.toFixed(0)}% LTV)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="termDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loan Term: {field.value} days</FormLabel>
                        <FormControl>
                          <Slider
                            min={7}
                            max={365}
                            step={1}
                            defaultValue={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                            className="py-4"
                          />
                        </FormControl>
                        <FormDescription>
                          Choose your loan term between 7 and 365 days
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="rounded-md bg-muted p-3">
                    <div className="text-sm font-medium mb-1">Interest Rate</div>
                    <div className="text-xl font-bold">5.0%</div>
                    <div className="text-xs text-muted-foreground">
                      Fixed rate for the duration of the loan
                    </div>
                  </div>
                </div>
              </div>
              
              <Alert className="bg-primary/5 border-primary/10">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  If the value of your collateral falls below the liquidation threshold, your collateral may be liquidated to repay the loan.
                </AlertDescription>
              </Alert>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setApplyDialogOpen(false)} type="button">
                  Cancel
                </Button>
                <Button type="submit">Apply for Loan</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoansPage;