import React, { useState } from 'react';
import { Link } from 'wouter';
import { Search, BookOpen, ArrowRight, ArrowLeft, Shield, Coins, Landmark, Megaphone, Bookmark } from 'lucide-react';

interface KnowledgeArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
  icon: React.ReactNode;
  content: string;
}

const knowledgeArticles: KnowledgeArticle[] = [
  {
    id: 'what-is-nepalipay',
    title: 'What is NepaliPay?',
    summary: 'An overview of the NepaliPay ecosystem and its benefits for users.',
    category: 'general',
    icon: <BookOpen className="h-6 w-6" />,
    content: `
# What is NepaliPay?

NepaliPay is a cutting-edge digital wallet and financial ecosystem built on blockchain technology, specifically designed for the Nepali market. It brings together modern financial tools with the security and transparency of blockchain technology.

## Core Components

NepaliPay consists of several key components:

1. **NepaliPay Token (NPT)** - The native digital token that powers the ecosystem
2. **Digital Wallet** - For storing and managing NPT tokens
3. **Loan System** - Allowing users to take loans using cryptocurrency as collateral
4. **Rewards Program** - Offering cashback, referral bonuses, and special avatars
5. **Ad Bazaar** - A marketplace for posting and viewing advertisements

## Key Benefits

- **Secure Transactions** - All transactions are secured by blockchain technology
- **Financial Freedom** - Access to loans without traditional banking requirements
- **Community-Driven** - Built specifically for the needs of Nepali users
- **User-Friendly** - Simple, intuitive interface accessible to everyone
- **Transparent** - All operations are visible on the blockchain

NepaliPay represents a step toward financial inclusion and modernization in Nepal, bridging traditional financial services with innovative blockchain technology.
    `
  },
  {
    id: 'how-nepalipay-works',
    title: 'How Does NepaliPay Work?',
    summary: 'Learn about the technology behind NepaliPay and how it processes transactions.',
    category: 'technical',
    icon: <Coins className="h-6 w-6" />,
    content: `
# How Does NepaliPay Work?

NepaliPay operates on the Binance Smart Chain (BSC), leveraging blockchain technology to provide secure, transparent financial services.

## The Technology Stack

1. **Smart Contracts** - Self-executing code on the blockchain that handles all transactions and business logic
2. **Web3 Integration** - Connects your wallet (like MetaMask) to the blockchain
3. **Frontend Application** - The user interface you interact with
4. **Blockchain Network** - The underlying Binance Smart Chain that processes and records all transactions

## Transaction Flow

When you perform an action in NepaliPay, here's what happens:

1. Your request is initiated through the app interface
2. The app creates a transaction and sends it to your Web3 wallet
3. You approve the transaction in your wallet
4. The transaction is broadcast to the Binance Smart Chain
5. Miners on the network process and validate the transaction
6. The transaction is recorded on the blockchain
7. The app updates to reflect the completed transaction

## Smart Contract Interactions

NepaliPay uses three main smart contracts:

- **NepaliPayToken (NPT)** - Handles the NPT token economy
- **NepaliPay** - Manages core functionality like transfers and loans
- **FeeRelayer** - Optimizes gas fees for a better user experience

All smart contracts are verified and audited for security, with their code publicly available for inspection on BscScan.
    `
  },
  {
    id: 'why-use-nepalipay',
    title: 'Why Use NepaliPay?',
    summary: 'Discover the advantages of using NepaliPay over traditional financial services.',
    category: 'benefits',
    icon: <Landmark className="h-6 w-6" />,
    content: `
# Why Use NepaliPay?

NepaliPay offers several advantages over traditional banking and payment systems, especially for users in Nepal.

## Key Advantages

### 1. Financial Inclusion
- Access financial services without traditional banking requirements
- No credit check needed for loans (collateral-based)
- Available to anyone with a smartphone and internet connection

### 2. Security and Transparency
- All transactions are recorded on the blockchain and cannot be altered
- Smart contracts ensure rules are followed without intermediary interference
- Your funds remain in your control through your private keys

### 3. Cost Effectiveness
- Lower fees compared to traditional banking services
- No monthly maintenance fees or minimum balance requirements
- Efficient cross-border transactions without excessive fees

### 4. Innovation
- Access to modern financial tools previously unavailable in Nepal
- Earn rewards through the ecosystem
- Participate in the growing digital economy

### 5. Speed
- Transactions process quickly compared to traditional banking
- Instant transfers between NepaliPay users
- Loan approval and disbursement happen automatically through smart contracts

By using NepaliPay, you're not just accessing a payment app – you're joining a financial ecosystem built for the future of Nepal.
    `
  },
  {
    id: 'key-terms',
    title: 'Key Terms: NPT, Wallet, Collateral, Ad Bazaar, Rewards',
    summary: 'Essential terminology and concepts for NepaliPay users.',
    category: 'educational',
    icon: <Bookmark className="h-6 w-6" />,
    content: `
# Key Terms in the NepaliPay Ecosystem

Understanding these key terms will help you navigate the NepaliPay platform more effectively.

## NPT (NepaliPay Token)
The native digital currency of the NepaliPay ecosystem. NPT is used for:
- Sending and receiving payments
- Collateralizing loans
- Posting advertisements
- Earning rewards
- Paying fees

## Wallet
A digital tool for storing and managing your NPT tokens and other cryptocurrencies. Your wallet:
- Contains your public and private keys
- Displays your balance and transaction history
- Connects to the blockchain through Web3 technology
- Must be secured with strong passwords and backup phrases

## Collateral
Assets you temporarily lock in a smart contract to secure a loan. In NepaliPay:
- Accepted collateral includes BNB, ETH, and BTC
- Different assets have different loan-to-value (LTV) ratios
- Collateral is automatically returned upon full loan repayment
- May be liquidated if market fluctuations push LTV above 85%

## Ad Bazaar
The marketplace within NepaliPay where users can post and view advertisements:
- Ads require approval before publishing
- Posting an ad costs a small amount of NPT
- Ads can target specific user demographics
- Performance metrics are available to advertisers

## Rewards
Incentives for active participation in the NepaliPay ecosystem:
- Cashback on transactions
- Bonuses for referring new users
- Special NFT avatars for reaching certain milestones
- Limited-time promotions and events
    `
  },
  {
    id: 'safety-tips',
    title: 'Safety Tips: Protect Wallet, Check Recipients, Repay Loans, Honest Ads',
    summary: 'Best practices for secure and responsible use of NepaliPay.',
    category: 'security',
    icon: <Shield className="h-6 w-6" />,
    content: `
# Safety Tips for NepaliPay Users

Follow these guidelines to ensure a secure and positive experience with NepaliPay.

## Protect Your Wallet

- **Never share your recovery phrase or private keys** with anyone, including NepaliPay support staff
- **Enable additional security features** such as biometric authentication and two-factor authentication
- **Regularly update** your wallet software and the NepaliPay app
- **Back up your recovery phrase** in multiple secure locations (offline)
- **Use a strong, unique password** for your wallet and NepaliPay account
- **Be wary of phishing attempts** - always verify you're on the official website or app

## Check Recipients Carefully

- **Double-check wallet addresses** before sending NPT or other cryptocurrencies
- **Send a small test transaction** first when transferring to a new address
- **Verify the recipient's identity** through alternative channels when possible
- **Be cautious of unexpected requests** for transfers, even if they appear to come from known contacts
- **Remember that blockchain transactions are irreversible** - once sent, funds cannot be recalled

## Monitor and Repay Loans Responsibly

- **Understand the terms** of your loan before taking it
- **Keep track of your loan-to-value (LTV) ratio** to avoid liquidation
- **Set reminders for repayment dates** to avoid unnecessary interest
- **Monitor market conditions** that might affect your collateral value
- **Have a repayment plan** before taking a loan
- **Don't borrow more than you can comfortably repay**

## Post Honest and Compliant Ads

- **Follow the Ad Bazaar guidelines** for content and format
- **Make honest claims** in your advertisements
- **Include necessary disclosures** as required by regulations
- **Respect user privacy** and data protection rules
- **Target appropriate audiences** for your content
- **Be responsive** to inquiries about your advertised products or services

## General Security Practices

- **Use secure networks** when accessing NepaliPay
- **Keep your device free from malware** with regular security scans
- **Log out from your account** when using shared or public devices
- **Report suspicious activity** immediately to NepaliPay support
- **Stay informed about security best practices** in the cryptocurrency space
    `
  },
  {
    id: 'advertising-guidelines',
    title: 'Ad Bazaar: Effective Advertising Guidelines',
    summary: 'How to create and manage successful advertisements in the NepaliPay Ad Bazaar.',
    category: 'marketing',
    icon: <Megaphone className="h-6 w-6" />,
    content: `
# Effective Advertising in the NepaliPay Ad Bazaar

The Ad Bazaar offers a unique opportunity to reach a targeted audience of NepaliPay users. Follow these guidelines to maximize your advertising effectiveness.

## Creating Compelling Ads

### 1. Define Your Objective
- Brand awareness
- Product promotion
- Service offering
- Event announcement

### 2. Craft a Clear Message
- Keep it concise and direct
- Highlight key benefits or unique selling points
- Include a specific call to action
- Use simple, accessible language

### 3. Design Considerations
- Use high-quality images that are relevant to your offering
- Ensure text is readable on various screen sizes
- Maintain consistent branding with your other marketing materials
- Consider the visual hierarchy of information

## Ad Submission Process

1. **Prepare Your Content**: Create your ad copy and visual elements
2. **Navigate to Ad Bazaar**: Access through the main menu in the NepaliPay app
3. **Fill Out the Form**: Complete all required fields, including:
   - Ad title
   - Description
   - Target audience
   - Duration
   - Budget in NPT
4. **Submit for Review**: All ads undergo review for compliance
5. **Revise if Necessary**: Address any feedback from the review team
6. **Approval and Publishing**: Once approved, your ad will go live

## Optimization Strategies

- **Monitor Performance**: Track clicks, conversions, and engagement
- **Test Different Variations**: Try different headlines, images, or calls to action
- **Refine Targeting**: Adjust your audience parameters based on performance data
- **Consider Timing**: Schedule ads during peak usage hours for maximum visibility
- **Follow Up**: Have a clear plan for engaging with users who respond to your ad

## Content Guidelines

All ads must comply with these standards:
- No misleading or false claims
- No offensive, discriminatory, or inappropriate content
- No promotion of illegal activities or products
- No impersonation of other brands or entities
- No excessive use of capital letters, exclamation points, or emojis

By following these guidelines, you'll create more effective advertisements that resonate with NepaliPay users while maintaining the quality standards of the platform.
    `
  }
];

const categories = [
  { id: 'all', name: 'All Articles' },
  { id: 'general', name: 'General Information' },
  { id: 'technical', name: 'Technical Guides' },
  { id: 'benefits', name: 'Benefits & Features' },
  { id: 'educational', name: 'Educational Content' },
  { id: 'security', name: 'Security & Safety' },
  { id: 'marketing', name: 'Marketing & Advertising' }
];

const KnowledgePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);
  
  const filteredArticles = knowledgeArticles.filter(article => {
    const matchesSearch = 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Function to convert Markdown H1, H2, H3 to HTML
  const formatContent = (content: string) => {
    const withH1 = content.replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold my-4">$1</h1>');
    const withH2 = withH1.replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold my-3 mt-6">$1</h2>');
    const withH3 = withH2.replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium my-2 mt-4">$1</h3>');
    
    // Convert lists
    const withLists = withH3.replace(/^- (.*$)/gm, '<li class="ml-4 mb-1">• $1</li>');
    
    // Convert paragraphs (groups of text separated by blank lines)
    const withParagraphs = withLists.replace(/^(?!<h|<li)(.*$)/gm, function(match) {
      if (match.trim() === '') return '';
      return '<p class="my-2 text-gray-300">' + match + '</p>';
    });
    
    // Remove empty paragraphs and clean up
    return withParagraphs.replace(/<p class="my-2 text-gray-300"><\/p>/g, '');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800/30 backdrop-blur-[20px] border-b border-gray-700/30 p-4">
        <div className="max-w-6xl mx-auto flex items-center">
          <Link href="/dashboard" className="mr-4">
            <ArrowLeft className="h-6 w-6 text-gray-400 hover:text-white transition-colors" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Knowledge Base</h1>
            <p className="text-gray-400">In-depth guides and information about NepaliPay</p>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-6xl mx-auto p-4 py-8">
        {selectedArticle ? (
          <div>
            {/* Article header */}
            <div className="mb-8">
              <button
                onClick={() => setSelectedArticle(null)}
                className="flex items-center text-gray-400 hover:text-white mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to all articles
              </button>
              
              <div className="flex items-center mb-2">
                <div className="p-2 mr-3 bg-gray-800/50 backdrop-blur-[20px] rounded-lg text-primary">
                  {selectedArticle.icon}
                </div>
                <h1 className="text-2xl font-bold">{selectedArticle.title}</h1>
              </div>
              
              <p className="text-gray-400 ml-12">{selectedArticle.summary}</p>
            </div>
            
            {/* Article content */}
            <div className="bg-gray-800/30 backdrop-blur-[20px] border border-gray-700/30 rounded-lg shadow-lg p-6">
              <div 
                dangerouslySetInnerHTML={{ __html: formatContent(selectedArticle.content) }} 
                className="prose prose-invert prose-gray max-w-none"
              />
            </div>
            
            {/* Navigation and related articles */}
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {knowledgeArticles
                  .filter(article => article.id !== selectedArticle.id && article.category === selectedArticle.category)
                  .slice(0, 2)
                  .map(article => (
                    <div
                      key={article.id}
                      onClick={() => setSelectedArticle(article)}
                      className="bg-gray-800/30 backdrop-blur-[20px] border border-gray-700/30 rounded-lg p-4 cursor-pointer hover:bg-gray-700/30"
                    >
                      <div className="flex items-center mb-2">
                        <div className="p-1.5 mr-2 bg-gray-800/50 backdrop-blur-[20px] rounded-md text-primary">
                          {article.icon}
                        </div>
                        <h3 className="font-medium">{article.title}</h3>
                      </div>
                      <p className="text-sm text-gray-400">{article.summary}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <>
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
                  placeholder="Search for articles or keywords..."
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
            
            {/* Articles */}
            <div className="space-y-6">
              {filteredArticles.length > 0 ? (
                filteredArticles.map(article => (
                  <div
                    key={article.id}
                    className="bg-gray-800/30 backdrop-blur-[20px] border border-gray-700/30 rounded-lg shadow-lg overflow-hidden hover:bg-gray-700/20 transition-colors cursor-pointer"
                    onClick={() => setSelectedArticle(article)}
                  >
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="p-2 mr-3 bg-gray-800/50 backdrop-blur-[20px] rounded-lg text-primary">
                          {article.icon}
                        </div>
                        <div>
                          <h2 className="text-xl font-bold">{article.title}</h2>
                          <p className="text-gray-400">{article.summary}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs bg-gray-800/50 px-3 py-1 rounded-full text-gray-400">
                          {categories.find(c => c.id === article.category)?.name || article.category}
                        </span>
                        <div className="flex items-center text-primary hover:text-primary-dark font-medium">
                          Read more
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-800/50 backdrop-blur-[20px] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No articles found</h3>
                  <p className="text-gray-400">
                    We couldn't find any articles matching your search or filter criteria.
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
          </>
        )}
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

export default KnowledgePage;