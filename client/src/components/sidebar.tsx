import React from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
  HomeIcon,
  WalletIcon,
  AnalyticsIcon,
  CardIcon,
  SettingsIcon,
  HelpIcon,
  LogoutIcon
} from '@/lib/icons';

// Navigation items for the sidebar
const navItems = [
  {
    title: 'Home',
    href: '/',
    icon: HomeIcon
  },
  {
    title: 'Wallet',
    href: '/wallet',
    icon: WalletIcon
  },
  {
    title: 'Transactions',
    href: '/transactions',
    icon: AnalyticsIcon
  },
  {
    title: 'Collateral',
    href: '/collateral',
    icon: CardIcon
  },
  {
    title: 'Support',
    href: '/support',
    icon: HelpIcon
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: SettingsIcon
  }
];

const Sidebar = () => {
  const [location] = useLocation();
  const { logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="flex flex-col h-full w-64 bg-card border-r border-border">
      {/* Logo and app name */}
      <div className="flex items-center justify-center h-16 px-4">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          NepaliPay
        </h1>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <a
                className={cn(
                  'flex items-center px-4 py-3 text-sm rounded-lg transition-colors',
                  isActive 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <item.icon className={cn('h-5 w-5 mr-3', isActive ? 'text-primary' : 'text-muted-foreground')} />
                {item.title}
              </a>
            </Link>
          );
        })}
      </nav>

      {/* User and logout section */}
      <div className="p-4 border-t border-border">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogoutIcon className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;