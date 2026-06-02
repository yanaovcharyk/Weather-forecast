import { ApolloLink } from '@apollo/client';
import { Observable } from 'rxjs';
import { normalizeError } from '../../../../logger/utils/normalizeError';
import { safeVariables } from '../../../../logger/utils/safeVariables';
import { loggerContext } from '../../../../logger/context/LoggerContextStore';
import { apolloLogger } from '../../../../logger/loggers';

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

  loggerContext.set({
    ...loggerContext.get(),
    requestId,
  });

  apolloLogger.debug('GraphQL request initialized', {
    operationName: operation.operationName,
  });

  apolloLogger.info('GraphQL request started', {
    operationName: operation.operationName,
    variables: safeVariables(operation.variables),
  });

  apolloLogger.debug('GraphQL variables snapshot', {
    variables: safeVariables(operation.variables),
  });

  return new Observable((observer) => {
    const subscription = forward(operation).subscribe({
      next: (result) => {
        const duration = Math.round(performance.now() - startedAt);

        apolloLogger.debug('GraphQL response received', {
          operationName: operation.operationName,
          hasErrors: Boolean(result.errors?.length),
          dataKeys: result.data ? Object.keys(result.data) : [],
        });

        apolloLogger.info('GraphQL request completed', {
          operationName: operation.operationName,
          executionTimeMs: duration,
          hasErrors: Boolean(result.errors?.length),
        });

        if (result.errors?.length) {
          apolloLogger.warn('GraphQL response contains errors', {
            operationName: operation.operationName,
            errorsCount: result.errors.length,
          });
        }

        observer.next(result);
        observer.complete();
      },

      error: (error) => {
        const duration = Math.round(performance.now() - startedAt);

        apolloLogger.debug('GraphQL request failed (raw error captured)', {
          operationName: operation.operationName,
          rawError: String(error),
        });

        apolloLogger.error('GraphQL request failed', {
          operationName: operation.operationName,
          executionTimeMs: duration,
          error: normalizeError(error),
          variables: safeVariables(operation.variables),
        });

        observer.error(error);
      },

      complete: () => {
        apolloLogger.debug('GraphQL observable completed');

        observer.complete();
      },
    });

    return () => {
      apolloLogger.debug('GraphQL request unsubscribed');

      subscription.unsubscribe();
    };
  });
});
