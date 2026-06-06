import { DatabaseType } from './database.types';
import { databaseConfig } from '@shared/config';

export const DATABASE_DRIVERS: Record<DatabaseType, any> = {
  [DatabaseType.POSTGRES]: databaseConfig,
};
