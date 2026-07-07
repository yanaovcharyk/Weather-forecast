import { z } from 'zod';
import type { LogLevel } from '@/logger/types';

const booleanFromEnv = z.preprocess((value) => {
  if (typeof value !== 'string') {
    return value;
  }

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  return value;
}, z.boolean());

export const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url().default('http://localhost:3000'),
  VITE_GRAPHQL_PATH: z.string().min(1).default('/graphql'),
  VITE_LOGGER_API_URL: z
    .string()
    .url()
    .default('http://localhost:3000/graphql'),

  VITE_LOGGER_ENABLED: booleanFromEnv.default(false),
  VITE_LOGGER_LEVEL: z
    .enum(['info', 'warn', 'error', 'debug'])
    .default('info') satisfies z.ZodType<LogLevel>,
  VITE_LOGGER_CONSOLE: booleanFromEnv.default(false),
  VITE_LOGGER_REMOTE: booleanFromEnv.default(false),

  VITE_APOLLO_DEVTOOLS: booleanFromEnv.default(false),
});

export type FrontendEnv = z.infer<typeof envSchema>;
