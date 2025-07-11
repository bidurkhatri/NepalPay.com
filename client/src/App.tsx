import { Route, Switch } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { Toaster } from './components/ui/toaster';
import ToastProvider from './components/ui/toast-notifications';
import { AuthProvider } from './contexts/auth-context';
import { RealTimeProvider } from './contexts/real-time-context';
import { ProtectedRoute } from './lib/protected-route';
import DashboardLayout from './components/dashboard-layout';

// Pages
import AuthPage from './pages/auth-page';
import NotFoundPage from './pages/not-found';
import HomePage from './pages/home-page';
import AdvancedLandingPage from './pages/advanced-landing-page';
import DashboardPage from './pages/dashboard';
import EnhancedWalletPage from './pages/enhanced-wallet';
import SendFundsPage from './pages/send-funds';
import PurchaseTokensPage from './pages/purchase-tokens';
import PaymentsPage from './pages/payments';
import LoansPage from './pages/loans';
import AnalyticsPage from './pages/analytics';
import RewardsPage from './pages/rewards';
import MarketplacePage from './pages/marketplace';
import ProfilePage from './pages/profile';
import SettingsPage from './pages/settings';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <RealTimeProvider>
            <Switch>
            <Route path="/">
              <AdvancedLandingPage />
            </Route>
            <Route path="/auth">
              <AuthPage />
            </Route>
            
            {/* Protected routes with Dashboard Layout */}
            <ProtectedRoute path="/dashboard">
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>
            </ProtectedRoute>
            <ProtectedRoute path="/wallet">
              <DashboardLayout>
                <EnhancedWalletPage />
              </DashboardLayout>
            </ProtectedRoute>
            <ProtectedRoute path="/send">
              <DashboardLayout>
                <SendFundsPage />
              </DashboardLayout>
            </ProtectedRoute>
            <ProtectedRoute path="/purchase">
              <DashboardLayout>
                <PurchaseTokensPage />
              </DashboardLayout>
            </ProtectedRoute>
            <ProtectedRoute path="/payments">
              <DashboardLayout>
                <PaymentsPage />
              </DashboardLayout>
            </ProtectedRoute>
            <ProtectedRoute path="/loans">
              <DashboardLayout>
                <LoansPage />
              </DashboardLayout>
            </ProtectedRoute>
            <ProtectedRoute path="/analytics">
              <DashboardLayout>
                <AnalyticsPage />
              </DashboardLayout>
            </ProtectedRoute>
            <ProtectedRoute path="/rewards">
              <DashboardLayout>
                <RewardsPage />
              </DashboardLayout>
            </ProtectedRoute>
            <ProtectedRoute path="/marketplace">
              <DashboardLayout>
                <MarketplacePage />
              </DashboardLayout>
            </ProtectedRoute>
            <ProtectedRoute path="/profile">
              <DashboardLayout>
                <ProfilePage />
              </DashboardLayout>
            </ProtectedRoute>
            <ProtectedRoute path="/settings">
              <DashboardLayout>
                <SettingsPage />
              </DashboardLayout>
            </ProtectedRoute>
            
            <Route>
              <NotFoundPage />
            </Route>
            </Switch>
            <Toaster />
          </RealTimeProvider>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
