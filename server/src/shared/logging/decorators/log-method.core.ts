import { LoggerContext, LogMethodOptions } from '../types';
import { safeSerialize } from '../sanitize';
import { DEFAULT_FIELDS_TO_MASK, DEFAULT_FIELDS_TO_REMOVE } from '../constants';

export function createLogMethodWrapper(options: LogMethodOptions) {
  const {
    shouldLogArguments = false,
    shouldLogResult = false,
    shouldLogExecutionTime = true,
    fieldsToMask = DEFAULT_FIELDS_TO_MASK,
    fieldsToRemove = DEFAULT_FIELDS_TO_REMOVE,
  } = options;

  return function createMethodWrapper(
    originalMethod: Function,
    loggerContext: LoggerContext,
    methodName: string,
    className: string,
  ) {
    return async function wrappedMethod(...methodArguments: any[]) {
      const logger = loggerContext.logger;

      const executionStartTimestamp = Date.now();

      logger?.info(`${className}.${methodName} called`);

      if (shouldLogArguments) {
        const sanitizedArguments = methodArguments
          .map((argument) => {
            const sanitizedValue = safeSerialize(
              argument,
              fieldsToMask,
              fieldsToRemove,
            );

            if (sanitizedValue === '[FilteredRequestObject]') {
              return undefined;
            }

            return sanitizedValue;
          })
          .filter((sanitizedValue) => sanitizedValue !== undefined);

        logger?.debug(`${className}.${methodName} arguments`, {
          arguments: sanitizedArguments,
        });
      }

      try {
        const methodResult = await originalMethod.apply(
          loggerContext,
          methodArguments,
        );

        if (shouldLogExecutionTime) {
          logger?.debug(`${className}.${methodName} completed`, {
            executionTimeMilliseconds: Date.now() - executionStartTimestamp,
          });
        }

        if (shouldLogResult) {
          logger?.debug(`${className}.${methodName} result`, {
            result: safeSerialize(methodResult, fieldsToMask, fieldsToRemove),
          });
        }

        return methodResult;
      } catch (error) {
        logger?.error(`${className}.${methodName} failed`, {
          error: error instanceof Error ? error.message : String(error),
          executionTimeMilliseconds: Date.now() - executionStartTimestamp,
        });

        throw error;
      }
    };
  };
}
