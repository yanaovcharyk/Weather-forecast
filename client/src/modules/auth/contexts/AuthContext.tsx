import { createContext } from 'react';

export interface IAuthContextValue {
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

export const AuthContext = createContext<IAuthContextValue>({
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  loading: false,
});
