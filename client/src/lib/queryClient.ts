import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

type ApiRequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export async function apiRequest(
  method: ApiRequestMethod,
  url: string,
  data?: any,
  options?: RequestInit
) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  const requestOptions: RequestInit = {
    method,
    headers,
    credentials: 'include',
    ...options,
  };

  if (data && method !== 'GET') {
    requestOptions.body = JSON.stringify(data);
  }

  return fetch(url, requestOptions);
}

interface GetQueryFnOptions {
  on401?: 'throw' | 'returnNull';
}

export function getQueryFn<TData = unknown>(options: GetQueryFnOptions = {}) {
  return async ({ queryKey }: { queryKey: string[] }): Promise<TData | null> => {
    const endpoint = queryKey[0];
    
    const response = await apiRequest('GET', endpoint);
    
    if (response.status === 401) {
      if (options.on401 === 'returnNull') {
        return null;
      }
      throw new Error('Unauthorized');
    }
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
      throw new Error(error.message || `API Error: ${response.status}`);
    }
    
    return response.json();
  };
}