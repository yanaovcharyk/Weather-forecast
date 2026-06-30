import { IAppConfig } from '@shared/types';
import { Env } from './env.schema';

export const configuration = (env: Env): IAppConfig => ({
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
    synchronize: env.DB_SYNCHRONIZE,
    logging: env.DB_LOGGING,
    migrationsRun: env.DB_MIGRATIONS_RUN,
  },

  auth: {
    cookie: {
      httpOnly: env.AUTH_COOKIE_HTTP_ONLY,
      secure: env.AUTH_COOKIE_SECURE,
      sameSite: env.AUTH_COOKIE_SAME_SITE,
      path: env.AUTH_COOKIE_PATH,
    },
  },

  logger: {
    level: env.SERVER_LOG_LEVEL,
    consoleEnabled: env.SERVER_LOG_CONSOLE_ENABLED,
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
