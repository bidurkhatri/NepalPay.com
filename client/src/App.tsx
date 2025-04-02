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

// Protected route component that redirects to login if not authenticated
const ProtectedRoute = ({ component: Component, ...rest }: { component: React.ComponentType, path?: string }) => {
  const { user, loading } = useAuth();
  
  // Show nothing while checking authentication
  if (loading) return null;
  
  // If not authenticated, redirect to login
  if (!user) return <Redirect to="/login" />;
  
  // If authenticated, render the component
  return <Component {...rest} />;
};

// Public route component that redirects to dashboard if already authenticated
const PublicRoute = ({ component: Component, ...rest }: { component: React.ComponentType, path?: string }) => {
  const { user, loading } = useAuth();
  
  // Show nothing while checking authentication
  if (loading) return null;
  
  // If authenticated, redirect to dashboard
  if (user) return <Redirect to="/dashboard" />;
  
  // If not authenticated, render the component
  return <Component {...rest} />;
};

function Router() {
  const [location] = useLocation();

  // Redirect from root to dashboard or login
  if (location === "/") {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Switch>
      <Route path="/login" component={() => <PublicRoute component={Login} />} />
      <Route path="/register" component={() => <PublicRoute component={Register} />} />
      <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/wallet" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/transactions" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/cards" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/analytics" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/profile" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/settings" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WalletProvider>
          <Router />
          <Toaster />
        </WalletProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
