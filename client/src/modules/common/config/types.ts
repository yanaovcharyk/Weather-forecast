import type { LogLevel } from '@/logger/types';

export interface IFrontendConfig {
  apiBaseUrl: string;
  graphqlPath: string;
  loggerApiUrl: string;

  appEnv: 'development' | 'production' | 'test';
  loggerEnabled: boolean;
  loggerLevel: LogLevel;
  loggerConsole: boolean;
  loggerRemote: boolean;
}

export type ConfigKey = keyof IFrontendConfig;
export type EnvVarName = string;
export type ConfigSchema = Record<ConfigKey, EnvVarName>;
