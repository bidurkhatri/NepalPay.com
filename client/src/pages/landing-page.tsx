import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, ChevronRight, CreditCard, Globe, Lock, Smartphone, Zap } from "lucide-react";
import ContractLinks, { ContractInfo } from "@/components/contract-links";

export default function LandingPage() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Smart contract information
  const contracts: ContractInfo[] = [
    {
      name: "NepaliPay Token (NPT)",
      address: "0x69d34B25809b346702C21EB0E22EAD8C1de58D66",
      description: "ERC-20 token with 1 million supply, pegged to 1 NPR via Chainlink price feed."
    },
    {
      name: "NepaliPay",
      address: "0xe2d189f6696ee8b247ceae97fe3f1f2879054553",
      description: "Core payment and utility contract with loan, referral, and ad functionality."
    },
    {
      name: "FeeRelayer",
      address: "0x7ff2271749409f9137dac1e082962e21cc99aee6",
      description: "Handles dynamic gas fee calculation for transactions in NPT."
    }
  ];

  const features = [
    {
      icon: <Globe className="h-8 w-8 text-primary" />,
      title: "Blockchain Powered",
      description: "Built on Binance Smart Chain for lower fees and faster transactions."
    },
    {
      icon: <Smartphone className="h-8 w-8 text-primary" />,
      title: "Mobile First",
      description: "Designed for mobile users with convenient access to all features."
    },
    {
      icon: <CreditCard className="h-8 w-8 text-primary" />,
      title: "Buy NPT Tokens",
      description: "Purchase tokens with credit card or cryptocurrency easily."
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Fast Transfers",
      description: "Send money to anyone, anywhere in the world instantly."
    },
    {
      icon: <Lock className="h-8 w-8 text-primary" />,
      title: "Secure Loans",
      description: "Get crypto-backed loans with competitive interest rates."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 to-indigo-900/30"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              <span className="gradient-text">NepaliPay</span> - Digital Financial Revolution
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-300 max-w-3xl mb-8"
            >
              Empowering Nepal's financial future with blockchain technology. 
              Send money, take loans, and manage digital assets with ease.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/login">
                <a className="modern-button py-3 px-8 text-lg flex items-center">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Link>
              <Link href="/register">
                <a className="modern-button-outline py-3 px-8 text-lg">
                  Create Account
                </a>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold gradient-text mb-4">Why Choose NepaliPay?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the future of finance with our cutting-edge digital wallet.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="cyber-card"
              >
                <div className="card-highlight"></div>
                <div className="card-content">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Smart Contract Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold gradient-text mb-4">Powered By Blockchain</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our platform is built on secure, audited smart contracts deployed on Binance Smart Chain.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <ContractLinks contracts={contracts} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-indigo-900/30"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="glass-card max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-3xl font-bold gradient-text mb-4">Ready to Transform Your Financial Future?</h2>
              <p className="text-xl text-gray-300 mb-8">
                Join thousands of users who have already embraced the future of finance with NepaliPay.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/login">
                  <a className="modern-button py-3 px-8">
                    Login
                  </a>
                </Link>
                <Link href="/register">
                  <a className="modern-button-outline py-3 px-8">
                    Register Now
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-gray-900/70 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold gradient-text">NepaliPay</h3>
              <p className="text-gray-400 mt-2">Empowering Nepal's Financial Future</p>
            </div>
            <div className="flex gap-8">
              <Link href="/login">
                <a className="text-gray-300 hover:text-primary transition-colors">Login</a>
              </Link>
              <Link href="/register">
                <a className="text-gray-300 hover:text-primary transition-colors">Register</a>
              </Link>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">Terms</a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">Privacy</a>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} NepaliPay. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}