import { QueryClient } from "@tanstack/react-query";

type RequestOptions = {
  on401?: "returnNull" | "throw" | "redirect";
};

export type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * Create a query function that handles common API request patterns
 */
export function getQueryFn(options: RequestOptions = {}) {
  return async <T>({ queryKey }: { queryKey: string[] }): Promise<T> => {
    const [path] = queryKey;
    try {
      const response = await fetch(path);

      // Handle 401 Unauthorized based on options
      if (response.status === 401) {
        if (options.on401 === "redirect") {
          window.location.href = "/auth";
          return null as T;
        } else if (options.on401 === "returnNull") {
          return null as T;
        } else {
          throw new Error("Unauthorized");
        }
      }

      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${path}:`, error);
      throw error;
    }
  };
}

/**
 * Make an API request with the specified method
 */
export async function apiRequest(
  method: HTTPMethod,
  url: string,
  data?: any,
  headers?: HeadersInit
) {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: "include", // Include cookies for authentication
  };

  if (data && method !== "GET") {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with status: ${response.status}`);
  }

  return response;
}

/**
 * Create and configure the QueryClient
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
      queryFn: getQueryFn({ on401: "redirect" }),
    },
  },
});