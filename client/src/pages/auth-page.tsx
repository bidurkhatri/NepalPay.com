import React, { useState } from 'react';
import { Redirect } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

// Define the forms' schemas
const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
    },
  });

  // Handle login submission
  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  // Handle register submission
  const onRegisterSubmit = (data: RegisterFormValues) => {
    // Remove confirmPassword as it's not part of the API schema
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate(registerData);
  };

  // Redirect to home if already logged in
  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen flex animated-gradient-bg">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-12">
        <div className="glass-morphic-dark p-8 md:p-10 rounded-xl shadow-xl w-full max-w-md">
          {/* Tabs */}
          <div className="flex mb-8 border-b border-white/10">
            <button
              className={`pb-3 px-4 text-lg font-medium transition-colors ${isLogin ? 'text-white border-b-2 border-blue-500' : 'text-white/60 hover:text-white/80'}`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`pb-3 px-4 text-lg font-medium transition-colors ${!isLogin ? 'text-white border-b-2 border-blue-500' : 'text-white/60 hover:text-white/80'}`}
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </div>

          {/* Login Form */}
          {isLogin ? (
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-white/80 mb-1">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  {...loginForm.register('username')}
                  className="glass-input-dark w-full px-4 py-2 text-white"
                  placeholder="Enter your username"
                />
                {loginForm.formState.errors.username && (
                  <p className="mt-1 text-red-400 text-sm">{loginForm.formState.errors.username.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  {...loginForm.register('password')}
                  className="glass-input-dark w-full px-4 py-2 text-white"
                  placeholder="Enter your password"
                />
                {loginForm.formState.errors.password && (
                  <p className="mt-1 text-red-400 text-sm">{loginForm.formState.errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-white/70">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-sm text-blue-400 hover:text-blue-300">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="glass-button-dark w-full py-3 text-white font-medium flex items-center justify-center"
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-white/80 mb-1">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    {...registerForm.register('firstName')}
                    className="glass-input-dark w-full px-4 py-2 text-white"
                    placeholder="First name"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-white/80 mb-1">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    {...registerForm.register('lastName')}
                    className="glass-input-dark w-full px-4 py-2 text-white"
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg-username" className="block text-sm font-medium text-white/80 mb-1">
                  Username*
                </label>
                <input
                  id="reg-username"
                  type="text"
                  {...registerForm.register('username')}
                  className="glass-input-dark w-full px-4 py-2 text-white"
                  placeholder="Choose a username"
                />
                {registerForm.formState.errors.username && (
                  <p className="mt-1 text-red-400 text-sm">{registerForm.formState.errors.username.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">
                  Email*
                </label>
                <input
                  id="email"
                  type="email"
                  {...registerForm.register('email')}
                  className="glass-input-dark w-full px-4 py-2 text-white"
                  placeholder="Your email address"
                />
                {registerForm.formState.errors.email && (
                  <p className="mt-1 text-red-400 text-sm">{registerForm.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-white/80 mb-1">
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  {...registerForm.register('phoneNumber')}
                  className="glass-input-dark w-full px-4 py-2 text-white"
                  placeholder="Your phone number"
                />
              </div>

              <div>
                <label htmlFor="reg-password" className="block text-sm font-medium text-white/80 mb-1">
                  Password*
                </label>
                <input
                  id="reg-password"
                  type="password"
                  {...registerForm.register('password')}
                  className="glass-input-dark w-full px-4 py-2 text-white"
                  placeholder="Create a password"
                />
                {registerForm.formState.errors.password && (
                  <p className="mt-1 text-red-400 text-sm">{registerForm.formState.errors.password.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/80 mb-1">
                  Confirm Password*
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  {...registerForm.register('confirmPassword')}
                  className="glass-input-dark w-full px-4 py-2 text-white"
                  placeholder="Confirm your password"
                />
                {registerForm.formState.errors.confirmPassword && (
                  <p className="mt-1 text-red-400 text-sm">{registerForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500"
                  required
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-white/70">
                  I agree to the <a href="#" className="text-blue-400 hover:text-blue-300">Terms of Service</a> and <a href="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>
                </label>
              </div>

              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="glass-button-dark w-full py-3 text-white font-medium flex items-center justify-center"
              >
                {registerMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Right side - Hero */}
      <div className="hidden md:flex md:w-1/2 bg-gray-900 items-center justify-center relative">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1508196476428-de21c4d8a2ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1972&q=80')" }}></div>
        <div className="p-12 max-w-md z-10">
          <div className="p-6 glass-morphic-dark rounded-xl mb-6 backdrop-blur-lg">
            <h2 className="text-3xl font-bold mb-6 gradient-text-blue">Welcome to NepaliPay</h2>
            <p className="text-white/90 mb-6">
              Join Nepal's most advanced blockchain-powered digital wallet. Secure, fast, and designed specifically for the Nepali financial ecosystem.
            </p>
            <ul className="space-y-4">
              <li className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-white/80">Secure blockchain transactions</span>
              </li>
              <li className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-white/80">NPT tokens pegged to Nepalese Rupee</span>
              </li>
              <li className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-white/80">Send money instantly across Nepal</span>
              </li>
              <li className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-white/80">Access to collateral-based loans</span>
              </li>
            </ul>
          </div>
          <p className="text-white/60 text-sm">
            Already trusted by thousands of users across Nepal. Join the financial revolution today.
          </p>
        </div>
      </div>
    </div>
  );
}