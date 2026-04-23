export interface AppConfig {
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
    accessExpires: `${number}${'ms' | 's' | 'm' | 'h' | 'd'}`;
    refreshExpires: `${number}${'ms' | 's' | 'm' | 'h' | 'd'}`;
  };

  weatherApi: {
    key: string;
    baseUrl: string;
  };

  geoApi: {
    baseUrl: string;
  };
}
