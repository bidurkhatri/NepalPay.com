import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useBlockchain } from '@/contexts/blockchain-context';
import { 
  Home, 
  Wallet, 
  BarChart3, 
  CreditCard, 
  Shield, 
  PlusCircle, 
  Menu, 
  X, 
  LogOut, 
  ChevronDown,
  User,
  HelpCircle,
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
        className={`flex items-center gap-3 px-4 py-3 rounded-lg apple-transition ${
          active
            ? 'bg-primary/15 text-primary font-medium backdrop-blur-sm'
            : 'hover:bg-primary/5 text-foreground/80 hover:text-foreground'
        }`}
        onClick={onClick}
      >
        {icon}
        <span>{label}</span>
      </a>
    </Link>
  );
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const { user, logoutMutation } = useAuth();
  const { connectedWallet, connectWallet, disconnectWallet, tokenBalance, tokenSymbol } = useBlockchain();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleWalletConnection = () => {
    if (connectedWallet) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const ThemeIcon = theme === 'dark' ? Sun : theme === 'light' ? Moon : Monitor;

  // Apply the appropriate theme class based on user role
  const roleClass = user?.role === 'admin' 
    ? 'admin-theme' 
    : user?.role === 'superadmin' 
      ? 'superadmin-theme' 
      : '';

  return (
    <div className={`flex h-screen overflow-hidden bg-background dashboard-background ${roleClass}`}>
      {/* Mobile sidebar backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-md lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`glass-sidebar dark:glass-sidebar-dark fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 lg:translate-x-0 lg:static ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between p-4 border-b border-border/30">
            <Link href="/">
              <a className="flex items-center gap-2">
                <div className="gradient-text font-bold text-xl">NepaliPay</div>
              </a>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1 rounded-md hover:bg-muted lg:hidden"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            <SidebarItem
              href="/dashboard"
              icon={<Home size={20} />}
              label="Dashboard"
              active={location === '/dashboard'}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <SidebarItem
              href="/wallet"
              icon={<Wallet size={20} />}
              label="Wallet"
              active={location === '/wallet'}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <SidebarItem
              href="/transactions"
              icon={<BarChart3 size={20} />}
              label="Transactions"
              active={location === '/transactions'}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <SidebarItem
              href="/loans"
              icon={<CreditCard size={20} />}
              label="Loans"
              active={location === '/loans'}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <SidebarItem
              href="/collaterals"
              icon={<Shield size={20} />}
              label="Collaterals"
              active={location === '/collaterals'}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <SidebarItem
              href="/buy-tokens"
              icon={<PlusCircle size={20} />}
              label="Buy Tokens"
              active={location === '/buy-tokens'}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <SidebarItem
              href="/support"
              icon={<HelpCircle size={20} />}
              label="Support"
              active={location.startsWith('/support')}
              onClick={() => setIsMobileMenuOpen(false)}
            />
          </nav>

          {/* Wallet connection status */}
          <div className="p-3 border-t border-border/30">
            <button
              onClick={handleWalletConnection}
              className={`glass-button w-full flex items-center justify-center gap-2 apple-transition ${
                connectedWallet
                  ? 'bg-green-500/15 text-green-500 hover:bg-green-500/25 backdrop-blur-sm'
                  : 'glass-button-primary'
              }`}
            >
              <Wallet size={16} />
              <span className="truncate">
                {connectedWallet
                  ? `${connectedWallet.substring(0, 6)}...${connectedWallet.substring(
                      connectedWallet.length - 4
                    )}`
                  : 'Connect Wallet'}
              </span>
            </button>

            {connectedWallet && (
              <div className="mt-2 text-center text-sm">
                <div className="gradient-text font-semibold">{Number(tokenBalance).toLocaleString()} {tokenSymbol}</div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="glass-navbar dark:glass-navbar-dark sticky top-0 z-30 flex items-center justify-between px-4 h-16">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-md hover:bg-muted lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center ml-auto gap-4">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-primary/10 apple-transition"
              title={`Switch to ${theme === 'dark' ? 'light' : theme === 'light' ? 'dark' : 'system'} theme`}
            >
              <ThemeIcon size={20} />
            </button>

            {/* User profile */}
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 p-2 rounded-full hover:bg-primary/10 apple-transition"
              >
                <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center overflow-hidden">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={18} className="text-primary" />
                  )}
                </div>
                <span className="hidden md:block font-medium">{user?.username}</span>
                <ChevronDown size={16} />
              </button>

              {isProfileDropdownOpen && (
                <div className="glass-morphic dark:glass-morphic-dark absolute right-0 mt-2 w-48 rounded-xl shadow-lg overflow-hidden z-50">
                  <div className="p-3 border-b border-border/30">
                    <div className="font-medium">{user?.username}</div>
                    <div className="text-sm text-muted-foreground truncate">
                      {user?.email}
                    </div>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md apple-transition"
                    >
                      <LogOut size={16} />
                      <span>Log out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto py-6 px-4 md:px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;