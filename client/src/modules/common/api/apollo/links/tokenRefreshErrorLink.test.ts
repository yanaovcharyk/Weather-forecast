import { describe, expect, it, vi } from 'vitest';

import {
  UNAUTHENTICATED_RESPONSE,
  createGraphQLErrorResponse,
} from '@/common/testing/fixtures/tokenRefreshErrorLink.fixture';
import {
  missingRetryOperation,
  subscribeToTokenRefreshLink,
} from '@/common/testing/helpers/tokenRefreshErrorLink.helpers';
import {
  createErrorForward,
  createResponseForward,
  createRetryForward,
} from '@/common/testing/mocks/tokenRefreshForward.mock';
import {
  createTokenRefreshLink,
  type RetryOperation,
} from '@/common/testing/setups/tokenRefreshErrorLink.setup';

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

describe('createTokenRefreshErrorLink', () => {
  it('passes successful graphql response through', () => {
    const response = {
      data: {
        cities: [],
      },
    };

    const next = vi.fn();
    const complete = vi.fn();

    subscribeToTokenRefreshLink(
      createTokenRefreshLink(),
      createResponseForward(response) as never,
      {
        next,
        complete,
      },
    );

    expect(next).toHaveBeenCalledWith(response);
    expect(complete).toHaveBeenCalled();
  });

  it('shows error for graphql error', () => {
    const displayErrorMessage = vi.fn();

    subscribeToTokenRefreshLink(
      createTokenRefreshLink({
        displayErrorMessage,
      }),
      createResponseForward(createGraphQLErrorResponse('CITY_EXISTS')) as never,
    );

    expect(displayErrorMessage).toHaveBeenCalledWith('message');
  });

  it('retries operation after token refresh', () => {
    let queuedRetryOperation: RetryOperation = missingRetryOperation;
    const response = {
      data: {
        success: true,
      },
    };
    const next = vi.fn();
    const complete = vi.fn();
    const queueRetryOperation = vi.fn(
      (retryOperation: RetryOperation): void => {
        queuedRetryOperation = retryOperation;
      },
    );

    subscribeToTokenRefreshLink(
      createTokenRefreshLink({
        queueRetryOperation,
      }),
      createRetryForward({
        retryResponse: response,
      }) as never,
      {
        next,
        complete,
      },
    );

    expect(queueRetryOperation).toHaveBeenCalled();

    queuedRetryOperation();

    expect(next).toHaveBeenCalledWith(response);
    expect(complete).toHaveBeenCalled();
  });

  it('propagates retry error', () => {
    let queuedRetryOperation: RetryOperation = missingRetryOperation;
    const retryError = new Error('retry failed');
    const observerError = vi.fn();

    subscribeToTokenRefreshLink(
      createTokenRefreshLink({
        queueRetryOperation: (retryOperation) => {
          queuedRetryOperation = retryOperation;
        },
      }),
      createRetryForward({
        retryError,
      }) as never,
      {
        error: observerError,
      },
    );

    queuedRetryOperation();

    expect(observerError).toHaveBeenCalledWith(retryError);
  });

  it('handles refresh failure if refresh fails', async () => {
    const handleRefreshFailure = vi.fn();

    subscribeToTokenRefreshLink(
      createTokenRefreshLink({
        refreshAccessToken: vi.fn(() =>
          Promise.reject(new Error('refresh failed')),
        ),
        handleRefreshFailure,
      }),
      createResponseForward(UNAUTHENTICATED_RESPONSE) as never,
      {
        error: vi.fn(),
      },
    );

    await vi.waitFor(() => {
      expect(handleRefreshFailure).toHaveBeenCalled();
    });
  });

  it('propagates refresh error when refresh failure handler rejects', async () => {
    const refreshError = new Error('refresh failed');
    const observerError = vi.fn();

    subscribeToTokenRefreshLink(
      createTokenRefreshLink({
        refreshAccessToken: vi.fn(() => Promise.reject(refreshError)),
        handleRefreshFailure: vi.fn(() =>
          Promise.reject(new Error('logout failed')),
        ),
      }),
      createResponseForward(UNAUTHENTICATED_RESPONSE) as never,
      {
        error: observerError,
      },
    );

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

    subscribeToTokenRefreshLink(
      createTokenRefreshLink({
        displayErrorMessage,
      }),
      createErrorForward(networkError) as never,
      {
        error: observerError,
      },
    );

    expect(displayErrorMessage).toHaveBeenCalledWith('message');
    expect(observerError).toHaveBeenCalledWith(networkError);
  });
});
