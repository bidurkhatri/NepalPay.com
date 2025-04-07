# NepaliPay Authentication System

This document explains the authentication system used in the NepaliPay application.

## Authentication Hooks

The application uses two primary authentication hooks:

### 1. Base Authentication Hook (`@/hooks/use-auth.tsx`)

This hook provides core authentication functionality:

- User data management
- Login/logout/register mutations
- Basic auth state

**Use this hook when you only need:**
- Check if a user is logged in
- Get user data
- Perform basic authentication operations

```tsx
import { useAuth } from '@/hooks/use-auth';

function MyComponent() {
  const { user, isLoading, loginMutation, logoutMutation } = useAuth();
  
  // Use for basic auth functionality
}
```

### 2. Enhanced Authentication Context Hook (`@/contexts/auth-context.tsx`)

This hook extends the base authentication with additional functionality:

- Navigation integration (redirects after login/logout)
- Simplified login/register methods
- Additional computed properties

**Use this hook when you need:**
- Authentication with navigation integration
- Simplified authentication methods that handle navigation

```tsx
import { useAuthContext } from '@/contexts/auth-context';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuthContext();
  
  // Use for enhanced auth with navigation
}
```

## Authentication Provider

The application uses nested authentication providers:

1. `AuthProvider` from `@/hooks/use-auth` - Core authentication
2. `AuthProvider` from `@/contexts/auth-context` - Enhanced functionality

The providers should be nested in the following order:

```tsx
<QueryClientProvider>
  <AuthProvider> {/* From hooks/use-auth */}
    <AuthProvider> {/* From contexts/auth-context */}
      <App />
    </AuthProvider>
  </AuthProvider>
</QueryClientProvider>
```

## Best Practices

1. **Choose the appropriate hook**: Use the simpler hook when possible, and the enhanced hook only when needed.

2. **Consistent imports**: Be explicit about which hook you're using instead of using the alias.

3. **Testing**: When testing authentication, mock the base authentication hook if possible.

4. **Maintenance**: When adding new authentication features:
   - Add core functionality to the base hook
   - Add UI/navigation integration to the enhanced context
