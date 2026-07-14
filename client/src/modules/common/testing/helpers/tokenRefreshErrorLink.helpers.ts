import type { createTokenRefreshErrorLink } from '@/common/api/apollo/links/tokenRefreshErrorLink';

export const missingRetryOperation = (): never => {
  throw new Error('Retry operation was not queued');
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
