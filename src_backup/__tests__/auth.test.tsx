import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Router } from 'wouter';
import { AuthProvider, useAuth } from '@/hooks/use-auth';
import { ToastProvider } from '@/hooks/use-toast';
import AuthPage from '@/pages/auth-page';

// Mock the apiRequest function from queryClient
vi.mock('@/lib/queryClient', () => ({
  apiRequest: vi.fn(),
  queryClient: {
    setQueryData: vi.fn(),
    invalidateQueries: vi.fn(),
  },
  getQueryFn: vi.fn(),
}));

// Import the mocked module
import { apiRequest, queryClient } from '@/lib/queryClient';

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

// Test component that uses the auth hook
const TestAuthComponent = () => {
  const { user, isLoading, loginMutation, registerMutation, logoutMutation } = useAuth();

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : user ? (
        <div>
          <p>Logged in as {user.username}</p>
          <button onClick={() => logoutMutation.mutate()}>Logout</button>
        </div>
      ) : (
        <div>
          <p>Not logged in</p>
          <button
            onClick={() =>
              loginMutation.mutate({ username: 'testuser', password: 'password' })
            }
          >
            Login
          </button>
          <button
            onClick={() =>
              registerMutation.mutate({
                username: 'newuser',
                email: 'user@example.com',
                password: 'password',
                role: 'user',
                firstname: 'Test',
                lastname: 'User',
                phone_number: '1234567890',
                created_at: new Date(),
              })
            }
          >
            Register
          </button>
        </div>
      )}
    </div>
  );
};

describe('Auth Hook', () => {
  beforeEach(() => {
    // Reset the mocks
    vi.resetAllMocks();
    
    // Mock the user query to initially return no user
    vi.mocked(apiRequest).mockResolvedValue({
      status: 401,
      json: () => Promise.resolve(null),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should show not logged in when no user is available', async () => {
    render(
      <TestWrapper>
        <TestAuthComponent />
      </TestWrapper>
    );

    // First we see loading
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Then we see not logged in
    await waitFor(() => {
      expect(screen.getByText('Not logged in')).toBeInTheDocument();
    });
  });

  it('should handle login flow correctly', async () => {
    // Mock successful login
    const mockUser = { id: 1, username: 'testuser', role: 'user' };
    vi.mocked(apiRequest).mockImplementation(async (method, url) => {
      if (method === 'POST' && url === '/api/login') {
        return {
          status: 200,
          json: () => Promise.resolve(mockUser),
        };
      }
      return {
        status: 401,
        json: () => Promise.resolve(null),
      };
    });

    render(
      <TestWrapper>
        <TestAuthComponent />
      </TestWrapper>
    );

    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.getByText('Not logged in')).toBeInTheDocument();
    });

    // Click login button
    const loginButton = screen.getByText('Login');
    await userEvent.click(loginButton);

    // Mock that queryClient now returns the user
    vi.mocked(apiRequest).mockImplementation(async (method, url) => {
      return {
        status: 200,
        json: () => Promise.resolve(mockUser),
      };
    });

    vi.mocked(queryClient.setQueryData).mockImplementation((key, data) => {
      if (key === ['/api/user']) {
        return mockUser;
      }
      return null;
    });

    // Verify login mutation was called
    expect(apiRequest).toHaveBeenCalledWith('POST', '/api/login', {
      username: 'testuser',
      password: 'password',
    });

    // Verify the query client was updated
    expect(queryClient.setQueryData).toHaveBeenCalled();
  });

  it('should handle registration flow correctly', async () => {
    // Mock successful registration
    const mockUser = {
      id: 1,
      username: 'newuser',
      email: 'user@example.com',
      role: 'user',
      firstname: 'Test',
      lastname: 'User',
    };
    
    vi.mocked(apiRequest).mockImplementation(async (method, url) => {
      if (method === 'POST' && url === '/api/register') {
        return {
          status: 201,
          json: () => Promise.resolve(mockUser),
        };
      }
      return {
        status: 401,
        json: () => Promise.resolve(null),
      };
    });

    render(
      <TestWrapper>
        <TestAuthComponent />
      </TestWrapper>
    );

    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.getByText('Not logged in')).toBeInTheDocument();
    });

    // Click register button
    const registerButton = screen.getByText('Register');
    await userEvent.click(registerButton);

    // Mock that queryClient now returns the user
    vi.mocked(apiRequest).mockImplementation(async (method, url) => {
      return {
        status: 200,
        json: () => Promise.resolve(mockUser),
      };
    });

    vi.mocked(queryClient.setQueryData).mockImplementation((key, data) => {
      if (key === ['/api/user']) {
        return mockUser;
      }
      return null;
    });

    // Verify registration mutation was called
    expect(apiRequest).toHaveBeenCalledWith('POST', '/api/register', {
      username: 'newuser',
      email: 'user@example.com',
      password: 'password',
      role: 'user',
      firstname: 'Test',
      lastname: 'User',
      phone_number: '1234567890',
      created_at: expect.any(Date),
    });

    // Verify the query client was updated
    expect(queryClient.setQueryData).toHaveBeenCalled();
  });

  it('should handle logout flow correctly', async () => {
    // Mock logged in user initially
    const mockUser = { id: 1, username: 'testuser', role: 'user' };
    vi.mocked(apiRequest).mockResolvedValue({
      status: 200,
      json: () => Promise.resolve(mockUser),
    });

    // Set up the logout mock
    const logoutMock = vi.fn().mockResolvedValue({
      status: 200,
    });

    vi.mocked(apiRequest).mockImplementation(async (method, url) => {
      if (method === 'POST' && url === '/api/logout') {
        logoutMock();
        return {
          status: 200,
          json: () => Promise.resolve({}),
        };
      }
      return {
        status: 200,
        json: () => Promise.resolve(mockUser),
      };
    });

    render(
      <TestWrapper>
        <TestAuthComponent />
      </TestWrapper>
    );

    // Wait for the component to show logged in state
    await waitFor(() => {
      expect(screen.getByText('Logged in as testuser')).toBeInTheDocument();
    });

    // Mock that queryClient now returns null for user
    vi.mocked(queryClient.setQueryData).mockImplementation((key, data) => {
      if (key === ['/api/user']) {
        return null;
      }
      return data;
    });

    // Click logout button
    const logoutButton = screen.getByText('Logout');
    await userEvent.click(logoutButton);

    // Verify logout mutation was called
    expect(logoutMock).toHaveBeenCalled();
    expect(queryClient.setQueryData).toHaveBeenCalled();
  });
});

describe('Auth Page', () => {
  beforeEach(() => {
    // Reset the mocks
    vi.resetAllMocks();
    
    // Mock the user query to initially return no user
    vi.mocked(apiRequest).mockResolvedValue({
      status: 401,
      json: () => Promise.resolve(null),
    });
  });

  it('should render the login form by default', async () => {
    render(
      <TestWrapper>
        <AuthPage />
      </TestWrapper>
    );

    // Wait for the component to render
    await waitFor(() => {
      expect(screen.getByText(/Welcome back/i, { exact: false })).toBeInTheDocument();
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    });
  });

  it('should allow switching to registration form', async () => {
    render(
      <TestWrapper>
        <AuthPage />
      </TestWrapper>
    );

    // Wait for the component to render
    await waitFor(() => {
      expect(screen.getByText(/Welcome back/i, { exact: false })).toBeInTheDocument();
    });

    // Find and click the "Register" or "Sign up" link
    const registerLink = screen.getByText(/don't have an account/i, { exact: false }) ||
                        screen.getByText(/sign up/i, { exact: false }) ||
                        screen.getByText(/register/i, { exact: false });
    
    if (registerLink) {
      await userEvent.click(registerLink);
    
      // Check if registration form is displayed
      await waitFor(() => {
        expect(screen.getByText(/Create an account/i, { exact: false })).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
      });
    }
  });
});