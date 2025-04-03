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
import { useState, useEffect } from "react";

// Protected route component that redirects to login if not authenticated
const ProtectedRoute = ({ component: Component }: { component: React.ComponentType }) => {
  console.log("ProtectedRoute rendering");
  const { user, loading } = useAuth();
  
  console.log("ProtectedRoute - Auth state:", { loading, isAuthenticated: !!user });
  
  // Show a loading indicator while checking authentication
  if (loading) {
    console.log("ProtectedRoute - Still loading auth state");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!user) {
    console.log("ProtectedRoute - User not authenticated, redirecting to login");
    return <Redirect to="/login" />;
  }
  
  // If authenticated, render the component
  console.log("ProtectedRoute - User authenticated, rendering component");
  return <Component />;
};

// Public route component that redirects to dashboard if already authenticated
const PublicRoute = ({ component: Component }: { component: React.ComponentType }) => {
  console.log("PublicRoute rendering");
  const { user, loading } = useAuth();
  
  console.log("PublicRoute - Auth state:", { loading, isAuthenticated: !!user });
  
  // Show a loading indicator while checking authentication
  if (loading) {
    console.log("PublicRoute - Still loading auth state");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  // If authenticated, redirect to dashboard
  if (user) {
    console.log("PublicRoute - User already authenticated, redirecting to dashboard");
    return <Redirect to="/dashboard" />;
  }
  
  // If not authenticated, render the component
  console.log("PublicRoute - User not authenticated, rendering component");
  return <Component />;
};

function Router() {
  console.log("Router component rendering");
  const [location] = useLocation();
  console.log("Current location:", location);

  // Render a minimal fallback UI if there's an error in the routing logic
  try {
    // Redirect from root to dashboard or login
    if (location === "/") {
      console.log("Redirecting from root to dashboard");
      return <Redirect to="/dashboard" />;
    }

    console.log("Setting up routes");
    return (
      <Switch>
        <Route path="/login" component={() => {
          console.log("Rendering login route");
          return <PublicRoute component={Login} />;
        }} />
        <Route path="/register" component={() => {
          console.log("Rendering register route");
          return <PublicRoute component={Register} />;
        }} />
        <Route path="/dashboard" component={() => {
          console.log("Rendering dashboard route");
          return <ProtectedRoute component={Dashboard} />;
        }} />
        <Route path="/crypto" component={() => {
          console.log("Rendering crypto route");
          return <ProtectedRoute component={CryptoFixedPage} />;
        }} />
        <Route path="/wallet" component={() => {
          console.log("Rendering wallet route");
          return <ProtectedRoute component={WalletPage} />;
        }} />
        <Route path="/transactions" component={() => {
          console.log("Rendering transactions route");
          return <ProtectedRoute component={TransactionsPage} />;
        }} />
        <Route path="/analytics" component={() => {
          console.log("Rendering analytics route");
          return <ProtectedRoute component={AnalyticsPage} />;
        }} />
        <Route path="/profile" component={() => {
          console.log("Rendering profile route");
          return <ProtectedRoute component={ProfilePage} />;
        }} />
        <Route path="/settings" component={() => {
          console.log("Rendering settings route");
          return <ProtectedRoute component={SettingsPage} />;
        }} />
        <Route component={() => {
          console.log("Rendering not found route");
          return <NotFound />;
        }} />
      </Switch>
    );
  } catch (error) {
    console.error("Critical error in Router component:", error);
    return (
      <div style={{ padding: "20px", margin: "20px", backgroundColor: "#f43f5e", color: "white", borderRadius: "10px" }}>
        <h2>Router Error</h2>
        <p>Current location: {location}</p>
        <p>The application encountered an error setting up routes.</p>
        <pre>{error instanceof Error ? error.stack : String(error)}</pre>
      </div>
    );
  }
}

// Import providers
import { BlockchainProvider } from "@/contexts/blockchain-context";
import { SettingsProvider } from "@/contexts/settings-context";

// Simple standalone login page that doesn't depend on any other contexts
function MinimalLoginPage() {
  console.log("MinimalLoginPage rendering");
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoggingIn(true);
      console.log("Attempting login with:", username);
      
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      if (res.ok) {
        console.log("Login successful");
        window.location.href = '/dashboard';
      } else {
        console.error("Login failed:", await res.text());
        alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error("Login error:", error);
      alert('Login error. Please try again.');
    } finally {
      setLoggingIn(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4">
      <div className="glass-card max-w-md w-full">
        <h2 className="text-2xl font-bold text-white mb-6">NepaliPay Login</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="modern-input w-full"
              placeholder="Enter your username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="modern-input w-full"
              placeholder="Enter your password"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loggingIn}
            className="modern-button w-full"
          >
            {loggingIn ? 'Logging in...' : 'Login'}
          </button>
          <p className="text-sm text-gray-300 mt-4">
            Demo account: Username: <span className="text-white font-medium">demo</span>, Password: <span className="text-white font-medium">password</span>
          </p>
        </form>
      </div>
    </div>
  );
}

function App() {
  console.log("App rendering started");
  const [showMinimal, setShowMinimal] = useState(false);
  
  // Option to show minimal UI after a timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("Timeout reached, checking if app rendered properly");
      const rootEl = document.getElementById('root');
      const isEmpty = rootEl && rootEl.childElementCount <= 1;
      
      if (isEmpty) {
        console.log("App appears to be empty, showing minimal UI");
        setShowMinimal(true);
      }
    }, 5000); // 5 seconds timeout
    
    return () => clearTimeout(timer);
  }, []);
  
  // Add fallback UI in case of provider errors
  try {
    console.log("Initializing providers");
    
    // If minimal mode is triggered, bypass all other providers
    if (showMinimal) {
      console.log("Rendering minimal UI");
      return <MinimalLoginPage />;
    }
    
    return (
      <QueryClientProvider client={queryClient}>
        <div id="app-fallback" style={{ 
          position: 'fixed', 
          bottom: '10px', 
          right: '10px', 
          padding: '10px', 
          background: 'rgba(0,0,0,0.7)', 
          color: 'white', 
          borderRadius: '5px',
          zIndex: 9999,
          display: 'block'
        }}>
          Loading app...
        </div>
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
  } catch (error) {
    console.error("Critical error in App component:", error);
    return (
      <div style={{ padding: "20px", margin: "20px", backgroundColor: "#f43f5e", color: "white", borderRadius: "10px" }}>
        <h2>Critical App Error</h2>
        <p>The application encountered a serious problem during initialization.</p>
        <pre>{error instanceof Error ? error.stack : String(error)}</pre>
        <div className="mt-4">
          <button 
            onClick={() => setShowMinimal(true)}
            style={{
              padding: "10px 20px",
              background: "white",
              color: "black",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Switch to Minimal UI
          </button>
        </div>
      </div>
    );
  }
}

export default App;
