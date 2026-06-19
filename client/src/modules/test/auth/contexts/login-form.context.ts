import { vi } from 'vitest';

export const createLoginFormContext = () => ({
  loginUser: vi.fn(),
});

export type LoginFormContext = ReturnType<typeof createLoginFormContext>;
