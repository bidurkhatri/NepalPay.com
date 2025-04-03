import React, { useState } from 'react';
import { useLocation } from 'wouter';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [error, setError] = useState('');
  const [, setLocation] = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoggingIn(true);
      
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      if (res.ok) {
        console.log('Login successful');
        setLocation('/dashboard');
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4">
      <div className="glass-card max-w-md w-full">
        <h2 className="text-2xl font-bold text-white mb-6">NepaliPay Login</h2>
        
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-white">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="modern-input w-full"
              placeholder="Enter your username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="modern-input w-full"
              placeholder="Enter your password"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loggingIn}
            className="modern-button w-full"
          >
            {loggingIn ? 'Logging in...' : 'Login'}
          </button>
          <p className="text-sm text-gray-300 mt-4">
            Don't have an account? <a href="/register" className="text-blue-400 hover:text-blue-300">Register</a>
          </p>
          <p className="text-sm text-gray-300 mt-2">
            Demo account: Username: <span className="text-white font-medium">demo</span>, Password: <span className="text-white font-medium">password</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;