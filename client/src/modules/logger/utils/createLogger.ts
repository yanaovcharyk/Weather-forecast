import { logger } from '@/logger/services/LoggerService';

export function createLogger(moduleName: string) {
  return logger.child({
    moduleName,
  });
}
