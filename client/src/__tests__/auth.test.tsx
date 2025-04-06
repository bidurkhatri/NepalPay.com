import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth, AuthProvider } from '../hooks/use-auth';
import { ToastProvider } from '../hooks/use-toast';

// Create a wrapper component that uses the useAuth hook
const TestComponent = () => {
  const { user, isLoading, loginMutation, logoutMutation, registerMutation } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      {user ? (
        <div>
          <p data-testid="user-info">Logged in as: {user.username}</p>
          <button 
            onClick={() => logoutMutation.mutate()}
            data-testid="logout-button"
          >
            Logout
          </button>
        </div>
      ) : (
        <div>
          <p data-testid="login-status">Not logged in</p>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              loginMutation.mutate({ 
                username: 'testuser', 
                password: 'password123'
              });
            }}
          >
            <button type="submit" data-testid="login-button">Login</button>
          </form>
          
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              registerMutation.mutate({ 
                username: 'newuser', 
                password: 'password123',
                email: 'new@example.com',
                firstName: 'New',
                lastName: 'User',
                role: 'USER'
              });
            }}
          >
            <button type="submit" data-testid="register-button">Register</button>
          </form>
        </div>
      )}
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
  
  return render(
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          {ui}
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
};

describe('Auth Hook Integration', () => {
  beforeEach(() => {
    // Clear mock calls between tests
    vi.clearAllMocks();
  });
  
  it('shows loading state initially', () => {
    renderWithProviders(<TestComponent />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
  
  it('shows not logged in when user is null', async () => {
    // Mock the query to return null
    vi.spyOn(global, 'fetch').mockImplementationOnce(() => 
      Promise.resolve({
        ok: false,
        status: 401,
        json: () => Promise.resolve(null),
      } as Response)
    );
    
    renderWithProviders(<TestComponent />);
    
    await waitFor(() => {
      expect(screen.getByTestId('login-status')).toBeInTheDocument();
    });
    
    expect(screen.getByTestId('login-status')).toHaveTextContent('Not logged in');
    expect(screen.getByTestId('login-button')).toBeInTheDocument();
    expect(screen.getByTestId('register-button')).toBeInTheDocument();
  });
  
  it('logs in successfully when login button is clicked', async () => {
    // Mock initial query to return null (not logged in)
    vi.spyOn(global, 'fetch')
      .mockImplementationOnce(() => 
        Promise.resolve({
          ok: false,
          status: 401,
          json: () => Promise.resolve(null),
        } as Response)
      )
      // Mock the login mutation
      .mockImplementationOnce(() => 
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            role: 'USER',
          }),
        } as Response)
      );
    
    renderWithProviders(<TestComponent />);
    
    await waitFor(() => {
      expect(screen.getByTestId('login-button')).toBeInTheDocument();
    });
    
    // Click login button
    fireEvent.click(screen.getByTestId('login-button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('user-info')).toBeInTheDocument();
    });
    
    expect(screen.getByTestId('user-info')).toHaveTextContent('Logged in as: testuser');
  });
  
  it('logs out successfully when logout button is clicked', async () => {
    // Mock initial query to return a user (logged in)
    vi.spyOn(global, 'fetch')
      .mockImplementationOnce(() => 
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            role: 'USER',
          }),
        } as Response)
      )
      // Mock the logout mutation
      .mockImplementationOnce(() => 
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
        } as Response)
      );
    
    renderWithProviders(<TestComponent />);
    
    await waitFor(() => {
      expect(screen.getByTestId('user-info')).toBeInTheDocument();
    });
    
    // Click logout button
    fireEvent.click(screen.getByTestId('logout-button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('login-status')).toBeInTheDocument();
    });
    
    expect(screen.getByTestId('login-status')).toHaveTextContent('Not logged in');
  });
});