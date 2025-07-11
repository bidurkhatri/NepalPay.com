import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders, testUtils } from '@/components/ui/test-helpers';
import EnhancedWalletPage from '@/pages/enhanced-wallet';
import EnhancedWalletCard from '@/components/ui/enhanced-wallet-card';
import BottomNavigation from '@/components/ui/bottom-navigation';

// Mock the auth context
jest.mock('@/contexts/auth-context', () => ({
  useAuth: () => ({
    user: { 
      id: 1, 
      username: 'testuser',
      walletAddress: '0x1234567890123456789012345678901234567890'
    },
  }),
}));

// Mock the real-time context
jest.mock('@/contexts/real-time-context', () => ({
  useRealTime: () => ({
    wsStatus: 'connected',
    lastMessage: null,
  }),
}));

describe('Enhanced Wallet Components', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock successful API responses
    testUtils.mockApiResponse('/api/v1/wallet/status', {
      hasWallet: true,
      walletAddress: '0x1234567890123456789012345678901234567890',
      nptBalance: '100.50',
      bnbBalance: '0.025',
    });

    testUtils.mockApiResponse('/api/user/transactions', [
      {
        id: '1',
        type: 'received',
        amount: '50.25',
        currency: 'NPT',
        status: 'completed',
        createdAt: '2025-01-11T10:00:00Z',
        description: 'Payment from John',
      },
      {
        id: '2', 
        type: 'sent',
        amount: '25.00',
        currency: 'NPT',
        status: 'pending',
        createdAt: '2025-01-11T09:00:00Z',
        description: 'Payment to merchant',
      },
    ]);
  });

  describe('EnhancedWalletCard', () => {
    it('renders wallet information correctly', async () => {
      const mockWallet = {
        address: '0x1234567890123456789012345678901234567890',
        nptBalance: '100.50',
        bnbBalance: '0.025',
      };

      renderWithProviders(
        <EnhancedWalletCard wallet={mockWallet} />
      );

      expect(screen.getByText('Your Wallet')).toBeInTheDocument();
      expect(screen.getByText('100.50 NPT')).toBeInTheDocument();
      expect(screen.getByText('0x1234...7890')).toBeInTheDocument();
      expect(screen.getByText('Custodial Wallet - Secured by NepaliPay')).toBeInTheDocument();
    });

    it('handles copy to clipboard functionality', async () => {
      const mockWallet = {
        address: '0x1234567890123456789012345678901234567890',
        nptBalance: '100.50',
        bnbBalance: '0.025',
      };

      // Mock clipboard API
      Object.assign(navigator, {
        clipboard: {
          writeText: jest.fn().mockResolvedValue(undefined),
        },
      });

      renderWithProviders(
        <EnhancedWalletCard wallet={mockWallet} />
      );

      const copyButton = screen.getByLabelText(/copy address/i);
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockWallet.address);
      });
    });

    it('shows QR code dialog when QR button is clicked', async () => {
      const mockWallet = {
        address: '0x1234567890123456789012345678901234567890',
        nptBalance: '100.50',
        bnbBalance: '0.025',
      };

      renderWithProviders(
        <EnhancedWalletCard wallet={mockWallet} />
      );

      const qrButton = screen.getByLabelText(/show qr code/i);
      fireEvent.click(qrButton);

      await waitFor(() => {
        expect(screen.getByText('Wallet QR Code')).toBeInTheDocument();
      });
    });

    it('handles loading state correctly', () => {
      renderWithProviders(
        <EnhancedWalletCard isLoading={true} />
      );

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('meets accessibility requirements', async () => {
      const mockWallet = {
        address: '0x1234567890123456789012345678901234567890',
        nptBalance: '100.50',
        bnbBalance: '0.025',
      };

      const { container } = renderWithProviders(
        <EnhancedWalletCard wallet={mockWallet} />
      );

      // Check that all interactive elements have proper accessibility attributes
      const buttons = container.querySelectorAll('button');
      buttons.forEach(button => {
        const checks = testUtils.checkAccessibility(button);
        expect(checks.hasAriaLabel || checks.hasAriaLabelledBy).toBe(true);
        expect(checks.isInteractive).toBe(true);
      });

      // Test keyboard navigation
      await testUtils.testKeyboardNavigation(container);
    });
  });

  describe('BottomNavigation', () => {
    beforeEach(() => {
      // Mock useLocation hook
      jest.mock('wouter', () => ({
        useLocation: () => ['/wallet', jest.fn()],
        Link: ({ children, href, ...props }: any) => (
          <a href={href} {...props}>{children}</a>
        ),
      }));
    });

    it('renders all navigation items', () => {
      renderWithProviders(<BottomNavigation />);

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Wallet')).toBeInTheDocument();
      expect(screen.getByText('Send')).toBeInTheDocument();
      expect(screen.getByText('History')).toBeInTheDocument();
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });

    it('highlights active navigation item', () => {
      renderWithProviders(<BottomNavigation />);

      const walletLink = screen.getByRole('link', { name: /navigate to wallet/i });
      expect(walletLink).toHaveAttribute('aria-current', 'page');
    });

    it('has proper ARIA labels for accessibility', () => {
      renderWithProviders(<BottomNavigation />);

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', 'Main navigation');

      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toHaveAttribute('aria-label');
      });
    });

    it('meets minimum touch target size requirements', () => {
      const { container } = renderWithProviders(<BottomNavigation />);

      const links = container.querySelectorAll('a');
      links.forEach(link => {
        const styles = window.getComputedStyle(link);
        expect(parseInt(styles.minHeight)).toBeGreaterThanOrEqual(44);
        expect(parseInt(styles.minWidth)).toBeGreaterThanOrEqual(44);
      });
    });
  });

  describe('Enhanced Wallet Page Integration', () => {
    it('renders complete wallet page with all components', async () => {
      renderWithProviders(<EnhancedWalletPage />);

      await waitFor(() => {
        expect(screen.getByText('Wallet')).toBeInTheDocument();
        expect(screen.getByText('Manage your NPT tokens and view transaction history')).toBeInTheDocument();
      });
    });

    it('handles responsive layout correctly', () => {
      const { container } = renderWithProviders(<EnhancedWalletPage />);

      // Test mobile layout
      testUtils.testResponsiveBreakpoints(container);
      
      // Check for responsive grid classes
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toHaveClass('grid-cols-1', 'lg:grid-cols-3');
    });

    it('shows appropriate content based on wallet state', async () => {
      // Test with no wallet
      testUtils.mockApiResponse('/api/v1/wallet/status', null, 404);

      renderWithProviders(<EnhancedWalletPage />);

      await waitFor(() => {
        expect(screen.getByText('No Wallet Found')).toBeInTheDocument();
        expect(screen.getByText('Create Wallet')).toBeInTheDocument();
      });
    });

    it('handles error states gracefully', async () => {
      // Mock API error
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      renderWithProviders(<EnhancedWalletPage />);

      await waitFor(() => {
        expect(screen.getByText(/create wallet/i)).toBeInTheDocument();
      });
    });
  });

  describe('Mobile UX Optimizations', () => {
    it('has thumb-zone optimized button placement', () => {
      const { container } = renderWithProviders(<EnhancedWalletPage />);

      const primaryButtons = container.querySelectorAll('button[type="submit"], .primary-button');
      primaryButtons.forEach(button => {
        const rect = button.getBoundingClientRect();
        // Check if button is in lower half of typical mobile viewport
        expect(rect.top).toBeGreaterThan(200); // Approximate thumb-zone start
      });
    });

    it('uses consistent spacing following design system', () => {
      const { container } = renderWithProviders(<EnhancedWalletPage />);

      // Check for consistent gap and spacing classes
      const spacingElements = container.querySelectorAll('[class*="gap-"], [class*="space-y-"]');
      spacingElements.forEach(element => {
        const classes = element.className;
        // Should use standardized spacing tokens (4, 6, 8, etc.)
        expect(classes).toMatch(/gap-[468]|space-y-[468]/);
      });
    });
  });
});