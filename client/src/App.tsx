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
import { useBlockchain } from "@/contexts/blockchain-context";

// Detect which portal we're on based on hostname
const getPortalType = (): 'user' | 'admin' | 'superadmin' | 'public' => {
  const hostname = window.location.hostname;
  
  if (hostname.startsWith('admin.')) {
    return 'admin';
  } else if (hostname.startsWith('superadmin.')) {
    return 'superadmin';
  } else {
    return 'user';
  }
};

// Protected route component that redirects to login if not authenticated or if role doesn't match
interface ProtectedRouteProps {
  component: React.ComponentType;
  requiredRole?: 'USER' | 'ADMIN' | 'OWNER';
}

const ProtectedRoute = ({ component: Component, requiredRole }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const { userRole } = useBlockchain();
  
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
  
  // If role is required and user doesn't have it, redirect to dashboard
  if (requiredRole && userRole !== requiredRole) {
    return <Redirect to="/dashboard" />;
  }
  
  // If authenticated and role matches or no role required, render the component
  return <Component />;
};

// Public route component that redirects to appropriate dashboard if already authenticated
const PublicRoute = ({ component: Component }: { component: React.ComponentType }) => {
  const { user, loading } = useAuth();
  const { userRole } = useBlockchain();
  const portalType = getPortalType();
  
  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-950">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }
  
  // If authenticated, redirect to appropriate dashboard based on portal and role
  if (user) {
    if (portalType === 'admin' && userRole === 'ADMIN') {
      return <Redirect to="/admin-dashboard" />;
    } else if (portalType === 'superadmin' && userRole === 'OWNER') {
      return <Redirect to="/owner-dashboard" />;
    } else {
      return <Redirect to="/dashboard" />;
    }
  }
  
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
  const portalType = getPortalType();

  // Redirect from root based on portal type
  if (location === "/") {
    if (portalType === 'admin') {
      return <Redirect to="/admin-dashboard" />;
    } else if (portalType === 'superadmin') {
      return <Redirect to="/owner-dashboard" />;
    } else {
      return <Redirect to="/welcome" />;
    }
  }

  return (
    <Switch>
      {/* Public and landing routes */}
      <Route path="/welcome" component={() => <LandingRoute component={LandingPage} />} />
      <Route path="/login" component={() => <PublicRoute component={Login} />} />
      <Route path="/register" component={() => <PublicRoute component={Register} />} />
      
      {/* User portal routes */}
      <Route path="/sections" component={() => <ProtectedRoute component={SectionsPage} requiredRole="USER" />} />
      <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} requiredRole="USER" />} />
      <Route path="/crypto" component={() => <ProtectedRoute component={CryptoFixedPage} requiredRole="USER" />} />
      <Route path="/wallet" component={() => <ProtectedRoute component={WalletPage} requiredRole="USER" />} />
      <Route path="/transactions" component={() => <ProtectedRoute component={TransactionsPage} requiredRole="USER" />} />
      <Route path="/profile" component={() => <ProtectedRoute component={ProfilePage} requiredRole="USER" />} />
      <Route path="/settings" component={() => <ProtectedRoute component={SettingsPage} requiredRole="USER" />} />
      <Route path="/buy-tokens" component={() => <ProtectedRoute component={BuyTokensPage} requiredRole="USER" />} />
      
      {/* Admin portal routes (admin.nepalipay.com) */}
      <Route path="/admin-dashboard" component={() => <ProtectedRoute component={SectionsPage} requiredRole="ADMIN" />} />
      <Route path="/user-management" component={() => <ProtectedRoute component={Dashboard} requiredRole="ADMIN" />} />
      <Route path="/loan-oversight" component={() => <ProtectedRoute component={WalletPage} requiredRole="ADMIN" />} />
      <Route path="/ad-bazaar-moderation" component={() => <ProtectedRoute component={TransactionsPage} requiredRole="ADMIN" />} />
      <Route path="/admin-analytics" component={() => <ProtectedRoute component={AnalyticsPage} requiredRole="ADMIN" />} />
      
      {/* Owner/Superadmin portal routes (superadmin.nepalipay.com) */}
      <Route path="/owner-dashboard" component={() => <ProtectedRoute component={SectionsPage} requiredRole="OWNER" />} />
      <Route path="/system-control" component={() => <ProtectedRoute component={Dashboard} requiredRole="OWNER" />} />
      <Route path="/npt-stability" component={() => <ProtectedRoute component={WalletPage} requiredRole="OWNER" />} />
      <Route path="/admin-management" component={() => <ProtectedRoute component={TransactionsPage} requiredRole="OWNER" />} />
      <Route path="/financial-oversight" component={() => <ProtectedRoute component={AnalyticsPage} requiredRole="OWNER" />} />
      
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
