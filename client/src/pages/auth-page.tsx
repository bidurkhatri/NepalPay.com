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
      setLocation('/dashboard');
      console.log("User authenticated, redirecting to dashboard");
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
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-text-muted text-lg">
                {isLogin
                  ? 'Sign in to access your NepaliPay wallet.'
                  : 'Join the digital financial revolution in Nepal.'}
              </p>
            </div>

            {error && (
              <div className="bg-danger/10 border border-danger/20 text-danger-light rounded-lg p-4 mb-6 backdrop-blur-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
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
                  <div className="absolute inset-0 rounded-lg pointer-events-none border border-primary/0 group-focus-within:border-primary/20 transition-colors"></div>
                </div>
              </div>

              {!isLogin && (
                <>
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
                </>
              )}

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

              <button
                type="submit"
                className="w-full mt-8 px-8 py-4 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-lg relative overflow-hidden shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                disabled={loginMutation.isPending || registerMutation.isPending}
              >
                <span className="relative z-10">
                  {isLogin ? 'Sign In' : 'Create Account'}
                  {(loginMutation.isPending || registerMutation.isPending) && '...'}
                </span>
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary-dark to-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
              </button>

              <div className="text-center text-text-muted mt-6">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <button 
                  type="button" 
                  onClick={toggleAuthMode} 
                  className="text-primary hover:text-primary-light transition-colors font-medium"
                >
                  {isLogin ? 'Register' : 'Login'}
                </button>
              </div>
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