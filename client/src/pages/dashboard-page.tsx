import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
}

const DashboardPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [, setLocation] = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/user');
        
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          if (res.status === 401) {
            // Unauthorized, redirect to login
            setLocation('/login');
          } else {
            setError('Failed to fetch user data');
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [setLocation]);

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      setLocation('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4">
        <div className="glass-card max-w-md text-center p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button 
            onClick={() => setLocation('/login')}
            className="px-4 py-2 bg-primary text-white rounded-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Header/Navbar */}
      <header className="sticky top-0 z-10 backdrop-blur-lg bg-black/20 border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <h1 className="text-white text-xl font-bold">NepaliPay</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <button
              onClick={handleLogout}
              className="text-gray-300 hover:text-white transition"
            >
              Logout
            </button>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-gray-300">Welcome back</p>
                <p className="text-white font-medium">{user?.username}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-medium">
                {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-white mb-8">Dashboard</h2>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {['Balance', 'Transactions', 'Tokens'].map((item, index) => (
            <div key={index} className="glass-card p-6">
              <h3 className="text-lg font-medium text-gray-300 mb-2">{item}</h3>
              <p className="text-3xl font-bold text-white">
                {index === 0 ? '$1,234.56' : 
                index === 1 ? '24' : '500 NPT'}
              </p>
            </div>
          ))}
        </div>
        
        {/* Quick Actions */}
        <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {['Send Money', 'Buy Tokens', 'Stake Tokens', 'Pay Bills'].map((action, index) => (
            <button 
              key={index}
              className="glass-card p-6 text-center hover:bg-white/5 transition"
              onClick={() => alert(`${action} feature coming soon!`)}
            >
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
                <div className="w-6 h-6 rounded-full bg-blue-500"></div>
              </div>
              <p className="text-white font-medium">{action}</p>
            </button>
          ))}
        </div>
        
        {/* Coming Soon */}
        <div className="glass-card p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-4">Coming Soon</h3>
          <p className="text-gray-300 max-w-2xl mx-auto">
            The full NepaliPay application with blockchain integration, token management, 
            staking, and payment features is currently under development.
          </p>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-6 bg-black/30 backdrop-blur-lg border-t border-white/5">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© 2023 NepaliPay. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;