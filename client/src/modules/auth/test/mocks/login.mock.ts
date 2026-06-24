import { vi } from 'vitest';

export const createLoginMocks = () => ({
  mutate: vi.fn(),
  login: vi.fn(),
  navigate: vi.fn(),
  toast: vi.fn(),
  loginUser: vi.fn(),
});
