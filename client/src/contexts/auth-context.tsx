import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginCredentials, RegisterData } from '@/types';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  isDemoMode: boolean;
  activateDemoMode: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(localStorage.getItem('demo_mode') === 'true');

  const checkAuth = async () => {
    try {
      setLoading(true);

      // If in demo mode, create a demo user
      if (isDemoMode) {
        console.log("Using demo mode authentication");
        setUser({
          id: 999,
          username: 'demo',
          email: 'demo@nepalipay.com',
          firstName: 'Demo',
          lastName: 'User',
          role: 'USER',
          createdAt: new Date().toISOString()
        });
        return;
      }

      const res = await fetch('/api/user', {
        credentials: 'include',
      });

      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      } else {
        // If unauthorized but demo credentials are in localStorage, activate demo mode
        if (localStorage.getItem('demo_credentials') === 'true') {
          activateDemoMode();
        } else {
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Error checking authentication', error);
      // If there's an auth error but demo credentials are stored, use demo mode
      if (localStorage.getItem('demo_credentials') === 'true') {
        activateDemoMode();
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const activateDemoMode = () => {
    console.log("Activating demo mode");
    localStorage.setItem('demo_mode', 'true');
    localStorage.setItem('demo_credentials', 'true');
    setIsDemoMode(true);
    setUser({
      id: 999,
      username: 'demo',
      email: 'demo@nepalipay.com',
      firstName: 'Demo',
      lastName: 'User',
      role: 'USER',
      createdAt: new Date().toISOString()
    });
    
    toast({
      title: "Demo Mode Activated",
      description: "You're using NepaliPay in demo mode. Some features will be simulated.",
    });
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);

      // Special case for demo user
      if (credentials.username === 'demo' && credentials.password === 'password') {
        activateDemoMode();
        return;
      }

      const res = await apiRequest('POST', '/api/login', credentials);
      const userData = await res.json();
      setUser(userData);
      localStorage.setItem('demo_mode', 'false');
      setIsDemoMode(false);
      // Success notification is handled in the login component
    } catch (error) {
      console.error('Login error:', error);
      // Error notification is handled in the login component
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      const res = await apiRequest('POST', '/api/register', data);
      const userData = await res.json();
      setUser(userData);
      localStorage.setItem('demo_mode', 'false');
      setIsDemoMode(false);
      // Success notification is handled in the registration component
    } catch (error) {
      console.error('Registration error:', error);
      // Error notification is handled in the registration component
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      // If in demo mode, just clear local state
      if (isDemoMode) {
        localStorage.removeItem('demo_mode');
        localStorage.removeItem('demo_credentials');
        setIsDemoMode(false);
        setUser(null);
        return;
      }
      
      // Otherwise call the logout API
      await apiRequest('POST', '/api/logout');
      setUser(null);
      // Success notification is handled in the logout component
    } catch (error) {
      console.error('Logout error:', error);
      // In case of error, force logout anyway
      localStorage.removeItem('demo_mode');
      localStorage.removeItem('demo_credentials');
      setIsDemoMode(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        register, 
        logout, 
        checkAuth, 
        isDemoMode, 
        activateDemoMode 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
