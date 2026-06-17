import { vi } from 'vitest';

export const createApolloMutationMock = () => {
  const mutate = vi.fn();

  return {
    mutate,
  };
};
