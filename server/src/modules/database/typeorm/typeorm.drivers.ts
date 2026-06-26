import { DatabaseType } from '@database/database.types';
import { typeormConfig } from './typeorm.config';

export const DATABASE_DRIVERS: Record<DatabaseType, any> = {
  [DatabaseType.POSTGRES]: typeormConfig,
};
