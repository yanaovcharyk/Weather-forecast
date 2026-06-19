import { vi } from 'vitest';

export const createMutationState = (overrides = {}) => ({
  loading: false,
  data: undefined,
  error: undefined,
  called: false,
  client: {} as never,
  reset: vi.fn(),
  ...overrides,
});
