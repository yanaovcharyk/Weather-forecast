import type { useMutation, useQuery } from '@apollo/client/react';

export const createQueryResult = <TData = unknown>(
  overrides: Partial<useQuery.Result<TData>> = {},
) =>
  ({
    data: undefined,
    loading: false,
    error: undefined,
    fetchMore: vi.fn(),
    refetch: vi.fn(),
    ...overrides,
  }) as useQuery.Result<TData>;

export const createMutationResult = <TData = unknown>(
  overrides: Partial<useMutation.Result<TData>> = {},
) =>
  ({
    data: undefined,
    loading: false,
    error: undefined,
    called: false,
    reset: vi.fn(),
    ...overrides,
  }) as useMutation.Result<TData>;
