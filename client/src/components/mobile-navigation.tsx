import React from 'react';
import { Link, useLocation } from 'wouter';
import { LayoutDashboard, Wallet, Settings, BadgePercent, Store } from 'lucide-react';

const MobileNavigation: React.FC = () => {
  const [location] = useLocation();

  const menuItems = [
    { href: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard' },
    { href: '/wallet', icon: <Wallet className="h-5 w-5" />, label: 'Wallet' },
    { href: '/home', icon: <Settings className="h-5 w-5" />, label: 'Home' },
  ];

  return (
    <div className="fixed inset-x-0 bottom-0 md:hidden border-t border-primary/20 bg-black/90 backdrop-blur-lg">
      <nav className="flex justify-around">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div
              className={`flex flex-col items-center justify-center p-3 ${
                location === item.href
                  ? 'text-primary'
                  : 'text-gray-400'
              }`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default MobileNavigation;