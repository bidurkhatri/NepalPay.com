import React from 'react';
import { Link, useLocation } from 'wouter';
import { LayoutDashboard, Wallet, User, Coins, Settings } from 'lucide-react';
import { SendIcon, CardIcon } from '@/lib/icons';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const MobileNavigation: React.FC = () => {
  const [location] = useLocation();

  const menuItems = [
    { href: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" />, label: 'Home' },
    { href: '/wallet', icon: <Wallet className="h-5 w-5" />, label: 'Wallet' },
    { href: '/send', icon: <SendIcon className="h-5 w-5" />, label: 'Send' },
    { href: '/loans', icon: <Coins className="h-5 w-5" />, label: 'Loans' },
    { href: '/settings', icon: <Settings className="h-5 w-5" />, label: 'Settings' },
  ];

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed inset-x-0 bottom-0 md:hidden border-t border-border/30 bg-card/95 backdrop-blur-lg safe-area-bottom"
    >
      <nav className="flex justify-around px-2 py-1">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.href}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <Link href={item.href}>
              <div
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-300 min-w-[60px]",
                  location === item.href
                    ? 'text-primary bg-primary/10 ring-2 ring-primary/30'
                    : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                )}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center"
                >
                  {item.icon}
                  <span className="text-xs mt-1 font-medium">{item.label}</span>
                </motion.div>
              </div>
            </Link>
          </motion.div>
        ))}
      </nav>
    </motion.div>
  );
};

export default MobileNavigation;