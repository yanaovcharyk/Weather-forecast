import { vi } from 'vitest';

import { createTokenRefreshErrorLink } from '@/common/api/apollo/links/tokenRefreshErrorLink';

export type RetryOperation = () => void;

type TokenRefreshLinkOptions = {
  queueRetryOperation?: (retryOperation: RetryOperation) => void;
  refreshAccessToken?: () => Promise<void>;
  handleRefreshFailure?: () => void | Promise<void>;
  displayErrorMessage?: (message: string) => void;
};

const createDefaultTokenRefreshLinkOptions =
  (): Required<TokenRefreshLinkOptions> => ({
    queueRetryOperation: vi.fn(),
    refreshAccessToken: vi.fn(() => Promise.resolve()),
    handleRefreshFailure: vi.fn(),
    displayErrorMessage: vi.fn(),
  });

export const createTokenRefreshLink = (
  overrides: TokenRefreshLinkOptions = {},
) => {
  const options = {
    ...createDefaultTokenRefreshLinkOptions(),
    ...overrides,
  };

  return createTokenRefreshErrorLink({
    tokenRefreshCoordinator: {
      queueRetryOperation: options.queueRetryOperation,
      refreshAccessToken: options.refreshAccessToken,
    },
    handleRefreshFailure: options.handleRefreshFailure,
    displayErrorMessage: options.displayErrorMessage,
  });
};
