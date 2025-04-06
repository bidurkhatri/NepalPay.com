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

// Direct named export for the hook to resolve fast refresh compatibility issues
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

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
          phoneNumber: '+9779876543210',
          createdAt: new Date().toISOString()
        } as User);
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
      phoneNumber: '+9779876543210',
      createdAt: new Date().toISOString()
    } as User);
    
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
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Login failed');
      }
      
      const userData = await res.json();
      setUser(userData);
      localStorage.setItem('demo_mode', 'false');
      setIsDemoMode(false);
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${userData.firstName}!`,
      });
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      const res = await apiRequest('POST', '/api/register', data);
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      
      const userData = await res.json();
      setUser(userData);
      localStorage.setItem('demo_mode', 'false');
      setIsDemoMode(false);
      
      toast({
        title: "Registration Successful",
        description: `Welcome to NepaliPay, ${userData.firstName}!`,
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "Could not create account. Please try again.",
        variant: "destructive",
      });
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
        
        toast({
          title: "Demo Mode Deactivated",
          description: "You've been logged out of demo mode.",
        });
        return;
      }
      
      // Otherwise call the logout API
      await apiRequest('POST', '/api/logout');
      setUser(null);
      
      toast({
        title: "Logout Successful",
        description: "You've been logged out successfully.",
      });
    } catch (error) {
      console.error('Logout error:', error);
      // In case of error, force logout anyway
      localStorage.removeItem('demo_mode');
      localStorage.removeItem('demo_credentials');
      setIsDemoMode(false);
      setUser(null);
      
      toast({
        title: "Logout Completed",
        description: "You've been logged out.",
      });
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
