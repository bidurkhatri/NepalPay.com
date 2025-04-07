import { Route, Switch } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './hooks/use-auth';
import { RealTimeProvider } from './contexts/real-time-context';
import { ProtectedRoute } from './lib/protected-route';
import DashboardLayout from './components/dashboard-layout';

// Pages
import AuthPage from './pages/auth-page';
import BuyTokensPage from './pages/buy-tokens';
import PaymentSuccessPage from './pages/payment-success';
import NotFoundPage from './pages/not-found';
import HomePage from './pages/home-page';
import AdvancedLandingPage from './pages/advanced-landing-page';
import WalletPage from './pages/wallet';
import SendPage from './pages/send-page';
import TransactionsPage from './pages/transactions';
import RewardsPage from './pages/rewards-page'; 
import BorrowPage from './pages/borrow-page';
import AdBazaarPage from './pages/ad-bazaar-page';
import ProfilePage from './pages/profile';
import SettingsPage from './pages/settings';

// Support Pages
import SupportPage from './pages/support/support-page';
import FAQPage from './pages/support/faq-page';
import KnowledgebasePage from './pages/support/knowledgebase-page';
import ContactPage from './pages/support/contact-page';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
                <HomePage />
              </DashboardLayout>
            </ProtectedRoute>
            <ProtectedRoute path="/wallet">
              <DashboardLayout>
                <WalletPage />
              </DashboardLayout>
            </ProtectedRoute>
            <ProtectedRoute path="/send">
              <DashboardLayout>
                <SendPage />
              </DashboardLayout>
            </ProtectedRoute>
            <ProtectedRoute path="/transactions">
              <DashboardLayout>
                <TransactionsPage />
              </DashboardLayout>
            </ProtectedRoute>
            <ProtectedRoute path="/rewards">
              <DashboardLayout>
                <RewardsPage />
              </DashboardLayout>
            </ProtectedRoute>
            <ProtectedRoute path="/referrals">
              <DashboardLayout>
                <RewardsPage />
              </DashboardLayout>
            </ProtectedRoute>
            <ProtectedRoute path="/borrow">
              <DashboardLayout>
                <BorrowPage />
              </DashboardLayout>
            </ProtectedRoute>
            <ProtectedRoute path="/ad-bazaar">
              <DashboardLayout>
                <AdBazaarPage />
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
            <ProtectedRoute path="/buy-tokens">
              <DashboardLayout>
                <BuyTokensPage />
              </DashboardLayout>
            </ProtectedRoute>
            <ProtectedRoute path="/payment-success">
              <DashboardLayout>
                <PaymentSuccessPage />
              </DashboardLayout>
            </ProtectedRoute>
            
            {/* Support Routes */}
            <ProtectedRoute path="/support">
              <DashboardLayout>
                <SupportPage />
              </DashboardLayout>
            </ProtectedRoute>
            <ProtectedRoute path="/support/faq">
              <DashboardLayout>
                <FAQPage />
              </DashboardLayout>
            </ProtectedRoute>
            <ProtectedRoute path="/support/knowledgebase">
              <DashboardLayout>
                <KnowledgebasePage />
              </DashboardLayout>
            </ProtectedRoute>
            <ProtectedRoute path="/support/contact">
              <DashboardLayout>
                <ContactPage />
              </DashboardLayout>
            </ProtectedRoute>
            
            <Route>
              <NotFoundPage />
            </Route>
          </Switch>
          <Toaster />
        </RealTimeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
