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
  ExternalLink
} from 'lucide-react';
import ContractLinks from '@/components/contract-links';

const SectionsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { 
    isConnected, 
    connectWallet, 
    username, 
    nptBalance, 
    tokenBalance, 
    userDebt, 
    userCollaterals, 
    txCount, 
    avatars, 
    referralCount 
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

  const sections = [
    {
      title: "Wallet",
      description: "Manage your NPT tokens, deposit, and withdraw funds",
      icon: <Wallet className="h-8 w-8" />,
      path: "/wallet",
      color: "from-blue-500 to-cyan-400"
    },
    {
      title: "Payments",
      description: "Send and receive payments with other NepaliPay users",
      icon: <CircleDollarSign className="h-8 w-8" />,
      path: "/transactions",
      color: "from-green-500 to-emerald-400"
    },
    {
      title: "Loans",
      description: "Borrow NPT using your crypto as collateral",
      icon: <Shield className="h-8 w-8" />,
      path: "/loans",
      color: "from-purple-500 to-indigo-400"
    },
    {
      title: "Rewards",
      description: "Earn rewards through referrals, cashback, and avatars",
      icon: <Award className="h-8 w-8" />,
      path: "/rewards",
      color: "from-yellow-500 to-amber-400"
    },
    {
      title: "Ad Bazaar",
      description: "Post or browse local advertisements",
      icon: <Store className="h-8 w-8" />,
      path: "/ad-bazaar",
      color: "from-red-500 to-pink-400"
    },
    {
      title: "Buy Tokens",
      description: "Purchase NPT tokens with your credit card",
      icon: <ArrowUpRight className="h-8 w-8" />,
      path: "/buy-tokens",
      color: "from-indigo-500 to-blue-400",
      featured: true
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
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-gray-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/">
                <a className="flex items-center">
                  <span className="text-xl font-bold gradient-text">NepaliPay</span>
                </a>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <div className="glass-card bg-gray-900/60 py-1.5 px-4 flex items-center">
                <span className="text-gray-400 mr-2">Balance:</span>
                <span className="font-bold text-white">{parseFloat(nptBalance).toLocaleString(undefined, { maximumFractionDigits: 2 })} NPT</span>
              </div>
              
              {isConnected ? (
                <div className="flex items-center gap-4">
                  <div className="glass-card bg-primary/10 py-1.5 px-4 flex items-center">
                    <span className="text-primary font-medium">
                      {username || "Unnamed User"}
                    </span>
                  </div>
                  <button 
                    onClick={() => logout()}
                    className="modern-button-outline flex items-center"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </button>
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
            <div className="px-2 py-3 space-y-1 sm:px-3">
              <div className="glass-card bg-gray-900/60 py-3 px-4 flex items-center justify-between">
                <span className="text-gray-400">Balance:</span>
                <span className="font-bold text-white">{parseFloat(nptBalance).toLocaleString(undefined, { maximumFractionDigits: 2 })} NPT</span>
              </div>
              
              {isConnected ? (
                <>
                  <div className="glass-card bg-primary/10 py-3 px-4 flex items-center justify-between">
                    <span className="text-primary font-medium">
                      {username || "Unnamed User"}
                    </span>
                    <UserCircle className="h-5 w-5 text-primary" />
                  </div>
                  <button 
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                    }}
                    className="modern-button w-full flex items-center justify-center"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </button>
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
        <section className="py-12 px-4 sm:px-6 lg:px-8 relative">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute w-[500px] h-[500px] blur-[100px] rounded-full -top-20 -right-20 bg-primary/20 opacity-30"></div>
            <div className="absolute w-[600px] h-[600px] blur-[120px] rounded-full -bottom-40 -left-40 bg-blue-600/10 opacity-30"></div>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
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
            
            {/* Dashboard cards */}
            {isConnected && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="cyber-card">
                  <div className="card-highlight"></div>
                  <div className="card-content">
                    <h3 className="text-lg font-medium mb-2">NPT Balance</h3>
                    <div className="flex items-baseline">
                      <span className="text-2xl font-bold">{parseFloat(nptBalance).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                      <span className="ml-2 text-sm text-gray-400">NPT</span>
                    </div>
                    <div className="mt-4">
                      <Link href="/buy-tokens">
                        <a className="text-sm text-primary flex items-center">
                          Buy more tokens
                          <ArrowUpRight className="ml-1 h-4 w-4" />
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
                
                <div className="cyber-card">
                  <div className="card-highlight"></div>
                  <div className="card-content">
                    <h3 className="text-lg font-medium mb-2">Loan Status</h3>
                    {parseFloat(userDebt) > 0 ? (
                      <div>
                        <div className="flex items-baseline">
                          <span className="text-2xl font-bold text-red-400">{parseFloat(userDebt).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                          <span className="ml-2 text-sm text-gray-400">NPT owed</span>
                        </div>
                        <div className="mt-1 text-xs text-gray-400">
                          Collateral: {parseFloat(userCollaterals.nptValue).toLocaleString(undefined, { maximumFractionDigits: 2 })} NPT value
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-green-400 mb-1">No active loans</div>
                        <div className="text-sm text-gray-400">
                          You can borrow up to {parseFloat(userCollaterals.nptValue) * 0.66} NPT
                        </div>
                      </div>
                    )}
                    <div className="mt-4">
                      <Link href="/loans">
                        <a className="text-sm text-primary flex items-center">
                          Manage loans
                          <ArrowUpRight className="ml-1 h-4 w-4" />
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
                
                <div className="cyber-card">
                  <div className="card-highlight"></div>
                  <div className="card-content">
                    <h3 className="text-lg font-medium mb-2">Rewards</h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-gray-800/60 rounded p-2">
                        <div className="text-gray-400">Referrals</div>
                        <div className="text-lg font-bold">{referralCount}</div>
                      </div>
                      <div className="bg-gray-800/60 rounded p-2">
                        <div className="text-gray-400">Transactions</div>
                        <div className="text-lg font-bold">{txCount}/10</div>
                      </div>
                      <div className="bg-gray-800/60 rounded p-2">
                        <div className="text-gray-400">Avatars</div>
                        <div className="text-lg font-bold">{avatars.length}/5</div>
                      </div>
                      <div className="bg-primary/10 rounded p-2">
                        <div className="text-primary">Claimable</div>
                        <div className="text-lg font-bold">
                          {avatars.length >= 5 ? 5 : 0} NPT
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Link href="/rewards">
                        <a className="text-sm text-primary flex items-center">
                          View all rewards
                          <ArrowUpRight className="ml-1 h-4 w-4" />
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Features grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sections.map((section, index) => (
                <Link key={index} href={section.path}>
                  <a className={`cyber-card hover:translate-y-[-4px] transition-all ${section.featured ? 'bg-primary/10 border-primary/20' : ''}`}>
                    <div className="card-highlight"></div>
                    <div className="card-content">
                      <div className={`w-16 h-16 rounded-lg mb-4 flex items-center justify-center bg-gradient-to-br ${section.color} text-white`}>
                        {section.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
                      <p className="text-gray-400">{section.description}</p>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </section>
        
        {/* Contract Links Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
          <div className="max-w-5xl mx-auto">
            <ContractLinks contracts={contracts} />
          </div>
        </section>
      </main>
      
      {/* Footer */}
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
      </footer>
    </div>
  );
};

export default SectionsPage;