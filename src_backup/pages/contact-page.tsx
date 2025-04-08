import React, { useState } from 'react';
import { Link } from 'wouter';
import { Mail, Phone, MapPin, Send, ArrowLeft, Facebook, Twitter, Instagram } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const { toast } = useToast();
  const [formValues, setFormValues] = useState<ContactFormValues>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formValues.name || !formValues.email || !formValues.message) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formValues.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      
      toast({
        title: "Message Sent",
        description: "Thank you for your message. We'll get back to you soon!",
        variant: "default"
      });
      
      // Reset form
      setFormValues({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1500);
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
            <h1 className="text-2xl font-bold">Contact Us</h1>
            <p className="text-gray-400">Get in touch with the NepaliPay team</p>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-6xl mx-auto p-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div>
            <h2 className="text-xl font-bold mb-6">Our Contact Information</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-800/30 backdrop-blur-[20px] border border-gray-700/30 rounded-lg p-6 shadow-lg">
                <div className="flex items-start">
                  <div className="p-3 rounded-lg bg-primary/20 text-primary mr-4">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Email Us</h3>
                    <p className="text-gray-400 mb-2">For general inquiries and support</p>
                    <a href="mailto:support@nepalipay.com" className="text-primary hover:underline">
                      support@nepalipay.com
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800/30 backdrop-blur-[20px] border border-gray-700/30 rounded-lg p-6 shadow-lg">
                <div className="flex items-start">
                  <div className="p-3 rounded-lg bg-primary/20 text-primary mr-4">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Call Us</h3>
                    <p className="text-gray-400 mb-2">Monday to Friday, 9am to 5pm NPT</p>
                    <a href="tel:+9771-555-1234" className="text-primary hover:underline">
                      +977-1-555-1234
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800/30 backdrop-blur-[20px] border border-gray-700/30 rounded-lg p-6 shadow-lg">
                <div className="flex items-start">
                  <div className="p-3 rounded-lg bg-primary/20 text-primary mr-4">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Visit Us</h3>
                    <p className="text-gray-400 mb-2">Our headquarters location</p>
                    <address className="not-italic text-gray-300">
                      NepaliPay HQ<br />
                      Thamel, Kathmandu<br />
                      Nepal
                    </address>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Social Media */}
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a 
                  href="https://facebook.com/nepalipay" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-800/30 backdrop-blur-[20px] border border-gray-700/30 rounded-lg hover:bg-gray-700/30 transition-colors"
                >
                  <Facebook className="h-6 w-6 text-blue-500" />
                </a>
                <a 
                  href="https://twitter.com/nepalipay" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-800/30 backdrop-blur-[20px] border border-gray-700/30 rounded-lg hover:bg-gray-700/30 transition-colors"
                >
                  <Twitter className="h-6 w-6 text-sky-500" />
                </a>
                <a 
                  href="https://instagram.com/nepalipay" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-800/30 backdrop-blur-[20px] border border-gray-700/30 rounded-lg hover:bg-gray-700/30 transition-colors"
                >
                  <Instagram className="h-6 w-6 text-pink-500" />
                </a>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="bg-gray-800/30 backdrop-blur-[20px] border border-gray-700/30 rounded-lg p-6 shadow-lg h-fit">
            <h2 className="text-xl font-bold mb-6">Send Us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formValues.name}
                  onChange={handleChange}
                  className="w-full bg-gray-800/30 backdrop-blur-[20px] border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-primary shadow-md"
                  placeholder="Enter your name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formValues.email}
                  onChange={handleChange}
                  className="w-full bg-gray-800/30 backdrop-blur-[20px] border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-primary shadow-md"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formValues.subject}
                  onChange={handleChange}
                  className="w-full bg-gray-800/30 backdrop-blur-[20px] border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-primary shadow-md"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="account">Account Issues</option>
                  <option value="feature">Feature Request</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                  Your Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formValues.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full bg-gray-800/30 backdrop-blur-[20px] border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-primary shadow-md"
                  placeholder="Enter your message"
                  required
                />
              </div>
              
              <div className="text-xs text-gray-400">
                Fields marked with <span className="text-red-500">*</span> are required.
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 rounded-lg font-medium mt-4 flex items-center justify-center 
                  ${isSubmitting 
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-primary to-primary-light text-white'
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="mt-12 bg-gray-800/30 backdrop-blur-[20px] border border-gray-700/30 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold mb-3">Have questions?</h2>
          <p className="text-gray-300 mb-6">Check our frequently asked questions or explore our knowledge base.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/faq">
              <button className="bg-primary/20 text-primary hover:bg-primary/30 px-6 py-3 rounded-lg font-medium flex items-center justify-center">
                View FAQ
              </button>
            </Link>
            <Link href="/knowledge">
              <button className="bg-gray-700/50 text-white hover:bg-gray-700/70 px-6 py-3 rounded-lg font-medium flex items-center justify-center">
                Knowledge Base
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

export default ContactPage;