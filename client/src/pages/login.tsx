import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';

const LoginPage: React.FC = () => {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  
  useEffect(() => {
    // Redirect to auth page
    navigate('/auth');
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex justify-center items-center bg-black">
      <div className="text-white text-center">
        <p>Redirecting to login page...</p>
      </div>
    </div>
  );
};

export default LoginPage;