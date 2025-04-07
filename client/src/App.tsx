import { Route, Switch } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './hooks/use-auth';
import { RealTimeProvider } from './contexts/real-time-context';
import { ProtectedRoute } from './lib/protected-route';

// Pages
import AuthPage from './pages/auth-page';
import BuyTokensPage from './pages/buy-tokens';
import PaymentSuccessPage from './pages/payment-success';
import NotFoundPage from './pages/not-found';
import HomePage from './pages/home-page';
import LandingPage from './pages/new-landing-page';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RealTimeProvider>
          <Switch>
            <Route path="/" component={LandingPage} />
            <Route path="/auth" component={AuthPage} />
            <ProtectedRoute path="/dashboard" component={HomePage} />
            <ProtectedRoute path="/buy-tokens" component={BuyTokensPage} />
            <ProtectedRoute path="/payment-success" component={PaymentSuccessPage} />
            <Route component={NotFoundPage} />
          </Switch>
          <Toaster />
        </RealTimeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;