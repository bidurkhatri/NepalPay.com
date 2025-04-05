import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/auth-context";
import { useWallet } from "@/contexts/wallet-context";
import { useBlockchain } from "@/contexts/blockchain-context";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import ContractLinks, { ContractInfo } from "@/components/contract-links";

export default function SectionsPage() {
  const { user } = useAuth();
  const { wallet } = useWallet();
  const { nptBalance, isConnected, connectWallet } = useBlockchain();
  const { toast } = useToast();
  const [connecting, setConnecting] = useState(false);

  const handleConnectWallet = async () => {
    if (connecting) return;
    
    setConnecting(true);
    try {
      await connectWallet();
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been successfully connected.",
      });
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
    }
  };

  const sections = [
    {
      id: "wallet",
      title: "Wallet Management",
      description: "View your balance, deposit, and withdraw funds",
      icon: "💰",
      link: "/wallet"
    },
    {
      id: "payments",
      title: "Send NPT",
      description: "Transfer tokens to other users quickly and securely",
      icon: "💸",
      link: "/transactions"
    },
    {
      id: "loans",
      title: "Loans",
      description: "Borrow NPT by adding collateral or repay existing loans",
      icon: "🏦",
      link: "/crypto"
    },
    {
      id: "rewards",
      title: "Rewards",
      description: "Earn bonuses through referrals, cashback, and avatars",
      icon: "🎁",
      link: "/profile"
    },
    {
      id: "ad-bazaar",
      title: "Ad Bazaar",
      description: "Post and browse advertisements for local goods and services",
      icon: "📣",
      link: "/analytics"
    },
    {
      id: "buy-tokens",
      title: "Buy NPT Tokens",
      description: "Purchase NepaliPay Tokens using credit card or cryptocurrency",
      icon: "💲",
      link: "/buy-tokens"
    }
  ];

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold gradient-text mb-4"
          >
            NepaliPay Sections
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-300 max-w-2xl mx-auto"
          >
            Welcome to your digital financial companion. Manage your finances, make payments,
            take loans, earn rewards, and more - all in one place.
          </motion.p>
        </div>

        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-card mb-10 max-w-3xl mx-auto"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Welcome, {user?.firstName || "User"}!
              </h2>
              <p className="text-gray-300 mb-1">
                Username: <span className="text-white">{user?.username || "Not set"}</span>
              </p>
              <p className="text-gray-300">
                Balance: <span className="text-white">{isConnected ? `${nptBalance || "0"} NPT` : "Connect wallet to view"}</span>
              </p>
            </div>
            {!isConnected ? (
              <button 
                onClick={handleConnectWallet} 
                className="modern-button"
                disabled={connecting}
              >
                {connecting ? "Connecting..." : "Connect Wallet"}
              </button>
            ) : (
              <div className="text-sm px-3 py-1 bg-green-500/20 text-green-400 rounded-full">
                Wallet Connected
              </div>
            )}
          </div>
        </motion.div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            >
              <Link href={section.link}>
                <a className="block h-full">
                  <div className="cyber-card h-full flex flex-col cursor-pointer">
                    <div className="card-highlight"></div>
                    <div className="card-content flex flex-col h-full">
                      <div className="text-3xl mb-4">{section.icon}</div>
                      <h3 className="text-xl font-semibold mb-2 gradient-text">{section.title}</h3>
                      <p className="text-gray-300 mb-4">{section.description}</p>
                      <div className="mt-auto">
                        <span className="text-sm font-medium text-primary flex items-center">
                          Access Now <span className="ml-2">→</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Smart Contract Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <ContractLinks contracts={contracts} />
        </motion.div>
      </div>
    </div>
  );
}