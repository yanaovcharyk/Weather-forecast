import { getRequiredEnvVar } from './getRequiredEnvVar';

export const ENV = {
  loggerApiUrl: getRequiredEnvVar('VITE_LOGGER_API_URL'),
};
