import { vi } from 'vitest';
import type { useQuery } from '@apollo/client/react';

export const createQueryMock = <TData>() =>
  ({
    data: undefined,
    loading: false,
    error: undefined,
    networkStatus: 7,

    refetch: vi.fn(),

    fetchMore: vi.fn(),
    startPolling: vi.fn(),
    stopPolling: vi.fn(),
    subscribeToMore: vi.fn(),
    updateQuery: vi.fn(),

    observable: {} as never,
    client: {} as never,
    variables: {},
  }) as unknown as useQuery.Result<TData>;
