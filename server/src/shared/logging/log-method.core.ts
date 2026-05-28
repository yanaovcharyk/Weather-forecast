import { LoggerContext } from './logger-context';

import { safeSerialize } from './sanitize';

export type LogMethodOptions = {
  shouldLogArguments?: boolean;
  shouldLogResult?: boolean;
  shouldLogExecutionTime?: boolean;
  fieldsToMask?: string[];
  fieldsToRemove?: string[];
};

export function createLogMethodWrapper(
  options: LogMethodOptions,
) {

  const {
    shouldLogArguments = true,
    shouldLogResult = false,
    shouldLogExecutionTime = true,
    fieldsToMask = [
      'password',
      'refreshToken',
      'accessToken',
    ],
    fieldsToRemove = [
      'req',
      'res',
      'socket',
      'client',
      '_doc',
    ],
  } = options;

  return function createMethodWrapper(
    originalMethod: Function,
    loggerContext: LoggerContext,
    methodName: string,
    className: string,
  ) {

    return async function wrappedMethod(
      ...methodArguments: any[]
    ) {

      const logger = loggerContext.logger;

      const executionStartTimestamp = Date.now();

      logger?.info(`${className}.${methodName} called`);

      if (shouldLogArguments) {
        const sanitizedArguments =
          methodArguments
            .map(argument => {
              const sanitizedValue =
                safeSerialize(
                  argument,
                  fieldsToMask,
                  fieldsToRemove,
                );

              if (
                sanitizedValue ===
                '[FilteredRequestObject]'
              ) {
                return undefined;
              }

              return sanitizedValue;
            })
            .filter(
              sanitizedValue =>
                sanitizedValue !== undefined,
            );

        logger?.debug(
          `${className}.${methodName} arguments`,
          {
            arguments: sanitizedArguments,
          },
        );
      }

      try {
        const methodResult =
          await originalMethod.apply(
            loggerContext,
            methodArguments,
          );

        if (shouldLogExecutionTime) {
          logger?.debug(
            `${className}.${methodName} completed`,
            {
              executionTimeMilliseconds:
                Date.now() -
                executionStartTimestamp,
            },
          );
        }

        if (shouldLogResult) {
          logger?.debug(
            `${className}.${methodName} result`,
            {
              result: safeSerialize(
                methodResult,
                fieldsToMask,
                fieldsToRemove,
              ),
            },
          );
        }

        return methodResult;
      } catch (error) {

        logger?.error(
          `${className}.${methodName} failed`,
          {
            error:
              error instanceof Error
                ? error.message
                : String(error),

            executionTimeMilliseconds:
              Date.now() -
              executionStartTimestamp,
          },
        );

        throw error;
      }
    };
  };
}
