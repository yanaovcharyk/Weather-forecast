import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { getRequiredConfig } from '@config/config-service.util';
import {
  CreateCities1720000000002,
  CreateUsers1720000000001,
  SplitUserAuth1720000000003,
} from '@database/migrations';
import { IAppConfig } from '@shared/types';

export const typeormConfig = (
  configService: ConfigService<IAppConfig>,
): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    host: getRequiredConfig(configService, 'db.host'),
    port: getRequiredConfig(configService, 'db.port'),
    username: getRequiredConfig(configService, 'db.user'),
    password: getRequiredConfig(configService, 'db.password'),
    database: getRequiredConfig(configService, 'db.name'),

    autoLoadEntities: true,
    synchronize: getRequiredConfig(configService, 'db.synchronize'),
    logging: getRequiredConfig(configService, 'db.logging'),

    migrations: [
      CreateUsers1720000000001,
      CreateCities1720000000002,
      SplitUserAuth1720000000003,
    ],
    migrationsRun: getRequiredConfig(configService, 'db.migrationsRun'),
  };
};
