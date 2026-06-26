import type { AuthContext } from '@/auth/contexts/AuthContext';

export type AuthContextType = React.ContextType<typeof AuthContext>;

export const createAuthMock = (overrides?: Partial<AuthContextType>) => ({
  login: vi.fn(),
  logout: vi.fn(),
  isAuthenticated: false,
  loading: false,
  ...overrides,
});
