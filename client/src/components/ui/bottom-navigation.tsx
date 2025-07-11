import React from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Home, 
  Wallet, 
  Send, 
  History,
  User
} from 'lucide-react';

const navigationItems = [
  { 
    href: '/dashboard', 
    icon: Home, 
    label: 'Home',
    ariaLabel: 'Navigate to dashboard'
  },
  { 
    href: '/wallet', 
    icon: Wallet, 
    label: 'Wallet',
    ariaLabel: 'Navigate to wallet'
  },
  { 
    href: '/send', 
    icon: Send, 
    label: 'Send',
    ariaLabel: 'Navigate to send tokens'
  },
  { 
    href: '/transactions', 
    icon: History, 
    label: 'History',
    ariaLabel: 'Navigate to transaction history'
  },
  { 
    href: '/profile', 
    icon: User, 
    label: 'Profile',
    ariaLabel: 'Navigate to profile'
  },
];

export function BottomNavigation() {
  const [location] = useLocation();

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-t border-border md:hidden"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex justify-around items-center h-16 px-2">
        {navigationItems.map(({ href, icon: Icon, label, ariaLabel }) => {
          const isActive = location === href || (href === '/dashboard' && location === '/');
          
          return (
            <Link 
              key={href}
              href={href}
              className={`
                flex flex-col items-center justify-center 
                min-h-[44px] min-w-[44px] px-3 py-2 
                rounded-lg transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-2
                active:scale-95
                ${isActive 
                  ? 'bg-design-primary/10' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }
              `}
              style={{
                ...(isActive ? { color: '#1A73E8' } : {}),
                '--tw-ring-color': '#1A73E8'
              } as React.CSSProperties}
              aria-label={ariaLabel}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon 
                className={`h-5 w-5 mb-1 ${isActive ? 'stroke-2' : 'stroke-1.5'}`}
                aria-hidden="true"
              />
              <span className="text-xs font-medium leading-none">
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNavigation;