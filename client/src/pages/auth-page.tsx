import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { AlertCircle, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot-password'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [resetToken, setResetToken] = useState('');
  const { user, isLoading, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();

  // Use useEffect to handle redirection instead of doing it in render
  useEffect(() => {
    if (user) {
      console.log("User authenticated, redirecting to dashboard");
      setLocation('/dashboard');
    }
  }, [user, setLocation]);

  // Handle form submission for all auth modes
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      if (authMode === 'login') {
        console.log('Attempting login with:', { username });
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        
        if (!response.ok) {
          console.error('Login error:', data);
          setError(data.error || 'Login failed');
          return;
        }
        
        console.log('Login successful:', data);
        window.location.href = '/dashboard'; // Force page reload
      } 
      else if (authMode === 'register') {
        console.log('Attempting registration with:', { username, email });
        
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ 
            username, 
            password, 
            email, 
            firstName, 
            lastName
          }),
        });

        const data = await response.json();
        
        if (!response.ok) {
          console.error('Registration error:', data);
          setError(data.error || 'Registration failed');
          return;
        }
        
        console.log('Registration successful:', data);
        window.location.href = '/dashboard'; // Force page reload
      }
      else if (authMode === 'forgot-password') {
        if (resetToken) {
          // Reset password with token
          if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
          }
          
          console.log('Resetting password with token');
          const response = await fetch('/api/reset-password', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              token: resetToken,
              password 
            }),
          });

          const data = await response.json();
          
          if (!response.ok) {
            console.error('Password reset error:', data);
            setError(data.error || 'Password reset failed');
            return;
          }
          
          setSuccessMessage('Your password has been reset successfully! You can now login.');
          setTimeout(() => {
            setAuthMode('login');
            setPassword('');
            setConfirmPassword('');
            setResetToken('');
            setSuccessMessage('');
          }, 3000);
        }
        else {
          // Request password reset
          console.log('Requesting password reset for:', { email });
          const response = await fetch('/api/forgot-password', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          });

          const data = await response.json();
          
          if (!response.ok) {
            console.error('Forgot password error:', data);
            setError(data.error || 'Forgot password request failed');
            return;
          }
          
          // In development, we'll get the token back for testing
          if (data.token) {
            setResetToken(data.token);
            setSuccessMessage('Please enter your new password below.');
          } else {
            setSuccessMessage('If an account with that email exists, a password reset link has been sent.');
            setTimeout(() => {
              setAuthMode('login');
              setEmail('');
              setSuccessMessage('');
            }, 3000);
          }
        }
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  // Switch between different authentication modes
  const switchAuthMode = (mode: 'login' | 'register' | 'forgot-password') => {
    setAuthMode(mode);
    setError('');
    setSuccessMessage('');
    setResetToken('');
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // If user is already logged in, don't render the form
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 bg-background-dark z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-3/4 h-3/4 bg-gradient-to-tl from-secondary/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 left-1/3 w-1/2 h-1/2 bg-gradient-to-br from-accent/5 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 z-0 opacity-30">
        {Array.from({ length: 6 }).map((_, i) => (
          <div 
            key={i} 
            className="absolute rounded-full bg-primary/20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 5 + 2}px`,
              height: `${Math.random() * 5 + 2}px`,
              animation: `float ${Math.random() * 10 + 15}s linear infinite`
            }}
          ></div>
        ))}
      </div>
      
      <div className="gradient-border w-full max-w-6xl z-10">
        <div className="glass-card flex flex-col md:flex-row overflow-hidden">
          {/* Form Side */}
          <div className="w-full md:w-1/2 p-8 md:p-12">
            <div className="mb-10">
              <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-light to-secondary mb-3">
                {authMode === 'login' ? 'Welcome Back' : 
                 authMode === 'register' ? 'Create Account' : 
                 'Reset Password'}
              </h1>
              <p className="text-text-muted text-lg">
                {authMode === 'login'
                  ? 'Sign in to access your NepaliPay wallet.'
                  : authMode === 'register'
                  ? 'Join the digital financial revolution in Nepal.'
                  : 'We\'ll help you recover access to your account.'}
              </p>
              
              {authMode === 'forgot-password' && (
                <button
                  type="button"
                  onClick={() => switchAuthMode('login')}
                  className="mt-4 flex items-center text-primary hover:text-primary-light transition-all"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  <span>Back to login</span>
                </button>
              )}
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {successMessage && (
              <Alert variant="success" className="mb-6 bg-green-50 border-green-200 text-green-800">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Login Form */}
              {authMode === 'login' && (
                <>
                  <div className="form-group">
                    <label htmlFor="username" className="block text-text-color mb-2 font-medium">
                      Username
                    </label>
                    <div className="relative">
                      <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-glass-bg-light border border-border-light rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-text-color backdrop-blur-md transition-all"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="flex justify-between mb-2">
                      <label htmlFor="password" className="block text-text-color font-medium">
                        Password
                      </label>
                      <button 
                        type="button" 
                        onClick={() => switchAuthMode('forgot-password')}
                        className="text-sm text-primary hover:text-primary-light transition-colors"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-glass-bg-light border border-border-light rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-text-color backdrop-blur-md transition-all"
                      />
                    </div>
                  </div>
                </>
              )}
              
              {/* Registration Form */}
              {authMode === 'register' && (
                <>
                  <div className="form-group">
                    <label htmlFor="username" className="block text-text-color mb-2 font-medium">
                      Username
                    </label>
                    <div className="relative">
                      <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-glass-bg-light border border-border-light rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-text-color backdrop-blur-md transition-all"
                      />
                    </div>
                  </div>
                
                  <div className="form-group">
                    <label htmlFor="email" className="block text-text-color mb-2 font-medium">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-glass-bg-light border border-border-light rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-text-color backdrop-blur-md transition-all"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="form-group">
                      <label htmlFor="firstName" className="block text-text-color mb-2 font-medium">
                        First Name
                      </label>
                      <div className="relative">
                        <input
                          id="firstName"
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                          className="w-full px-4 py-3 bg-glass-bg-light border border-border-light rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-text-color backdrop-blur-md transition-all"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="lastName" className="block text-text-color mb-2 font-medium">
                        Last Name
                      </label>
                      <div className="relative">
                        <input
                          id="lastName"
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                          className="w-full px-4 py-3 bg-glass-bg-light border border-border-light rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-text-color backdrop-blur-md transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="password" className="block text-text-color mb-2 font-medium">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-glass-bg-light border border-border-light rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-text-color backdrop-blur-md transition-all"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="confirmPassword" className="block text-text-color mb-2 font-medium">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-glass-bg-light border border-border-light rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-text-color backdrop-blur-md transition-all"
                      />
                    </div>
                  </div>
                </>
              )}
              
              {/* Forgot Password Form */}
              {authMode === 'forgot-password' && !resetToken && (
                <div className="form-group">
                  <label htmlFor="email" className="block text-text-color mb-2 font-medium">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-glass-bg-light border border-border-light rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-text-color backdrop-blur-md transition-all"
                      placeholder="Enter your account email"
                    />
                  </div>
                  <p className="mt-2 text-sm text-text-muted">
                    We'll send a password reset link to this email address.
                  </p>
                </div>
              )}
              
              {/* Reset Password Form (with token) */}
              {authMode === 'forgot-password' && resetToken && (
                <>
                  <div className="form-group">
                    <label htmlFor="password" className="block text-text-color mb-2 font-medium">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-glass-bg-light border border-border-light rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-text-color backdrop-blur-md transition-all"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="confirmPassword" className="block text-text-color mb-2 font-medium">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-glass-bg-light border border-border-light rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-text-color backdrop-blur-md transition-all"
                      />
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full mt-8 px-8 py-4 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-lg relative overflow-hidden shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                disabled={loginMutation.isPending || registerMutation.isPending}
              >
                <span className="relative z-10">
                  {authMode === 'login' ? 'Sign In' : 
                   authMode === 'register' ? 'Create Account' : 
                   resetToken ? 'Reset Password' : 'Send Reset Link'}
                  {(loginMutation.isPending || registerMutation.isPending) && '...'}
                </span>
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary-dark to-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
              </button>

              {/* Bottom links for switching between login/register */}
              {authMode !== 'forgot-password' && (
                <div className="text-center text-text-muted mt-6">
                  {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                  <button 
                    type="button" 
                    onClick={() => switchAuthMode(authMode === 'login' ? 'register' : 'login')} 
                    className="text-primary hover:text-primary-light transition-colors font-medium"
                  >
                    {authMode === 'login' ? 'Register' : 'Login'}
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Info Side */}
          <div className="w-full md:w-1/2 p-8 md:p-12 bg-gradient-to-br from-primary/10 via-background-light/30 to-secondary/10 backdrop-blur-md flex flex-col justify-center relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 mb-12">
              <h2 className="text-4xl font-bold mb-3">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-light to-secondary text-glow">
                  NepaliPay
                </span>
              </h2>
              <p className="text-text-color text-xl font-medium mb-8">A digital financial revolution for Nepal</p>
              
              <div className="h-1 w-16 bg-gradient-to-r from-primary to-secondary rounded-full mb-8"></div>
            </div>
            
            <ul className="space-y-6 mb-12 relative z-10">
              {[
                'Secure blockchain-powered digital wallet',
                'NPT tokens pegged to Nepalese Rupee (NPR)',
                'Fast and low-cost money transfers',
                'Collateralized loans and digital payments',
                'Earn rewards through referrals'
              ].map((feature, index) => (
                <li key={index} className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs mr-4 mt-0.5 shadow-glow">✓</div>
                  <span className="text-text-muted text-lg">{feature}</span>
                </li>
              ))}
            </ul>
            
            <div className="mt-auto pt-8 text-center relative z-10">
              <div className="py-3 px-6 inline-block rounded-full bg-glass-bg-light border border-border-light text-text-dimmed text-sm backdrop-blur-lg">
                Powered by advanced blockchain technology
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CSS for the floating animation */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float {
            0% {
              transform: translateY(0px) translateX(0px);
            }
            25% {
              transform: translateY(-30px) translateX(10px);
            }
            50% {
              transform: translateY(-10px) translateX(20px);
            }
            75% {
              transform: translateY(-20px) translateX(-10px);
            }
            100% {
              transform: translateY(0px) translateX(0px);
            }
          }
        `
      }} />
    </div>
  );
}