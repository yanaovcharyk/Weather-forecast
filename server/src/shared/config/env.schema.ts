import { z } from 'zod';
import { StringValue } from 'ms';

const msRegex = /^\d+(ms|s|m|h|d)$/;

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),

  PORT: z.coerce.number().default(3000),

  DB_DRIVER: z.literal('postgres'),
  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),

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

  OPENWEATHER_API_KEY: z.string(),
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
