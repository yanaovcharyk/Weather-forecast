export interface IFrontendConfig {
  apiBaseUrl: string;
  graphqlPath: string;
  loggerApiUrl: string;
}

export type ConfigKey = keyof IFrontendConfig;
export type EnvVarName = string;
export type ConfigSchema = Record<ConfigKey, EnvVarName>;
