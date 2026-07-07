import type { IAuthContextValue } from '@/auth/types';

export type AuthContextType = IAuthContextValue;

export const createAuthMock = (overrides?: Partial<AuthContextType>) => ({
  currentUser: null,
  logout: vi.fn(),
  refreshSession: vi.fn(),
  isAuthenticated: false,
  isLoading: false,
  ...overrides,
});
