import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';
import { AuthProvider } from './contexts/auth-context';
import { BlockchainProvider } from './contexts/blockchain-context';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from './components/ui/toaster';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="nepalipay-theme">
        <BlockchainProvider>
          <AuthProvider>
            <App />
            <Toaster />
          </AuthProvider>
        </BlockchainProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);