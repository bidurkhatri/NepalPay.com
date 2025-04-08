import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Link } from 'wouter';
import { Search, ChevronLeft, ChevronRight, BookOpen, Play, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function KnowledgebasePage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  // Knowledgebase topics
  const topics = [
    {
      id: 'wallet-setup',
      name: 'Wallet Setup',
      icon: <svg className="h-10 w-10 text-purple-400" fill="currentColor" viewBox="0 0 24 24"><path d="M18.6,1H5.4C2.984,1,1,2.984,1,5.4v13.2C1,21.016,2.984,23,5.4,23h13.2c2.416,0,4.4-1.984,4.4-4.4V5.4 C23,2.984,21.016,1,18.6,1z M21.4,18.6c0,1.54-1.26,2.8-2.8,2.8H5.4c-1.54,0-2.8-1.26-2.8-2.8V5.4c0-1.54,1.26-2.8,2.8-2.8h13.2 c1.54,0,2.8,1.26,2.8,2.8V18.6z M17.007,8.307C16.775,8.113,16.45,8,16.1,8h-8.2C7.19,8,6.64,8.55,6.64,9.25v5.5 c0,0.7,0.55,1.25,1.25,1.25h8.2c0.35,0,0.675-0.113,0.907-0.307c0.232-0.194,0.343-0.438,0.343-0.943V9.25 C17.34,8.745,17.24,8.501,17.007,8.307z M16.1,9.5l-4.099,2.733L7.9,9.5H16.1z M7.9,14.5v-3.925l4.1,2.733l4.1-2.733V14.5H7.9z" /></svg>,
      color: "bg-gradient-to-br from-purple-500/20 to-indigo-500/20",
      description: "Learn how to set up your wallet and connect to NepaliPay"
    },
    {
      id: 'loan-basics',
      name: 'Loan Basics',
      icon: <svg className="h-10 w-10 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M20.5,3.5v17h-17v-17H20.5z M20.5,2h-17C2.675,2,2,2.675,2,3.5v17C2,21.325,2.675,22,3.5,22h17c0.825,0,1.5-0.675,1.5-1.5 v-17C22,2.675,21.325,2,20.5,2z M8.25,18h7.5c0.413,0,0.75-0.337,0.75-0.75S16.163,16.5,15.75,16.5h-7.5 c-0.413,0-0.75,0.337-0.75,0.75S7.837,18,8.25,18z M8.25,13.5h7.5c0.413,0,0.75-0.337,0.75-0.75S16.163,12,15.75,12h-7.5 c-0.413,0-0.75,0.337-0.75,0.75S7.837,13.5,8.25,13.5z M8.25,9h7.5c0.413,0,0.75-0.337,0.75-0.75S16.163,7.5,15.75,7.5h-7.5 c-0.413,0-0.75,0.337-0.75,0.75S7.837,9,8.25,9z" /></svg>,
      color: "bg-gradient-to-br from-blue-500/20 to-cyan-500/20",
      description: "Understand how loans work in NepaliPay"
    },
    {
      id: 'reward-tips',
      name: 'Reward Tips',
      icon: <svg className="h-10 w-10 text-teal-400" fill="currentColor" viewBox="0 0 24 24"><path d="M17.5,12c-0.507,0-0.985,0.125-1.404,0.346l-1.963-1.963c0.221-0.419,0.346-0.897,0.346-1.404 c0-1.683-1.352-3.035-3.035-3.035c-0.507,0-0.985,0.125-1.404,0.346L8.077,4.327C8.298,3.909,8.422,3.43,8.422,2.922 c0-1.683-1.352-3.035-3.035-3.035S2.353,1.24,2.353,2.922s1.351,3.035,3.035,3.035c0.507,0,0.985-0.125,1.404-0.346l1.963,1.963 C8.534,7.992,8.41,8.47,8.41,8.977c0,1.683,1.352,3.035,3.035,3.035c0.507,0,0.985-0.124,1.404-0.346l1.963,1.963 c-0.221,0.419-0.346,0.897-0.346,1.404c0,1.683,1.351,3.035,3.035,3.035s3.035-1.352,3.035-3.035S19.183,12,17.5,12z M5.387,4.459 c-0.839,0-1.518-0.68-1.518-1.518c0-0.839,0.68-1.518,1.518-1.518c0.839,0,1.518,0.68,1.518,1.518 C6.905,3.779,6.226,4.459,5.387,4.459z M11.446,10.494c-0.839,0-1.518-0.68-1.518-1.518c0-0.839,0.68-1.518,1.518-1.518 s1.518,0.68,1.518,1.518C12.964,9.814,12.285,10.494,11.446,10.494z M17.5,16.518c-0.839,0-1.518-0.68-1.518-1.518 c0-0.839,0.68-1.518,1.518-1.518s1.518,0.68,1.518,1.518C19.017,15.838,18.338,16.518,17.5,16.518z" /></svg>,
      color: "bg-gradient-to-br from-teal-500/20 to-green-500/20",
      description: "Maximize your rewards and cashback"
    },
    {
      id: 'ad-posting',
      name: 'Ad Posting',
      icon: <svg className="h-10 w-10 text-amber-400" fill="currentColor" viewBox="0 0 24 24"><path d="M16.462,2h-11C4.656,2,4,2.656,4,3.462v17.077C4,21.344,4.656,22,5.462,22h11c0.807,0,1.462-0.656,1.462-1.462V3.462 C17.923,2.656,17.269,2,16.462,2z M16.462,20.5H5.462c-0.268,0.001-0.459-0.218-0.462-0.487V3.967L5.462,3.5h11 c0.268-0.001,0.459,0.218,0.462,0.486v16.027C16.923,20.281,16.729,20.5,16.462,20.5z M9.116,6c-0.258,0-0.466,0.209-0.466,0.467 S8.858,6.934,9.116,6.934h3.693c0.258,0,0.467-0.209,0.467-0.467S13.067,6,12.809,6H9.116z M7.499,12.467 c0-0.258-0.209-0.467-0.466-0.467H6.233c-0.258,0-0.466,0.209-0.466,0.467s0.208,0.467,0.466,0.467h0.799 C7.29,12.934,7.499,12.725,7.499,12.467z M7.499,15.4c0-0.258-0.209-0.467-0.466-0.467H6.233c-0.258,0-0.466,0.209-0.466,0.467 s0.208,0.466,0.466,0.466h0.799C7.29,15.866,7.499,15.658,7.499,15.4z M7.499,9.533c0-0.258-0.209-0.466-0.466-0.466H6.233 c-0.258,0-0.466,0.208-0.466,0.466S5.975,10,6.233,10h0.799C7.29,10,7.499,9.792,7.499,9.533z M16.157,9.533 c0-0.258-0.209-0.466-0.466-0.466h-0.8c-0.258,0-0.467,0.208-0.467,0.466S14.633,10,14.891,10h0.8 C15.948,10,16.157,9.792,16.157,9.533z M16.157,12.467c0-0.258-0.209-0.467-0.466-0.467h-0.8c-0.258,0-0.467,0.209-0.467,0.467 s0.209,0.467,0.467,0.467h0.8C15.948,12.934,16.157,12.725,16.157,12.467z M16.157,15.4c0-0.258-0.209-0.467-0.466-0.467h-0.8 c-0.258,0-0.467,0.209-0.467,0.467s0.209,0.466,0.467,0.466h0.8C15.948,15.866,16.157,15.658,16.157,15.4z M9.116,17.867h3.693 c0.258,0,0.467-0.209,0.467-0.467c0-0.258-0.209-0.466-0.467-0.466H9.116c-0.258,0-0.466,0.208-0.466,0.466 C8.65,17.658,8.858,17.867,9.116,17.867z" /></svg>,
      color: "bg-gradient-to-br from-amber-500/20 to-orange-500/20",
      description: "Create and manage effective advertisements"
    }
  ];

  // Popular guides
  const popularGuides = [
    {
      title: "How to Borrow NPT",
      topic: "loan-basics",
      description: "Step-by-step guide to taking out a loan using collateral",
      readTime: "5 min read"
    },
    {
      title: "Understanding Collateral",
      topic: "loan-basics",
      description: "Learn about the different types of collateral and their loan-to-value ratios",
      readTime: "7 min read"
    },
    {
      title: "Setting Up MetaMask",
      topic: "wallet-setup",
      description: "Complete guide to setting up MetaMask for use with NepaliPay",
      readTime: "6 min read"
    },
    {
      title: "Maximizing Referral Rewards",
      topic: "reward-tips",
      description: "Tips and strategies to get the most from the referral program",
      readTime: "4 min read"
    },
    {
      title: "Creating Effective Ads",
      topic: "ad-posting",
      description: "Best practices for creating ads that convert",
      readTime: "8 min read"
    }
  ];

  // Filter guides based on search query
  const filteredGuides = searchQuery
    ? popularGuides.filter(
        guide => 
          guide.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          guide.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : popularGuides;

  // Get topic by ID
  const getTopicById = (id: string) => {
    return topics.find(topic => topic.id === id);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header section */}
      <div className="relative pt-12 pb-8 px-4 md:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
          <div className="absolute top-1/4 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl -z-10"></div>
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
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-400 to-emerald-400">
              Knowledge Base
            </h1>
            <p className="text-lg text-white/70 mb-8 max-w-3xl">
              Explore detailed guides, tutorials, and resources to get the most out of NepaliPay
            </p>

            {/* Search bar */}
            <div className="max-w-2xl mb-8 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <Input 
                type="search"
                placeholder="Search articles, guides, and tutorials..."
                className="bg-white/5 border-white/10 text-white pl-10 focus-visible:ring-teal-500/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Knowledgebase content */}
      <div className="flex-grow py-4 px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Browse Topics section */}
          {!searchQuery && (
            <motion.section 
              className="mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-2xl font-bold mb-8 text-white">Browse Topics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {topics.map((topic, index) => (
                  <Link key={index} href={`/support/knowledgebase/${topic.id}`}>
                    <Card className={`h-full cursor-pointer bg-black/40 border border-white/10 hover:border-white/20 hover:bg-black/50 transition-all overflow-hidden group`}>
                      <div className={`absolute inset-0 ${topic.color} opacity-20 transition-opacity group-hover:opacity-30`}></div>
                      <CardHeader className="relative">
                        <div className="mb-3">{topic.icon}</div>
                        <CardTitle className="text-xl text-white">{topic.name}</CardTitle>
                        <CardDescription className="text-white/60">{topic.description}</CardDescription>
                      </CardHeader>
                      <CardFooter className="relative border-t border-white/5 pt-4 flex justify-between items-center">
                        <span className="text-sm text-white/60">Browse Articles</span>
                        <ChevronRight className="h-5 w-5 text-white/40 group-hover:text-white/60 transition-all group-hover:translate-x-1" />
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            </motion.section>
          )}

          {/* Popular Guides section */}
          <section className="mb-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">
                {searchQuery ? "Search Results" : "Popular Guides"}
              </h2>
              {searchQuery && (
                <Badge variant="secondary" className="bg-white/10 text-white">
                  {filteredGuides.length} result(s)
                </Badge>
              )}
            </div>

            {filteredGuides.length > 0 ? (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredGuides.map((guide, index) => {
                  const topic = getTopicById(guide.topic);
                  
                  return (
                    <motion.div key={index} variants={itemVariants}>
                      <Link href={`/support/knowledgebase/${guide.topic}/${guide.title.toLowerCase().replace(/\s+/g, '-')}`}>
                        <Card className="h-full cursor-pointer bg-black/40 border border-white/10 hover:border-white/20 hover:bg-black/50 transition-all overflow-hidden group">
                          <CardHeader className="relative pb-3">
                            <div className="flex items-center gap-2 mb-3">
                              <Badge variant="outline" className="bg-white/5 text-white/80 hover:bg-white/10">
                                {topic?.name}
                              </Badge>
                              <span className="text-xs text-white/40">{guide.readTime}</span>
                            </div>
                            <CardTitle className="text-lg text-white group-hover:text-primary transition-colors">{guide.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="pb-3">
                            <p className="text-sm text-white/60">{guide.description}</p>
                          </CardContent>
                          <CardFooter className="relative pt-3 border-t border-white/5">
                            <span className="inline-flex items-center text-xs text-primary/80 group-hover:text-primary transition-all">
                              Read Article
                              <ArrowUpRight className="h-3 w-3 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </span>
                          </CardFooter>
                        </Card>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <div className="bg-black/30 border border-white/10 rounded-lg p-8 text-center">
                <p className="text-white/60">No guides found matching "{searchQuery}". Try different keywords or browse topics.</p>
              </div>
            )}
          </section>

          {/* Video Tutorials section */}
          {!searchQuery && (
            <motion.section 
              className="mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white">Video Tutorials</h2>
                <Link href="/support/knowledgebase/videos">
                  <Button variant="link" className="text-primary hover:text-primary/80">
                    View All Videos
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>

              <div className="bg-gradient-to-r from-blue-500/10 to-teal-500/10 backdrop-blur-sm rounded-xl p-8 border border-white/10 relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="md:w-1/2">
                    <h3 className="text-xl font-semibold text-white mb-2">Getting Started with NepaliPay</h3>
                    <p className="text-white/60 mb-6">
                      A comprehensive video guide covering all the basics of setting up and using NepaliPay. Perfect for new users.
                    </p>
                    <Button className="bg-primary hover:bg-primary/90 text-white inline-flex items-center">
                      <Play className="h-4 w-4 mr-2" />
                      Watch Now
                    </Button>
                  </div>
                  <div className="md:w-1/2 aspect-video bg-black/40 rounded-lg border border-white/10 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-white/30" />
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </div>
      </div>
    </div>
  );
}