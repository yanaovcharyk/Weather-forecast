import type { LogLevel } from '@/logger/types';
import { LOG_LEVEL_PRIORITY } from '@/logger/constants';
import { config } from '@/common/config';

export const shouldLog = (level: LogLevel) => {
  if (!config.loggerEnabled) {
    return false;
  }

  const minLevel = config.loggerLevel ?? 'info';

  return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[minLevel];
};
