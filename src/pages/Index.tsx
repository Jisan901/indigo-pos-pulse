
import { useAuth } from '@/hooks/useAuth';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.data?.user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [user?.data?.user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gemini-bg">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gemini-neon"></div>
    </div>
  );
};

export default Index;
