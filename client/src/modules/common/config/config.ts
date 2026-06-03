import { createValidatedConfig } from './createValidatedConfig';
import type { IFrontendConfig } from './types';

export const config: IFrontendConfig = createValidatedConfig({
  apiBaseUrl: 'VITE_API_BASE_URL',
  graphqlPath: 'VITE_GRAPHQL_PATH',
  loggerApiUrl: 'VITE_LOGGER_API_URL',
});
