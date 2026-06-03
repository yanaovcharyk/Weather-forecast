import { getRequiredEnvVar } from './getRequiredEnvVar';
import type { ConfigKey, ConfigSchema, IFrontendConfig } from './types';

export function createValidatedConfig(
  configSchema: ConfigSchema,
): IFrontendConfig {
  const validatedConfig = {} as IFrontendConfig;

  for (const key in configSchema) {
    const envKey = configSchema[key as ConfigKey];
    validatedConfig[key as ConfigKey] = getRequiredEnvVar(envKey);
  }

  return validatedConfig;
}
