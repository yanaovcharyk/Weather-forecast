import { vi } from 'vitest';

import { createApolloClient } from '@/common/api/apollo/createApolloClient';

export const createTestApolloClient = () =>
  createApolloClient({
    displayErrorMessage: vi.fn(),
  });
