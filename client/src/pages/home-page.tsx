import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronRight, Wallet, Shield, Gift, CreditCard } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="w-full py-4 px-6 backdrop-blur-sm bg-background/30 border-b border-border/40 fixed top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary">
              NepaliPay
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard <ChevronRight className="ml-1 h-4 w-4" /></Button>
              </Link>
            ) : (
              <Link href="/auth">
                <Button>Get Started <ArrowRight className="ml-1 h-4 w-4" /></Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
                Your Gateway to Nepal's
                <span className="text-primary"> Digital Financial Future</span>
              </h1>
              <p className="text-lg text-foreground/90 mb-8">
                Experience the power of blockchain technology with NepaliPay - a secure, transparent and efficient platform for all your digital financial needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth">
                  <Button size="lg" className="w-full sm:w-auto">
                    Login / Create Account
                  </Button>
                </Link>
                <Link href="/support">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="backdrop-blur-md bg-card/50 border border-border/40 rounded-xl p-6 shadow-lg">
              <div className="aspect-[4/3] bg-gradient-to-br from-primary/30 to-primary/10 rounded-lg flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-20 h-20 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-4 shadow-inner">
                    <Wallet className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">NPT Token</h3>
                  <p className="text-foreground/80">The future of financial transactions in Nepal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background/60 backdrop-blur-md p-6 rounded-xl border border-border/40 shadow-sm">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Digital Wallet</h3>
              <p className="text-foreground/80">Securely store, send, and receive NPT tokens with our intuitive digital wallet.</p>
            </div>
            <div className="bg-background/60 backdrop-blur-md p-6 rounded-xl border border-border/40 shadow-sm">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Collateralized Loans</h3>
              <p className="text-foreground/80">Get instant loans backed by your cryptocurrency collateral with competitive rates.</p>
            </div>
            <div className="bg-background/60 backdrop-blur-md p-6 rounded-xl border border-border/40 shadow-sm">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Buy NPT Tokens</h3>
              <p className="text-foreground/80">Easily purchase NPT tokens using your credit or debit card via secure Stripe payment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-border/30 backdrop-blur-sm bg-background/30">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold text-primary">
                NepaliPay
              </h2>
              <p className="text-sm text-foreground/80">Empowering Nepal's Digital Financial Future</p>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <Link href="/support">
                <Button variant="ghost" size="sm" className="text-foreground/90">Support</Button>
              </Link>
              <Link href="/auth">
                <Button variant="ghost" size="sm" className="text-foreground/90">Login / Create Account</Button>
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-border/30 text-center text-sm text-foreground/80">
            © {new Date().getFullYear()} NepaliPay. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;