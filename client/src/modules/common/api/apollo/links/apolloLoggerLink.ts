import { ApolloLink } from '@apollo/client';
import { Observable } from 'rxjs';
import { logger } from '../../../../logger/Logger';

const MODULE = 'Apollo';

export const apolloLoggerLink = new ApolloLink(
  (operation: ApolloLink.Operation, forward) => {
    const requestId = crypto.randomUUID();
    const startedAt = performance.now();

    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        'x-request-id': requestId,
      },
      requestId,
    }));

    logger.info('GraphQL request started', {
      module: MODULE,
      requestId,
      operationName: operation.operationName,
      variables: safeVariables(operation.variables),
    });

    return new Observable((observer) => {
      const subscription = forward(operation).subscribe({
        next: (result) => {
          const duration = Math.round(performance.now() - startedAt);

          logger.info('GraphQL request completed', {
            module: MODULE,
            requestId,
            operationName: operation.operationName,
            executionTimeMs: duration,
            hasErrors: Boolean(result.errors?.length),
          });

          observer.next(result);
          observer.complete();
        },

        error: (error) => {
          const duration = Math.round(performance.now() - startedAt);

          logger.error('GraphQL request failed', {
            module: MODULE,
            requestId,
            operationName: operation.operationName,
            executionTimeMs: duration,
            error: normalizeError(error),
          });

          observer.error(error);
        },

        complete: () => {
          observer.complete();
        },
      });

      return () => subscription.unsubscribe();
    });
  },
);

function safeVariables(variables: unknown) {
  try {
    if (!variables) {
      return undefined;
    }

    const str = JSON.stringify(variables);

    if (str.length > 2000) {
      return '[TRUNCATED VARIABLES]';
    }

    return JSON.parse(str);
  } catch {
    return '[UNSERIALIZABLE VARIABLES]';
  }
}

function normalizeError(error: unknown) {
  if (error instanceof Error) {
    return {
      message: error.message,
      name: error.name,
      stack: error.stack,
    };
  }

  return String(error);
}
