import { Observable } from 'rxjs';
import { vi } from 'vitest';

import { createTokenRefreshErrorLink } from '@/common/api/apollo/links/tokenRefreshErrorLink';

export type RetryOperation = () => void;

export const missingRetryOperation = (): never => {
  throw new Error('Retry operation was not queued');
};

export const createGraphQLErrorResponse = (code: string) => ({
  errors: [
    {
      extensions: {
        code,
      },
    },
  ],
});

export const UNAUTHENTICATED_RESPONSE =
  createGraphQLErrorResponse('UNAUTHENTICATED');

export const createResponseForward = <T>(response: T) =>
  vi.fn(
    () =>
      new Observable<T>((observer) => {
        observer.next(response);
        observer.complete();
      }),
  );

export const createErrorForward = (error: unknown) =>
  vi.fn(
    () =>
      new Observable((observer) => {
        observer.error(error);
      }),
  );

export const createRetryForward = <TResponse>({
  retryResponse,
  retryError,
}: {
  retryResponse?: TResponse;
  retryError?: Error;
}) => {
  let callCount = 0;

  return vi.fn(
    () =>
      new Observable<TResponse | typeof UNAUTHENTICATED_RESPONSE>(
        (observer) => {
          callCount += 1;

          if (callCount === 1) {
            observer.next(UNAUTHENTICATED_RESPONSE);
            return;
          }

          if (retryError) {
            observer.error(retryError);
            return;
          }

          observer.next(retryResponse as TResponse);
          observer.complete();
        },
      ),
  );
};

export const subscribeToTokenRefreshLink = (
  link: ReturnType<typeof createTokenRefreshErrorLink>,
  forward: never,
  observer: {
    next?: (value: unknown) => void;
    error?: (error: unknown) => void;
    complete?: () => void;
  } = {},
): void => {
  link.request({} as never, forward)?.subscribe(observer);
};

export const createTokenRefreshLink = ({
  queueRetryOperation = vi.fn(),
  refreshAccessToken = vi.fn(() => Promise.resolve()),
  handleRefreshFailure = vi.fn(),
  displayErrorMessage = vi.fn(),
}: {
  queueRetryOperation?: (retryOperation: RetryOperation) => void;
  refreshAccessToken?: () => Promise<void>;
  handleRefreshFailure?: () => void | Promise<void>;
  displayErrorMessage?: (message: string) => void;
} = {}) =>
  createTokenRefreshErrorLink({
    tokenRefreshCoordinator: {
      queueRetryOperation,
      refreshAccessToken,
    } as never,
    handleRefreshFailure,
    displayErrorMessage,
  });
