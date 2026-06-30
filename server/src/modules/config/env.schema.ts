import { StringValue } from 'ms';
import { z } from 'zod';

const msRegex = /^\d+(ms|s|m|h|d)$/;
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
  PORT: z.coerce.number().default(3000),
  APP_PREFIX: z.string().min(1).default('api'),
  APP_CORS: booleanFromEnv.default(true),
  APP_CORS_ORIGIN: z.string().url().default('http://localhost:5173'),

  DB_DRIVER: z.literal('postgres'),
  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  DB_SYNCHRONIZE: booleanFromEnv.default(false),
  DB_LOGGING: booleanFromEnv.default(false),
  DB_MIGRATIONS_RUN: booleanFromEnv.default(false),

  AUTH_COOKIE_HTTP_ONLY: booleanFromEnv.default(true),
  AUTH_COOKIE_SECURE: booleanFromEnv.default(false),
  AUTH_COOKIE_SAME_SITE: z.enum(['strict', 'lax', 'none']).default('lax'),
  AUTH_COOKIE_PATH: z.string().min(1).default('/'),

  SERVER_LOG_LEVEL: z
    .enum(['error', 'warn', 'info', 'debug', 'verbose', 'silly'])
    .default('debug'),
  SERVER_LOG_CONSOLE_ENABLED: booleanFromEnv.default(true),

  JWT_ACCESS_SECRET: z.string().min(10),
  JWT_ACCESS_EXPIRES: z
    .string()
    .regex(msRegex, 'Must be like 15m, 10s, 1h')
    .default('15m'),

  JWT_REFRESH_SECRET: z.string().min(10),
  JWT_REFRESH_EXPIRES: z
    .string()
    .regex(msRegex, 'Must be like 7d, 1h')
    .default('7d'),

  OPENWEATHER_API_KEY: z
    .string()
    .min(20),
  WEATHER_BASE_URL: z
    .string()
    .url()
    .default('https://api.openweathermap.org/data/2.5'),
  GEO_BASE_URL: z
    .string()
    .url()
    .default('https://api.openweathermap.org/geo/1.0'),
});

export type Env = Omit<
  z.infer<typeof envSchema>,
  'JWT_ACCESS_EXPIRES' | 'JWT_REFRESH_EXPIRES'
> & {
  JWT_ACCESS_EXPIRES: StringValue;
  JWT_REFRESH_EXPIRES: StringValue;
};
