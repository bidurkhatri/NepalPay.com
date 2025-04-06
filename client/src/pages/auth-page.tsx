import { useState } from 'react';
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

  // Redirect if user is already logged in
  if (user) {
    setLocation('/');
    return null;
  }

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

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form-container">
          <h1>{isLogin ? 'Login' : 'Create Account'}</h1>
          <p>
            {isLogin
              ? 'Sign in to access your NepaliPay wallet.'
              : 'Register for a new NepaliPay account.'}
          </p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {!isLogin && (
              <>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loginMutation.isPending || registerMutation.isPending}
            >
              {isLogin ? 'Sign In' : 'Create Account'}
              {(loginMutation.isPending || registerMutation.isPending) && '...'}
            </button>

            <div className="form-switch">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button type="button" onClick={toggleAuthMode}>
                {isLogin ? 'Register' : 'Login'}
              </button>
            </div>
          </form>
        </div>

        <div className="auth-hero">
          <h2>NepaliPay</h2>
          <p>A digital financial revolution for Nepal</p>
          <ul>
            <li>Secure blockchain-powered digital wallet</li>
            <li>NPT tokens pegged to Nepalese Rupee (NPR)</li>
            <li>Fast and low-cost money transfers</li>
            <li>Collateralized loans and digital payments</li>
            <li>Earn rewards through referrals</li>
          </ul>
        </div>
      </div>
    </div>
  );
}