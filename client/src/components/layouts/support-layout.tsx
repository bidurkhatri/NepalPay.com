import React from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { HelpIcon, HomeIcon } from '@/lib/icons';

interface SupportLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const supportLinks = [
  {
    title: 'Dashboard',
    href: '/',
    icon: HomeIcon
  },
  {
    title: 'FAQ',
    href: '/support/faq',
    icon: HelpIcon
  },
  {
    title: 'Knowledge Base',
    href: '/support/knowledge-base',
    icon: HelpIcon
  },
  {
    title: 'Contact',
    href: '/support/contact',
    icon: HelpIcon
  }
];

const SupportLayout: React.FC<SupportLayoutProps> = ({ 
  children,
  className 
}) => {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 z-10 bg-background">
        <div className="container flex items-center justify-between h-16">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            NepaliPay Support
          </h1>
          <Link href="/">
            <Button variant="outline" size="sm">Back to Dashboard</Button>
          </Link>
        </div>
      </header>
      
      <div className="container pt-6 pb-12">
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="w-full md:w-64 shrink-0">
            <nav className="flex flex-col gap-2 sticky top-24">
              {supportLinks.map((link) => {
                const isActive = location === link.href;
                return (
                  <Link key={link.href} href={link.href}>
                    <a
                      className={cn(
                        'flex items-center px-4 py-3 text-sm rounded-lg transition-colors',
                        isActive 
                          ? 'bg-primary/10 text-primary font-medium' 
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      )}
                    >
                      <link.icon className={cn('h-5 w-5 mr-3', isActive ? 'text-primary' : 'text-muted-foreground')} />
                      {link.title}
                    </a>
                  </Link>
                );
              })}
            </nav>
          </aside>
          
          <main className={cn("flex-1", className)}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SupportLayout;