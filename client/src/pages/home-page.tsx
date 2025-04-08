import React from 'react';
import { Link } from 'wouter';
import { Wallet, ArrowRight, Shield, DownloadCloud, CreditCard, BarChart3 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const HomePage: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background pt-16 pb-24">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl sm:text-6xl font-bold leading-tight">
                Nepal's Digital <span className="text-gradient">Financial</span> Future
              </h1>
              <p className="mt-4 text-xl text-muted-foreground max-w-xl">
                NepaliPay delivers fast, secure, and convenient digital financial services
                with blockchain technology designed for Nepal's unique needs.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                {user ? (
                  <Link href="/dashboard">
                    <a className="btn-hover-effect px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium inline-flex items-center gap-2">
                      Go to Dashboard
                      <ArrowRight size={18} />
                    </a>
                  </Link>
                ) : (
                  <Link href="/auth">
                    <a className="btn-hover-effect px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium inline-flex items-center gap-2">
                      Get Started
                      <ArrowRight size={18} />
                    </a>
                  </Link>
                )}
                <Link href="/support">
                  <a className="px-8 py-3 border border-border rounded-lg font-medium">
                    Learn More
                  </a>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl"></div>
                <img
                  src="https://images.unsplash.com/photo-1518893494013-481c1d8ed3fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="NepaliPay Dashboard Preview"
                  className="relative z-10 rounded-xl shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Innovative Financial Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience the next generation of digital finance with cutting-edge blockchain technology,
            designed specifically for Nepal's unique economic landscape.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Wallet className="text-primary" size={24} />}
            title="Secure Digital Wallet"
            description="Store, send, and receive NPT tokens with complete security and privacy using blockchain technology."
          />
          <FeatureCard
            icon={<Shield className="text-primary" size={24} />}
            title="Collateral-Backed Loans"
            description="Use cryptocurrency as collateral to access instant loans with competitive interest rates."
          />
          <FeatureCard
            icon={<DownloadCloud className="text-primary" size={24} />}
            title="Buy NPT Tokens"
            description="Easily purchase NPT tokens using your credit/debit card with our secure Stripe integration."
          />
          <FeatureCard
            icon={<CreditCard className="text-primary" size={24} />}
            title="Bill Payments"
            description="Pay utility bills, mobile recharges, and other services directly from your wallet."
          />
          <FeatureCard
            icon={<BarChart3 className="text-primary" size={24} />}
            title="Transaction Analytics"
            description="Track your spending patterns, view transaction history, and manage finances efficiently."
          />
          <FeatureCard
            icon={<Shield className="text-primary" size={24} />}
            title="Enhanced Security"
            description="Multi-factor authentication, blockchain verification, and encrypted transactions."
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to join the financial revolution?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Start your journey with NepaliPay today and experience the future of digital finance in Nepal.
          </p>
          {user ? (
            <Link href="/dashboard">
              <a className="btn-hover-effect px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium inline-flex items-center gap-2">
                Go to Dashboard
                <ArrowRight size={18} />
              </a>
            </Link>
          ) : (
            <Link href="/auth">
              <a className="btn-hover-effect px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium inline-flex items-center gap-2">
                Get Started
                <ArrowRight size={18} />
              </a>
            </Link>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">NepaliPay</h3>
              <p className="text-muted-foreground">
                Nepal's leading blockchain-powered digital wallet and financial services platform.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="/dashboard"><a className="text-muted-foreground hover:text-foreground">Dashboard</a></Link></li>
                <li><Link href="/wallet"><a className="text-muted-foreground hover:text-foreground">Wallet</a></Link></li>
                <li><Link href="/loans"><a className="text-muted-foreground hover:text-foreground">Loans</a></Link></li>
                <li><Link href="/buy-tokens"><a className="text-muted-foreground hover:text-foreground">Buy Tokens</a></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link href="/support"><a className="text-muted-foreground hover:text-foreground">Help Center</a></Link></li>
                <li><Link href="/support/faq"><a className="text-muted-foreground hover:text-foreground">FAQ</a></Link></li>
                <li><Link href="/support/knowledgebase"><a className="text-muted-foreground hover:text-foreground">Knowledge Base</a></Link></li>
                <li><Link href="/support/contact"><a className="text-muted-foreground hover:text-foreground">Contact Us</a></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Terms of Service</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} NepaliPay. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;