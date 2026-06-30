import { configuration } from './configuration';
import { envSchema, type FrontendEnv } from './env.schema';
import type { IFrontendConfig } from './types';

export function createValidatedConfig(
  env: Record<string, unknown> = import.meta.env,
): IFrontendConfig {
  const parsed = envSchema.safeParse(env);

  if (!parsed.success) {
    throw new Error('Invalid frontend environment variables');
  }

  return configuration(parsed.data as FrontendEnv);
}
