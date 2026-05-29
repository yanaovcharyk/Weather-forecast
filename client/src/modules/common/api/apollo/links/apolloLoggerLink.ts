import { ApolloLink } from '@apollo/client';
import { Observable } from 'rxjs';
import { logger } from '../../../../logger/services/LoggerService';
import { normalizeError } from '../../../../logger/utils/normalizeError';
import { safeVariables } from '../../../../logger/utils/safeVariables';

const MODULE = 'Apollo';

export const apolloLoggerLink = new ApolloLink((operation, forward) => {
  const requestId = crypto.randomUUID();
  const startedAt = performance.now();

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      'x-request-id': requestId,
    },
    requestId,
  }));

  logger.debug('GraphQL request initialized', {
    module: MODULE,
    requestId,
    operationName: operation.operationName,
  });

  logger.info('GraphQL request started', {
    module: MODULE,
    requestId,
    operationName: operation.operationName,
    variables: safeVariables(operation.variables),
  });

  logger.debug('GraphQL variables snapshot', {
    module: MODULE,
    requestId,
    variables: safeVariables(operation.variables),
  });

  return new Observable((observer) => {
    const subscription = forward(operation).subscribe({
      next: (result) => {
        const duration = Math.round(performance.now() - startedAt);

        logger.debug('GraphQL response received', {
          module: MODULE,
          requestId,
          operationName: operation.operationName,
          hasErrors: Boolean(result.errors?.length),
          dataKeys: result.data ? Object.keys(result.data) : [],
        });

        logger.info('GraphQL request completed', {
          module: MODULE,
          requestId,
          operationName: operation.operationName,
          executionTimeMs: duration,
          hasErrors: Boolean(result.errors?.length),
        });

        if (result.errors?.length) {
          logger.warn('GraphQL response contains errors', {
            module: MODULE,
            requestId,
            operationName: operation.operationName,
            errorsCount: result.errors.length,
          });
        }

        observer.next(result);
        observer.complete();
      },

      error: (error) => {
        const duration = Math.round(performance.now() - startedAt);

        logger.debug('GraphQL request failed (raw error captured)', {
          module: MODULE,
          requestId,
          operationName: operation.operationName,
          rawError: String(error),
        });

        logger.error('GraphQL request failed', {
          module: MODULE,
          requestId,
          operationName: operation.operationName,
          executionTimeMs: duration,
          error: normalizeError(error),
          variables: safeVariables(operation.variables),
        });

        observer.error(error);
      },

      complete: () => {
        logger.debug('GraphQL observable completed', {
          module: MODULE,
          requestId,
        });

        observer.complete();
      },
    });

    return () => {
      logger.debug('GraphQL request unsubscribed', {
        module: MODULE,
        requestId,
      });

      subscription.unsubscribe();
    };
  });
});
