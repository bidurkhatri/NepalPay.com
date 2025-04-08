import { useAuth } from '@/hooks/use-auth';
import { Link } from 'wouter';
import { MessageSquareText, FileQuestion, Book, Phone, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function SupportPage() {
  const { user } = useAuth();

  const supportOptions = [
    {
      title: "Frequently Asked Questions",
      description: "Get quick answers to common questions",
      icon: <FileQuestion className="h-10 w-10 text-primary/80" />,
      href: "/support/faq",
      color: "from-purple-500/20 to-indigo-500/20"
    },
    {
      title: "Knowledge Base",
      description: "Detailed guides and tutorials",
      icon: <Book className="h-10 w-10 text-indigo-500/80" />,
      href: "/support/knowledgebase",
      color: "from-blue-500/20 to-cyan-500/20"
    },
    {
      title: "Contact Us",
      description: "Get in touch with our support team",
      icon: <Phone className="h-10 w-10 text-cyan-500/80" />,
      href: "/support/contact",
      color: "from-teal-500/20 to-emerald-500/20"
    }
  ];

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
      <div className="relative pt-12 pb-10 px-4 md:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>
          <div className="absolute top-1/4 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-blue-400">
            Help & Support
          </h1>
          <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
            We're here to help you with any questions or issues you might have with NepaliPay
          </p>
        </motion.div>
      </div>

      {/* Support options */}
      <div className="flex-grow py-8 px-4 md:px-6 lg:px-8">
        <motion.div 
          className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {supportOptions.map((option, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Link href={option.href}>
                <Card className="h-full bg-black/40 border border-white/10 hover:border-white/20 hover:bg-black/50 transition-all cursor-pointer overflow-hidden group">
                  <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-20 transition-opacity group-hover:opacity-30`}></div>
                  <CardHeader className="relative">
                    <div className="mb-2">{option.icon}</div>
                    <CardTitle className="text-xl text-white">{option.title}</CardTitle>
                    <CardDescription className="text-white/60">{option.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="relative border-t border-white/5 pt-4 flex justify-between items-center">
                    <span className="text-sm text-white/60">View {option.title}</span>
                    <ChevronRight className="h-5 w-5 text-white/40 group-hover:text-white/60 transition-all group-hover:translate-x-1" />
                  </CardFooter>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Live chat button */}
        <motion.div 
          className="max-w-6xl mx-auto mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-primary to-purple-500 rounded-full p-3 shadow-lg shadow-primary/20">
                  <MessageSquareText className="h-8 w-8 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-semibold text-white">Need immediate assistance?</h3>
                  <p className="text-white/60">Our support team is available to help you right now</p>
                </div>
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-6 h-auto rounded-lg shadow-lg shadow-primary/20">
                Start Live Chat
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Support ticket button */}
        <motion.div 
          className="max-w-6xl mx-auto mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="border border-white/10 rounded-xl p-6 backdrop-blur-sm bg-white/5">
            <h3 className="text-lg font-medium text-white mb-2">Submit a Support Ticket</h3>
            <p className="text-white/60 mb-4">
              For complex issues, create a support ticket and our team will get back to you
            </p>
            <Button variant="outline" className="border-white/20 hover:border-white/30 text-white">
              Create Ticket
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}