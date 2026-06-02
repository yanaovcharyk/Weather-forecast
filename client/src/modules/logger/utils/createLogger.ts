import { logger } from '../services/LoggerService';

export function createLogger(module: string) {
  return logger.child({
    module,
  });
}
