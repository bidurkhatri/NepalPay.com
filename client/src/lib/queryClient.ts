import { QueryClient } from "@tanstack/react-query";

/**
 * Creates a new client-side API request
 * 
 * @param method The HTTP method to use
 * @param path The API path
 * @param body The request body, if any
 * @param options Additional fetch options
 * @returns A promise resolving to the fetch response
 */
export async function apiRequest(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  path: string,
  body?: any,
  options: RequestInit = {}
): Promise<Response> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const config: RequestInit = {
    method,
    headers,
    credentials: "include",
    ...options,
  };

  if (body !== undefined) {
    config.body = JSON.stringify(body);
  }

  return fetch(path, config);
}

/**
 * Function for fetching data in TanStack Query
 * Handles API error responses and provides typed data
 */
export const defaultFetcher = async ({ 
  queryKey,
  signal
}: {
  queryKey: readonly unknown[];
  signal?: AbortSignal;
}) => {
  if (!Array.isArray(queryKey) || !queryKey.length) {
    throw new Error("Invalid queryKey");
  }

  const endpoint = queryKey[0] as string;
  const res = await apiRequest("GET", endpoint, undefined, { signal });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `Error ${res.status}: ${res.statusText}`);
  }

  return res.json();
};

/**
 * TanStack Query client with default configuration
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultFetcher,
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      retryDelay: 1000,
    },
  },
});