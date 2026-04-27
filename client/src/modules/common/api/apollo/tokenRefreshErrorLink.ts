import { ApolloLink } from '@apollo/client';
import { Observable } from 'rxjs';
import type { AccessTokenRefreshCoordinator } from './AccessTokenRefreshCoordinator';
import { extractErrorCode, isTokenError } from '../../utils/extractErrorCode';
import { mapErrorCodeToMessage } from '../../utils/mapErrorCodeToMessage';

type CreateErrorLinkParams = {
  tokenRefreshCoordinator: AccessTokenRefreshCoordinator;
  performLogout: () => void;
  displayErrorMessage: (message: string) => void;
};

export const createTokenRefreshErrorLink = ({
  tokenRefreshCoordinator,
  performLogout,
  displayErrorMessage,
}: CreateErrorLinkParams) => {
  return new ApolloLink((operation, forward) => {
    return new Observable((responseObserver) => {
      const subscription = forward(operation).subscribe({
        next: (graphqlResponse) => {
          const firstError = graphqlResponse.errors?.[0];

          if (!firstError) {
            responseObserver.next(graphqlResponse);
            responseObserver.complete();
            return;
          }

          const errorCode = extractErrorCode(firstError);

          if (isTokenError(firstError)) {
            const retryOperation = () => {
              forward(operation).subscribe({
                next: (retryResponse) => {
                  responseObserver.next(retryResponse);
                  responseObserver.complete();
                },
                error: (retryError) => responseObserver.error(retryError),
              });
            };

            tokenRefreshCoordinator.queueRetryOperation(retryOperation);

            tokenRefreshCoordinator.refreshAccessToken().catch((error) => {
              performLogout();
              displayErrorMessage('Session expired. Please login again.');
              responseObserver.error(error);
            });

            return;
          }

          displayErrorMessage(mapErrorCodeToMessage(errorCode));
          responseObserver.next(graphqlResponse);
          responseObserver.complete();
        },

        error: (networkError) => {
          const errorCode = extractErrorCode(networkError);
          displayErrorMessage(mapErrorCodeToMessage(errorCode));
          responseObserver.error(networkError);
        },
      });

      return () => subscription.unsubscribe();
    });
  });
};
