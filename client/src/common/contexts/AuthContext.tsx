import { createContext } from 'react';

export interface AuthContextValue {
  login: () => void;
  logout: () => void;

  isAuthenticated: boolean;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextValue>({
  login: () => {},
  logout: () => {},

  isAuthenticated: false,
  loading: false,
});
