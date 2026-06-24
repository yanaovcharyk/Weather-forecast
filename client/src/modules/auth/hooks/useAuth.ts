import { useContext } from 'react';
import { AuthContext } from '@/auth/contexts/AuthContext';

export const useAuth = () => useContext(AuthContext);
