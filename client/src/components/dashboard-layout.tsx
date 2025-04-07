import React, { ReactNode } from 'react';
import Sidebar from './sidebar';
import MobileNavigation from './mobile-navigation';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          {children}
        </main>
        <MobileNavigation />
      </div>
    </div>
  );
};

export default DashboardLayout;