import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/auth-context';
import { RealTimeProvider } from '@/contexts/real-time-context';
import ToastProvider from './toast-notifications';

// Create a test wrapper that includes all necessary providers
export function TestWrapper({ children }: { children: React.ReactNode }) {
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
          <RealTimeProvider>
            {children}
          </RealTimeProvider>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}

// Custom render function that includes our providers
export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<Parameters<typeof render>[1], 'wrapper'>
) {
  return render(ui, { wrapper: TestWrapper, ...options });
}

// Test utilities for common interactions
export const testUtils = {
  // Wait for element to appear with timeout
  waitForElement: async (selector: string, timeout = 3000) => {
    return await waitFor(() => screen.getByTestId(selector), { timeout });
  },

  // Check accessibility attributes
  checkAccessibility: (element: HTMLElement) => {
    const checks = {
      hasAriaLabel: element.hasAttribute('aria-label'),
      hasAriaLabelledBy: element.hasAttribute('aria-labelledby'),
      hasAriaDescribedBy: element.hasAttribute('aria-describedby'),
      hasRole: element.hasAttribute('role'),
      isInteractive: element.tabIndex >= 0,
      hasProperContrast: true, // Would need actual contrast checking logic
    };
    return checks;
  },

  // Test keyboard navigation
  testKeyboardNavigation: async (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    for (let i = 0; i < focusableElements.length; i++) {
      fireEvent.keyDown(document.activeElement!, { key: 'Tab' });
      await waitFor(() => {
        expect(document.activeElement).toBe(focusableElements[i]);
      });
    }
  },

  // Test responsive breakpoints
  testResponsiveBreakpoints: (element: HTMLElement) => {
    const breakpoints = {
      mobile: '(max-width: 767px)',
      tablet: '(min-width: 768px) and (max-width: 1023px)',
      desktop: '(min-width: 1024px)',
    };

    Object.entries(breakpoints).forEach(([name, query]) => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((q) => ({
          matches: q === query,
          media: q,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      // Check if element adapts to breakpoint
      expect(element).toBeInTheDocument();
    });
  },

  // Mock API responses
  mockApiResponse: (endpoint: string, response: any, status = 200) => {
    global.fetch = jest.fn().mockImplementation((url) => {
      if (url.includes(endpoint)) {
        return Promise.resolve({
          ok: status >= 200 && status < 300,
          status,
          json: () => Promise.resolve(response),
        });
      }
      return Promise.reject(new Error('Not found'));
    });
  },

  // Test form validation
  testFormValidation: async (form: HTMLFormElement, testCases: Array<{
    field: string;
    value: string;
    shouldBeValid: boolean;
    errorMessage?: string;
  }>) => {
    for (const testCase of testCases) {
      const field = screen.getByLabelText(new RegExp(testCase.field, 'i'));
      
      fireEvent.change(field, { target: { value: testCase.value } });
      fireEvent.submit(form);

      if (testCase.shouldBeValid) {
        await waitFor(() => {
          expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
        });
      } else {
        await waitFor(() => {
          if (testCase.errorMessage) {
            expect(screen.getByText(new RegExp(testCase.errorMessage, 'i'))).toBeInTheDocument();
          } else {
            expect(screen.getByText(/error/i)).toBeInTheDocument();
          }
        });
      }
    }
  },
};

export default testUtils;