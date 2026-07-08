import type { LogLevel } from '@/logger/types';

export interface IFrontendConfig {
  apiBaseUrl: string;
  graphqlPath: string;
  loggerApiUrl: string;

  loggerEnabled: boolean;
  loggerLevel: LogLevel;
  isLoggerConsole: boolean;
  isLoggerRemote: boolean;
  isApolloDevtoolsEnabled: boolean;
}
