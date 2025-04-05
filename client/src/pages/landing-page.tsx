import React from 'react';
import { Link } from 'wouter';
import { MoveRight, Shield, Globe, Rocket, CreditCard, Phone, ArrowUpRight } from 'lucide-react';
import ContractLinks from '@/components/contract-links';

const LandingPage: React.FC = () => {
  const contracts = [
    {
      name: "NepaliPay Token (NPT)",
      address: "0x69d34B25809b346702C21EB0E22EAD8C1de58D66",
      description: "The main token used in the NepaliPay ecosystem",
    },
    {
      name: "NepaliPay",
      address: "0xe2d189f6696ee8b247ceae97fe3f1f2879054553",
      description: "Core functionality contract for user operations",
    },
    {
      name: "Fee Relayer",
      address: "0x7ff2271749409f9137dac1e082962e21cc99aee6",
      description: "Handles gas fee relaying for transactions",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[500px] h-[500px] blur-[100px] rounded-full -top-20 -right-20 bg-primary/20"></div>
          <div className="absolute w-[600px] h-[600px] blur-[120px] rounded-full -bottom-40 -left-40 bg-blue-600/10"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight gradient-text">
                Revolutionizing Digital Finance in Nepal
              </h1>
              <p className="text-lg text-gray-300 leading-relaxed">
                Experience the future of finance with NepaliPay - a cutting-edge blockchain solution designed for Nepal's unique financial landscape. 
                Secure. Transparent. Innovative.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/login">
                  <a className="modern-button flex items-center">
                    Get Started
                    <MoveRight className="ml-2 h-5 w-5" />
                  </a>
                </Link>
                <Link href="/register">
                  <a className="modern-button-outline flex items-center">
                    Create Account
                    <ArrowUpRight className="ml-2 h-5 w-5" />
                  </a>
                </Link>
              </div>
            </div>
            
            <div className="glass-card">
              <div className="card-highlight"></div>
              <div className="card-content relative">
                <div className="absolute -top-8 -right-8 w-32 h-32 blur-[80px] bg-primary/30 rounded-full"></div>
                <img 
                  src="https://storage.googleapis.com/replit/images/1637926042321_89fdd3a9cf8ce6405fc38b5b071e5dd1.png" 
                  alt="NepaliPay Dashboard Preview" 
                  className="w-full h-auto rounded-lg border border-gray-800/60 shadow-xl transform transition-all"
                />
                <div className="mt-4 flex gap-3">
                  <div className="bg-gray-800/60 rounded-lg p-3 text-center flex-1">
                    <div className="text-2xl font-bold text-primary">13.3K+</div>
                    <div className="text-xs text-gray-400 mt-1">Active Users</div>
                  </div>
                  <div className="bg-gray-800/60 rounded-lg p-3 text-center flex-1">
                    <div className="text-2xl font-bold text-primary">120M+</div>
                    <div className="text-xs text-gray-400 mt-1">Transactions</div>
                  </div>
                  <div className="bg-gray-800/60 rounded-lg p-3 text-center flex-1">
                    <div className="text-2xl font-bold text-primary">$8.5M</div>
                    <div className="text-xs text-gray-400 mt-1">Total Volume</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold gradient-text mb-4">Revolutionary Features</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              NepaliPay combines cutting-edge blockchain technology with user-friendly interfaces 
              to create a seamless financial experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="cyber-card">
              <div className="card-highlight"></div>
              <div className="card-content">
                <Shield className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Secure Transactions</h3>
                <p className="text-gray-400">
                  All transactions are secured on the Binance Smart Chain, ensuring transparency and immutability.
                </p>
              </div>
            </div>
            
            <div className="cyber-card">
              <div className="card-highlight"></div>
              <div className="card-content">
                <Globe className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Cross-Border Payments</h3>
                <p className="text-gray-400">
                  Send money internationally without the high fees and delays of traditional banking systems.
                </p>
              </div>
            </div>
            
            <div className="cyber-card">
              <div className="card-highlight"></div>
              <div className="card-content">
                <Rocket className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Instant Settlements</h3>
                <p className="text-gray-400">
                  Experience near-instant transaction confirmations, putting an end to long waiting periods.
                </p>
              </div>
            </div>
            
            <div className="cyber-card">
              <div className="card-highlight"></div>
              <div className="card-content">
                <CreditCard className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Collateralized Loans</h3>
                <p className="text-gray-400">
                  Access liquidity by using your crypto assets as collateral, with competitive interest rates.
                </p>
              </div>
            </div>
            
            <div className="cyber-card">
              <div className="card-highlight"></div>
              <div className="card-content">
                <Phone className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Mobile-First Design</h3>
                <p className="text-gray-400">
                  Manage your finances on the go with our responsive, mobile-optimized interface.
                </p>
              </div>
            </div>
            
            <div className="cyber-card bg-primary/10 border-primary/20">
              <div className="card-highlight"></div>
              <div className="card-content">
                <div className="absolute -bottom-6 -right-6 w-24 h-24 blur-[60px] bg-primary/40 rounded-full"></div>
                <h3 className="text-xl font-semibold mb-2">Start Using NepaliPay Today</h3>
                <p className="text-gray-400 mb-4">
                  Join thousands of users already benefiting from the future of finance.
                </p>
                <Link href="/register">
                  <a className="modern-button w-full text-center">
                    Register Now
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold gradient-text mb-4">What Our Users Say</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Hear from the people who use NepaliPay to transform their financial lives.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-card">
              <div className="card-highlight"></div>
              <div className="card-content">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-lg font-bold mr-3">
                    RK
                  </div>
                  <div>
                    <h4 className="font-medium">Rajesh Kumar</h4>
                    <p className="text-sm text-gray-400">Small Business Owner</p>
                  </div>
                </div>
                <p className="italic text-gray-300">
                  "NepaliPay has transformed how I run my business. The instant payments and low fees have increased my profit margins significantly."
                </p>
              </div>
            </div>
            
            <div className="glass-card">
              <div className="card-highlight"></div>
              <div className="card-content">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-lg font-bold mr-3">
                    SP
                  </div>
                  <div>
                    <h4 className="font-medium">Sita Pradhan</h4>
                    <p className="text-sm text-gray-400">Freelance Designer</p>
                  </div>
                </div>
                <p className="italic text-gray-300">
                  "As a freelancer, getting paid by international clients was always a headache. With NepaliPay, I receive payments in minutes, not days."
                </p>
              </div>
            </div>
            
            <div className="glass-card">
              <div className="card-highlight"></div>
              <div className="card-content">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-lg font-bold mr-3">
                    AM
                  </div>
                  <div>
                    <h4 className="font-medium">Anish Maharjan</h4>
                    <p className="text-sm text-gray-400">Tech Entrepreneur</p>
                  </div>
                </div>
                <p className="italic text-gray-300">
                  "The collateralized loan feature helped me expand my startup without giving away equity. NepaliPay is a game-changer for entrepreneurs."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Blockchain Integration */}
      <section className="py-16 px-4 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold gradient-text mb-4">Powered by Blockchain</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              NepaliPay is built on secure, audited smart contracts deployed on the Binance Smart Chain.
            </p>
          </div>
          
          <ContractLinks contracts={contracts} />
          
          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-6">
              Connect your wallet to interact directly with our smart contracts
            </p>
            <Link href="/login">
              <a className="modern-button">
                Connect Wallet
              </a>
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto glass p-10 rounded-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 blur-[100px] bg-primary/20 rounded-full"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 blur-[100px] bg-blue-600/10 rounded-full"></div>
          
          <div className="relative text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text">
              Ready to Join the Financial Revolution?
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Create your account today and experience the future of finance with NepaliPay. 
              It only takes a few minutes to get started.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link href="/register">
                <a className="modern-button px-8 py-3">
                  Create Free Account
                </a>
              </Link>
              <Link href="/login">
                <a className="modern-button-outline px-8 py-3">
                  Sign In
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-10 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">NepaliPay</h3>
              <p className="text-gray-400">
                Empowering Nepal's financial future through blockchain technology.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-primary">Digital Wallet</a></li>
                <li><a href="#" className="hover:text-primary">Collateralized Loans</a></li>
                <li><a href="#" className="hover:text-primary">Ad Bazaar</a></li>
                <li><a href="#" className="hover:text-primary">Reward System</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-primary">Documentation</a></li>
                <li><a href="#" className="hover:text-primary">Developers</a></li>
                <li><a href="#" className="hover:text-primary">API Reference</a></li>
                <li><a href="#" className="hover:text-primary">Smart Contracts</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-primary">About Us</a></li>
                <li><a href="#" className="hover:text-primary">Careers</a></li>
                <li><a href="#" className="hover:text-primary">Blog</a></li>
                <li><a href="#" className="hover:text-primary">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-10 pt-10 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © 2025 NepaliPay. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-primary">Terms</a>
              <a href="#" className="text-gray-400 hover:text-primary">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-primary">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;