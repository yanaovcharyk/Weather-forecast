import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import Spin from 'antd/es/spin';
import { useAuthContext } from '@/auth/contexts/AuthContext';

export const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { currentUser, isLoading } = useAuthContext();

  if (isLoading) {
    return <Spin fullscreen />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
