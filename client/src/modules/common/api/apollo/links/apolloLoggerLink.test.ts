import { describe, expect, it, vi } from 'vitest';
import { Observable } from 'rxjs';

const operationLogger = {
  warn: vi.fn(),
  success: vi.fn(),
  fail: vi.fn(),
};

vi.mock('@/logger/utils/createLogger', () => ({
  createLogger: () => ({
    operation: vi.fn(() => operationLogger),
    debug: vi.fn(),
  }),
}));

vi.mock('@/logger/context/LoggerContextStore', () => ({
  loggerContext: {
    get: vi.fn(() => ({})),
    set: vi.fn(),
  },
}));

import { apolloLoggerLink } from './apolloLoggerLink';

describe('apolloLoggerLink', () => {
  it('logs successful operation', () => {
    vi.spyOn(crypto, 'randomUUID').mockReturnValue(
      '123e4567-e89b-12d3-a456-426614174000',
    );

    const operation = {
      operationName: 'cities',
      variables: {},
      setContext: vi.fn(),
    };

    const forward = vi.fn(
      () =>
        new Observable((observer) => {
          observer.next({});
          observer.complete();
        }),
    );

    apolloLoggerLink.request(operation as never, forward as never)?.subscribe();

    expect(operationLogger.success).toHaveBeenCalled();
  });

  it('logs errors', () => {
    const operation = {
      operationName: 'cities',
      variables: {},
      setContext: vi.fn(),
    };

    const forward = vi.fn(
      () =>
        new Observable((observer) => {
          observer.error(new Error('fail'));
        }),
    );

    apolloLoggerLink.request(operation as never, forward as never)?.subscribe({
      error: () => {},
    });

    expect(operationLogger.fail).toHaveBeenCalled();
  });

  it('logs graphql response errors', () => {
    const operation = {
      operationName: 'cities',
      variables: {},
      setContext: vi.fn(),
    };

    const forward = vi.fn(
      () =>
        new Observable((observer) => {
          observer.next({
            errors: [{ message: 'error 1' }, { message: 'error 2' }],
          });

          observer.complete();
        }),
    );

    apolloLoggerLink.request(operation as never, forward as never)?.subscribe();

    expect(operationLogger.warn).toHaveBeenCalledWith(
      'graphql.response.errors',
      {
        errorsCount: 2,
      },
    );

    expect(operationLogger.success).toHaveBeenCalledWith({
      hasErrors: true,
    });
  });
  it('adds request id to operation context', () => {
    vi.spyOn(crypto, 'randomUUID').mockReturnValue(
      '123e4567-e89b-12d3-a456-426614174000',
    );

    const setContext = vi.fn();

    const operation = {
      operationName: 'cities',
      variables: {},
      setContext,
    };

    const forward = vi.fn(
      () =>
        new Observable((observer) => {
          observer.complete();
        }),
    );

    apolloLoggerLink.request(operation as never, forward as never)?.subscribe();

    expect(setContext).toHaveBeenCalledTimes(1);

    const contextFactory = setContext.mock.calls[0][0] as (context: {
      headers?: Record<string, string>;
    }) => {
      headers: Record<string, string>;
      requestId: string;
    };

    const result = contextFactory({
      headers: {
        authorization: 'token',
      },
    });

    expect(result).toEqual({
      headers: {
        authorization: 'token',
        'x-request-id': '123e4567-e89b-12d3-a456-426614174000',
      },
      requestId: '123e4567-e89b-12d3-a456-426614174000',
    });
  });
});
