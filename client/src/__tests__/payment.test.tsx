import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '../hooks/use-toast';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Mock the loadStripe function
vi.mock('@stripe/stripe-js', () => {
  return {
    loadStripe: vi.fn(() => Promise.resolve({
      elements: vi.fn(() => ({
        create: vi.fn(() => ({
          mount: vi.fn(),
          unmount: vi.fn(),
          on: vi.fn(),
          update: vi.fn(),
        })),
      })),
      confirmPayment: vi.fn(() => Promise.resolve({ paymentIntent: { status: 'succeeded' } })),
    })),
  };
});

// Create a simple test payment component
const TestPaymentComponent = () => {
  const handlePayment = async () => {
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 1000 }),
      });
      
      const data = await response.json();
      
      if (data.clientSecret) {
        document.getElementById('payment-status')!.textContent = 'Ready for payment';
      }
    } catch (error) {
      document.getElementById('payment-status')!.textContent = 'Error: ' + (error as Error).message;
    }
  };
  
  return (
    <div>
      <h1>Payment Test</h1>
      <div id="payment-status">Not started</div>
      <button 
        onClick={handlePayment}
        data-testid="start-payment"
      >
        Start Payment
      </button>
    </div>
  );
};

// Create a wrapper for the component with providers
const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  // Mock Stripe elements
  const stripePromise = loadStripe('fake-publishable-key');
  
  return render(
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <Elements stripe={stripePromise} options={{ clientSecret: 'fake-client-secret' }}>
          {ui}
        </Elements>
      </ToastProvider>
    </QueryClientProvider>
  );
};

describe('Payment Integration', () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Set up DOM element for payment status
    document.body.innerHTML = '<div id="payment-status">Not started</div>';
  });
  
  it('initializes the payment component', async () => {
    renderWithProviders(<TestPaymentComponent />);
    
    expect(screen.getByTestId('start-payment')).toBeInTheDocument();
    expect(document.getElementById('payment-status')?.textContent).toBe('Not started');
  });
  
  it('creates a payment intent when start button is clicked', async () => {
    // Mock the fetch function for payment intent creation
    vi.spyOn(global, 'fetch').mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
          clientSecret: 'pi_test123456789_secret_987654321',
        }),
      } as Response)
    );
    
    renderWithProviders(<TestPaymentComponent />);
    
    // Click the start payment button
    fireEvent.click(screen.getByTestId('start-payment'));
    
    await waitFor(() => {
      expect(document.getElementById('payment-status')?.textContent).toBe('Ready for payment');
    });
    
    // Verify the fetch was called with the correct data
    expect(global.fetch).toHaveBeenCalledWith('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 1000 }),
    });
  });
  
  it('handles payment intent creation errors', async () => {
    // Mock fetch to reject with an error
    vi.spyOn(global, 'fetch').mockImplementationOnce(() => 
      Promise.reject(new Error('Network error'))
    );
    
    renderWithProviders(<TestPaymentComponent />);
    
    // Click the start payment button
    fireEvent.click(screen.getByTestId('start-payment'));
    
    await waitFor(() => {
      expect(document.getElementById('payment-status')?.textContent).toBe('Error: Network error');
    });
  });
});