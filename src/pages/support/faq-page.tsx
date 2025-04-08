import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Link } from 'wouter';
import { Search, ChevronLeft, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function FAQPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  // FAQ categories
  const categories = [
    { id: 'getting-started', name: 'Getting Started' },
    { id: 'payments', name: 'Payments' },
    { id: 'loans', name: 'Loans' },
    { id: 'rewards', name: 'Rewards' },
    { id: 'ads', name: 'Ads' },
  ];

  // FAQ data
  const faqs = {
    'getting-started': [
      {
        question: "What is NepaliPay?",
        answer: "NepaliPay is a blockchain-powered digital wallet application designed for the Nepali financial ecosystem. It allows users to manage NPT tokens (stablecoins pegged to NPR), perform transfers, pay utilities, take loans, and track transaction history using blockchain technology."
      },
      {
        question: "How do I create an account?",
        answer: "To create an account, go to the authentication page, click on 'Register', and fill in your details. You'll need to provide a username, email, and password. For full functionality, you'll also need to connect a Web3 wallet like MetaMask."
      },
      {
        question: "Do I need a digital wallet to use NepaliPay?",
        answer: "Yes, to access all features of NepaliPay, you will need a Web3 compatible wallet such as MetaMask. The wallet needs to be configured to work with the Binance Smart Chain (BSC) network and have some BNB for gas fees."
      },
      {
        question: "Is NepaliPay available on mobile devices?",
        answer: "Yes, NepaliPay is designed to be responsive and works well on both desktop and mobile devices. You can access all features through your mobile browser."
      }
    ],
    'payments': [
      {
        question: "What is an NPT token?",
        answer: "NPT (NepaliPay Token) is a stablecoin pegged to the Nepalese Rupee (NPR). One NPT is designed to maintain a value equivalent to one NPR, allowing for stable digital transactions within the Nepal ecosystem."
      },
      {
        question: "How do I buy NPT tokens?",
        answer: "You can purchase NPT tokens using a credit or debit card through our Stripe integration. Navigate to the 'Buy Tokens' section, select the amount you wish to purchase, and complete the payment process."
      },
      {
        question: "What fees are involved in transactions?",
        answer: "NepaliPay charges a 2% service fee on token purchases. Additionally, blockchain transactions require gas fees paid in BNB (Binance Coin) on the Binance Smart Chain."
      },
      {
        question: "How do I send NPT to another user?",
        answer: "To send NPT, go to the 'Send' section, enter the recipient's address or username, specify the amount, and confirm the transaction. You'll need sufficient NPT balance and BNB for gas fees."
      }
    ],
    'loans': [
      {
        question: "How do I take a loan on NepaliPay?",
        answer: "To take a loan, navigate to the 'Loans' section, select 'New Loan', specify the amount you wish to borrow, and provide the necessary collateral. Review the terms and confirm to receive your loan."
      },
      {
        question: "What is collateral and why is it needed?",
        answer: "Collateral is an asset you provide as security when taking a loan. If you fail to repay the loan, the collateral may be liquidated. This system enables undercollateralized loans and protects both borrowers and lenders."
      },
      {
        question: "How do I add collateral?",
        answer: "To add collateral, go to the 'Collateral' section, click 'Add Collateral', select the cryptocurrency you wish to use (BNB, ETH, or BTC), enter the amount, and confirm the transaction."
      },
      {
        question: "What are the loan-to-value ratios for different collaterals?",
        answer: "The loan-to-value (LTV) ratios vary by cryptocurrency: BNB allows up to 75% LTV, ETH up to 70% LTV, and BTC between 65-80% LTV depending on market conditions."
      }
    ],
    'rewards': [
      {
        question: "What rewards does NepaliPay offer?",
        answer: "NepaliPay offers various rewards including cashback on transactions, referral bonuses for inviting new users, and loyalty rewards for active platform usage."
      },
      {
        question: "How does the referral program work?",
        answer: "When you refer a new user who registers and completes their first transaction, both you and the referred user receive NPT tokens as a reward. You can track your referrals in the 'Rewards' section."
      },
      {
        question: "How do I claim my rewards?",
        answer: "To claim rewards, navigate to the 'Rewards' section where you'll see all available rewards. Click on 'Claim' next to the reward you wish to receive, and it will be transferred to your wallet balance."
      },
      {
        question: "Do rewards expire?",
        answer: "Yes, most rewards have an expiration date. You can check the expiration of each reward in the 'Rewards' section. Make sure to claim your rewards before they expire."
      }
    ],
    'ads': [
      {
        question: "How can I place an ad on NepaliPay?",
        answer: "To place an ad, go to the 'Ads' section, click 'Create New Ad', fill in the required details such as title, description, and target audience, set your budget, and submit for approval."
      },
      {
        question: "What types of ads are allowed?",
        answer: "NepaliPay accepts ads related to financial services, businesses, and products relevant to the Nepali market. All ads must comply with our content guidelines and are subject to approval by our admin team."
      },
      {
        question: "How much does advertising cost?",
        answer: "Advertising costs depend on factors such as ad placement, duration, and targeting options. You can set a budget when creating your ad, and the system will provide an estimate of reach and impressions."
      },
      {
        question: "How long does ad approval take?",
        answer: "Ad approval typically takes 24-48 hours. Once approved, your ad will go live according to the schedule you specified during creation."
      }
    ]
  };

  // Filter FAQs based on search query
  const filterFAQs = (category: string) => {
    if (!searchQuery) return faqs[category as keyof typeof faqs] || [];
    
    return (faqs[category as keyof typeof faqs] || []).filter(
      faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header section */}
      <div className="relative pt-12 pb-8 px-4 md:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>
          <div className="absolute top-1/4 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-8">
            <Link href="/support">
              <Button variant="ghost" className="text-white/70 hover:text-white">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Support
              </Button>
            </Link>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-white/70 mb-8 max-w-3xl">
              Find quick answers to common questions about using NepaliPay
            </p>

            {/* Search bar */}
            <div className="max-w-2xl mb-8 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <Input 
                type="search"
                placeholder="Search FAQs..."
                className="bg-white/5 border-white/10 text-white pl-10 focus-visible:ring-purple-500/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* FAQ content */}
      <div className="flex-grow py-4 px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="getting-started">
            <TabsList className="bg-black/30 border border-white/10 p-1 mb-8">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="data-[state=active]:text-white data-[state=active]:bg-white/10 data-[state=active]:shadow-none text-white/70"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {categories.map((category) => {
              const filteredFaqs = filterFAQs(category.id);
              
              return (
                <TabsContent key={category.id} value={category.id}>
                  <div className="mb-4">
                    <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
                      {category.name}
                    </Badge>
                    {searchQuery && (
                      <span className="ml-3 text-sm text-white/60">
                        {filteredFaqs.length} result(s) found
                      </span>
                    )}
                  </div>
                  
                  {filteredFaqs.length > 0 ? (
                    <motion.div 
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Accordion type="single" collapsible className="space-y-4">
                        {filteredFaqs.map((faq, index) => (
                          <motion.div key={index} variants={itemVariants}>
                            <AccordionItem value={`faq-${category.id}-${index}`} className="border border-white/10 rounded-lg bg-black/30 px-2 py-1">
                              <AccordionTrigger className="text-left font-medium text-white hover:text-white hover:no-underline py-5">
                                {faq.question}
                              </AccordionTrigger>
                              <AccordionContent className="text-white/70 pb-5 pt-1">
                                {faq.answer}
                              </AccordionContent>
                            </AccordionItem>
                          </motion.div>
                        ))}
                      </Accordion>
                    </motion.div>
                  ) : (
                    <div className="bg-black/30 border border-white/10 rounded-lg p-8 text-center">
                      <p className="text-white/60">No FAQs found for your search. Try different keywords or browse other categories.</p>
                    </div>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
          
          {/* Still need help section */}
          <div className="mt-12 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">Still have questions?</h3>
                <p className="text-white/60">Check out our detailed knowledge base or contact our support team</p>
              </div>
              <div className="flex gap-4">
                <Link href="/support/knowledgebase">
                  <Button variant="outline" className="border-white/20 hover:border-white/30 text-white">
                    Knowledge Base
                  </Button>
                </Link>
                <Link href="/support/contact">
                  <Button className="bg-primary hover:bg-primary/90 text-white">
                    Contact Support
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}