import { createContext, ReactNode, useContext, useEffect } from "react";
import {
  useQuery,
  useMutation,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import { User, InsertUser } from "../../shared/schema";
import { useToast } from "../hooks/use-toast";
import { apiRequest, queryClient } from "../lib/queryClient";

// Types
type LoginCredentials = {
  username: string;
  password: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginMutation: UseMutationResult<User, Error, LoginCredentials>;
  registerMutation: UseMutationResult<User, Error, InsertUser>;
  logoutMutation: UseMutationResult<void, Error, void>;
  userQuery: UseQueryResult<User | null, Error>;
};

// Create context
export const AuthContext = createContext<AuthContextType | null>(null);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();

  // Fetch current user
  const userQuery = useQuery<User | null, Error>({
    queryKey: ["/api/user"],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/user");
        return await response.json();
      } catch (error: any) {
        if (error.status === 401) {
          // Not authenticated, return null instead of throwing
          return null;
        }
        throw error;
      }
    },
    retry: false,
  });

  // Login mutation
  const loginMutation = useMutation<User, Error, LoginCredentials>({
    mutationFn: async (credentials) => {
      const response = await apiRequest("POST", "/api/login", credentials);
      return await response.json();
    },
    onSuccess: (user) => {
      // Update cache with user data
      queryClient.setQueryData(["/api/user"], user);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.username}!`,
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid username or password",
        variant: "destructive",
      });
    },
  });

  // Register mutation
  const registerMutation = useMutation<User, Error, InsertUser>({
    mutationFn: async (userData) => {
      const response = await apiRequest("POST", "/api/register", userData);
      return await response.json();
    },
    onSuccess: (user) => {
      // Update cache with user data
      queryClient.setQueryData(["/api/user"], user);
      
      toast({
        title: "Registration successful",
        description: `Welcome to NepaliPay, ${user.username}!`,
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Registration failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation<void, Error, void>({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      // Clear user from cache
      queryClient.setQueryData(["/api/user"], null);
      
      // Invalidate queries that depend on authentication
      queryClient.invalidateQueries({ queryKey: ["/api/wallet"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
        variant: "info",
      });
    },
    onError: (error) => {
      toast({
        title: "Logout failed",
        description: error.message || "Failed to log out",
        variant: "destructive",
      });
    },
  });

  // Context value
  const value: AuthContextType = {
    user: userQuery.data || null,
    isLoading: userQuery.isLoading,
    isAuthenticated: !!userQuery.data,
    loginMutation,
    registerMutation,
    logoutMutation,
    userQuery,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};