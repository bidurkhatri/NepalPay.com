import React from "react";
import { Loader2 } from "lucide-react";
import { Redirect, Route, useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";

interface ProtectedRouteProps {
  component: React.ComponentType;
  admin?: boolean;
  superadmin?: boolean;
  path: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  admin = false,
  superadmin = false,
  path,
}) => {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  if (admin && user.role !== "admin" && user.role !== "superadmin") {
    return (
      <Route path={path}>
        <Redirect to="/" />
      </Route>
    );
  }

  if (superadmin && user.role !== "superadmin") {
    return (
      <Route path={path}>
        <Redirect to="/" />
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
};