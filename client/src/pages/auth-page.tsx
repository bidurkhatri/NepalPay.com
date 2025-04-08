import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/use-auth';
import { Loader2, User, Key, Mail, ChevronRight, X, Building } from 'lucide-react';

// Login form schema
const loginSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});
type LoginFormData = z.infer<typeof loginSchema>;

// Register form schema
const registerSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string(),
  fullName: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});
type RegisterFormData = z.infer<typeof registerSchema>;

const AuthPage: React.FC = () => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const { user, loginMutation, registerMutation } = useAuth();
  const [, navigate] = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Login form
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
    },
  });

  // Handle login form submission
  const handleLogin = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  // Handle register form submission
  const handleRegister = (data: RegisterFormData) => {
    // Remove confirmPassword as it's not needed in the API call
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate(registerData);
  };

  // Toggle between login and register forms
  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left column - Auth forms */}
      <div className="flex flex-col justify-center w-full px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 lg:w-2/5">
        <div className="w-full max-w-sm mx-auto lg:w-96">
          <div className="text-center mb-8">
            <h2 className="mt-6 text-3xl font-bold tracking-tight">
              {authMode === 'login' ? 'Sign in to your account' : 'Create your account'}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {authMode === 'login' ? "Don't have an account?" : 'Already have an account?'}
              <button
                type="button"
                onClick={toggleAuthMode}
                className="ml-2 font-medium text-primary hover:underline"
              >
                {authMode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Login Form */}
          {authMode === 'login' && (
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium">
                  Username
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User size={16} className="text-muted-foreground" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    className="block w-full pl-10 border-border bg-background rounded-md py-2"
                    {...loginForm.register('username')}
                  />
                </div>
                {loginForm.formState.errors.username && (
                  <p className="mt-1 text-sm text-destructive">
                    {loginForm.formState.errors.username.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Key size={16} className="text-muted-foreground" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    className="block w-full pl-10 border-border bg-background rounded-md py-2"
                    {...loginForm.register('password')}
                  />
                </div>
                {loginForm.formState.errors.password && (
                  <p className="mt-1 text-sm text-destructive">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-primary hover:underline">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="flex justify-center items-center w-full py-2 px-4 border border-transparent rounded-md shadow-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  {loginMutation.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Register Form */}
          {authMode === 'register' && (
            <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium">
                  Username
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User size={16} className="text-muted-foreground" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    className="block w-full pl-10 border-border bg-background rounded-md py-2"
                    {...registerForm.register('username')}
                  />
                </div>
                {registerForm.formState.errors.username && (
                  <p className="mt-1 text-sm text-destructive">
                    {registerForm.formState.errors.username.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail size={16} className="text-muted-foreground" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className="block w-full pl-10 border-border bg-background rounded-md py-2"
                    {...registerForm.register('email')}
                  />
                </div>
                {registerForm.formState.errors.email && (
                  <p className="mt-1 text-sm text-destructive">
                    {registerForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="fullName" className="block text-sm font-medium">
                  Full Name (Optional)
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Building size={16} className="text-muted-foreground" />
                  </div>
                  <input
                    id="fullName"
                    type="text"
                    autoComplete="name"
                    className="block w-full pl-10 border-border bg-background rounded-md py-2"
                    {...registerForm.register('fullName')}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="register-password" className="block text-sm font-medium">
                  Password
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Key size={16} className="text-muted-foreground" />
                  </div>
                  <input
                    id="register-password"
                    type="password"
                    autoComplete="new-password"
                    className="block w-full pl-10 border-border bg-background rounded-md py-2"
                    {...registerForm.register('password')}
                  />
                </div>
                {registerForm.formState.errors.password && (
                  <p className="mt-1 text-sm text-destructive">
                    {registerForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium">
                  Confirm Password
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Key size={16} className="text-muted-foreground" />
                  </div>
                  <input
                    id="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    className="block w-full pl-10 border-border bg-background rounded-md py-2"
                    {...registerForm.register('confirmPassword')}
                  />
                </div>
                {registerForm.formState.errors.confirmPassword && (
                  <p className="mt-1 text-sm text-destructive">
                    {registerForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  id="agree-terms"
                  name="agree-terms"
                  type="checkbox"
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="agree-terms" className="ml-2 block text-sm">
                  I agree to the{' '}
                  <a href="#" className="font-medium text-primary hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="font-medium text-primary hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="flex justify-center items-center w-full py-2 px-4 border border-transparent rounded-md shadow-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  {registerMutation.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Right column - Hero section */}
      <div className="hidden lg:block relative lg:w-3/5">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1535025183041-0991a977e25b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center bg-no-repeat opacity-50"></div>
        <div className="relative flex h-full items-center justify-center p-8">
          <div className="max-w-xl text-center text-white">
            <h1 className="text-4xl font-bold mb-4">NepaliPay</h1>
            <p className="text-xl mb-6">
              The blockchain-powered digital wallet and financial services platform 
              designed for Nepal's unique economic landscape.
            </p>
            <div className="flex flex-col space-y-4 mt-8">
              <div className="flex items-center">
                <div className="bg-white/20 rounded-full p-2 mr-4">
                  <ChevronRight className="h-5 w-5 text-white" />
                </div>
                <p className="text-left">Secure blockchain technology for all transactions</p>
              </div>
              <div className="flex items-center">
                <div className="bg-white/20 rounded-full p-2 mr-4">
                  <ChevronRight className="h-5 w-5 text-white" />
                </div>
                <p className="text-left">Instant digital payments and transfers</p>
              </div>
              <div className="flex items-center">
                <div className="bg-white/20 rounded-full p-2 mr-4">
                  <ChevronRight className="h-5 w-5 text-white" />
                </div>
                <p className="text-left">Collateral-backed loans with competitive rates</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;