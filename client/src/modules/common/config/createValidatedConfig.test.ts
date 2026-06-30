import { describe, expect, it } from 'vitest';

import { createValidatedConfig } from './createValidatedConfig';

describe('createValidatedConfig', () => {
  it('creates typed config object from environment variables', () => {
    const result = createValidatedConfig({
      VITE_API_BASE_URL: 'http://localhost:3000',
      VITE_GRAPHQL_PATH: '/graphql',
      VITE_LOGGER_API_URL: 'http://localhost:3000/graphql',
      VITE_APP_ENV: 'test',
      VITE_LOGGER_ENABLED: 'true',
      VITE_LOGGER_LEVEL: 'warn',
      VITE_LOGGER_CONSOLE: 'false',
    });

    expect(result).toEqual({
      apiBaseUrl: 'http://localhost:3000',
      graphqlPath: '/graphql',
      loggerApiUrl: 'http://localhost:3000/graphql',
      appEnv: 'test',
      loggerEnabled: true,
      loggerLevel: 'warn',
      loggerConsole: false,
    });
  });

  it('uses defaults for optional frontend environment variables', () => {
    expect(createValidatedConfig({})).toEqual({
      apiBaseUrl: 'http://localhost:3000',
      graphqlPath: '/graphql',
      loggerApiUrl: 'http://localhost:3000/graphql',
      appEnv: 'development',
      loggerEnabled: false,
      loggerLevel: 'info',
      loggerConsole: false,
    });
  });

  it('throws for invalid frontend environment variables', () => {
    expect(() =>
      createValidatedConfig({
        VITE_LOGGER_LEVEL: 'verbose',
      }),
    ).toThrow('Invalid frontend environment variables');
  });
});
