
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  // Get the current path to redirect after login
  const currentPath = window.location.pathname;
  const redirectPath = currentPath === '/' ? '/dashboard' : currentPath;

  if (!user?.data?.user) {
    return <Navigate to={`/login?redirect=${redirectPath}`} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
