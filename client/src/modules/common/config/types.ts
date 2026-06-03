export interface IFrontendConfig {
  apiBaseUrl: string;
  graphqlPath: string;
  loggerApiUrl: string;

  appEnv: string;
  loggerEnabled: string;
  loggerLevel: string;
  loggerConsole: string;
  loggerRemote: string;
}

export type ConfigKey = keyof IFrontendConfig;
export type EnvVarName = string;
export type ConfigSchema = Record<ConfigKey, EnvVarName>;
