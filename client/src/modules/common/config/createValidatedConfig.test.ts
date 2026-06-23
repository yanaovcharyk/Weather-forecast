import { describe, expect, it, vi } from 'vitest';

vi.mock('./getRequiredEnvVar', () => ({
  getRequiredEnvVar: vi.fn(),
}));

import { getRequiredEnvVar } from './getRequiredEnvVar';
import { createValidatedConfig } from './createValidatedConfig';

describe('createValidatedConfig', () => {
  it('creates validated config object', () => {
    vi.mocked(getRequiredEnvVar)
      .mockReturnValueOnce('api-url')
      .mockReturnValueOnce('/graphql');

    const configSchema = {
      apiBaseUrl: 'VITE_API_URL',
      graphqlPath: 'VITE_GRAPHQL_PATH',
    };

    const result = createValidatedConfig(configSchema as never);

    expect(result).toEqual({
      apiBaseUrl: 'api-url',
      graphqlPath: '/graphql',
    });

    expect(getRequiredEnvVar).toHaveBeenCalledTimes(2);

    expect(getRequiredEnvVar).toHaveBeenNthCalledWith(1, 'VITE_API_URL');

    expect(getRequiredEnvVar).toHaveBeenNthCalledWith(2, 'VITE_GRAPHQL_PATH');
  });
});
