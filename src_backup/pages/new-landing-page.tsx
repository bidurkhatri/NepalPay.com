import React from 'react';
import { Link } from 'wouter';
import { 
  ArrowRight, 
  Send,
  DollarSign, 
  Gift, 
  ShoppingBag,
  ExternalLink,
  MessageSquare,
  Plus,
  ArrowDownCircle
} from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
      {/* Header - Logo and Nav Buttons */}
      <header className="border-b border-gray-800/60 bg-gray-900/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            <div className="flex items-center">
              <div className="text-2xl font-bold gradient-text">NepaliPay</div>
              <div className="ml-2 h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">₹</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Language Toggle */}
              <div className="hidden md:flex glass-card bg-gray-900/70 p-1.5 rounded-full">
                <button className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                  English
                </button>
                <button className="px-3 py-1 rounded-full text-gray-400 text-xs font-medium">
                  नेपाली
                </button>
              </div>
              
              <Link href="/auth">
                <button className="modern-button bg-gradient-to-r from-blue-600 to-blue-500">
                  Login
                </button>
              </Link>
              
              <Link href="/auth">
                <button className="modern-button bg-gradient-to-r from-green-600 to-green-500">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Himalayan blue color scheme */}
          <div className="absolute w-[500px] h-[500px] blur-[100px] rounded-full -top-20 -right-20 bg-blue-600/20 opacity-30"></div>
          <div className="absolute w-[600px] h-[600px] blur-[120px] rounded-full -bottom-40 -left-40 bg-blue-500/10 opacity-30"></div>
          
          {/* Nepali flag-inspired accent (red) */}
          <div className="absolute w-[300px] h-[300px] blur-[100px] rounded-full top-40 left-20 bg-red-500/10 opacity-20"></div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Welcome to Nepal's Digital Wallet – </span>
            <br/>
            <span className="gradient-text">Your Money, Your Way!</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Send money, borrow, earn rewards, and sell locally with 1 NPT = 1 NPR.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link href="/auth">
              <button className="modern-button bg-gradient-to-r from-green-600 to-green-500 h-12 px-8">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </Link>
            
            <Link href="/auth">
              <button className="modern-button-outline h-12 px-8">
                Login
              </button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Features</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Everything you need for digital finance in Nepal
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1: Instant Payments */}
            <div className="cyber-card bg-gradient-to-br from-blue-500/10 to-indigo-600/10 border-blue-500/20 hover:border-blue-500/30 hover:bg-gradient-to-br hover:from-blue-500/15 hover:to-indigo-600/15">
              <div className="card-highlight"></div>
              <div className="card-content text-center py-6">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
                  <Send className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Instant Payments</h3>
                <p className="text-gray-400">Pay friends or vendors in seconds.</p>
              </div>
            </div>
            
            {/* Feature 2: Easy Loans */}
            <div className="cyber-card bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border-purple-500/20 hover:border-purple-500/30 hover:bg-gradient-to-br hover:from-purple-500/15 hover:to-indigo-500/15">
              <div className="card-highlight"></div>
              <div className="card-content text-center py-6">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-500 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
                  <DollarSign className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Easy Loans</h3>
                <p className="text-gray-400">Borrow NPT with no bank hassle.</p>
              </div>
            </div>
            
            {/* Feature 3: Fun Rewards */}
            <div className="cyber-card bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-amber-500/20 hover:border-amber-500/30 hover:bg-gradient-to-br hover:from-amber-500/15 hover:to-yellow-500/15">
              <div className="card-highlight"></div>
              <div className="card-content text-center py-6">
                <div className="bg-gradient-to-br from-amber-500 to-yellow-500 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
                  <Gift className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Fun Rewards</h3>
                <p className="text-gray-400">Earn NPT and avatars with every tap.</p>
              </div>
            </div>
            
            {/* Feature 4: Ad Bazaar */}
            <div className="cyber-card bg-gradient-to-br from-pink-500/10 to-rose-500/10 border-pink-500/20 hover:border-pink-500/30 hover:bg-gradient-to-br hover:from-pink-500/15 hover:to-rose-500/15">
              <div className="card-highlight"></div>
              <div className="card-content text-center py-6">
                <div className="bg-gradient-to-br from-pink-500 to-rose-500 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
                  <ShoppingBag className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Ad Bazaar</h3>
                <p className="text-gray-400">Sell or shop Nepal's digital market.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Details & Info Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Why NepaliPay? */}
            <div className="glass-card">
              <div className="card-highlight"></div>
              <div className="card-content p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Why NepaliPay?</h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-300">
                    <div className="mr-3 h-2 w-2 bg-primary rounded-full"></div>
                    Low fees (~5 NPR)
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="mr-3 h-2 w-2 bg-primary rounded-full"></div>
                    Fast and secure
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="mr-3 h-2 w-2 bg-primary rounded-full"></div>
                    Nepal-friendly design
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Community Impact */}
            <div className="glass-card">
              <div className="card-highlight"></div>
              <div className="card-content p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Community Impact</h3>
                <p className="text-gray-300 mb-4">
                  5% of ad fees help schools and clinics through our Ember Pool.
                </p>
                <div className="rounded-lg bg-gray-800/50 p-3">
                  <div className="text-sm text-amber-400 mb-1">Ember Pool</div>
                  <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full w-3/5"></div>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">2,500 NPT collected</div>
                </div>
              </div>
            </div>
            
            {/* Safe & Simple */}
            <div className="glass-card">
              <div className="card-highlight"></div>
              <div className="card-content p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Safe & Simple</h3>
                <p className="text-gray-300 mb-4">
                  Your wallet, your control – no tech skills needed.
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">Verified Contracts</div>
                  <a 
                    href="https://bscscan.com/address/0x69d34B25809b346702C21EB0E22EAD8C1de58D66"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary flex items-center text-sm"
                  >
                    View on BSCScan
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="cyber-card bg-gradient-to-br from-primary/10 to-blue-600/5">
            <div className="card-highlight"></div>
            <div className="card-content p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-6">Join 10,000+ Nepalis Today!</h2>
              <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
                Be part of Nepal's digital financial revolution and take control of your money.
              </p>
              <Link href="/auth">
                <button className="modern-button bg-gradient-to-r from-green-600 to-green-500 h-12 px-8">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <span className="text-2xl font-bold gradient-text">NepaliPay</span>
                <div className="ml-2 h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">₹</span>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-400">Empowering Nepal's financial future</p>
            </div>
            
            <div className="flex flex-wrap gap-x-8 gap-y-4 justify-center md:justify-end">
              <a href="#" className="text-gray-400 hover:text-primary">About Us</a>
              <a href="#" className="text-gray-400 hover:text-primary">FAQ</a>
              <a href="#" className="text-gray-400 hover:text-primary">Contact</a>
              <a 
                href="mailto:support@nepalipay.com" 
                className="text-gray-400 hover:text-primary"
              >
                support@nepalipay.com
              </a>
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} NepaliPay. All rights reserved.
          </div>
        </div>
        
        {/* Need Help Chat Bubble - Fixed position */}
        <div className="fixed bottom-6 right-6 z-40">
          <Link href="/support" className="flex items-center glass-card bg-primary/10 py-3 px-5 rounded-full shadow-lg hover:scale-105 transition-transform">
            <MessageSquare className="mr-2 h-5 w-5 text-primary" />
            <span className="font-medium text-primary">Need Help?</span>
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;