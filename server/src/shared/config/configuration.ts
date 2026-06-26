import { IAppConfig } from '@shared/types';
import { Env } from './env.schema';

export const configuration = (env: Env): IAppConfig => ({
  nodeEnv: env.NODE_ENV,
  port: env.PORT,

  app: {
    prefix: env.APP_PREFIX,
    cors: env.APP_CORS,
    corsOrigin: env.APP_CORS_ORIGIN,
  },

  db: {
    type: env.DB_DRIVER,
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    name: env.DB_NAME,
  },

  jwt: {
    accessSecret: env.JWT_ACCESS_SECRET,
    refreshSecret: env.JWT_REFRESH_SECRET,
    accessExpires: env.JWT_ACCESS_EXPIRES,
    refreshExpires: env.JWT_REFRESH_EXPIRES,
  },

  weatherApi: {
    key: env.OPENWEATHER_API_KEY,
    baseUrl: env.WEATHER_BASE_URL,
  },

  geoApi: {
    baseUrl: env.GEO_BASE_URL,
  },
});
