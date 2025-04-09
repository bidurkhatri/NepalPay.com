import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export async function apiRequest(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  url: string,
  body?: any
) {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Important for auth cookies
  };

  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Request failed with status ${response.status}`);
  }

  return response;
}

export function getQueryFn(options?: { on401: 'throw' | 'returnNull' }) {
  return async ({ queryKey }: { queryKey: string | string[] }) => {
    const path = Array.isArray(queryKey) ? queryKey[0] : queryKey;
    
    try {
      const response = await apiRequest('GET', path);
      
      // Handle empty responses
      if (response.status === 204) {
        return null;
      }
      
      return await response.json();
    } catch (error: any) {
      // Handle unauthorized
      if (
        error.message?.includes('401') &&
        options?.on401 === 'returnNull'
      ) {
        return null;
      }
      throw error;
    }
  };
}