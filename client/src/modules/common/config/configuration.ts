import type { FrontendEnv } from './env.schema';
import type { IFrontendConfig } from './types';

export const configuration = (env: FrontendEnv): IFrontendConfig => ({
  apiBaseUrl: env.VITE_API_BASE_URL,
  graphqlPath: env.VITE_GRAPHQL_PATH,
  loggerApiUrl: env.VITE_LOGGER_API_URL,

  loggerEnabled: env.VITE_LOGGER_ENABLED,
  loggerLevel: env.VITE_LOGGER_LEVEL,
  loggerConsole: env.VITE_LOGGER_CONSOLE,
  loggerRemote: env.VITE_LOGGER_REMOTE,
});
