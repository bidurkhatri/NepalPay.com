import React, { useState } from 'react';
import { Link } from 'wouter';
import { ChevronDown, Search, ArrowLeft } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    id: '1',
    question: 'What is NepaliPay?',
    answer: 'NepaliPay is a blockchain-based digital wallet and financial ecosystem designed specifically for the Nepali market. It allows users to send and receive NPT tokens, take loans using crypto collateral, earn rewards, and participate in the Ad Bazaar marketplace.',
    category: 'general'
  },
  {
    id: '2',
    question: 'How do I start using NepaliPay?',
    answer: 'To start using NepaliPay, download the app, create an account, and connect a Web3 wallet like MetaMask configured with the Binance Smart Chain. You\'ll need a small amount of BNB for gas fees. Once connected, you can buy NPT tokens or use the services directly.',
    category: 'getting-started'
  },
  {
    id: '3',
    question: 'Is NepaliPay safe?',
    answer: 'Yes, NepaliPay is built on blockchain technology which provides transparent, secure transactions. All smart contracts have been audited by security firms. Your wallet is only accessible with your private keys, which we never store. Always keep your recovery phrase safe and never share it with anyone.',
    category: 'security'
  },
  {
    id: '4',
    question: 'What can I do with NepaliPay?',
    answer: 'With NepaliPay, you can send and receive NPT tokens, take loans using cryptocurrency as collateral, earn rewards through cashback and referrals, and post or browse ads in the Ad Bazaar. Future updates will add more features like scheduled payments and utility bill payments.',
    category: 'features'
  },
  {
    id: '5',
    question: 'How much does it cost?',
    answer: 'NepaliPay itself is free to use. You only pay small transaction fees (gas fees) on the Binance Smart Chain for blockchain operations. These fees are typically a few cents. For loans, there\'s an interest rate displayed before you take the loan. Ad posting in the Ad Bazaar has a small NPT fee.',
    category: 'fees'
  },
  {
    id: '6',
    question: 'Can I get my money back?',
    answer: 'Blockchain transactions are irreversible, so sending NPT to the wrong address cannot be undone. However, if you\'ve provided collateral for a loan, you can get it back by repaying the loan plus accrued interest. Your crypto assets always remain yours as long as you maintain control of your wallet.',
    category: 'transactions'
  },
  {
    id: '7',
    question: 'What if I don\'t repay a loan?',
    answer: 'If you don\'t repay a loan, your collateral may be liquidated if market fluctuations cause your loan-to-value (LTV) ratio to exceed 85%. You\'ll receive warnings before this happens. It\'s important to monitor your loans and maintain a healthy LTV ratio or repay the loan on time.',
    category: 'loans'
  },
  {
    id: '8',
    question: 'How do I contact support?',
    answer: 'You can contact NepaliPay support through the chat bubble available in the app, via email at support@nepalipay.com, or by phone at +977-1-555-1234. Our support team is available 24/7 to assist you with any issues or questions.',
    category: 'support'
  },
  {
    id: '9',
    question: 'Why do ads need approval?',
    answer: 'Ads in the Ad Bazaar require approval to ensure they comply with our community standards and local regulations. This creates a safe, trustworthy marketplace for all users. Most ads are reviewed within 24 hours of submission.',
    category: 'ads'
  },
  {
    id: '10',
    question: 'Can I use it without a smartphone?',
    answer: 'While NepaliPay is optimized for smartphones, you can access most features through our web platform at nepalipay.com. You\'ll still need a Web3 wallet like MetaMask installed in your browser to interact with the blockchain features.',
    category: 'accessibility'
  }
];

const categories = [
  { id: 'all', name: 'All Questions' },
  { id: 'general', name: 'General Information' },
  { id: 'getting-started', name: 'Getting Started' },
  { id: 'security', name: 'Security' },
  { id: 'features', name: 'Features & Services' },
  { id: 'fees', name: 'Fees & Costs' },
  { id: 'transactions', name: 'Transactions' },
  { id: 'loans', name: 'Loans & Collateral' },
  { id: 'support', name: 'Support & Help' },
  { id: 'ads', name: 'Ad Bazaar' },
  { id: 'accessibility', name: 'Accessibility' }
];

const FAQPage: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const toggleFAQ = (id: string) => {
    setActiveId(activeId === id ? null : id);
  };
  
  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800/30 backdrop-blur-[20px] border-b border-gray-700/30 p-4">
        <div className="max-w-6xl mx-auto flex items-center">
          <Link href="/dashboard" className="mr-4">
            <ArrowLeft className="h-6 w-6 text-gray-400 hover:text-white transition-colors" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Frequently Asked Questions</h1>
            <p className="text-gray-400">Find answers to common questions about NepaliPay</p>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-6xl mx-auto p-4 py-8">
        {/* Search and filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800/30 backdrop-blur-[20px] border border-gray-700/50 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-primary shadow-md"
              placeholder="Search for questions or keywords..."
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary/20 text-primary'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-gray-300'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* FAQ accordion */}
        <div className="space-y-4">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map(faq => (
              <div 
                key={faq.id} 
                className="bg-gray-800/30 backdrop-blur-[20px] border border-gray-700/30 rounded-lg shadow-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-700/20"
                >
                  <h3 className="text-lg font-medium">{faq.question}</h3>
                  <ChevronDown 
                    className={`h-5 w-5 text-gray-400 transition-transform ${
                      activeId === faq.id ? 'transform rotate-180' : ''
                    }`} 
                  />
                </button>
                
                {activeId === faq.id && (
                  <div className="px-6 py-4 bg-gray-800/50 border-t border-gray-700/30">
                    <p className="text-gray-300">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-800/50 backdrop-blur-[20px] rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-medium mb-2">No results found</h3>
              <p className="text-gray-400">
                We couldn't find any FAQs matching your search or filter criteria.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-4 px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
        
        {/* Contact support */}
        <div className="mt-12 bg-gray-800/30 backdrop-blur-[20px] border border-gray-700/30 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold mb-3">Didn't find what you're looking for?</h2>
          <p className="text-gray-300 mb-6">Our support team is ready to help you with any questions or issues.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/support">
              <button className="bg-primary/20 text-primary hover:bg-primary/30 px-6 py-3 rounded-lg font-medium flex items-center justify-center">
                Chat with Support
              </button>
            </Link>
            <Link href="/contact">
              <button className="bg-gray-700/50 text-white hover:bg-gray-700/70 px-6 py-3 rounded-lg font-medium flex items-center justify-center">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-4 sm:mb-0">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} NepaliPay. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-4">
            <Link href="/knowledge">
              <span className="text-sm text-gray-500 hover:text-gray-300">Knowledge Base</span>
            </Link>
            <Link href="/faq">
              <span className="text-sm text-gray-500 hover:text-gray-300">FAQ</span>
            </Link>
            <Link href="/contact">
              <span className="text-sm text-gray-500 hover:text-gray-300">Contact Us</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FAQPage;