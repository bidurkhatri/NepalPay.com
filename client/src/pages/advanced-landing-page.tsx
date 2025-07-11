import React, { useEffect, useState } from 'react';
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
  ArrowDownCircle,
  ShieldCheck,
  Zap,
  Globe,
  CreditCard,
  TrendingUp,
  Smartphone
} from 'lucide-react';

const AdvancedLandingPage: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 right-0 h-[800px] bg-gradient-to-b from-primary/20 to-transparent"></div>
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-40"></div>
        <div className="absolute top-80 left-[20%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] opacity-30"></div>
        <div className="absolute top-60 right-[10%] w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[90px] opacity-30"></div>
      </div>
      
      {/* Header - Logo and Nav Buttons */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${scrollY > 20 ? 'backdrop-blur-md bg-black/60 border-b border-primary/20' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-teal-400">NepaliPay</div>
              <div className="ml-2 h-6 w-6 rounded-full flex items-center justify-center shadow-lg" 
                   style={{ 
                     background: 'linear-gradient(to right, #1A73E8, #009688)',
                     boxShadow: '0 4px 15px rgba(26, 115, 232, 0.2)'
                   }}>
                <span className="text-white font-bold text-xs">₹</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Nav Links - Desktop */}
              <div className="hidden md:flex items-center space-x-6">
                <a href="#features" className="text-white/80 transition-colors text-sm" 
                   style={{ color: 'rgba(255,255,255,0.8)' }}
                   onMouseEnter={(e) => e.target.style.color = '#1A73E8'}
                   onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>Features</a>
                <a href="#how-it-works" className="text-white/80 transition-colors text-sm"
                   style={{ color: 'rgba(255,255,255,0.8)' }}
                   onMouseEnter={(e) => e.target.style.color = '#1A73E8'}
                   onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>How it Works</a>
                <a href="#security" className="text-white/80 transition-colors text-sm"
                   style={{ color: 'rgba(255,255,255,0.8)' }}
                   onMouseEnter={(e) => e.target.style.color = '#1A73E8'}
                   onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>Security</a>
              </div>
              
              {/* Language Toggle */}
              <div className="hidden lg:flex glass-card bg-white/5 p-1 rounded-full border border-white/10">
                <button className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: 'rgba(26, 115, 232, 0.2)', color: '#1A73E8' }}>
                  English
                </button>
                <button className="px-3 py-1 rounded-full text-white/60 text-xs font-medium hover:text-white/80 transition-colors">
                  नेपाली
                </button>
              </div>
              
              <Link href="/auth">
                <button className="text-sm hidden sm:flex px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-white">
                  Login
                </button>
              </Link>
              
              <Link href="/auth">
                <button className="text-sm px-4 py-2 rounded-lg transition-all shadow-lg text-white"
                        style={{ 
                          background: 'linear-gradient(to right, #1A73E8, #009688)',
                          boxShadow: '0 4px 15px rgba(26, 115, 232, 0.2)'
                        }}
                        onMouseEnter={(e) => e.target.style.background = 'linear-gradient(to right, rgba(26, 115, 232, 0.9), rgba(0, 150, 136, 0.9))'}
                        onMouseLeave={(e) => e.target.style.background = 'linear-gradient(to right, #1A73E8, #009688)'}>
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm mb-6"
                   style={{ 
                     backgroundColor: 'rgba(26, 115, 232, 0.1)',
                     borderColor: 'rgba(26, 115, 232, 0.2)',
                     color: '#1A73E8',
                     border: '1px solid'
                   }}>
                <span className="mr-2">Revolutionizing digital payments in Nepal</span>
                <Zap className="h-4 w-4" />
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-400 to-blue-500">
                  The Future of Finance
                </span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-teal-400 to-teal-500">
                  for Nepal
                </span>
              </h1>
              
              <p className="text-xl text-white/70 mb-8 max-w-xl mx-auto lg:mx-0">
                Experience seamless blockchain payments with our cutting-edge digital wallet. Send money, pay bills, and manage your digital assets with ease.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link href="/auth">
                  <button className="flex items-center px-8 py-3 rounded-lg transition-all shadow-lg text-white font-medium"
                          style={{ 
                            background: 'linear-gradient(to right, #1A73E8, #009688)',
                            boxShadow: '0 10px 25px rgba(26, 115, 232, 0.2)'
                          }}
                          onMouseEnter={(e) => e.target.style.background = 'linear-gradient(to right, rgba(26, 115, 232, 0.9), rgba(0, 150, 136, 0.9))'}
                          onMouseLeave={(e) => e.target.style.background = 'linear-gradient(to right, #1A73E8, #009688)'}>
                    <span className="font-medium">Start Now</span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                </Link>
                
                <a 
                  href="#how-it-works" 
                  className="flex items-center px-8 py-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                >
                  <span>Learn More</span>
                </a>
              </div>
              
              <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-8">
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`w-8 h-8 rounded-full border-2 border-black bg-gradient-to-br ${i === 1 ? 'from-pink-500 to-purple-500' : i === 2 ? 'from-blue-500 to-teal-500' : i === 3 ? 'from-orange-500 to-yellow-500' : 'from-green-500 to-emerald-500'}`}></div>
                    ))}
                  </div>
                  <span className="ml-4 text-white/70 text-sm">10,000+ Users Trust Us</span>
                </div>
                
                <div className="flex items-center">
                  <div className="flex items-center text-yellow-500">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-white/70 text-sm">5.0 Rating</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              {/* App Preview Card with Glassmorphism */}
              <div className="glass transition duration-700 transform bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl shadow-primary/20 max-w-md mx-auto">
                <div className="pointer-events-none select-none">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">NepaliPay Wallet</h3>
                      <p className="text-sm text-white/60">Real-time blockchain transactions</p>
                    </div>
                    <div className="h-10 w-10 rounded-full flex items-center justify-center shadow-lg" 
                         style={{ 
                           background: 'linear-gradient(to bottom right, #1A73E8, #009688)',
                           boxShadow: '0 4px 15px rgba(26, 115, 232, 0.2)'
                         }}>
                      <span className="text-white font-bold">₹</span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="mb-2 flex justify-between items-center">
                      <div className="text-sm text-white/60">Your Balance</div>
                      <div className="text-xs text-white/40 flex items-center">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1"></div>
                        Live
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
                      10,000 NPT
                    </div>
                    <div className="text-sm text-white/60">≈ 10,000 NPR</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="flex flex-col items-center bg-white/5 rounded-xl border border-white/5 p-3 hover:bg-white/10 transition-all">
                      <Send className="h-5 w-5 mb-2" style={{ color: '#1A73E8' }} />
                      <span className="text-xs text-white/80">Send</span>
                    </div>
                    <div className="flex flex-col items-center bg-white/5 rounded-xl border border-white/5 p-3 hover:bg-white/10 transition-all">
                      <Plus className="h-5 w-5 text-green-400 mb-2" />
                      <span className="text-xs text-white/80">Receive</span>
                    </div>
                    <div className="flex flex-col items-center bg-white/5 rounded-xl border border-white/5 p-3 hover:bg-white/10 transition-all">
                      <CreditCard className="h-5 w-5 text-purple-400 mb-2" />
                      <span className="text-xs text-white/80">Buy</span>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl border border-white/5 p-4">
                    <div className="mb-3 text-sm font-medium text-white">Recent Activity</div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                            <ArrowDownCircle className="h-4 w-4 text-green-400" />
                          </div>
                          <div>
                            <div className="text-sm text-white/80">Received</div>
                            <div className="text-xs text-white/60">From: Ram</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-400">+500 NPT</div>
                          <div className="text-xs text-white/60">2h ago</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center mr-3">
                            <Send className="h-4 w-4 text-red-400" />
                          </div>
                          <div>
                            <div className="text-sm text-white/80">Sent</div>
                            <div className="text-xs text-white/60">To: Sita</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-red-400">-200 NPT</div>
                          <div className="text-xs text-white/60">Yesterday</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Animated glow effects */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur-xl opacity-20 animate-pulse"></div>
              
              {/* Floating elements for decoration */}
              <div className="absolute -right-8 top-1/4 w-16 h-16 bg-blue-500/30 rounded-full blur-xl"></div>
              <div className="absolute -left-10 bottom-1/3 w-20 h-20 bg-purple-500/30 rounded-full blur-xl"></div>
              <div className="absolute right-1/4 -bottom-6 w-12 h-12 bg-primary/30 rounded-full blur-lg"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Partners Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-white/60 text-sm uppercase tracking-wider">TRUSTED BY LEADING ORGANIZATIONS</p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {/* Partner logos would go here - using placeholder text for now */}
            {['BinancePay', 'Nepal Bank', 'Himalayan Bank', 'NTC', 'Ncell'].map((partner, index) => (
              <div key={index} className="text-white/40 hover:text-white/70 transition-all">
                <span className="text-xl font-bold">{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
                Redefining Financial Transactions
              </span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              NepaliPay combines innovative blockchain technology with beautiful, intuitive design to create a seamless financial experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards */}
            {[
              {
                icon: <ShoppingBag className="h-6 w-6 text-primary" />,
                title: "Buy & Sell NPT Tokens",
                description: "Purchase NPT tokens using your credit card or bank account. Spend them anywhere NepaliPay is accepted."
              },
              {
                icon: <Zap className="h-6 w-6 text-primary" />,
                title: "Instant Transfers",
                description: "Send money to anyone, anywhere in Nepal instantly. No waiting, no delays, just fast transfers."
              },
              {
                icon: <ShieldCheck className="h-6 w-6 text-primary" />,
                title: "Secure Blockchain",
                description: "All transactions are secured with enterprise-grade encryption and recorded on the blockchain for transparency."
              },
              {
                icon: <Gift className="h-6 w-6 text-primary" />,
                title: "Rewards & Cashback",
                description: "Earn rewards for using NepaliPay. Get cashback on transactions and refer friends to earn more."
              },
              {
                icon: <Globe className="h-6 w-6 text-primary" />,
                title: "Cross-Border Support",
                description: "Send and receive money internationally with reduced fees and faster processing times."
              },
              {
                icon: <TrendingUp className="h-6 w-6 text-primary" />,
                title: "Financial Analytics",
                description: "Track your spending patterns, monitor your investments, and manage your finances with powerful insights."
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 transition-all hover:bg-white/10 hover:border-primary/30 h-full">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-white/60 group-hover:text-white/80 transition-colors">
                    {feature.description}
                  </p>
                </div>
                
                {/* Subtle glow on hover */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-xl opacity-0 group-hover:opacity-30 blur-sm transition-opacity duration-300 -z-10"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
                How NepaliPay Works
              </span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Simple, secure, and straightforward. Experience the future of digital payments in Nepal.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                step: "01",
                title: "Create Your Wallet",
                description: "Sign up in minutes and create your secure blockchain wallet to store NPT tokens.",
                icon: <Smartphone className="h-10 w-10 text-primary" />
              },
              {
                step: "02",
                title: "Buy NPT Tokens",
                description: "Purchase NPT tokens using your credit/debit card or bank account securely.",
                icon: <CreditCard className="h-10 w-10 text-primary" />
              },
              {
                step: "03",
                title: "Send & Receive Money",
                description: "Transfer money instantly to anyone in Nepal or use NPT for purchases and services.",
                icon: <Send className="h-10 w-10 text-primary" />
              }
            ].map((step, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 relative group hover:bg-white/10 transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <span className="text-4xl font-bold text-white/10 group-hover:text-primary/20 transition-colors">{step.step}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">{step.title}</h3>
                <p className="text-white/60">{step.description}</p>
                
                {/* Connection line between steps (except last one) */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary/50 to-transparent"></div>
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link href="/auth">
              <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all shadow-lg shadow-primary/20 text-white font-medium">
                Get Started Now
              </button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Security Section */}
      <section id="security" className="py-20 px-4 sm:px-6 lg:px-8 relative z-10 border-t border-white/5">
        <div className="absolute right-0 top-1/4 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -z-10"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm mb-6">
              <ShieldCheck className="h-4 w-4 mr-2" />
              <span>Enterprise-Grade Security</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
                Built with Security First
              </span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Your trust is our priority. We've implemented multiple layers of security to protect your assets and data.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="space-y-6">
                {[
                  {
                    title: "Blockchain Technology",
                    description: "Every transaction is recorded on the blockchain, creating an immutable and transparent ledger."
                  },
                  {
                    title: "Bank-Level Encryption",
                    description: "We use AES-256 encryption to protect your personal information and transaction data."
                  },
                  {
                    title: "Two-Factor Authentication",
                    description: "Add an extra layer of security to your account with 2FA for all sensitive operations."
                  },
                  {
                    title: "Regular Security Audits",
                    description: "Our systems undergo rigorous security audits by third-party experts to identify and address vulnerabilities."
                  }
                ].map((item, index) => (
                  <div key={index} className="flex bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all">
                    <div className="mr-4 mt-1">
                      <div className="h-8 w-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <ShieldCheck className="h-5 w-5 text-green-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1 text-white">{item.title}</h3>
                      <p className="text-white/60">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="order-1 lg:order-2 flex justify-center">
              <div className="relative">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 max-w-md">
                  <div className="text-center">
                    <div className="mb-6">
                      <div className="h-20 w-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
                        <ShieldCheck className="h-10 w-10 text-green-400" />
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-3 text-white">Your Security Dashboard</h3>
                    <p className="text-white/60 mb-6">Monitor and enhance your account security with our comprehensive tools.</p>
                    
                    <div className="space-y-4">
                      <div className="bg-white/5 rounded-lg p-4 flex justify-between items-center">
                        <span className="text-white/80">Two-Factor Authentication</span>
                        <span className="text-green-400 font-medium">Enabled</span>
                      </div>
                      
                      <div className="bg-white/5 rounded-lg p-4 flex justify-between items-center">
                        <span className="text-white/80">Biometric Verification</span>
                        <span className="text-green-400 font-medium">Enabled</span>
                      </div>
                      
                      <div className="bg-white/5 rounded-lg p-4 flex justify-between items-center">
                        <span className="text-white/80">Transaction Notifications</span>
                        <span className="text-green-400 font-medium">Enabled</span>
                      </div>
                      
                      <div className="bg-white/5 rounded-lg p-4 flex justify-between items-center">
                        <span className="text-white/80">Last Security Scan</span>
                        <span className="text-white/80 font-medium">Today</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-primary rounded-2xl blur-xl opacity-20 -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-black to-gray-900 border border-primary/20 rounded-xl p-8 md:p-12 relative overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-blue-500/20 opacity-30"></div>
            
            {/* Glass orbs decoration */}
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/20 blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-purple-500/20 blur-3xl"></div>
            
            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to Join Nepal's Financial Revolution?</h2>
              <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
                Experience the future of payments today. Fast, secure, and designed for Nepal.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link href="/auth">
                  <button className="w-full sm:w-auto px-8 py-3 rounded-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all shadow-lg shadow-primary/20 text-white font-medium">
                    Create Your Wallet
                    <ArrowRight className="ml-2 h-5 w-5 inline-block" />
                  </button>
                </Link>
                
                <a 
                  href="#" 
                  className="text-white/80 hover:text-white transition-colors flex items-center"
                >
                  <span>Watch Demo</span>
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </div>
              
              <div className="mt-8 text-white/40 text-sm">
                Already have 10,000+ users trusting NepaliPay for their daily transactions
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center mb-4">
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-400 to-purple-400">NepaliPay</span>
                <div className="ml-2 h-6 w-6 bg-gradient-to-r from-primary to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">₹</span>
                </div>
              </div>
              <p className="text-white/60 mb-4">Empowering Nepal's financial future through innovative blockchain technology.</p>
              <div className="flex space-x-4">
                {['twitter', 'facebook', 'instagram', 'linkedin'].map((social) => (
                  <a key={social} href="#" className="text-white/40 hover:text-primary transition-colors">
                    <span className="sr-only">{social}</span>
                    <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center">
                      <span className="uppercase text-xs">{social[0]}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
              <ul className="space-y-3">
                {['About Us', 'Careers', 'Blog', 'Press'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-white/60 hover:text-primary transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Support</h3>
              <ul className="space-y-3">
                {['Help Center', 'Contact Us', 'FAQs', 'Community'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-white/60 hover:text-primary transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Legal</h3>
              <ul className="space-y-3">
                {['Privacy Policy', 'Terms of Service', 'Compliance', 'Security'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-white/60 hover:text-primary transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-white/40 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} NepaliPay. All rights reserved.
            </div>
            
            <div className="text-white/40 text-sm">
              Made with ♥ in Nepal | <a href="mailto:support@nepalipay.com" className="hover:text-primary transition-colors">support@nepalipay.com</a>
            </div>
          </div>
        </div>
        
        {/* Need Help Chat Bubble - Fixed position */}
        <div className="fixed bottom-6 right-6 z-40">
          <Link href="/support" className="flex items-center backdrop-blur-md bg-primary/10 py-3 px-5 rounded-full border border-primary/30 shadow-lg shadow-primary/5 hover:bg-primary/20 transition-all">
            <MessageSquare className="mr-2 h-5 w-5 text-primary" />
            <span className="font-medium text-primary">Need Help?</span>
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default AdvancedLandingPage;