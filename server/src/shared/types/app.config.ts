import { StringValue } from 'ms';

export interface IAppConfig {
  port: number;

  app: {
    prefix: string;
    cors: boolean;
    corsOrigin: string;
  };

  db: {
    type: string;
    host: string;
    port: number;
    user: string;
    password: string;
    name: string;
    synchronize: boolean;
    logging: boolean;
    migrationsRun: boolean;
  };

  auth: {
    cookie: {
      httpOnly: boolean;
      secure: boolean;
      sameSite: 'strict' | 'lax' | 'none';
      path: string;
    };
  };

  logger: {
    level: 'error' | 'warn' | 'info' | 'debug' | 'verbose' | 'silly';
    consoleEnabled: boolean;
  };

  jwt: {
    accessSecret: string;
    refreshSecret: string;
    accessExpires: StringValue;
    refreshExpires: StringValue;
  };

  weatherApi: {
    key: string;
    baseUrl: string;
  };

  geoApi: {
    baseUrl: string;
  };
}
