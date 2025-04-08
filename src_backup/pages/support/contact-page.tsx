import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Link } from 'wouter';
import { ChevronLeft, Mail, Phone, MessageSquare, Send, Clock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';

export default function ContactPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form validation schema
  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    message: z.string().min(10, {
      message: "Message must be at least 10 characters.",
    }).max(1000, {
      message: "Message cannot exceed 1000 characters."
    }),
  });

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : "",
      username: user?.username || "",
      email: user?.email || "",
      message: "",
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      toast({
        title: "Message sent successfully",
        description: "We'll get back to you as soon as possible.",
        variant: "default",
      });
      form.reset({
        name: values.name,
        username: values.username,
        email: values.email,
        message: "",
      });
      setIsSubmitting(false);
    }, 1500);
  };

  // Social media links
  const socialLinks = [
    { 
      name: "Facebook", 
      icon: <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z"></path></svg>, 
      url: "#" 
    },
    { 
      name: "Twitter", 
      icon: <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M19.9441 7.92638C19.9568 8.10403 19.9568 8.28173 19.9568 8.45938C19.9568 13.8781 15.8325 20.1218 8.29441 20.1218C5.97207 20.1218 3.81473 19.4492 2 18.2817C2.32996 18.3198 2.64719 18.3325 2.98984 18.3325C4.90605 18.3325 6.67004 17.6853 8.07867 16.5812C6.27664 16.5431 4.76648 15.3629 4.24617 13.7386C4.5 13.7766 4.75379 13.802 5.02031 13.802C5.38832 13.802 5.75637 13.7512 6.09898 13.6624C4.22082 13.2817 2.81215 11.632 2.81215 9.63958V9.58884C3.35781 9.89341 3.99238 10.0838 4.66492 10.1091C3.56086 9.37306 2.83754 8.11675 2.83754 6.70812C2.83754 5.94663 3.04055 5.24866 3.3959 4.64945C5.41367 7.11598 8.44668 8.73889 11.8477 8.91658C11.7842 8.61201 11.7461 8.29469 11.7461 7.97736C11.7461 5.71818 13.5736 3.87817 15.8451 3.87817C17.0253 3.87817 18.0913 4.39087 18.84 5.22326C19.7664 5.04556 20.6547 4.7029 21.4416 4.2411C21.137 5.18519 20.4898 5.9467 19.6395 6.4213C20.4644 6.32815 21.2639 6.10982 21.9999 5.80522C21.4416 6.57947 20.7436 7.2647 19.9441 7.92638Z"></path></svg>, 
      url: "#" 
    },
    { 
      name: "LinkedIn", 
      icon: <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M6.94 5.00002C6.94 5.99002 6.14 6.79002 5.16 6.79002C4.18 6.79002 3.38 5.99002 3.38 5.00002C3.38 4.01002 4.18 3.22002 5.16 3.22002C6.14 3.22002 6.94 4.01002 6.94 5.00002ZM6.85 8.14002H3.48V21H6.85V8.14002ZM13.5 8.14002H10.14V21H13.5V14.2C13.5 10.86 17.7 10.58 17.7 14.2V21H21.1V13.14C21.1 7.25002 15.3 7.51002 13.5 10.36V8.14002Z"></path></svg>, 
      url: "#" 
    },
    { 
      name: "Instagram", 
      icon: <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>, 
      url: "#" 
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
      <div className="relative pt-12 pb-8 px-4 md:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-10"></div>
          <div className="absolute top-1/4 right-0 w-80 h-80 bg-green-500/10 rounded-full blur-3xl -z-10"></div>
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
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-green-400">
              Contact Us
            </h1>
            <p className="text-lg text-white/70 mb-8 max-w-3xl">
              Get in touch with our support team for assistance with NepaliPay
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contact content */}
      <div className="flex-grow py-4 px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact information */}
          <motion.div 
            className="lg:col-span-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="space-y-6">
              <motion.div variants={itemVariants}>
                <Card className="bg-black/40 border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-xl text-white flex items-center gap-2">
                      <Mail className="h-5 w-5 text-cyan-400" />
                      Email Us
                    </CardTitle>
                    <CardDescription className="text-white/60">
                      Send us an email directly
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <a href="mailto:support@nepalipay.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                      support@nepalipay.com
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Card className="bg-black/40 border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-xl text-white flex items-center gap-2">
                      <Phone className="h-5 w-5 text-teal-400" />
                      Call Us
                    </CardTitle>
                    <CardDescription className="text-white/60">
                      Speak to our support team
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <a href="tel:+9771555123" className="text-teal-400 hover:text-teal-300 transition-colors">
                      +977-1-555-1234
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Card className="bg-black/40 border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-xl text-white flex items-center gap-2">
                      <Clock className="h-5 w-5 text-green-400" />
                      Business Hours
                    </CardTitle>
                    <CardDescription className="text-white/60">
                      When we're available
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-white/80"><span className="text-white/50">Sunday - Friday:</span> 9:00 AM - 6:00 PM</p>
                    <p className="text-white/80"><span className="text-white/50">Saturday:</span> 10:00 AM - 2:00 PM</p>
                    <p className="text-xs text-white/50 mt-3">Nepal Standard Time (NPT)</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="bg-black/40 border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-xl text-white flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-emerald-400" />
                      Office Location
                    </CardTitle>
                    <CardDescription className="text-white/60">
                      Visit our office
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/80">
                      123 Durbar Marg<br />
                      Kathmandu, 44600<br />
                      Nepal
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="bg-black/40 border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-xl text-white flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-blue-400" />
                      Social Media
                    </CardTitle>
                    <CardDescription className="text-white/60">
                      Connect with us online
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      {socialLinks.map((social, index) => (
                        <a 
                          key={index} 
                          href={social.url} 
                          className="bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors"
                          aria-label={social.name}
                        >
                          <span className="text-white/80 hover:text-white transition-colors">
                            {social.icon}
                          </span>
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-black/40 border border-white/10 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl -z-10"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl -z-10"></div>
              
              <CardHeader>
                <CardTitle className="text-2xl text-white">Send us a message</CardTitle>
                <CardDescription className="text-white/60">
                  Fill out the form below and we'll get back to you as soon as possible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Your name" 
                                className="bg-white/5 border-white/10 text-white focus-visible:ring-teal-500/20" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Username</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Your NepaliPay username" 
                                className="bg-white/5 border-white/10 text-white focus-visible:ring-teal-500/20" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Email</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your email address" 
                              type="email"
                              className="bg-white/5 border-white/10 text-white focus-visible:ring-teal-500/20" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="How can we help you?" 
                              className="bg-white/5 border-white/10 text-white focus-visible:ring-teal-500/20 min-h-[150px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription className="text-white/40 text-xs">
                            {field.value.length}/1000 characters
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-8 py-6 h-auto"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}