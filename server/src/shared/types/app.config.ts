import { StringValue } from 'ms';
export interface IAppConfig {
  nodeEnv: 'development' | 'production';
  port: number;

  app: {
    prefix: string;
    cors: boolean;
  };

  db: {
    type: string;
    host: string;
    port: number;
    user: string;
    password: string;
    name: string;
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
