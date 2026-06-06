import { LoggerContext, LogMethodOptions } from '../types';
import { safeSerialize } from '../sanitize';
import {
  DEFAULT_FIELDS_TO_MASK,
  DEFAULT_FIELDS_TO_REMOVE,
} from '../constants';

export function createLogMethodWrapper(options: LogMethodOptions) {
  const {
    shouldLogArguments = false,
    shouldLogResult = false,
    shouldLogExecutionTime = true,
    fieldsToMask = DEFAULT_FIELDS_TO_MASK,
    fieldsToRemove = DEFAULT_FIELDS_TO_REMOVE,
  } = options;

  const logIfEnabled = (condition: boolean, callback: () => void) => {
    if (condition) {
      callback();
    }
  };

  return function createMethodWrapper(
    originalMethod: Function,
    loggerContext: LoggerContext,
    methodName: string,
    className: string,
  ) {
    return function wrappedMethod(...methodArguments: any[]) {
      const logger = loggerContext.logger;

      const executionStartTimestamp = Date.now();

      logger?.info(`${className}.${methodName} called`);

      logIfEnabled(shouldLogArguments, () => {
        const sanitizedArguments = methodArguments
          .map((argument) => {
            const sanitizedValue = safeSerialize(
              argument,
              fieldsToMask,
              fieldsToRemove,
            );

            return sanitizedValue === '[FilteredRequestObject]'
              ? undefined
              : sanitizedValue;
          })
          .filter(
            (value): value is Exclude<typeof value, undefined> =>
              value !== undefined,
          );

        logger?.debug(`${className}.${methodName} arguments`, {
          arguments: sanitizedArguments,
        });
      });

      try {
        const methodResult = originalMethod.apply(
          loggerContext,
          methodArguments,
        );

        if (methodResult instanceof Promise) {
          return methodResult
            .then((result) => {
              logIfEnabled(shouldLogExecutionTime, () => {
                logger?.debug(`${className}.${methodName} completed`, {
                  executionTimeMilliseconds:
                    Date.now() - executionStartTimestamp,
                });
              });

              logIfEnabled(shouldLogResult, () => {
                logger?.debug(`${className}.${methodName} result`, {
                  result: safeSerialize(
                    result,
                    fieldsToMask,
                    fieldsToRemove,
                  ),
                });
              });

              return result;
            })
            .catch((error) => {
              logger?.error(`${className}.${methodName} failed`, {
                error:
                  error instanceof Error
                    ? error.message
                    : String(error),

                executionTimeMilliseconds:
                  Date.now() - executionStartTimestamp,
              });

              throw error;
            });
        }

        logIfEnabled(shouldLogExecutionTime, () => {
          logger?.debug(`${className}.${methodName} completed`, {
            executionTimeMilliseconds:
              Date.now() - executionStartTimestamp,
          });
        });

        logIfEnabled(shouldLogResult, () => {
          logger?.debug(`${className}.${methodName} result`, {
            result: safeSerialize(
              methodResult,
              fieldsToMask,
              fieldsToRemove,
            ),
          });
        });

        return methodResult;
      } catch (error) {
        logger?.error(`${className}.${methodName} failed`, {
          error:
            error instanceof Error
              ? error.message
              : String(error),

          executionTimeMilliseconds:
            Date.now() - executionStartTimestamp,
        });

        throw error;
      }
    };
  };
}
