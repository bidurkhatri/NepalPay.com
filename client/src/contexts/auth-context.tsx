import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { User, LoginCredentials, RegisterData } from '@/types';
import { apiRequest } from '@/lib/queryClient';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  console.log("AuthProvider initialized");

  const checkAuth = async () => {
    console.log("Checking authentication status");
    try {
      setLoading(true);
      const res = await fetch('/api/user', {
        credentials: 'include',
      });

      console.log("Auth check response status:", res.status);
      
      if (res.ok) {
        const userData = await res.json();
        console.log("User authenticated:", userData);
        setUser(userData);
      } else {
        console.log("User not authenticated");
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking authentication', error);
      setUser(null);
    } finally {
      console.log("Authentication check complete, loading set to false");
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      const res = await apiRequest('POST', '/api/login', credentials);
      const userData = await res.json();
      setUser(userData);
      toast({
        title: 'Login successful',
        description: `Welcome back, ${userData.firstName}!`,
      });
    } catch (error) {
      console.error('Login error', error);
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'Invalid credentials',
        variant: 'destructive',
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
      const userData = await res.json();
      setUser(userData);
      toast({
        title: 'Registration successful',
        description: `Welcome, ${userData.firstName}!`,
      });
    } catch (error) {
      console.error('Registration error', error);
      toast({
        title: 'Registration failed',
        description: error instanceof Error ? error.message : 'Could not create account',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await apiRequest('POST', '/api/logout');
      setUser(null);
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out',
      });
    } catch (error) {
      console.error('Logout error', error);
      toast({
        title: 'Logout failed',
        description: 'Could not log out. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
