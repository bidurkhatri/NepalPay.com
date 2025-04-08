import { QueryClient } from "@tanstack/react-query";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface FetchOptions {
  on401?: "throw" | "returnNull";
}

/**
 * Create a query client with default settings
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Make an API request with proper error handling
 */
export async function apiRequest(
  method: RequestMethod,
  endpoint: string,
  body?: any,
  headers?: HeadersInit
) {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: "include",
  };

  if (body && method !== "GET") {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(endpoint, options);

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage;

    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorJson.error || `Error: ${response.status}`;
    } catch (e) {
      errorMessage = errorText || `Error: ${response.status}`;
    }

    const error = new Error(errorMessage);
    (error as any).status = response.status;
    throw error;
  }

  // Check if response is empty or not JSON
  const contentType = response.headers.get("content-type");
  if (response.status === 204 || !contentType || !contentType.includes("application/json")) {
    return response;
  }

  return response;
}

/**
 * Create a query function with error handling
 */
export function getQueryFn({ on401 = "throw" }: FetchOptions = {}) {
  return async ({ queryKey }: { queryKey: string[] }) => {
    const [endpoint] = queryKey;

    try {
      const response = await apiRequest("GET", endpoint);
      
      if (response.status === 204) {
        return null;
      }
      
      return await response.json();
    } catch (error: any) {
      if (error.status === 401 && on401 === "returnNull") {
        return null;
      }
      throw error;
    }
  };
}