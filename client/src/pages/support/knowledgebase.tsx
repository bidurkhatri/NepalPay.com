import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Book, Search, BookOpen, FileText, ChevronRight, ArrowRight } from 'lucide-react';

export default function KnowledgeBasePage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Knowledge Base</h1>
        <p className="text-muted-foreground">Detailed guides and resources to help you use NepaliPay</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          className="pl-10"
          placeholder="Search the knowledge base..."
        />
      </div>

      {/* Category Tabs */}
      <Tabs defaultValue="getting-started">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
          <TabsTrigger value="loans">Loans</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Getting Started Content */}
        <TabsContent value="getting-started" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">Setting Up Your Account</CardTitle>
                  <Badge variant="outline" className="text-xs">Beginner</Badge>
                </div>
                <CardDescription>Learn how to register, verify, and set up your profile</CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                A comprehensive guide to getting started with NepaliPay, including account creation, verification steps, and initial setup.
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full justify-between">
                  Read Guide <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">Navigating the Dashboard</CardTitle>
                  <Badge variant="outline" className="text-xs">Beginner</Badge>
                </div>
                <CardDescription>Understand the main features of the app interface</CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                Explore the NepaliPay dashboard and learn about the key features available, including wallet management, transactions, and account settings.
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full justify-between">
                  Read Guide <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">Making Your First Transaction</CardTitle>
                  <Badge variant="outline" className="text-xs">Beginner</Badge>
                </div>
                <CardDescription>Learn how to send and receive money</CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                A step-by-step guide to completing your first transaction on NepaliPay, including sending money, receiving payments, and viewing transaction history.
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full justify-between">
                  Read Guide <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Popular Getting Started Articles</CardTitle>
              <CardDescription>Quick access to essential knowledge</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="ghost" className="justify-start h-auto py-3">
                <div className="flex items-start text-left">
                  <FileText className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                  <div>
                    <span className="block font-medium">Account Verification Levels</span>
                    <span className="text-xs text-muted-foreground">Learn about the different verification levels and their benefits</span>
                  </div>
                </div>
              </Button>
              
              <Button variant="ghost" className="justify-start h-auto py-3">
                <div className="flex items-start text-left">
                  <FileText className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                  <div>
                    <span className="block font-medium">Setting Up Two-Factor Authentication</span>
                    <span className="text-xs text-muted-foreground">Enhance your account security with 2FA</span>
                  </div>
                </div>
              </Button>
              
              <Button variant="ghost" className="justify-start h-auto py-3">
                <div className="flex items-start text-left">
                  <FileText className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                  <div>
                    <span className="block font-medium">Mobile App Installation Guide</span>
                    <span className="text-xs text-muted-foreground">Download and set up the NepaliPay mobile app</span>
                  </div>
                </div>
              </Button>
              
              <Button variant="ghost" className="justify-start h-auto py-3">
                <div className="flex items-start text-left">
                  <FileText className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                  <div>
                    <span className="block font-medium">Understanding Fees and Limits</span>
                    <span className="text-xs text-muted-foreground">Overview of transaction fees and account limits</span>
                  </div>
                </div>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Content */}
        <TabsContent value="transactions" className="space-y-6">
          {/* Transaction-related content similar to above */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">Sending & Receiving Money</CardTitle>
                  <Badge variant="outline" className="text-xs">Essential</Badge>
                </div>
                <CardDescription>Learn about different transaction methods</CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                Detailed guide on sending and receiving money through NepaliPay, including user-to-user transfers and external wallet transactions.
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full justify-between">
                  Read Guide <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">Utility Payments</CardTitle>
                  <Badge variant="outline" className="text-xs">Essential</Badge>
                </div>
                <CardDescription>Pay bills and top up services</CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                Learn how to pay electricity bills, mobile top-ups, and other utility payments through the NepaliPay platform.
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full justify-between">
                  Read Guide <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">Transaction History & Reports</CardTitle>
                  <Badge variant="outline" className="text-xs">Intermediate</Badge>
                </div>
                <CardDescription>Access and understand your financial activity</CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                Guide to viewing, filtering, and exporting your transaction history and generating financial reports for your records.
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full justify-between">
                  Read Guide <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Only display this tab content to avoid duplication */}
        <TabsContent value="blockchain" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">NPT Token Guide</CardTitle>
                  <Badge variant="outline" className="text-xs">Essential</Badge>
                </div>
                <CardDescription>Understanding NepaliPay's native token</CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                Complete overview of the NPT token, its purpose, value, and how it's used within the NepaliPay ecosystem.
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full justify-between">
                  Read Guide <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">Connecting External Wallets</CardTitle>
                  <Badge variant="outline" className="text-xs">Intermediate</Badge>
                </div>
                <CardDescription>Link your blockchain wallets</CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                Learn how to connect external crypto wallets like MetaMask to your NepaliPay account for seamless blockchain interactions.
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full justify-between">
                  Read Guide <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">Understanding Gas Fees</CardTitle>
                  <Badge variant="outline" className="text-xs">Advanced</Badge>
                </div>
                <CardDescription>Learn about blockchain transaction costs</CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                Detailed explanation of gas fees on the Binance Smart Chain, how they're calculated, and strategies to optimize costs.
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full justify-between">
                  Read Guide <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Placeholder for other tabs */}
        <TabsContent value="loans">
          <Card>
            <CardHeader>
              <CardTitle>Loans & Collaterals Documentation</CardTitle>
              <CardDescription>Information about micro-loans and managing collaterals</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-8">
              <BookOpen className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Comprehensive Loan Documentation</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                Our detailed guides about the loan system, collateral management, repayments, and more are being updated with the latest information.
              </p>
              <Button className="mt-4">View Available Guides</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security & Privacy Documentation</CardTitle>
              <CardDescription>Information about securing your account and data</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-8">
              <BookOpen className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Security Documentation</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                Our detailed guides about account security, privacy features, and best practices are being updated with the latest information.
              </p>
              <Button className="mt-4">View Available Guides</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Popular Guides */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Popular Guides</h2>
          <Button variant="link" size="sm" className="text-primary">
            View All <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Book className="h-4 w-4 mr-2 text-primary" />
                Blockchain Basics
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Introduction to blockchain technology and how it powers NepaliPay.
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Book className="h-4 w-4 mr-2 text-primary" />
                Secure Your Account
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Best practices for maintaining the security of your NepaliPay account.
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Book className="h-4 w-4 mr-2 text-primary" />
                NPT Token Economics
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Understanding the value, supply, and utility of the NepaliPay Token.
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Book className="h-4 w-4 mr-2 text-primary" />
                Mobile App Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Complete walkthrough of the NepaliPay mobile application features.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}