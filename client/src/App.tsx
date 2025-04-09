import React from 'react';
import { Switch, Route } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AuthProvider } from './hooks/use-auth';
import { Toaster } from './components/ui/toaster';

// Pages
import HomePage from './pages/home-page';
import AuthPage from './pages/auth-page';
import { ProtectedRoute } from './lib/protected-route';

// Main App component
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* Main app routes */}
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/auth" component={AuthPage} />
          
          {/* Catch all route - not found */}
          <Route>
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-900 to-gray-800">
              <div className="max-w-md w-full p-8 bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-xl border border-gray-700/50">
                <h1 className="text-4xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-300">404</h1>
                <p className="text-gray-300 text-center mb-8">
                  The page you're looking for doesn't exist.
                </p>
                <div className="flex justify-center">
                  <a 
                    href="/"
                    className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-blue-600/30"
                  >
                    Go Back Home
                  </a>
                </div>
              </div>
            </div>
          </Route>
        </Switch>
        
        {/* Toast notifications */}
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;