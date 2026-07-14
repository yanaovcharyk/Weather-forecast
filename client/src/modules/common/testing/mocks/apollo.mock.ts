import { vi, type Mock } from 'vitest';
import type { useMutation, useQuery } from '@apollo/client/react';

import {
  createMutationResult,
  createQueryResult,
} from '@/common/testing/factories';

const apolloHookMocks = vi.hoisted(() => ({
  useApolloClientMock: vi.fn(),
  useLazyQueryMock: vi.fn(),
  useMutationMock: vi.fn(),
  useQueryMock: vi.fn(),
}));

export const {
  useApolloClientMock,
  useLazyQueryMock,
  useMutationMock,
  useQueryMock,
} = apolloHookMocks;

vi.mock('@apollo/client/react', async () => {
  const actual = await vi.importActual<typeof import('@apollo/client/react')>(
    '@apollo/client/react',
  );

  return {
    ...actual,
    useApolloClient: apolloHookMocks.useApolloClientMock,
    useLazyQuery: apolloHookMocks.useLazyQueryMock,
    useMutation: apolloHookMocks.useMutationMock,
    useQuery: apolloHookMocks.useQueryMock,
  };
});

type ApolloMutationMockOptions<TData> = {
  mutate?: Mock;
  result?: Partial<useMutation.Result<TData>>;
};

type ApolloLazyQueryMockOptions<TData> = {
  execute?: Mock;
  result?: Partial<useQuery.Result<TData>>;
};

export const mockApolloQuery = <TData = unknown>(
  resultOverrides: Partial<useQuery.Result<TData>> = {},
) => {
  const result = createQueryResult<TData>(resultOverrides);

  useQueryMock.mockReturnValue(result);

  return result;
};

export const mockApolloMutation = <TData = unknown>({
  mutate = vi.fn(),
  result: resultOverrides = {},
}: ApolloMutationMockOptions<TData> = {}) => {
  const result = createMutationResult<TData>(resultOverrides);

  useMutationMock.mockReturnValue([mutate, result]);

  return {
    mutate,
    result,
  };
};

export const mockApolloLazyQuery = <TData = unknown>({
  execute = vi.fn(),
  result: resultOverrides = {},
}: ApolloLazyQueryMockOptions<TData> = {}) => {
  const result = createQueryResult<TData>(resultOverrides);

  useLazyQueryMock.mockReturnValue([execute, result]);

  return {
    execute,
    result,
  };
};
