import { vi } from 'vitest';

export const useApolloClientMock = vi.fn();
export const useMutationMock = vi.fn();
export const useQueryMock = vi.fn();

vi.mock('@apollo/client/react', async () => {
  const actual = await vi.importActual<typeof import('@apollo/client/react')>(
    '@apollo/client/react',
  );

  return {
    ...actual,
    useApolloClient: useApolloClientMock,
    useMutation: useMutationMock,
    useQuery: useQueryMock,
  };
});
