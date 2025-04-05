import React, { useState, ReactNode } from 'react';
import { useBlockchain } from '@/contexts/blockchain-context';
import { useCustomToast } from '@/lib/toast-wrapper';
import { 
  Settings, 
  TrendingDown, 
  Users, 
  BarChart3, 
  Wallet, 
  LogOut, 
  Activity,
  ChevronDown,
  AlertCircle
} from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const { userAddress, disconnectWallet, nepaliPayContract, tokenContract, feeRelayerContract } = useBlockchain();
  const [location] = useLocation();
  const toast = useCustomToast();
  const [contractsExpanded, setContractsExpanded] = useState(false);

  const handleLogout = () => {
    disconnectWallet();
    window.location.href = "/superadmin";
  };

  // Truncate address for display
  const truncateAddress = (address: string | null) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const navItems = [
    { path: '/superadmin/dashboard', label: 'Control Panel', icon: <Settings className="h-5 w-5" /> },
    { path: '/superadmin/stability', label: 'Stability', icon: <TrendingDown className="h-5 w-5" /> },
    { path: '/superadmin/admins', label: 'Admin Management', icon: <Users className="h-5 w-5" /> },
    { path: '/superadmin/finance', label: 'Finance', icon: <Wallet className="h-5 w-5" /> },
    { path: '/superadmin/analytics', label: 'Analytics', icon: <BarChart3 className="h-5 w-5" /> },
  ];

  const isActiveRoute = (path: string) => {
    return location === path;
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar */}
      <motion.aside 
        className="sidebar-nav w-full lg:w-64 lg:h-screen lg:fixed"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col h-full">
          {/* Logo and header */}
          <div className="mb-8 px-2">
            <h1 className="text-xl font-bold nepal-gradient-text">NepaliPay Owner</h1>
            <div className="flex items-center mt-2 text-xs text-gray-400">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
              <span className="truncate">{truncateAddress(userAddress)}</span>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-grow">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link href={item.path}>
                    <a className={`sidebar-item ${isActiveRoute(item.path) ? 'active' : ''}`}>
                      {item.icon}
                      <span>{item.label}</span>
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Contract Info Accordion */}
          <div className="mt-4 mb-3 px-3">
            <button 
              onClick={() => setContractsExpanded(!contractsExpanded)}
              className="flex items-center justify-between w-full text-left py-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              <span className="font-medium">Smart Contracts</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${contractsExpanded ? 'transform rotate-180' : ''}`} />
            </button>
            
            {contractsExpanded && (
              <div className="mt-2 space-y-2 pl-2 text-xs text-gray-400">
                <div className="flex flex-col">
                  <span className="font-medium text-gray-300">NepaliPay Token</span>
                  <a 
                    href="https://bscscan.com/address/0x69d34B25809b346702C21EB0E22EAD8C1de58D66" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary/80 hover:text-primary truncate"
                  >
                    0x69d34B25809b346702C21EB0E22EAD8C1de58D66
                  </a>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-300">NepaliPay Main</span>
                  <a 
                    href="https://bscscan.com/address/0xe2d189f6696ee8b247ceae97fe3f1f2879054553" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary/80 hover:text-primary truncate"
                  >
                    0xe2d189f6696ee8b247ceae97fe3f1f2879054553
                  </a>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-300">FeeRelayer</span>
                  <a 
                    href="https://bscscan.com/address/0x7ff2271749409f9137dac1e082962e21cc99aee6" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary/80 hover:text-primary truncate"
                  >
                    0x7ff2271749409f9137dac1e082962e21cc99aee6
                  </a>
                </div>
              </div>
            )}
          </div>
          
          {/* Logout button */}
          <div className="mt-auto px-3 mb-5">
            <button 
              onClick={handleLogout}
              className="flex items-center text-gray-400 hover:text-white transition-colors w-full py-2 px-3 rounded-lg hover:bg-white/5"
            >
              <LogOut className="h-5 w-5 mr-2" />
              <span>Disconnect</span>
            </button>
          </div>
        </div>
      </motion.aside>
      
      {/* Main Content */}
      <main className="flex-grow lg:ml-64">
        {/* Top Header */}
        <div className="glass border-0 border-b border-white/5 mb-6">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <h1 className="text-xl font-bold">{title}</h1>
            <div className="flex items-center">
              <div className="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-xs flex items-center mr-3">
                <Activity className="h-3 w-3 mr-1" />
                <span>Mainnet</span>
              </div>
              <div className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs flex items-center">
                <span className="mr-1">•</span>
                <span>Connected</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Alerts for missing contracts */}
        {(!nepaliPayContract || !tokenContract || !feeRelayerContract) && (
          <div className="container mx-auto px-4 mb-6">
            <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-4 flex items-start">
              <AlertCircle className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-red-200">Connection Error</h3>
                <p className="text-red-300 text-sm">
                  One or more smart contracts are not properly connected. Please check your network connection and wallet configuration.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Page Content */}
        <div className="container mx-auto px-4 pb-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;