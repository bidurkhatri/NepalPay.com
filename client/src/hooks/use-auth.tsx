/**
 * Re-export the useAuth hook and AuthProvider from auth-context.tsx
 * This file exists for backward compatibility with existing imports.
 */

import { useAuth, AuthProvider } from '@/contexts/auth-context';

export { useAuth, AuthProvider };