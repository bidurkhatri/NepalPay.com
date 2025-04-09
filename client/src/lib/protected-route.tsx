import React from 'react';
import { Redirect, Route } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  path: string;
  component: React.ComponentType;
}

export function ProtectedRoute({ path, component: Component }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // Show loading state while checking user authentication
    return (
      <Route path={path}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="glass-card-dark p-8 rounded-xl shadow-xl flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
            <p className="text-white/80">Loading your account...</p>
          </div>
        </div>
      </Route>
    );
  }

  // If user is not authenticated, redirect to login page
  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  // If user is authenticated, render the component
  return <Route path={path} component={Component} />;
}