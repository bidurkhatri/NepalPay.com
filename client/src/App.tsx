import { Route, Switch } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { ToastProvider } from './hooks/use-toast';
import { AuthProvider } from './hooks/use-auth';
import { ProtectedRoute } from './lib/protected-route';

// Pages
import AuthPage from './pages/auth-page';
import BuyTokensPage from './pages/buy-tokens';
import PaymentSuccessPage from './pages/payment-success';
import NotFoundPage from './pages/not-found';
import HomePage from './pages/home-page';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <Switch>
            <Route path="/auth" component={AuthPage} />
            <ProtectedRoute path="/buy-tokens" component={BuyTokensPage} />
            <ProtectedRoute path="/payment-success" component={PaymentSuccessPage} />
            <ProtectedRoute path="/" component={HomePage} />
            <Route component={NotFoundPage} />
          </Switch>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;