import { describe, expect, it, vi } from 'vitest';
import { Observable } from 'rxjs';

vi.mock('@/common/utils', () => ({
  extractErrorCode: vi.fn((e) => e.extensions?.code),
  isTokenError: vi.fn((e) => e.extensions?.code === 'UNAUTHENTICATED'),
  mapErrorCodeToMessage: vi.fn(() => 'message'),
}));

import { createTokenRefreshErrorLink } from './tokenRefreshErrorLink';

describe('createTokenRefreshErrorLink', () => {
  it('passes successful graphql response through', () => {
    const link = createTokenRefreshErrorLink({
      tokenRefreshCoordinator: {
        queueRetryOperation: vi.fn(),
        refreshAccessToken: vi.fn(),
      } as never,
      performLogout: vi.fn(),
      displayErrorMessage: vi.fn(),
    });

    const next = vi.fn();
    const complete = vi.fn();

    const response = {
      data: {
        cities: [],
      },
    };

    const forward = vi.fn(
      () =>
        new Observable((observer) => {
          observer.next(response);
          observer.complete();
        }),
    );

    link.request({} as never, forward as never)?.subscribe({
      next,
      complete,
    });

    expect(next).toHaveBeenCalledWith(response);
    expect(complete).toHaveBeenCalled();
  });

  it('shows error for graphql error', () => {
    const displayErrorMessage = vi.fn();

    const link = createTokenRefreshErrorLink({
      tokenRefreshCoordinator: {
        queueRetryOperation: vi.fn(),
        refreshAccessToken: vi.fn(),
      } as never,
      performLogout: vi.fn(),
      displayErrorMessage,
    });

    const forward = vi.fn(
      () =>
        new Observable((observer) => {
          observer.next({
            errors: [
              {
                extensions: {
                  code: 'CITY_EXISTS',
                },
              },
            ],
          });
        }),
    );

    link.request({} as never, forward as never)?.subscribe();

    expect(displayErrorMessage).toHaveBeenCalledWith('message');
  });

  it('retries operation after token refresh', () => {
    let queuedRetryOperation: (() => void) | undefined;

    const queueRetryOperation = vi.fn((retry: () => void) => {
      queuedRetryOperation = retry;
    });

    const refreshAccessToken = vi.fn(() => Promise.resolve());

    const link = createTokenRefreshErrorLink({
      tokenRefreshCoordinator: {
        queueRetryOperation,
        refreshAccessToken,
      } as never,
      performLogout: vi.fn(),
      displayErrorMessage: vi.fn(),
    });

    const next = vi.fn();
    const complete = vi.fn();

    let callCount = 0;

    const forward = vi.fn(
      () =>
        new Observable((observer) => {
          callCount += 1;

          if (callCount === 1) {
            observer.next({
              errors: [
                {
                  extensions: {
                    code: 'UNAUTHENTICATED',
                  },
                },
              ],
            });

            return;
          }

          observer.next({
            data: {
              success: true,
            },
          });

          observer.complete();
        }),
    );

    link.request({} as never, forward as never)?.subscribe({
      next,
      complete,
    });

    expect(queueRetryOperation).toHaveBeenCalled();

    queuedRetryOperation?.();

    expect(next).toHaveBeenCalledWith({
      data: {
        success: true,
      },
    });

    expect(complete).toHaveBeenCalled();
  });

  it('propagates retry error', () => {
    let queuedRetryOperation: (() => void) | undefined;

    const queueRetryOperation = vi.fn((retry: () => void) => {
      queuedRetryOperation = retry;
    });

    const link = createTokenRefreshErrorLink({
      tokenRefreshCoordinator: {
        queueRetryOperation,
        refreshAccessToken: vi.fn(() => Promise.resolve()),
      } as never,
      performLogout: vi.fn(),
      displayErrorMessage: vi.fn(),
    });

    const propagatedError = vi.fn();

    let callCount = 0;

    const forward = vi.fn(
      () =>
        new Observable((observer) => {
          callCount += 1;

          if (callCount === 1) {
            observer.next({
              errors: [
                {
                  extensions: {
                    code: 'UNAUTHENTICATED',
                  },
                },
              ],
            });

            return;
          }

          observer.error(new Error('retry failed'));
        }),
    );

    link.request({} as never, forward as never)?.subscribe({
      error: propagatedError,
    });

    queuedRetryOperation?.();

    expect(propagatedError).toHaveBeenCalled();
  });

  it('performs logout if refresh fails', async () => {
    const performLogout = vi.fn();

    const link = createTokenRefreshErrorLink({
      tokenRefreshCoordinator: {
        queueRetryOperation: vi.fn(),
        refreshAccessToken: vi.fn(() => Promise.reject(new Error())),
      } as never,
      performLogout,
      displayErrorMessage: vi.fn(),
    });

    const forward = vi.fn(
      () =>
        new Observable((observer) => {
          observer.next({
            errors: [
              {
                extensions: {
                  code: 'UNAUTHENTICATED',
                },
              },
            ],
          });
        }),
    );

    link.request({} as never, forward as never)?.subscribe({
      error: () => {},
    });

    await Promise.resolve();

    expect(performLogout).toHaveBeenCalled();
  });

  it('shows error for network error', () => {
    const displayErrorMessage = vi.fn();
    const observerError = vi.fn();

    const networkError = {
      extensions: {
        code: 'NETWORK_ERROR',
      },
    };

    const link = createTokenRefreshErrorLink({
      tokenRefreshCoordinator: {
        queueRetryOperation: vi.fn(),
        refreshAccessToken: vi.fn(),
      } as never,
      performLogout: vi.fn(),
      displayErrorMessage,
    });

    const forward = vi.fn(
      () =>
        new Observable((observer) => {
          observer.error(networkError);
        }),
    );

    link.request({} as never, forward as never)?.subscribe({
      error: observerError,
    });

    expect(displayErrorMessage).toHaveBeenCalledWith('message');
    expect(observerError).toHaveBeenCalledWith(networkError);
  });
});
