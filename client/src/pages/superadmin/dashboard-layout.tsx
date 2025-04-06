import React, { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  ShieldAlert,
  BarChart3,
  Users,
  Banknote,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Cpu,
  TriangleAlert,
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const [location] = useLocation();
  const { logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  // Sidebar navigation items
  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/superadmin/dashboard' },
    { icon: <ShieldAlert size={20} />, label: 'Stability', href: '/superadmin/stability' },
    { icon: <Users size={20} />, label: 'Admins', href: '/superadmin/admins' },
    { icon: <Banknote size={20} />, label: 'Finance', href: '/superadmin/finance' },
    { icon: <BarChart3 size={20} />, label: 'Analytics', href: '/superadmin/analytics' },
    { icon: <Cpu size={20} />, label: 'Performance', href: '/superadmin/performance' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  // Animation variants
  const sidebarVariants = {
    expanded: { width: 'auto', minWidth: '240px', transition: { duration: 0.3 } },
    collapsed: { width: 'auto', minWidth: '76px', transition: { duration: 0.3 } },
  };

  const itemTextVariants = {
    expanded: { opacity: 1, display: 'block', transition: { duration: 0.2, delay: 0.1 } },
    collapsed: { opacity: 0, display: 'none', transition: { duration: 0.2 } },
  };

  return (
    <div className="flex h-screen bg-transparent">
      {/* Sidebar */}
      <motion.div
        className="sidebar-nav relative h-full flex flex-col shadow-xl"
        variants={sidebarVariants}
        animate={sidebarCollapsed ? 'collapsed' : 'expanded'}
        initial={false}
      >
        {/* Logo and collapse button */}
        <div className="flex items-center justify-between mb-8 pl-2 pr-2">
          <div className="flex items-center py-2">
            <div className="rounded-full bg-primary/10 p-1 mr-3">
              <TriangleAlert size={24} className="text-primary" />
            </div>
            <motion.div
              className="font-semibold text-lg"
              variants={itemTextVariants}
              animate={sidebarCollapsed ? 'collapsed' : 'expanded'}
              initial={false}
            >
              Admin Portal
            </motion.div>
          </div>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className={`sidebar-item ${
                    location === item.href ? 'active' : ''
                  } flex items-center`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  <motion.span
                    className="ml-3 whitespace-nowrap"
                    variants={itemTextVariants}
                    animate={sidebarCollapsed ? 'collapsed' : 'expanded'}
                    initial={false}
                  >
                    {item.label}
                  </motion.span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar footer */}
        <div className="mt-auto pt-4 px-2 border-t border-white/5">
          <Link 
            href="/superadmin/settings"
            className="sidebar-item flex items-center mb-2"
          >
            <Settings size={20} />
            <motion.span
              className="ml-3"
              variants={itemTextVariants}
              animate={sidebarCollapsed ? 'collapsed' : 'expanded'}
              initial={false}
            >
              Settings
            </motion.span>
          </Link>
          <button
            onClick={handleLogout}
            className="sidebar-item w-full text-left flex items-center"
          >
            <LogOut size={20} />
            <motion.span
              className="ml-3"
              variants={itemTextVariants}
              animate={sidebarCollapsed ? 'collapsed' : 'expanded'}
              initial={false}
            >
              Logout
            </motion.span>
          </button>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto p-6">
        {title && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;