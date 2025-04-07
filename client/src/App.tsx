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
          <DashboardLayout>
            <Switch>
              <Route path="/" component={AdvancedLandingPage} />
              <Route path="/auth" component={AuthPage} />
              <ProtectedRoute path="/dashboard" component={HomePage} />
              <ProtectedRoute path="/wallet" component={HomePage} />
              <ProtectedRoute path="/send" component={HomePage} />
              <ProtectedRoute path="/transactions" component={HomePage} />
              <ProtectedRoute path="/rewards" component={HomePage} />
              <ProtectedRoute path="/referrals" component={HomePage} />
              <ProtectedRoute path="/settings" component={HomePage} />
              <ProtectedRoute path="/buy-tokens" component={BuyTokensPage} />
              <ProtectedRoute path="/payment-success" component={PaymentSuccessPage} />
              
              {/* Support Routes */}
              <Route path="/support" component={SupportPage} />
              <Route path="/support/faq" component={FAQPage} />
              <Route path="/support/knowledgebase" component={KnowledgebasePage} />
              <Route path="/support/contact" component={ContactPage} />
              
              <Route component={NotFoundPage} />
            </Switch>
          </DashboardLayout>
          <Toaster />
        </RealTimeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;