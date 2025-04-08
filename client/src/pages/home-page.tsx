import React, { useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

export default function HomePage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (user) {
      setLocation('/dashboard');
    }
  }, [user, setLocation]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="container mx-auto py-6 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            NepaliPay
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/auth">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link href="/auth?signup=true">
            <Button variant="gradient">Sign up</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto py-16 md:py-24 flex flex-col md:flex-row items-center">
        <div className="flex-1 space-y-6 pb-10 md:pb-0">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            The Future of <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Digital Finance</span> in Nepal
          </h1>
          <p className="text-xl text-muted-foreground max-w-md">
            A modern blockchain-powered wallet and payment platform designed for Nepal's financial ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/auth?signup=true">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/support">
              <Button size="lg" variant="outline">Learn More</Button>
            </Link>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="relative w-[300px] h-[550px] sm:w-[350px] sm:h-[650px] rounded-[40px] border-8 border-foreground/10 overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm"></div>
            <div className="absolute top-10 left-0 right-0 text-center">
              <h3 className="text-xl font-semibold">NepaliPay Wallet</h3>
              <p className="text-sm text-muted-foreground">Your digital future</p>
            </div>
            <div className="absolute top-1/4 left-0 right-0 px-6">
              <div className="bg-card/70 backdrop-blur-md rounded-xl p-6 border border-border shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">Balance</span>
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">NPT</span>
                </div>
                <div className="text-3xl font-bold mb-2">12,458.35</div>
                <div className="text-sm text-muted-foreground">≈ $100.45 USD</div>
              </div>
            </div>
            <div className="absolute bottom-24 left-0 right-0 px-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card/70 backdrop-blur-md rounded-xl p-4 border border-border shadow-md text-center">
                  <span className="block text-xl">Send</span>
                </div>
                <div className="bg-card/70 backdrop-blur-md rounded-xl p-4 border border-border shadow-md text-center">
                  <span className="block text-xl">Receive</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose NepaliPay?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg p-6 shadow-md border border-border">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Blockchain</h3>
              <p className="text-muted-foreground">Advanced blockchain technology ensuring secure and transparent transactions.</p>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-md border border-border">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">NPT Tokens</h3>
              <p className="text-muted-foreground">Stablecoin pegged to NPR, providing a digital alternative for the Nepalese currency.</p>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-md border border-border">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Collaterals</h3>
              <p className="text-muted-foreground">Use your crypto as collateral for micro-loans, eliminating traditional banking barriers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
                NepaliPay
              </h2>
              <p className="text-muted-foreground max-w-xs">
                Empowering Nepal's financial future through blockchain technology.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold mb-3">Product</h3>
                <ul className="space-y-2">
                  <li><Link href="/support"><a className="text-muted-foreground hover:text-foreground">Features</a></Link></li>
                  <li><Link href="/support"><a className="text-muted-foreground hover:text-foreground">Pricing</a></Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Company</h3>
                <ul className="space-y-2">
                  <li><Link href="/support"><a className="text-muted-foreground hover:text-foreground">About Us</a></Link></li>
                  <li><Link href="/support/contact"><a className="text-muted-foreground hover:text-foreground">Contact</a></Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Resources</h3>
                <ul className="space-y-2">
                  <li><Link href="/support/knowledgebase"><a className="text-muted-foreground hover:text-foreground">Knowledge Base</a></Link></li>
                  <li><Link href="/support/faq"><a className="text-muted-foreground hover:text-foreground">FAQ</a></Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} NepaliPay. All rights reserved.
            </p>
            
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}