import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { CreateCities002, CreateUsers001 } from '@database/migrations';
import { IAppConfig } from '@shared/types';

export const databaseConfig = (
  configService: ConfigService<IAppConfig>,
): TypeOrmModuleOptions => {
  const isProd = configService.get('nodeEnv', { infer: true }) === 'production';

  return {
    type: 'postgres',
    host: configService.get('db.host', { infer: true }),
    port: configService.get('db.port', { infer: true }),
    username: configService.get('db.user', { infer: true }),
    password: configService.get('db.password', { infer: true }),
    database: configService.get('db.name', { infer: true }),

    autoLoadEntities: true,
    synchronize: !isProd,
    logging: !isProd,

    migrations: isProd ? [CreateUsers001, CreateCities002] : [],
    migrationsRun: isProd,
  };
};
