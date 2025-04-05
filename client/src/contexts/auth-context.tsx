import React, { createContext, useContext, useState, useEffect } from 'react';
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

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/user', {
        credentials: 'include',
      });

      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking authentication', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      const res = await apiRequest('POST', '/api/login', credentials);
      const userData = await res.json();
      setUser(userData);
      // Success notification is handled in the login component
    } catch (error) {
      console.error('Login error', error);
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
      // Success notification is handled in the registration component
    } catch (error) {
      console.error('Registration error', error);
      // Error notification is handled in the registration component
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
      // Success notification is handled in the logout component
    } catch (error) {
      console.error('Logout error', error);
      // Error notification is handled in the logout component
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
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
