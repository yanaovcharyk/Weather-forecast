import { LoggerContext } from './logger-context';
import { safeSerialize } from './sanitize';

export type LogMethodOptions = {
  logArgs?: boolean;
  logResult?: boolean;
  logExecutionTime?: boolean;
  maskFields?: string[];
  dropFields?: string[];
};

export function createLogMethodWrapper(options: LogMethodOptions) {
  const {
    logArgs = true,
    logResult = false,
    logExecutionTime = true,
    maskFields = ['password', 'refreshToken', 'accessToken'],
    dropFields = ['req', 'res', 'socket', 'client', '_doc'],
  } = options;

  return function wrap(
    originalMethod: Function,
    context: LoggerContext,
    methodName: string,
    className: string,
  ) {
    return async function (...args: any[]) {
      const logger = context.logger;
      const start = Date.now();

      logger?.info(`${methodName} called`);

      if (logArgs) {
        const cleanedArgs = args
          .map(arg => {
            const sanitized = safeSerialize(arg, maskFields, dropFields);

            return sanitized === '[FilteredRequestObject]'
              ? undefined
              : sanitized;
          })
          .filter(Boolean);

        logger?.debug(`${methodName} args`, {
          args: cleanedArgs,
        });
      }

      try {
        const result = await originalMethod.apply(context, args);

        if (logExecutionTime) {
          logger?.debug(`${methodName} completed`, {
            executionTimeMs: Date.now() - start,
          });
        }

        if (logResult) {
          logger?.debug(`${methodName} result`, {
            result: safeSerialize(result, maskFields, dropFields),
          });
        }

        return result;
      } catch (error) {
        logger?.error(`${methodName} failed`, {
          error: error instanceof Error ? error.message : String(error),
          executionTimeMs: Date.now() - start,
        });

        throw error;
      }
    };
  };
}
