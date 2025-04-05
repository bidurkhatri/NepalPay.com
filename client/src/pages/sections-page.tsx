import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useBlockchain } from '@/contexts/blockchain-context';
import { Link } from 'wouter';
import { 
  Wallet, 
  CircleDollarSign, 
  ArrowUpRight, 
  Shield, 
  Award, 
  Store, 
  LogOut, 
  UserCircle, 
  LogIn, 
  Menu, 
  X,
  ExternalLink,
  Send,
  ArrowDownCircle,
  Plus,
  Clock,
  PiggyBank,
  CreditCard,
  Newspaper,
  Building,
  Gift,
  DollarSign,
  ShoppingCart,
  MessageSquare
} from 'lucide-react';
import ContractLinks from '@/components/contract-links';

const SectionsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { 
    isConnected, 
    connectWallet, 
    username, 
    nptBalance = "0", 
    tokenBalance = "0", 
    userDebt = "0", 
    userCollaterals = { bnb: "0", eth: "0", btc: "0", nptValue: "0" }, 
    txCount = 0, 
    avatars = [], 
    referralCount = 0
  } = useBlockchain();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Contract info for the links component
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

  // Main grid sections based on the UI map structure
  const sections = [
    {
      title: "Send NPT",
      description: "Send NPT tokens to friends, family or businesses",
      icon: <Send className="h-8 w-8" />,
      path: "/send",
      color: "from-indigo-500 to-blue-400",
      featured: true
    },
    {
      title: "Borrow",
      description: "Take loans using your crypto as collateral",
      icon: <Shield className="h-8 w-8" />,
      path: "/borrow",
      color: "from-purple-500 to-indigo-400"
    },
    {
      title: "Rewards",
      description: "Earn through referrals, cashback, and avatar collection",
      icon: <Gift className="h-8 w-8" />,
      path: "/rewards",
      color: "from-amber-500 to-yellow-400"
    },
    {
      title: "Ad Bazaar",
      description: "Post or browse local marketplace advertisements",
      icon: <Store className="h-8 w-8" />,
      path: "/ad-bazaar",
      color: "from-pink-500 to-rose-400"
    },
    {
      title: "Buy Tokens",
      description: "Purchase NPT tokens with credit card or crypto",
      icon: <DollarSign className="h-8 w-8" />,
      path: "/buy-tokens",
      color: "from-green-600 to-emerald-500"
    },
    {
      title: "Utilities",
      description: "Pay for mobile, electricity, and other services",
      icon: <CreditCard className="h-8 w-8" />,
      path: "/utilities",
      color: "from-teal-500 to-green-400"
    },
    {
      title: "Crowdfunding",
      description: "Support or create campaigns for community projects",
      icon: <Building className="h-8 w-8" />,
      path: "/crowdfunding",
      color: "from-orange-500 to-red-400"
    },
    {
      title: "Wallet",
      description: "Manage your NPT tokens, deposit, and withdraw funds",
      icon: <Wallet className="h-8 w-8" />,
      path: "/wallet",
      color: "from-blue-500 to-cyan-400"
    },
    {
      title: "Help & Support",
      description: "Get assistance with using NepaliPay",
      icon: <MessageSquare className="h-8 w-8" />,
      path: "/support",
      color: "from-cyan-500 to-blue-400"
    }
  ];

  // Function to toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  // Function to close mobile menu
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen">
      {/* Header - Nepal Flag inspired */}
      <header className="glass sticky top-0 z-50 border-b border-gray-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold gradient-text">NepaliPay</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              {/* Balance Display */}
              <div className="glass-card bg-gray-900/60 py-2 px-4 flex items-center">
                <span className="text-gray-400 mr-2">Balance:</span>
                <span className="font-bold text-white">{parseFloat(nptBalance).toLocaleString(undefined, { maximumFractionDigits: 2 })} NPT</span>
                <span className="text-xs text-gray-400 ml-1">(~{parseFloat(nptBalance).toLocaleString(undefined, { maximumFractionDigits: 2 })} NPR)</span>
              </div>
              
              {isConnected ? (
                <div className="flex items-center gap-2">
                  {/* Add Funds Button */}
                  <Link href="/buy-tokens">
                    <button className="modern-button bg-gradient-to-r from-green-600 to-green-500 flex items-center">
                      <Plus className="mr-1 h-4 w-4" />
                      Add Funds
                    </button>
                  </Link>
                  
                  {/* Withdraw Button */}
                  <Link href="/wallet">
                    <button className="modern-button bg-gradient-to-r from-orange-600 to-orange-500 flex items-center">
                      <ArrowDownCircle className="mr-1 h-4 w-4" />
                      Withdraw
                    </button>
                  </Link>
                  
                  {/* Language Toggle */}
                  <div className="glass-card bg-gray-900/70 p-1.5 rounded-full flex">
                    <button className="px-2 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                      English
                    </button>
                    <button className="px-2 py-1 rounded-full text-gray-400 text-xs font-medium">
                      नेपाली
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={connectWallet}
                  className="modern-button flex items-center"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Connect Wallet
                </button>
              )}
            </nav>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={toggleMobileMenu}
                className="glass-button p-2 rounded-lg"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass border-t border-gray-800/60">
            <div className="px-2 py-3 space-y-2 sm:px-3">
              {/* Mobile Balance Display */}
              <div className="glass-card bg-gray-900/60 py-3 px-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Balance:</span>
                  <span className="font-bold text-white">{parseFloat(nptBalance).toLocaleString(undefined, { maximumFractionDigits: 2 })} NPT</span>
                </div>
                <div className="text-right text-xs text-gray-400">
                  (~{parseFloat(nptBalance).toLocaleString(undefined, { maximumFractionDigits: 2 })} NPR)
                </div>
              </div>
              
              {isConnected ? (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    {/* Add Funds Button */}
                    <Link href="/buy-tokens" className="w-full">
                      <button className="modern-button bg-gradient-to-r from-green-600 to-green-500 w-full flex items-center justify-center">
                        <Plus className="mr-1 h-4 w-4" />
                        Add Funds
                      </button>
                    </Link>
                    
                    {/* Withdraw Button */}
                    <Link href="/wallet" className="w-full">
                      <button className="modern-button bg-gradient-to-r from-orange-600 to-orange-500 w-full flex items-center justify-center">
                        <ArrowDownCircle className="mr-1 h-4 w-4" />
                        Withdraw
                      </button>
                    </Link>
                  </div>
                  
                  {/* Mobile Language Toggle */}
                  <div className="glass-card bg-gray-900/70 p-1.5 rounded-full flex justify-center">
                    <button className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                      English
                    </button>
                    <button className="px-3 py-1 rounded-full text-gray-400 text-xs font-medium">
                      नेपाली
                    </button>
                  </div>
                </>
              ) : (
                <button 
                  onClick={() => {
                    connectWallet();
                    closeMobileMenu();
                  }}
                  className="modern-button w-full flex items-center justify-center"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        )}
      </header>
      
      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="py-10 px-4 sm:px-6 lg:px-8 relative">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute w-[500px] h-[500px] blur-[100px] rounded-full -top-20 -right-20 bg-primary/20 opacity-30"></div>
            <div className="absolute w-[600px] h-[600px] blur-[120px] rounded-full -bottom-40 -left-40 bg-blue-600/10 opacity-30"></div>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-6">
              <h1 className="text-3xl md:text-4xl font-bold gradient-text">
                Welcome{username ? `, ${username}` : ''}!
              </h1>
              <p className="mt-3 text-lg text-gray-300">
                Manage your digital assets with NepaliPay. What would you like to do today?
              </p>
            </div>
            
            {!isConnected && (
              <div className="glass-card bg-gray-900/70 mb-8">
                <div className="card-highlight"></div>
                <div className="card-content text-center py-8">
                  <h2 className="text-xl font-semibold mb-4">Connect Your Wallet to Get Started</h2>
                  <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                    To access all features of NepaliPay, please connect your MetaMask or other Web3 wallet.
                  </p>
                  <button 
                    onClick={connectWallet}
                    className="modern-button"
                  >
                    Connect Wallet
                  </button>
                </div>
              </div>
            )}
            
            {/* Main Grid - Nepal Inspired */}
            {isConnected && (
              <>
                {/* Balance Card */}
                <div className="glass-card bg-gray-900/70 mb-6">
                  <div className="card-highlight"></div>
                  <div className="card-content py-4 px-1">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                      <div className="flex flex-col items-center md:items-start">
                        <span className="text-gray-400 text-sm">Current Balance</span>
                        <div className="flex items-baseline">
                          <span className="text-3xl font-bold text-white">{parseFloat(nptBalance).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                          <span className="ml-2 text-lg font-medium text-gray-300">NPT</span>
                        </div>
                        <span className="text-sm text-gray-400">(~{parseFloat(nptBalance).toLocaleString(undefined, { maximumFractionDigits: 2 })} NPR)</span>
                      </div>
                      
                      <div className="flex mt-4 md:mt-0 gap-3">
                        <Link href="/buy-tokens">
                          <button className="modern-button bg-gradient-to-r from-green-600 to-green-500">
                            <Plus className="mr-1 h-4 w-4" />
                            Add Funds
                          </button>
                        </Link>
                        <Link href="/wallet">
                          <button className="modern-button bg-gradient-to-r from-orange-600 to-orange-500">
                            <ArrowDownCircle className="mr-1 h-4 w-4" />
                            Withdraw
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Main Grid - Primary Actions (Nepal Style) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <Link href="/send" className="cyber-card bg-gradient-to-br from-blue-500/10 to-indigo-600/10 border-blue-500/20 hover:border-blue-500/30 hover:bg-gradient-to-br hover:from-blue-500/15 hover:to-indigo-600/15">
                    <div className="card-highlight"></div>
                    <div className="card-content text-center py-6">
                      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-3">
                        <Send className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">Send NPT</h3>
                    </div>
                  </Link>
                  
                  <Link href="/borrow" className="cyber-card bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border-purple-500/20 hover:border-purple-500/30 hover:bg-gradient-to-br hover:from-purple-500/15 hover:to-indigo-500/15">
                    <div className="card-highlight"></div>
                    <div className="card-content text-center py-6">
                      <div className="bg-gradient-to-br from-purple-500 to-indigo-500 w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-3">
                        <Shield className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">Borrow</h3>
                    </div>
                  </Link>
                  
                  <Link href="/rewards" className="cyber-card bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-amber-500/20 hover:border-amber-500/30 hover:bg-gradient-to-br hover:from-amber-500/15 hover:to-yellow-500/15">
                    <div className="card-highlight"></div>
                    <div className="card-content text-center py-6">
                      <div className="bg-gradient-to-br from-amber-500 to-yellow-500 w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-3">
                        <Gift className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">Rewards</h3>
                    </div>
                  </Link>
                  
                  <Link href="/ad-bazaar" className="cyber-card bg-gradient-to-br from-pink-500/10 to-rose-500/10 border-pink-500/20 hover:border-pink-500/30 hover:bg-gradient-to-br hover:from-pink-500/15 hover:to-rose-500/15">
                    <div className="card-highlight"></div>
                    <div className="card-content text-center py-6">
                      <div className="bg-gradient-to-br from-pink-500 to-rose-500 w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-3">
                        <Store className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">Ad Bazaar</h3>
                    </div>
                  </Link>
                </div>
                
                {/* Loan Status & Rewards Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="cyber-card">
                    <div className="card-highlight"></div>
                    <div className="card-content">
                      <h3 className="text-lg font-medium mb-3 flex items-center">
                        <Shield className="mr-2 h-5 w-5 text-purple-400" />
                        Loan Status
                      </h3>
                      {parseFloat(userDebt) > 0 ? (
                        <div>
                          <div className="flex items-baseline">
                            <span className="text-2xl font-bold text-red-400">{parseFloat(userDebt).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                            <span className="ml-2 text-sm text-gray-400">NPT owed</span>
                          </div>
                          <div className="mt-2 text-sm text-gray-400 flex items-center">
                            <span className="px-2 py-0.5 bg-red-900/30 text-red-400 rounded-full text-xs font-medium mr-2">5% interest</span>
                            <span>Due in 30 days</span>
                          </div>
                          <div className="mt-2 text-xs text-gray-400">
                            Collateral: {parseFloat(userCollaterals.nptValue).toLocaleString(undefined, { maximumFractionDigits: 2 })} NPT value
                          </div>
                          <div className="mt-4 flex gap-2">
                            <Link href="/borrow">
                              <button className="modern-button-outline text-sm py-1.5">
                                Add Collateral
                              </button>
                            </Link>
                            <Link href="/borrow">
                              <button className="modern-button bg-gradient-to-r from-red-600 to-red-500 text-sm py-1.5">
                                Repay Loan
                              </button>
                            </Link>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-green-400 mb-1 flex items-center">
                            <span className="px-2 py-0.5 bg-green-900/30 text-green-400 rounded-full text-xs font-medium mr-2">Available</span>
                            <span>No active loans</span>
                          </div>
                          <div className="text-sm text-gray-400 mt-2">
                            You can borrow up to {parseFloat(userCollaterals.nptValue) * 0.66} NPT with your current collateral
                          </div>
                          <div className="mt-4">
                            <Link href="/borrow">
                              <button className="modern-button bg-gradient-to-r from-purple-600 to-indigo-600 text-sm">
                                Take a Loan
                              </button>
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="cyber-card">
                    <div className="card-highlight"></div>
                    <div className="card-content">
                      <h3 className="text-lg font-medium mb-3 flex items-center">
                        <Gift className="mr-2 h-5 w-5 text-amber-400" />
                        Rewards Summary
                      </h3>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="glass-card bg-gray-800/60 rounded p-3">
                          <div className="text-gray-400 mb-1">Referrals</div>
                          <div className="text-lg font-bold flex items-baseline">
                            {referralCount}
                            <span className="ml-2 text-xs text-primary">{referralCount > 0 ? '10 NPT claimable' : ''}</span>
                          </div>
                        </div>
                        <div className="glass-card bg-gray-800/60 rounded p-3">
                          <div className="text-gray-400 mb-1">Transactions</div>
                          <div className="text-lg font-bold flex items-center">
                            <div className="mr-2">{txCount}/10</div>
                            <div className="h-1 flex-grow bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full" 
                                style={{ width: `${(txCount / 10) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className="glass-card bg-gray-800/60 rounded p-3">
                          <div className="text-gray-400 mb-1">Avatars</div>
                          <div className="text-lg font-bold flex items-baseline">
                            {avatars.length}/5
                            <span className="ml-2 text-xs text-amber-400">{avatars.length >= 5 ? '+5 NPT' : ''}</span>
                          </div>
                        </div>
                        <Link href="/rewards" className="glass-card bg-primary/10 rounded p-3 flex flex-col justify-center items-center hover:bg-primary/15 transition-colors">
                          <Gift className="h-5 w-5 text-primary mb-1" />
                          <span className="text-primary">View Rewards</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {/* Secondary Features Grid */}
            <h2 className="text-xl font-semibold mb-4 text-gray-100">More Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {sections.slice(4).map((section, index) => (
                <Link key={index} href={section.path} className="cyber-card hover:translate-y-[-4px] transition-all flex items-center p-4">
                  <div className={`w-10 h-10 rounded-lg mr-3 flex items-center justify-center bg-gradient-to-br ${section.color} text-white`}>
                    {section.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">{section.title}</h3>
                    <p className="text-xs text-gray-400">{section.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        
        {/* Contract Links Section */}
        <section className="py-10 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
          <div className="max-w-5xl mx-auto">
            <ContractLinks contracts={contracts} />
          </div>
        </section>
      </main>
      
      {/* Footer with Need Help chat bubble */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-lg font-bold gradient-text">NepaliPay</span>
            <p className="text-sm text-gray-400 mt-1">
              Empowering Nepal's financial future
            </p>
          </div>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center md:justify-end">
            <a href="#" className="text-sm text-gray-400 hover:text-primary">Terms</a>
            <a href="#" className="text-sm text-gray-400 hover:text-primary">Privacy</a>
            <a href="#" className="text-sm text-gray-400 hover:text-primary">Support</a>
            <a 
              href="https://bscscan.com/address/0x69d34B25809b346702C21EB0E22EAD8C1de58D66" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-primary flex items-center"
            >
              BscScan
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
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

export default SectionsPage;