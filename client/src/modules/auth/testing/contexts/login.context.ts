import { vi } from 'vitest';

export const createLoginContext = () => ({
  mutate: vi.fn(),
  refreshSession: vi.fn(),
  navigate: vi.fn(),
  toast: vi.fn(),
});

export type LoginContext = ReturnType<typeof createLoginContext>;
