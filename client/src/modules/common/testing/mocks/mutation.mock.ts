import type { ErrorLike } from '@apollo/client';
import { mockApolloMutation } from './apollo.mock';

export const createMutationMock = (
  overrides?: Partial<{
    data: unknown;
    error: ErrorLike | undefined;
    loading: boolean;
    called: boolean;
  }>,
) => {
  return mockApolloMutation({
    result: overrides,
  });
};
