import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import Spin from 'antd/es/spin';
import { useAuth } from '../../modules/auth/hooks/useAuth';

export const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Spin fullscreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
