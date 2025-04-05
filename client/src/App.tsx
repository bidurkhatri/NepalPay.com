import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { WalletProvider } from "@/contexts/wallet-context";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Login from "@/pages/login";
import Register from "@/pages/register";
import CryptoPage from "@/pages/crypto";
import CryptoFixedPage from "@/pages/crypto-fixed";
import WalletPage from "@/pages/wallet";
import TransactionsPage from "@/pages/transactions";
import ProfilePage from "@/pages/profile";
import SettingsPage from "@/pages/settings";
import AnalyticsPage from "@/pages/analytics";
import LandingPage from "@/pages/landing-page";
import SectionsPage from "@/pages/sections-page";
import BuyTokensPage from "@/pages/buy-tokens";
import { Loader2 } from "lucide-react";

// Protected route component that redirects to login if not authenticated
const ProtectedRoute = ({ component: Component }: { component: React.ComponentType }) => {
  const { user, loading } = useAuth();
  
  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-950">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!user) return <Redirect to="/login" />;
  
  // If authenticated, render the component
  return <Component />;
};

// Public route component that redirects to dashboard if already authenticated
const PublicRoute = ({ component: Component }: { component: React.ComponentType }) => {
  const { user, loading } = useAuth();
  
  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-950">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }
  
  // If authenticated, redirect to dashboard
  if (user) return <Redirect to="/sections" />;
  
  // If not authenticated, render the component
  return <Component />;
};

// Component that renders the landing page without authentication check
const LandingRoute = ({ component: Component }: { component: React.ComponentType }) => {
  return <Component />;
};

function Router() {
  const [location] = useLocation();
  const { user, loading } = useAuth();

  // Redirect from root to landing page
  if (location === "/") {
    return <Redirect to="/welcome" />;
  }

  return (
    <Switch>
      {/* Public and landing routes */}
      <Route path="/welcome" component={() => <LandingRoute component={LandingPage} />} />
      <Route path="/login" component={() => <PublicRoute component={Login} />} />
      <Route path="/register" component={() => <PublicRoute component={Register} />} />
      
      {/* Protected routes */}
      <Route path="/sections" component={() => <ProtectedRoute component={SectionsPage} />} />
      <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/crypto" component={() => <ProtectedRoute component={CryptoFixedPage} />} />
      <Route path="/wallet" component={() => <ProtectedRoute component={WalletPage} />} />
      <Route path="/transactions" component={() => <ProtectedRoute component={TransactionsPage} />} />
      <Route path="/analytics" component={() => <ProtectedRoute component={AnalyticsPage} />} />
      <Route path="/profile" component={() => <ProtectedRoute component={ProfilePage} />} />
      <Route path="/settings" component={() => <ProtectedRoute component={SettingsPage} />} />
      <Route path="/buy-tokens" component={() => <ProtectedRoute component={BuyTokensPage} />} />
      
      {/* 404 route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// Import providers
import { BlockchainProvider } from "@/contexts/blockchain-context";
import { SettingsProvider } from "@/contexts/settings-context";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SettingsProvider>
          <WalletProvider>
            <BlockchainProvider>
              <Router />
              <Toaster />
            </BlockchainProvider>
          </WalletProvider>
        </SettingsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
