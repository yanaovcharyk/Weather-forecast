import type { LogLevel } from '@/logger/types';
import { LOG_LEVEL_PRIORITY } from '@/logger/constants';
import { config } from '@/common/config';

const isLoggerEnabled = () => config.loggerEnabled === 'true';

export const shouldLog = (level: LogLevel) => {
  if (!isLoggerEnabled()) {
    return false;
  }

  const minLevel = (config.loggerLevel as LogLevel) ?? 'info';

  return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[minLevel];
};
