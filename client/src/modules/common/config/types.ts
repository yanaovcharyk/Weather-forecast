import type { LogLevel } from '@/logger/types';

export interface IFrontendConfig {
  apiBaseUrl: string;
  graphqlPath: string;
  loggerApiUrl: string;

  loggerEnabled: boolean;
  loggerLevel: LogLevel;
  loggerConsole: boolean;
  loggerRemote: boolean;
  apolloDevtools: boolean;
}
