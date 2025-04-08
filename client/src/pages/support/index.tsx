import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, MessageSquare, HelpCircle, Search, ChevronRight, Mail, ArrowRight } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">Help & Support</h1>
        <p className="text-muted-foreground">Find answers, guides, and contact information</p>
      </div>

      {/* Main Support Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <HelpCircle className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>
              Quick answers to common questions
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Find answers to the most common questions about NepaliPay, including account setup, payments, and blockchain functionality.
          </CardContent>
          <CardFooter>
            <Link href="/support/faq">
              <Button className="w-full justify-between" variant="outline">
                Browse FAQs <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Knowledge Base</CardTitle>
            <CardDescription>
              In-depth guides and resources
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Access detailed guides, tutorials, and articles about using NepaliPay and making the most of its features.
          </CardContent>
          <CardFooter>
            <Link href="/support/knowledgebase">
              <Button className="w-full justify-between" variant="outline">
                Explore Guides <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>
              Get personalized assistance
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Can't find what you're looking for? Reach out to our support team directly for personalized assistance.
          </CardContent>
          <CardFooter>
            <Link href="/support/contact">
              <Button className="w-full justify-between" variant="outline">
                Contact Us <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* Search Box */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Search for Help</CardTitle>
          <CardDescription>
            Find answers quickly by searching our help documentation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search for topics, features, or questions..."
              className="w-full rounded-md border border-border px-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <Button size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 px-3">
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Popular Topics */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Popular Topics</h2>
          <Button variant="link" size="sm" className="text-primary">
            View All <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button variant="ghost" className="justify-start h-auto py-4 px-4">
            <div className="flex items-start text-left">
              <div className="mr-3 mt-0.5 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-medium text-primary">1</span>
              </div>
              <div>
                <span className="block font-medium">How to Buy NPT Tokens</span>
                <span className="text-xs text-muted-foreground">Step-by-step guide to purchasing NPT tokens</span>
              </div>
            </div>
          </Button>
          
          <Button variant="ghost" className="justify-start h-auto py-4 px-4">
            <div className="flex items-start text-left">
              <div className="mr-3 mt-0.5 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-medium text-primary">2</span>
              </div>
              <div>
                <span className="block font-medium">Setting Up Two-Factor Authentication</span>
                <span className="text-xs text-muted-foreground">Enhance your account security</span>
              </div>
            </div>
          </Button>
          
          <Button variant="ghost" className="justify-start h-auto py-4 px-4">
            <div className="flex items-start text-left">
              <div className="mr-3 mt-0.5 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-medium text-primary">3</span>
              </div>
              <div>
                <span className="block font-medium">Applying for a Micro-Loan</span>
                <span className="text-xs text-muted-foreground">Learn about loan application process</span>
              </div>
            </div>
          </Button>
          
          <Button variant="ghost" className="justify-start h-auto py-4 px-4">
            <div className="flex items-start text-left">
              <div className="mr-3 mt-0.5 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-medium text-primary">4</span>
              </div>
              <div>
                <span className="block font-medium">Understanding Gas Fees</span>
                <span className="text-xs text-muted-foreground">Learn about blockchain transaction costs</span>
              </div>
            </div>
          </Button>
          
          <Button variant="ghost" className="justify-start h-auto py-4 px-4">
            <div className="flex items-start text-left">
              <div className="mr-3 mt-0.5 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-medium text-primary">5</span>
              </div>
              <div>
                <span className="block font-medium">Connecting External Wallets</span>
                <span className="text-xs text-muted-foreground">Link your crypto wallets to NepaliPay</span>
              </div>
            </div>
          </Button>
          
          <Button variant="ghost" className="justify-start h-auto py-4 px-4">
            <div className="flex items-start text-left">
              <div className="mr-3 mt-0.5 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-medium text-primary">6</span>
              </div>
              <div>
                <span className="block font-medium">Paying Utility Bills</span>
                <span className="text-xs text-muted-foreground">How to pay bills using NepaliPay</span>
              </div>
            </div>
          </Button>
        </div>
      </div>

      {/* Contact Options */}
      <Card>
        <CardHeader>
          <CardTitle>Still Need Help?</CardTitle>
          <CardDescription>
            Our support team is ready to assist you
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col items-center text-center p-4 rounded-lg border border-border">
            <Mail className="h-10 w-10 text-primary mb-2" />
            <h3 className="font-medium">Email Support</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Send us an email and we'll respond within 24 hours
            </p>
            <Link href="/support/contact">
              <Button variant="outline">
                Email Us
              </Button>
            </Link>
          </div>

          <div className="flex flex-col items-center text-center p-4 rounded-lg border border-border">
            <MessageSquare className="h-10 w-10 text-primary mb-2" />
            <h3 className="font-medium">Live Chat</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Chat with our support team during business hours
            </p>
            <Button variant="outline">
              Start Chat
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}