import { beforeEach, describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';
import { LoggerError } from '@/logger/components/LoggerError/LoggerError';
import { ToastContext } from '@/common/contexts/ToastContext';

const mocks = vi.hoisted(() => ({
  error: vi.fn(),
  normalize: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock('@/logger/utils/createLogger', () => ({
  createLogger: () => ({
    error: mocks.error,
  }),
}));

vi.mock('@/common/utils/normalizeReactError', () => ({
  normalizeReactError: mocks.normalize,
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('ErrorBoundary', () => {
  it('shows toast on error', () => {
    const Throw = () => {
      throw new Error('boom');
    };

    render(
      <ToastContext.Provider
        value={{
          toast: vi.fn(),
          success: vi.fn(),
          error: mocks.toastError,
          info: vi.fn(),
          warning: vi.fn(),
        }}
      >
        <ErrorBoundary>
          <Throw />
        </ErrorBoundary>
      </ToastContext.Provider>,
    );

    expect(mocks.toastError).toHaveBeenCalledWith('Something went wrong');
  });
});

describe('LoggerError', () => {
  it('logs error without owning toast behavior', () => {
    const onError = vi.fn();
    const Throw = () => {
      throw new Error('boom');
    };

    render(
      <LoggerError onError={onError}>
        <Throw />
      </LoggerError>,
    );

    expect(mocks.error).toHaveBeenCalled();
    expect(onError).toHaveBeenCalledOnce();
    expect(mocks.toastError).not.toHaveBeenCalled();
  });
});
