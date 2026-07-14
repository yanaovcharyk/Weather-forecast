import { Observable } from 'rxjs';
import { vi } from 'vitest';

import { UNAUTHENTICATED_RESPONSE } from '@/common/testing/fixtures/tokenRefreshErrorLink.fixture';

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
