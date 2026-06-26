import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DATABASE_DRIVERS } from './typeorm';
import { DatabaseType } from './database.types';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (config: ConfigService) => {
            const driver = config.get<DatabaseType>('db.type') ?? DatabaseType.POSTGRES;

            const configFactory = DATABASE_DRIVERS[driver];

            if (!configFactory) {
              throw new Error(`Unsupported DB_DRIVER: ${driver}`);
            }

            return configFactory(config);
          },
        }),
      ],
      exports: [TypeOrmModule],
    };
  }
}
