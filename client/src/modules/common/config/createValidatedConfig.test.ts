import { describe, expect, it } from 'vitest';

import { createValidatedConfig } from './createValidatedConfig';
import { LogLevel } from '@/logger/types';

describe('createValidatedConfig', () => {
  it('creates typed config object from environment variables', () => {
    const result = createValidatedConfig({
      VITE_API_BASE_URL: 'http://localhost:3000',
      VITE_GRAPHQL_PATH: '/graphql',
      VITE_LOGGER_API_URL: 'http://localhost:3000/graphql',
      VITE_LOGGER_ENABLED: 'true',
      VITE_LOGGER_LEVEL: 'warn',
      VITE_LOGGER_CONSOLE: 'false',
      VITE_LOGGER_REMOTE: 'true',
      VITE_APOLLO_DEVTOOLS: 'true',
    });

    expect(result).toEqual({
      apiBaseUrl: 'http://localhost:3000',
      graphqlPath: '/graphql',
      loggerApiUrl: 'http://localhost:3000/graphql',
      loggerEnabled: true,
      loggerLevel: LogLevel.Warn,
      isLoggerConsole: false,
      isLoggerRemote: true,
      isApolloDevtoolsEnabled: true,
    });
  });

  it('uses defaults for optional frontend environment variables', () => {
    expect(createValidatedConfig({})).toEqual({
      apiBaseUrl: 'http://localhost:3000',
      graphqlPath: '/graphql',
      loggerApiUrl: 'http://localhost:3000/graphql',
      loggerEnabled: false,
      loggerLevel: LogLevel.Info,
      isLoggerConsole: false,
      isLoggerRemote: false,
      isApolloDevtoolsEnabled: false,
    });
  });

  it('accepts boolean frontend environment variables', () => {
    expect(
      createValidatedConfig({
        VITE_LOGGER_ENABLED: true,
        VITE_LOGGER_CONSOLE: false,
        VITE_LOGGER_REMOTE: true,
        VITE_APOLLO_DEVTOOLS: false,
      }),
    ).toEqual({
      apiBaseUrl: 'http://localhost:3000',
      graphqlPath: '/graphql',
      loggerApiUrl: 'http://localhost:3000/graphql',
      loggerEnabled: true,
      loggerLevel: LogLevel.Info,
      isLoggerConsole: false,
      isLoggerRemote: true,
      isApolloDevtoolsEnabled: false,
    });
  });

  it('throws for invalid frontend environment variables', () => {
    expect(() =>
      createValidatedConfig({
        VITE_LOGGER_LEVEL: 'verbose',
      }),
    ).toThrow('Invalid frontend environment variables');
  });

  it('throws when boolean frontend environment variable is not boolean-like', () => {
    expect(() =>
      createValidatedConfig({
        VITE_LOGGER_ENABLED: 'yes',
      }),
    ).toThrow('Invalid frontend environment variables');
  });
});
