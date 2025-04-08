import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Home, 
  LifeBuoy, 
  FileQuestion, 
  Book, 
  MailPlus, 
  ChevronLeft,
  Menu,
  X,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

type SidebarItemProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
};

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  href, 
  icon, 
  label, 
  active = false,
  onClick 
}) => {
  return (
    <Link href={href}>
      <a
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
          active
            ? 'bg-primary/10 text-primary font-medium'
            : 'hover:bg-primary/5 text-foreground/80'
        }`}
        onClick={onClick}
      >
        {icon}
        <span>{label}</span>
      </a>
    </Link>
  );
};

interface SupportLayoutProps {
  children: React.ReactNode;
}

const SupportLayout: React.FC<SupportLayoutProps> = ({ children }) => {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const ThemeIcon = theme === 'dark' ? Sun : theme === 'light' ? Moon : Monitor;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile sidebar backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card transition-transform duration-300 lg:translate-x-0 lg:static ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Link href="/">
              <a className="flex items-center gap-2">
                <div className="text-primary font-bold text-xl">NepaliPay</div>
              </a>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1 rounded-md hover:bg-muted lg:hidden"
            >
              <X size={20} />
            </button>
          </div>

          {/* Support navigation */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            <div className="text-sm font-medium text-muted-foreground px-4 py-2">
              Help & Support
            </div>
            <SidebarItem
              href="/support"
              icon={<LifeBuoy size={20} />}
              label="Support Home"
              active={location === '/support'}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <SidebarItem
              href="/support/faq"
              icon={<FileQuestion size={20} />}
              label="FAQ"
              active={location === '/support/faq'}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <SidebarItem
              href="/support/knowledgebase"
              icon={<Book size={20} />}
              label="Knowledge Base"
              active={location === '/support/knowledgebase'}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <SidebarItem
              href="/support/contact"
              icon={<MailPlus size={20} />}
              label="Contact Us"
              active={location === '/support/contact'}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <div className="mt-6 border-t border-border pt-4">
              <SidebarItem
                href="/dashboard"
                icon={<Home size={20} />}
                label="Back to Dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
              />
            </div>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 h-16 border-b border-border bg-card">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-md hover:bg-muted lg:hidden"
            >
              <Menu size={20} />
            </button>
            <div className="ml-4 hidden md:block">
              <div className="text-lg font-medium">Help & Support</div>
              <div className="text-sm text-muted-foreground">
                Find answers and get assistance
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-muted text-muted-foreground"
              title={`Switch to ${theme === 'dark' ? 'light' : theme === 'light' ? 'dark' : 'system'} theme`}
            >
              <ThemeIcon size={20} />
            </button>

            {/* Back to dashboard */}
            <Link href="/dashboard">
              <a className="flex items-center gap-1 px-4 py-2 text-sm rounded-md hover:bg-muted">
                <ChevronLeft size={16} />
                <span className="hidden md:inline">Back to Dashboard</span>
              </a>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SupportLayout;