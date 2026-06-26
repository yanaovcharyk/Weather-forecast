import { DatabaseType } from './database.types';
import { databaseConfig } from '@database/config';

export const DATABASE_DRIVERS: Record<DatabaseType, any> = {
  [DatabaseType.POSTGRES]: databaseConfig,
};
