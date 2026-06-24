import { vi } from 'vitest';

export const useQueryMock = vi.fn();

vi.mock('@apollo/client/react', async () => {
  const actual = await vi.importActual<typeof import('@apollo/client/react')>(
    '@apollo/client/react',
  );

  return {
    ...actual,
    useQuery: useQueryMock,
  };
});
