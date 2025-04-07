import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();

  // Use useEffect to handle redirection instead of doing it in render
  useEffect(() => {
    if (user) {
      setLocation('/');
    }
  }, [user, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        loginMutation.mutate(
          { username, password },
          {
            onError: (error) => {
              setError(error.message);
            },
          }
        );
      } else {
        registerMutation.mutate(
          { username, password, email, firstName, lastName },
          {
            onError: (error) => {
              setError(error.message);
            },
          }
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  // If user is already logged in, don't render the form
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center p-4">
      <div className="glass cyber-card w-full max-w-6xl flex flex-col md:flex-row overflow-hidden rounded-xl shadow-glow">
        <div className="w-full md:w-1/2 p-8">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500 mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-white/60">
              {isLogin
                ? 'Sign in to access your NepaliPay wallet.'
                : 'Join the digital financial revolution in Nepal.'}
            </p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg p-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="form-group">
              <label htmlFor="username" className="block text-white/80 mb-1 text-sm font-medium">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2 bg-black/40 border border-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-white"
              />
            </div>

            {!isLogin && (
              <>
                <div className="form-group">
                  <label htmlFor="email" className="block text-white/80 mb-1 text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 bg-black/40 border border-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-white"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label htmlFor="firstName" className="block text-white/80 mb-1 text-sm font-medium">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="w-full px-4 py-2 bg-black/40 border border-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-white"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName" className="block text-white/80 mb-1 text-sm font-medium">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="w-full px-4 py-2 bg-black/40 border border-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-white"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="form-group">
              <label htmlFor="password" className="block text-white/80 mb-1 text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 bg-black/40 border border-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-white"
              />
            </div>

            <button
              type="submit"
              className="cyber-btn primary-glass-btn w-full py-3 font-semibold"
              disabled={loginMutation.isPending || registerMutation.isPending}
            >
              {isLogin ? 'Sign In' : 'Create Account'}
              {(loginMutation.isPending || registerMutation.isPending) && '...'}
            </button>

            <div className="form-switch text-center text-white/60 mt-4">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button 
                type="button" 
                onClick={toggleAuthMode} 
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                {isLogin ? 'Register' : 'Login'}
              </button>
            </div>
          </form>
        </div>

        <div className="w-full md:w-1/2 p-8 bg-gradient-to-br from-primary/20 to-purple-900/20 backdrop-blur-sm flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500 mb-3">
              NepaliPay
            </h2>
            <p className="text-white/80 text-lg font-medium mb-6">A digital financial revolution for Nepal</p>
          </div>
          
          <ul className="space-y-4">
            {[
              'Secure blockchain-powered digital wallet',
              'NPT tokens pegged to Nepalese Rupee (NPR)',
              'Fast and low-cost money transfers',
              'Collateralized loans and digital payments',
              'Earn rewards through referrals'
            ].map((feature, index) => (
              <li key={index} className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-primary mr-3"></div>
                <span className="text-white/70">{feature}</span>
              </li>
            ))}
          </ul>
          
          <div className="mt-auto pt-4 text-center">
            <div className="text-white/40 text-sm">
              Powered by advanced blockchain technology
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}