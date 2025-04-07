import { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth as useBaseAuth } from '@/hooks/use-auth';
import { User } from '@shared/schema';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: {
    username: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    password: string;
    walletAddress?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  error: Error | null;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [, setLocation] = useLocation();
  const {
    user,
    isLoading,
    error,
    loginMutation,
    registerMutation,
    logoutMutation,
  } = useBaseAuth();

  // Computed authenticated state
  const isAuthenticated = !!user;

  // Login function
  const login = async (username: string, password: string) => {
    try {
      await loginMutation.mutateAsync({ username, password });
      setLocation('/');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  // Register function
  const register = async (userData: {
    username: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    password: string;
    walletAddress?: string;
  }) => {
    try {
      await registerMutation.mutateAsync(userData);
      setLocation('/');
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
      setLocation('/auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

// Export useAuth as alias to useAuthContext for backward compatibility
export const useAuth = useAuthContext;

export default AuthContext;