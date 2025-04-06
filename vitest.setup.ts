import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// Mock global fetch for all tests
const server = setupServer(
  // Default handlers for API endpoints
  http.get('/api/user', () => {
    return HttpResponse.json({
      id: 1,
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      role: 'USER',
      kycStatus: 'VERIFIED',
    }, { status: 200 });
  }),
  http.post('/api/login', () => {
    return HttpResponse.json({
      id: 1,
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      role: 'USER',
    }, { status: 200 });
  }),
  http.post('/api/register', () => {
    return HttpResponse.json({
      id: 1,
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      role: 'USER',
    }, { status: 201 });
  }),
  http.post('/api/logout', () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.post('/api/create-payment-intent', () => {
    return HttpResponse.json({
      clientSecret: 'pi_test123456789_secret_987654321',
    }, { status: 200 });
  }),
  http.get('/api/wallet/:userId', () => {
    return HttpResponse.json({
      id: 1,
      userId: 1,
      balance: '5000',
      currency: 'NPT',
      walletAddress: '0x1234567890123456789012345678901234567890',
    }, { status: 200 });
  }),
  http.get('/api/transactions/:userId', () => {
    return HttpResponse.json([
      {
        id: 1,
        senderId: 1,
        receiverId: null,
        amount: '500',
        type: 'MOBILE_TOPUP',
        status: 'COMPLETED',
        note: 'Mobile recharge',
        txHash: '0xabcdef1234567890',
        createdAt: new Date().toISOString(),
      },
    ], { status: 200 });
  })
);

// Define Ethereum provider interface
interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, callback: (...args: any[]) => void) => void;
  removeListener: (event: string, callback: (...args: any[]) => void) => void;
  isMetaMask?: boolean;
}

// Extend Window interface
declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

beforeAll(() => {
  // Start the mock server
  server.listen();
  
  // Mock window.ethereum for web3 tests
  const ethereumMock: EthereumProvider = {
    request: vi.fn().mockImplementation(async ({ method, params }) => {
      if (method === 'eth_requestAccounts') {
        return ['0x1234567890123456789012345678901234567890'];
      }
      if (method === 'eth_getBalance') {
        return '0x1000000000000000000';
      }
      if (method === 'eth_chainId') {
        return '0x38'; // BSC mainnet
      }
      return null;
    }),
    on: vi.fn(),
    removeListener: vi.fn(),
    isMetaMask: true,
  };
  
  // Assign to window object
  if (global.window) {
    global.window.ethereum = ethereumMock;
  }
  
  // Mock environment variables
  vi.stubEnv('VITE_STRIPE_PUBLIC_KEY', 'pk_test_123456789');
});

afterEach(() => {
  // Reset request handlers
  server.resetHandlers();
  
  // Clear all mocks
  vi.clearAllMocks();
});

afterAll(() => {
  // Clean up
  server.close();
});

// Mock browser APIs
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));