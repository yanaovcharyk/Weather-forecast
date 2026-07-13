import { ApolloLink } from '@apollo/client';
import { Observable } from 'rxjs';
import type { Subscriber } from 'rxjs';

import type { AccessTokenRefreshCoordinator } from '@/auth/services/AccessTokenRefreshCoordinator';
import {
  extractErrorCode,
  isTokenError,
  mapErrorCodeToMessage,
} from '@/common/utils';

type CreateErrorLinkParams = {
  tokenRefreshCoordinator: AccessTokenRefreshCoordinator;
  handleRefreshFailure: () => void | Promise<void>;
  displayErrorMessage: (message: string) => void;
};

type ResponseObserver = Subscriber<ApolloLink.Result>;

type ForwardOperation = Parameters<ApolloLink['request']>[1];

type HandleTokenErrorParams = {
  operation: ApolloLink.Operation;
  forward: ForwardOperation;
  responseObserver: ResponseObserver;
  tokenRefreshCoordinator: AccessTokenRefreshCoordinator;
  handleRefreshFailure: () => void | Promise<void>;
};

type HandleGraphQLErrorParams = {
  error: NonNullable<ApolloLink.Result['errors']>[number];
  response: ApolloLink.Result;
  responseObserver: ResponseObserver;
  displayErrorMessage: (message: string) => void;
};

const completeWithResponse = (
  responseObserver: ResponseObserver,
  response: ApolloLink.Result,
): void => {
  responseObserver.next(response);
  responseObserver.complete();
};

const handleTokenError = ({
  operation,
  forward,
  responseObserver,
  tokenRefreshCoordinator,
  handleRefreshFailure,
}: HandleTokenErrorParams): void => {
  const retryOperation = (): void => {
    forward(operation).subscribe({
      next: (response) => {
        completeWithResponse(responseObserver, response);
      },
      error: (error: unknown) => {
        responseObserver.error(error);
      },
    });
  };

  tokenRefreshCoordinator.queueRetryOperation(retryOperation);

  void tokenRefreshCoordinator
    .refreshAccessToken()
    .catch(async (error: unknown) => {
      try {
        await handleRefreshFailure();
      } catch {
        // The original refresh error is the signal Apollo callers need here.
      }

      responseObserver.error(error);
    });
};

const handleGraphQLError = ({
  error,
  response,
  responseObserver,
  displayErrorMessage,
}: HandleGraphQLErrorParams): void => {
  const errorCode = extractErrorCode(error);

  displayErrorMessage(mapErrorCodeToMessage(errorCode));
  completeWithResponse(responseObserver, response);
};

export const createTokenRefreshErrorLink = ({
  tokenRefreshCoordinator,
  handleRefreshFailure,
  displayErrorMessage,
}: CreateErrorLinkParams): ApolloLink => {
  return new ApolloLink((operation, forward) => {
    return new Observable<ApolloLink.Result>((responseObserver) => {
      const subscription = forward(operation).subscribe({
        next: (response) => {
          const firstError = response.errors?.[0];

          if (!firstError) {
            completeWithResponse(responseObserver, response);
            return;
          }

          if (isTokenError(firstError)) {
            handleTokenError({
              operation,
              forward,
              responseObserver,
              tokenRefreshCoordinator,
              handleRefreshFailure,
            });

            return;
          }

          handleGraphQLError({
            error: firstError,
            response,
            responseObserver,
            displayErrorMessage,
          });
        },

        error: (error: unknown) => {
          const errorCode = extractErrorCode(error);

          displayErrorMessage(mapErrorCodeToMessage(errorCode));
          responseObserver.error(error);
        },
      });

      return () => subscription.unsubscribe();
    });
  });
};
