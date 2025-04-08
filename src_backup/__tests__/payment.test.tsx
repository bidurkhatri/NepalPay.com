import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Router } from 'wouter';
import { ToastProvider } from '@/hooks/use-toast';
import { AuthProvider } from '@/hooks/use-auth';
import BuyTokensPage from '@/pages/buy-tokens';
import PaymentSuccessPage from '@/pages/payment-success';

// Mock all Stripe components and hooks
vi.mock('@stripe/react-stripe-js', () => ({
  useStripe: vi.fn(),
  useElements: vi.fn(),
  Elements: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PaymentElement: () => <div data-testid="payment-element">Payment Form</div>,
}));

// Mock the Stripe loader
vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn().mockResolvedValue({
    elements: vi.fn().mockReturnValue({
      create: vi.fn(),
      getElement: vi.fn(),
    }),
  }),
}));

// Mock the apiRequest function from queryClient
vi.mock('@/lib/queryClient', () => ({
  apiRequest: vi.fn(),
  queryClient: {
    setQueryData: vi.fn(),
    invalidateQueries: vi.fn(),
  },
  getQueryFn: vi.fn(),
}));

// Mock BlockchainContext
vi.mock('@/contexts/blockchain-context', () => ({
  useBlockchain: vi.fn().mockReturnValue({
    connectWallet: vi.fn(),
    walletAddress: '0x1234567890123456789012345678901234567890',
    isConnected: true,
    tokenBalance: '100.0',
    getTokenBalance: vi.fn(),
  }),
}));

// Import the mocked modules
import { apiRequest } from '@/lib/queryClient';
import { useStripe, useElements } from '@stripe/react-stripe-js';

// Create a test wrapper
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <Router>{children}</Router>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
};

describe('BuyTokens Page', () => {
  beforeEach(() => {
    // Reset all mocks
    vi.resetAllMocks();
    
    // Mock successful client secret API response
    vi.mocked(apiRequest).mockImplementation(async (method, url, body) => {
      if (method === 'POST' && url === '/api/create-payment-intent') {
        return {
          status: 200,
          json: () => Promise.resolve({ clientSecret: 'test_client_secret' }),
        };
      }
      return {
        status: 404,
        json: () => Promise.resolve({}),
      };
    });
    
    // Mock Stripe hooks
    vi.mocked(useStripe).mockReturnValue({
      confirmPayment: vi.fn().mockResolvedValue({ error: null }),
    });
    
    vi.mocked(useElements).mockReturnValue({
      getElement: vi.fn(),
    });
  });
  
  it('should render the buy tokens form', async () => {
    render(
      <TestWrapper>
        <BuyTokensPage />
      </TestWrapper>
    );
    
    // Check that the page renders with token amount input
    await waitFor(() => {
      expect(screen.getByText(/Buy NPT Tokens/i, { exact: false })).toBeInTheDocument();
      expect(screen.getByLabelText(/Token Amount/i, { exact: false })).toBeInTheDocument();
    });
  });
  
  it('should calculate fees correctly', async () => {
    render(
      <TestWrapper>
        <BuyTokensPage />
      </TestWrapper>
    );
    
    // Find the token amount input
    const amountInput = await screen.findByLabelText(/Token Amount/i, { exact: false });
    
    // Enter a token amount
    await userEvent.clear(amountInput);
    await userEvent.type(amountInput, '100');
    
    // Verify that fees are calculated and displayed
    await waitFor(() => {
      expect(screen.getByText(/Token Cost/i, { exact: false })).toBeInTheDocument();
      expect(screen.getByText(/Gas Fee/i, { exact: false })).toBeInTheDocument();
      expect(screen.getByText(/Service Fee/i, { exact: false })).toBeInTheDocument();
      expect(screen.getByText(/Total Cost/i, { exact: false })).toBeInTheDocument();
    });
  });
  
  it('should create a payment intent when the form is submitted', async () => {
    render(
      <TestWrapper>
        <BuyTokensPage />
      </TestWrapper>
    );
    
    // Find the token amount input
    const amountInput = await screen.findByLabelText(/Token Amount/i, { exact: false });
    
    // Enter a token amount
    await userEvent.clear(amountInput);
    await userEvent.type(amountInput, '100');
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Continue to Payment/i });
    await userEvent.click(submitButton);
    
    // Verify that the API was called to create a payment intent
    await waitFor(() => {
      expect(apiRequest).toHaveBeenCalledWith('POST', '/api/create-payment-intent', expect.objectContaining({
        amount: expect.any(Number),
        walletAddress: '0x1234567890123456789012345678901234567890',
      }));
    });
  });
});

describe('PaymentSuccess Page', () => {
  beforeEach(() => {
    // Reset all mocks
    vi.resetAllMocks();
  });
  
  it('should render the payment success page', async () => {
    // Mock URL search params to include payment_intent and payment_intent_client_secret
    Object.defineProperty(window, 'location', {
      value: {
        search: '?payment_intent=pi_123&payment_intent_client_secret=cs_123',
        pathname: '/payment-success',
      },
      writable: true,
    });
    
    // Mock the API request for getting transaction details
    vi.mocked(apiRequest).mockImplementation(async (method, url) => {
      if (url.includes('/api/payment/')) {
        return {
          status: 200,
          json: () => Promise.resolve({
            id: 'pi_123',
            status: 'succeeded',
            amount: 10000, // $100.00 in cents
            walletAddress: '0x1234567890123456789012345678901234567890',
            tokenAmount: '100',
            txHash: '0xabcdef1234567890',
          }),
        };
      }
      return {
        status: 404,
        json: () => Promise.resolve({}),
      };
    });
    
    render(
      <TestWrapper>
        <PaymentSuccessPage />
      </TestWrapper>
    );
    
    // Check that the success page renders with correct details
    await waitFor(() => {
      expect(screen.getByText(/Payment Successful/i, { exact: false })).toBeInTheDocument();
      expect(screen.getByText(/100 NPT/i, { exact: false })).toBeInTheDocument();
      expect(screen.getByText(/0x1234/i, { exact: false })).toBeInTheDocument(); // Shortened wallet address
      expect(screen.getByText(/Transaction Hash/i, { exact: false })).toBeInTheDocument();
      expect(screen.getByText(/0xabcdef/i, { exact: false })).toBeInTheDocument(); // Shortened tx hash
    });
  });
  
  it('should handle errors gracefully if payment fails', async () => {
    // Mock URL search params for a failed payment
    Object.defineProperty(window, 'location', {
      value: {
        search: '?payment_intent=pi_123&payment_intent_client_secret=cs_123&redirect_status=failed',
        pathname: '/payment-success',
      },
      writable: true,
    });
    
    // Mock the API request to return a failed payment
    vi.mocked(apiRequest).mockImplementation(async (method, url) => {
      if (url.includes('/api/payment/')) {
        return {
          status: 200,
          json: () => Promise.resolve({
            id: 'pi_123',
            status: 'failed',
            error: 'Payment was declined',
          }),
        };
      }
      return {
        status: 404,
        json: () => Promise.resolve({}),
      };
    });
    
    render(
      <TestWrapper>
        <PaymentSuccessPage />
      </TestWrapper>
    );
    
    // Check that error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/Payment Failed/i, { exact: false })).toBeInTheDocument();
      expect(screen.getByText(/Payment was declined/i, { exact: false })).toBeInTheDocument();
    });
  });
});