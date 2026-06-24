import { vi } from 'vitest';
import { useMutationMock } from './useMutationMock';
import type { ErrorLike } from '@apollo/client';
import { createMutationResult } from '@/test/factories';

export const createMutationMock = (
  overrides?: Partial<{
    data: unknown;
    error: ErrorLike | undefined;
    loading: boolean;
    called: boolean;
  }>,
) => {
  const mutate = vi.fn();

  const result = createMutationResult(overrides);

  useMutationMock.mockReturnValue([mutate, result]);

  return { mutate, result };
};
