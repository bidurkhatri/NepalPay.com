import React from 'react';
import Sidebar from '@/components/sidebar';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children,
  className 
}) => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className={cn("flex-1 overflow-auto p-6", className)}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;