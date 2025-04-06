import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import { Send, X, MessagesSquare, ChevronDown, Languages, HelpCircle, MessageSquarePlus, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'system';
  timestamp: Date;
}

const demoReplies: { [key: string]: string } = {
  'hello': 'Hello! How can I help you with NepaliPay today?',
  'hi': 'Hi there! What can I assist you with regarding NepaliPay?',
  'help': 'I\'m here to help! What specific aspect of NepaliPay do you need assistance with?',
  'loan': 'To take a loan in NepaliPay, navigate to the Borrow section, add collateral, and select your loan amount. The system will calculate your loan-to-value ratio and show you the available amount you can borrow.',
  'collateral': 'Collateral in NepaliPay is crypto assets (BNB, ETH, or BTC) that you provide as security for taking a loan. Different assets have different loan-to-value ratios: BNB (75%), ETH (70%), and BTC (65%).',
  'wallet': 'Your NepaliPay wallet stores your NPT tokens and keeps track of your transaction history. You can send and receive NPT, take loans, and manage your rewards all from your wallet.',
  'send': 'To send NPT tokens, go to the Send section, enter the recipient\'s wallet address or username, specify the amount, add an optional note, and confirm the transaction.',
  'ads': 'The Ad Bazaar allows you to post ads visible to NepaliPay users. Your ad will need approval before going live. Ads can be purchased using NPT tokens.',
  'rewards': 'The Rewards section offers cashback on transactions, referral bonuses for inviting friends, and special NFT avatars for active users.',
  'contact': 'You can contact NepaliPay support at support@nepalipay.com or through this live chat. Our office is located in Kathmandu, Nepal.'
};

const SupportPage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Welcome to NepaliPay Support! How can we help you today?',
      sender: 'system',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [isSubmittingIssue, setIsSubmittingIssue] = useState(false);
  const [issueTitle, setIssueTitle] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [showTopics, setShowTopics] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const topics = [
    { id: 'payments', name: 'Payments & Transfers' },
    { id: 'loans', name: 'Loans & Collateral' },
    { id: 'rewards', name: 'Rewards & Referrals' },
    { id: 'ads', name: 'Ad Bazaar' },
    { id: 'other', name: 'Other Issues' }
  ];

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Process automated response
    setTimeout(() => {
      let responseText = "I don't have specific information about that topic yet. Would you like to submit this as an issue for our team to respond to?";
      
      // Check for keywords in the user's message
      const lowerCaseInput = inputText.toLowerCase();
      
      for (const [keyword, reply] of Object.entries(demoReplies)) {
        if (lowerCaseInput.includes(keyword)) {
          responseText = reply;
          break;
        }
      }
      
      const systemMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'system',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, systemMessage]);
    }, 1000);
    
    setInputText('');
  };

  const handleSubmitIssue = () => {
    if (issueTitle.trim() === '' || issueDescription.trim() === '') return;
    
    // Add confirmation message
    const systemMessage: Message = {
      id: Date.now().toString(),
      text: `Thank you for submitting your issue: "${issueTitle}". Our team will review it and respond via chat or email within 24 hours.`,
      sender: 'system',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, systemMessage]);
    setIsSubmittingIssue(false);
    setIssueTitle('');
    setIssueDescription('');
    setSelectedTopic('');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-800/30 backdrop-blur-[20px] border-b border-gray-700/30 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/dashboard" className="mr-4">
            <ArrowLeft className="h-6 w-6 text-gray-400 hover:text-white transition-colors" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">NepaliPay Support</h1>
            <p className="text-sm text-gray-400">We're here to help</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button 
              className="flex items-center bg-gray-700/50 hover:bg-gray-700/70 px-3 py-1.5 rounded-lg text-sm"
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            >
              <Languages className="h-4 w-4 mr-2" />
              {selectedLanguage}
              <ChevronDown className="h-4 w-4 ml-1" />
            </button>
            
            {showLanguageDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-gray-800/90 backdrop-blur-[20px] border border-gray-700/50 rounded-lg shadow-lg z-10">
                <div className="py-1">
                  <button 
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700/50"
                    onClick={() => {
                      setSelectedLanguage('English');
                      setShowLanguageDropdown(false);
                    }}
                  >
                    English
                  </button>
                  <button 
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700/50"
                    onClick={() => {
                      setSelectedLanguage('नेपाली');
                      setShowLanguageDropdown(false);
                    }}
                  >
                    नेपाली (Nepali)
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="relative">
            <button 
              className="flex items-center bg-gray-700/50 hover:bg-gray-700/70 px-3 py-1.5 rounded-lg text-sm"
              onClick={() => setShowTopics(!showTopics)}
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Topics
              <ChevronDown className="h-4 w-4 ml-1" />
            </button>
            
            {showTopics && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800/90 backdrop-blur-[20px] border border-gray-700/50 rounded-lg shadow-lg z-10">
                <div className="py-1">
                  {topics.map(topic => (
                    <button 
                      key={topic.id}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700/50"
                      onClick={() => {
                        setInputText(`I need help with ${topic.name.toLowerCase()}`);
                        setShowTopics(false);
                      }}
                    >
                      {topic.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <button 
            className="bg-primary/20 hover:bg-primary/30 text-primary px-3 py-1.5 rounded-lg text-sm flex items-center"
            onClick={() => setIsSubmittingIssue(true)}
          >
            <MessageSquarePlus className="h-4 w-4 mr-2" />
            New Issue
          </button>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 flex flex-col p-4 max-w-4xl mx-auto w-full">
        {isSubmittingIssue ? (
          <div className="bg-gray-800/30 backdrop-blur-[20px] border border-gray-700/30 rounded-lg shadow-lg p-6 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Submit an Issue</h2>
              <button 
                className="text-gray-400 hover:text-white"
                onClick={() => setIsSubmittingIssue(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="issueTitle" className="block text-sm font-medium text-gray-300 mb-1">
                  Issue Title
                </label>
                <input
                  id="issueTitle"
                  type="text"
                  value={issueTitle}
                  onChange={(e) => setIssueTitle(e.target.value)}
                  className="w-full bg-gray-800/30 backdrop-blur-[20px] border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-primary shadow-md"
                  placeholder="Brief description of your issue"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="issueTopic" className="block text-sm font-medium text-gray-300 mb-1">
                  Topic
                </label>
                <select
                  id="issueTopic"
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full bg-gray-800/30 backdrop-blur-[20px] border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-primary shadow-md"
                  required
                >
                  <option value="">Select a topic</option>
                  {topics.map(topic => (
                    <option key={topic.id} value={topic.id}>
                      {topic.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="issueDescription" className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  id="issueDescription"
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  rows={5}
                  className="w-full bg-gray-800/30 backdrop-blur-[20px] border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-primary shadow-md"
                  placeholder="Detailed description of the issue you're experiencing"
                  required
                />
              </div>
              
              <div className="pt-2">
                <button
                  onClick={handleSubmitIssue}
                  disabled={!issueTitle || !issueDescription || !selectedTopic}
                  className={`w-full py-3 rounded-lg font-medium flex items-center justify-center ${
                    issueTitle && issueDescription && selectedTopic
                      ? 'bg-gradient-to-r from-primary to-primary-light text-white'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Submit Issue
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Chat messages */}
            <div className="bg-gray-800/30 backdrop-blur-[20px] border border-gray-700/30 rounded-lg shadow-lg p-4 mb-4 flex-1 overflow-y-auto">
              <div className="space-y-4">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] px-4 py-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-primary/20 text-white'
                          : 'bg-gray-700/50 border border-gray-600/30'
                      }`}
                    >
                      <p>{message.text}</p>
                      <p className="text-xs text-gray-400 mt-1 text-right">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
            
            {/* Chat input */}
            <div className="bg-gray-800/30 backdrop-blur-[20px] border border-gray-700/30 rounded-lg shadow-lg p-3">
              <div className="flex items-center">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 bg-gray-700/50 border border-gray-600/30 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Type your message here..."
                />
                <button
                  onClick={handleSendMessage}
                  disabled={inputText.trim() === ''}
                  className={`ml-2 p-3 rounded-lg ${
                    inputText.trim() === ''
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-primary/20 text-primary hover:bg-primary/30'
                  }`}
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default SupportPage;