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
import NotFoundPage from './pages/not-found';
import HomePage from './pages/home-page';
import AdvancedLandingPage from './pages/advanced-landing-page';
import DashboardPage from './pages/dashboard';
import WalletPage from './pages/wallet';

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
                <DashboardPage />
              </DashboardLayout>
            </ProtectedRoute>
            <ProtectedRoute path="/wallet">
              <DashboardLayout>
                <WalletPage />
              </DashboardLayout>
            </ProtectedRoute>
            <ProtectedRoute path="/home">
              <DashboardLayout>
                <HomePage />
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
