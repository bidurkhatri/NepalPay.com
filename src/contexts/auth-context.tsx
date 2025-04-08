import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
  QueryClient,
} from "@tanstack/react-query";
import { User } from "../../shared/schema";
import { useToast } from "../hooks/use-toast";

// API request helpers
const API_BASE_URL = "/api";

type ApiRequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export async function apiRequest(
  method: ApiRequestMethod,
  endpoint: string,
  data?: any
) {
  const url = `${API_BASE_URL}${endpoint}`;
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Request failed with status ${response.status}`);
  }

  return response;
}

// Query client setup for central management
export const queryClient = {
  invalidateQueries: async (queryKey: string | string[]) => {
    // This is deliberately simple for now; can be expanded later
    const key = Array.isArray(queryKey) ? queryKey : [queryKey];
    // @ts-ignore - We're using the actual react-query client's invalidate behind the scenes
    await window.__reactQueryClient?.invalidateQueries(key);
  },
  setQueryData: <T>(queryKey: string | string[], data: T) => {
    const key = Array.isArray(queryKey) ? queryKey : [queryKey];
    // @ts-ignore - We're using the actual react-query client's setQueryData behind the scenes
    window.__reactQueryClient?.setQueryData(key, data);
  }
};

// Helper for creating query function
export function getQueryFn(options: { on401?: "throw" | "returnNull" } = {}) {
  const { on401 = "throw" } = options;

  return async ({ queryKey }: { queryKey: [string, ...any[]] }) => {
    const [endpoint, ..._params] = queryKey;

    // Build URL with any params if needed
    let url = endpoint;
    
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.status === 401) {
        if (on401 === "returnNull") {
          return null;
        } else {
          throw new Error("Unauthorized");
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return response.json();
      }
      
      return null;
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      throw error;
    }
  };
}

// Auth types
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<User, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<User, Error, RegisterData>;
};

type LoginData = {
  username: string;
  password: string;
};

type RegisterData = {
  username: string;
  password: string;
  email: string;
  fullName?: string;
};

// Create Auth Context
export const AuthContext = createContext<AuthContextType | null>(null);

// Auth Provider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  
  // Fetch current user
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User | null, Error>({
    queryKey: ["/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/login", credentials);
      return await res.json();
    },
    onSuccess: (user: User) => {
      queryClient.setQueryData("/user", user);
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.username}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      const res = await apiRequest("POST", "/register", data);
      return await res.json();
    },
    onSuccess: (user: User) => {
      queryClient.setQueryData("/user", user);
      toast({
        title: "Registration successful",
        description: `Welcome to NepaliPay, ${user.username}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData("/user", null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook for using the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}