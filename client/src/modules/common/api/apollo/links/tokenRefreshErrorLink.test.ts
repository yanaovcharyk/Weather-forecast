import { Observable } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/common/utils', () => ({
  extractErrorCode: vi.fn(
    (error: { extensions: { code: string } }) => error.extensions.code,
  ),
  isTokenError: vi.fn(
    (error: { extensions: { code: string } }) =>
      error.extensions.code === 'UNAUTHENTICATED',
  ),
  mapErrorCodeToMessage: vi.fn(() => 'message'),
}));

import { createTokenRefreshErrorLink } from './tokenRefreshErrorLink';

type RetryOperation = () => void;

const missingRetryOperation = (): never => {
  throw new Error('Retry operation was not queued');
};

const createGraphQLErrorResponse = (code: string) => ({
  errors: [
    {
      extensions: {
        code,
      },
    },
  ],
});

const unauthenticatedResponse = createGraphQLErrorResponse('UNAUTHENTICATED');

const createResponseForward = <T>(response: T) =>
  vi.fn(
    () =>
      new Observable<T>((observer) => {
        observer.next(response);
        observer.complete();
      }),
  );

const subscribeToLink = (
  link: ReturnType<typeof createTokenRefreshErrorLink>,
  forward: never,
  observer: {
    next?: () => void;
    error?: (error: unknown) => void;
    complete?: () => void;
  } = {},
): void => {
  link.request({} as never, forward)?.subscribe(observer);
};

const createLink = ({
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

describe('createTokenRefreshErrorLink', () => {
  it('passes successful graphql response through', () => {
    const response = {
      data: {
        cities: [],
      },
    };

    const next = vi.fn();
    const complete = vi.fn();

    const link = createLink();
    const forward = createResponseForward(response);

    subscribeToLink(link, forward as never, {
      next,
      complete,
    });

    expect(next).toHaveBeenCalledWith(response);
    expect(complete).toHaveBeenCalled();
  });

  it('shows error for graphql error', () => {
    const displayErrorMessage = vi.fn();

    const link = createLink({
      displayErrorMessage,
    });

    const forward = createResponseForward(
      createGraphQLErrorResponse('CITY_EXISTS'),
    );

    subscribeToLink(link, forward as never);

    expect(displayErrorMessage).toHaveBeenCalledWith('message');
  });

  it('retries operation after token refresh', () => {
    let queuedRetryOperation: RetryOperation = missingRetryOperation;

    const queueRetryOperation = vi.fn(
      (retryOperation: RetryOperation): void => {
        queuedRetryOperation = retryOperation;
      },
    );

    const response = {
      data: {
        success: true,
      },
    };

    const next = vi.fn();
    const complete = vi.fn();

    let callCount = 0;

    const forward = vi.fn(
      () =>
        new Observable((observer) => {
          callCount += 1;

          if (callCount === 1) {
            observer.next(unauthenticatedResponse);
            return;
          }

          observer.next(response);
          observer.complete();
        }),
    );

    const link = createLink({
      queueRetryOperation,
    });

    subscribeToLink(link, forward as never, {
      next,
      complete,
    });

    expect(queueRetryOperation).toHaveBeenCalled();

    queuedRetryOperation();

    expect(next).toHaveBeenCalledWith(response);
    expect(complete).toHaveBeenCalled();
  });

  it('propagates retry error', () => {
    let queuedRetryOperation: RetryOperation = missingRetryOperation;

    const queueRetryOperation = vi.fn(
      (retryOperation: RetryOperation): void => {
        queuedRetryOperation = retryOperation;
      },
    );

    const retryError = new Error('retry failed');
    const observerError = vi.fn();

    let callCount = 0;

    const forward = vi.fn(
      () =>
        new Observable((observer) => {
          callCount += 1;

          if (callCount === 1) {
            observer.next(unauthenticatedResponse);
            return;
          }

          observer.error(retryError);
        }),
    );

    const link = createLink({
      queueRetryOperation,
    });

    subscribeToLink(link, forward as never, {
      error: observerError,
    });

    queuedRetryOperation();

    expect(observerError).toHaveBeenCalledWith(retryError);
  });

  it('handles refresh failure if refresh fails', async () => {
    const handleRefreshFailure = vi.fn();

    const link = createLink({
      refreshAccessToken: vi.fn(() =>
        Promise.reject(new Error('refresh failed')),
      ),
      handleRefreshFailure,
    });

    const forward = createResponseForward(unauthenticatedResponse);

    subscribeToLink(link, forward as never, {
      error: vi.fn(),
    });

    await vi.waitFor(() => {
      expect(handleRefreshFailure).toHaveBeenCalled();
    });
  });

  it('propagates refresh error when refresh failure handler rejects', async () => {
    const refreshError = new Error('refresh failed');
    const observerError = vi.fn();

    const link = createLink({
      refreshAccessToken: vi.fn(() => Promise.reject(refreshError)),
      handleRefreshFailure: vi.fn(() =>
        Promise.reject(new Error('logout failed')),
      ),
    });

    const forward = createResponseForward(unauthenticatedResponse);

    subscribeToLink(link, forward as never, {
      error: observerError,
    });

    await vi.waitFor(() => {
      expect(observerError).toHaveBeenCalledWith(refreshError);
    });
  });

  it('shows error for network error', () => {
    const displayErrorMessage = vi.fn();
    const observerError = vi.fn();

    const networkError = {
      extensions: {
        code: 'NETWORK_ERROR',
      },
    };

    const link = createLink({
      displayErrorMessage,
    });

    const forward = vi.fn(
      () =>
        new Observable((observer) => {
          observer.error(networkError);
        }),
    );

    subscribeToLink(link, forward as never, {
      error: observerError,
    });

    expect(displayErrorMessage).toHaveBeenCalledWith('message');
    expect(observerError).toHaveBeenCalledWith(networkError);
  });
});
