import { logger } from '../services/LoggerService';

export function createLogger(moduleName: string) {
  return logger.child({
    moduleName,
  });
}
