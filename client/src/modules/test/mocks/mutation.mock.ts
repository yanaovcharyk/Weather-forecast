import { vi } from 'vitest';
import { useMutationMock } from './useMutationMock';

export const createMutationMock = (
  overrides?: Partial<{
    data: unknown;
    error: unknown;
    loading: boolean;
    called: boolean;
  }>,
) => {
  const mutate = vi.fn();

  const result = {
    data: undefined,
    error: undefined,
    loading: false,
    called: false,
    client: null!,
    reset: vi.fn(),
    ...overrides,
  };

  useMutationMock.mockReturnValue([mutate, result]);

  return { mutate, result };
};
