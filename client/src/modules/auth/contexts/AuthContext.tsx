import { createContext } from 'react';
import type { IAuthContextValue } from '../types';

export const AuthContext = createContext<IAuthContextValue>({
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  loading: false,
});
