import { createContext } from 'react';
import type { IAuthContextValue } from '@/auth/types';
import { createSafeContext } from '@/common/utils';

export const AuthContext = createContext<IAuthContextValue | null>(null);

export const useAuthContext = createSafeContext(AuthContext, 'Auth');
