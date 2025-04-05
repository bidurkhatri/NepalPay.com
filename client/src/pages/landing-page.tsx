import React, { useState } from 'react';
import { Link } from 'wouter';
import { 
  MoveRight, Shield, Globe, Rocket, CreditCard, Phone, 
  ArrowUpRight, Info, Wallet, Flag, Clock, DollarSign, Users, ArrowRight 
} from 'lucide-react';
import ContractLinks from '@/components/contract-links';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

// Animation counter component
interface CounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

const Counter = ({ end, duration = 2000, prefix = '', suffix = '' }: CounterProps) => {
  const [count, setCount] = useState(0);
  
  React.useEffect(() => {
    let startTime = 0;
    const timer = requestAnimationFrame(function animate(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    });
    return () => cancelAnimationFrame(timer);
  }, [end, duration]);
  
  return (
    <span>{prefix}{count.toLocaleString()}{suffix}</span>
  );
};

const LandingPage: React.FC = () => {
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

  const faqs = [
    {
      question: "What is NepaliPay?",
      answer: "NepaliPay is a secure digital wallet built on the Binance Smart Chain for everyday Nepalis. It allows you to send money, borrow securely, advertise your business, and earn rewards — all powered by blockchain technology."
    },
    {
      question: "How do I send money?",
      answer: "Just connect your wallet, enter an address, amount, and hit send. No banks, no middlemen. The transaction is processed instantly on the blockchain."
    },
    {
      question: "What are collateralized loans?",
      answer: "You deposit digital assets like BNB or ETH and borrow NPT instantly — no paperwork, no credit checks, and no lengthy approval processes."
    },
    {
      question: "Is it safe?",
      answer: "Yes. Your funds are held in audited smart contracts, secured by blockchain technology. All transactions are transparent and immutable."
    }
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Small Business Owner",
      initial: "RK",
      quote: "NepaliPay helped me grow my shop faster. Instant pay = more customers."
    },
    {
      name: "Sita KC",
      role: "Freelance Designer",
      initial: "SK",
      quote: "I get paid from my clients overseas in minutes now, not days."
    },
    {
      name: "Anish Maharjan",
      role: "Tech Entrepreneur",
      initial: "AM",
      quote: "Borrowing without banks gave my startup the cash flow it needed."
    },
    {
      name: "Pratik Rai",
      role: "E-commerce Owner",
      initial: "PR",
      quote: "Ad Bazaar helped me reach more customers for my online store at half the cost."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section – Emotional + Localized Welcome */}
      <section className="py-20 px-4 relative min-h-[80vh] flex items-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[500px] h-[500px] blur-[100px] rounded-full -top-20 -right-20 bg-primary/20"></div>
          <div className="absolute w-[600px] h-[600px] blur-[120px] rounded-full -bottom-40 -left-40 bg-blue-600/10"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative w-full">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight gradient-text">
              Revolutionizing Finance for Every Nepali
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              NepaliPay is your digital wallet to send money, borrow securely, advertise your business, and earn rewards — powered by blockchain, made for Nepal.
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Link href="/login" className="modern-button flex items-center">
                <Wallet className="mr-2 h-5 w-5" />
                Connect Wallet
              </Link>
              <Link href="/login" className="modern-button-outline flex items-center">
                <Rocket className="mr-2 h-5 w-5" />
                Try Demo
              </Link>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-400 pt-2">
              <div className="flex items-center">
                <Flag className="h-4 w-4 mr-1 text-primary" />
                Built for Nepal
              </div>
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-1 text-primary" />
                On Binance Smart Chain
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Live Stats Cards (Row with Animations) */}
      <section className="py-10 px-4 relative bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card">
              <div className="card-highlight"></div>
              <div className="card-content flex flex-col items-center text-center">
                <Users className="h-8 w-8 text-primary mb-2" />
                <div className="text-3xl font-bold">
                  <Counter end={13300} suffix="+" />
                </div>
                <p className="text-gray-400">Users</p>
              </div>
            </div>
            
            <div className="glass-card">
              <div className="card-highlight"></div>
              <div className="card-content flex flex-col items-center text-center">
                <ArrowRight className="h-8 w-8 text-primary mb-2" />
                <div className="text-3xl font-bold">
                  <Counter end={120} suffix="M+" />
                </div>
                <p className="text-gray-400">Transactions</p>
              </div>
            </div>
            
            <div className="glass-card">
              <div className="card-highlight"></div>
              <div className="card-content flex flex-col items-center text-center">
                <DollarSign className="h-8 w-8 text-primary mb-2" />
                <div className="text-3xl font-bold">
                  <Counter end={8.5} prefix="$" suffix="M+" />
                </div>
                <p className="text-gray-400">Volume</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Feature Highlights (Icon Cards Grid) */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[400px] h-[400px] blur-[120px] rounded-full top-40 -left-20 bg-primary/5"></div>
          <div className="absolute w-[500px] h-[500px] blur-[100px] rounded-full -bottom-60 right-20 bg-blue-600/5"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold gradient-text mb-4">Feature Highlights</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card">
              <div className="card-highlight"></div>
              <div className="card-content">
                <Shield className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Secure Transactions</h3>
                <p className="text-gray-400">
                  All transactions are secured by advanced blockchain technology, ensuring your funds are always safe.
                </p>
              </div>
            </div>
            
            <div className="glass-card">
              <div className="card-highlight"></div>
              <div className="card-content">
                <Globe className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Cross-Border Transfers</h3>
                <p className="text-gray-400">
                  Skip remittance fees and send money internationally without excessive fees and long waiting times.
                </p>
              </div>
            </div>
            
            <div className="glass-card">
              <div className="card-highlight"></div>
              <div className="card-content">
                <Clock className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Instant Settlement</h3>
                <p className="text-gray-400">
                  No more waiting hours or days for transactions to clear. Experience near-instant confirmations.
                </p>
              </div>
            </div>
            
            <div className="glass-card">
              <div className="card-highlight"></div>
              <div className="card-content">
                <CreditCard className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Collateralized Loans</h3>
                <p className="text-gray-400">
                  Use your digital assets to unlock liquidity instantly, without credit checks or long approval processes.
                </p>
              </div>
            </div>
            
            <div className="glass-card">
              <div className="card-highlight"></div>
              <div className="card-content">
                <Phone className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Mobile First</h3>
                <p className="text-gray-400">
                  Pay, borrow, and earn from your phone with our responsive, mobile-optimized interface.
                </p>
              </div>
            </div>
            
            <div className="cyber-card bg-primary/10 border-primary/20">
              <div className="card-highlight"></div>
              <div className="card-content">
                <div className="absolute -bottom-6 -right-6 w-24 h-24 blur-[60px] bg-primary/40 rounded-full"></div>
                <h3 className="text-xl font-semibold mb-2">Ad Bazaar Platform</h3>
                <p className="text-gray-400 mb-4">
                  Promote your business or earn by hosting advertisements using our decentralized ad marketplace.
                </p>
                <Link href="/ad-bazaar" className="modern-button-outline w-full text-center block">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials with avatars (Carousel) */}
      <section className="py-16 px-4 bg-gray-950/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold gradient-text mb-4">What Our Users Say</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Hear from people who use NepaliPay to transform their financial lives.
            </p>
          </div>
          
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="glass-card h-full">
                    <div className="card-highlight"></div>
                    <div className="card-content">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-lg font-bold mr-3 text-primary">
                          {testimonial.initial}
                        </div>
                        <div>
                          <h4 className="font-medium">{testimonial.name}</h4>
                          <p className="text-sm text-gray-400">{testimonial.role}</p>
                        </div>
                      </div>
                      <p className="italic text-gray-300">
                        "{testimonial.quote}"
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold gradient-text mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Get answers to common questions about NepaliPay.
            </p>
          </div>
          
          <div className="glass-card">
            <div className="card-highlight"></div>
            <div className="card-content">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      <span className="flex items-center">
                        <Info className="h-5 w-5 mr-2 text-primary" />
                        {faq.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-gray-300 pl-7">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              
              <div className="mt-6 text-center">
                <p className="text-gray-400 mb-3">Want to explore more?</p>
                <Link href="/help" className="text-primary hover:underline flex items-center justify-center">
                  Check out our Knowledge Base
                  <MoveRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Final CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary/20 to-blue-600/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold gradient-text mb-6">Ready to experience the financial future?</h2>
          <p className="text-lg text-gray-300 mb-8">
            Join thousands of users already using NepaliPay to save, send, borrow, and grow.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/register" className="modern-button flex items-center">
              <Rocket className="mr-2 h-5 w-5" />
              Create Free Account
            </Link>
            <Link href="/login" className="modern-button-outline flex items-center">
              <ArrowUpRight className="mr-2 h-5 w-5" />
              Sign In
            </Link>
            <Link href="/login" className="modern-button-outline flex items-center">
              <Globe className="mr-2 h-5 w-5" />
              Connect Wallet
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-950/70">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 gradient-text">NepaliPay</h3>
            <p className="text-gray-400 mb-4">
              Empowering Nepal's financial future through innovative blockchain technology.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Products</h4>
            <ul className="space-y-2">
              <li><Link href="/wallet" className="text-gray-400 hover:text-primary">Digital Wallet</Link></li>
              <li><Link href="/nepalpaytoken" className="text-gray-400 hover:text-primary">NPT Token</Link></li>
              <li><Link href="/borrow" className="text-gray-400 hover:text-primary">Collateralized Loans</Link></li>
              <li><Link href="/ad-bazaar" className="text-gray-400 hover:text-primary">Ad Bazaar</Link></li>
              <li><Link href="/rewards" className="text-gray-400 hover:text-primary">Reward System</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/docs" className="text-gray-400 hover:text-primary">Documentation</Link></li>
              <li><Link href="/api" className="text-gray-400 hover:text-primary">API Reference</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-primary">FAQ</Link></li>
              <li><Link href="/help" className="text-gray-400 hover:text-primary">Knowledge Base</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Blockchain</h4>
            <ContractLinks contracts={contracts} />
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} NepaliPay. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;