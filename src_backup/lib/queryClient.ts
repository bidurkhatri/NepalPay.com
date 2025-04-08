import { QueryClient } from '@tanstack/react-query';

// Default retry function that excludes 401, 403 errors and others that shouldn't be retried
function defaultRetryFn(failureCount: number, error: unknown) {
  if (
    error instanceof Error &&
    typeof error.message === 'string' &&
    (error.message.includes('401') || error.message.includes('403'))
  ) {
    return false;
  }
  return failureCount < 3;
}

// Create a client with global defaults
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: defaultRetryFn,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5 // 5 minutes
    },
    mutations: {
      retry: defaultRetryFn
    }
  }
});

/**
 * The apiRequest is a wrapper around fetch that sets the
 * credentials and headers correctly.
 */
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown
): Promise<Response> {
  const options: RequestInit = {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (data && method !== 'GET') {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);
  
  if (response.status === 401) {
    throw new Error('401: Unauthorized');
  }
  
  if (response.status === 403) {
    throw new Error('403: Forbidden');
  }
  
  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(`${response.status}: ${errorJson.message || 'Unknown error'}`);
  }
  
  return response;
}

// QueryFn that uses apiRequest 
export function getQueryFn({ on401 = 'throw' }: { on401?: 'throw' | 'returnNull' } = {}) {
  return async ({ queryKey }: { queryKey: string | string[] }) => {
    try {
      const url = Array.isArray(queryKey) ? queryKey[0] : queryKey;
      const response = await apiRequest('GET', url);
      return await response.json();
    } catch (error) {
      if (error instanceof Error && error.message.includes('401') && on401 === 'returnNull') {
        return null;
      }
      throw error;
    }
  };
}