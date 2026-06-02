import { ApolloLink } from '@apollo/client';
import { Observable } from 'rxjs';

import { loggerContext } from '@/logger/context/LoggerContextStore';
import { createLogger } from '@/logger/utils/createLogger';

export const apolloLogger = createLogger('Apollo');

export const apolloLoggerLink = new ApolloLink((operation, forward) => {
  const requestId = crypto.randomUUID();

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

  const operationLogging = apolloLogger.operation('graphql.request', {
    operationName: operation.operationName,
    variables: operation.variables,
  });

  return new Observable((observer) => {
    const subscription = forward(operation).subscribe({
      next: (result) => {
        const hasErrors = Boolean(result.errors?.length);

        if (hasErrors) {
          operationLogging.warn('graphql.response.errors', {
            errorsCount: result.errors?.length,
          });
        }

        operationLogging.success({
          hasErrors,
        });

        observer.next(result);
      },

      error: (error) => {
        operationLogging.fail(error);

        observer.error(error);
      },

      complete: () => {
        observer.complete();
      },
    });

    return () => {
      apolloLogger.debug('graphql.request.unsubscribed', {
        operationName: operation.operationName,
      });

      subscription.unsubscribe();
    };
  });
});
