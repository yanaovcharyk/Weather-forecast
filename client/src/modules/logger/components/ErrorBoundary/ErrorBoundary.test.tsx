import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';

const mocks = vi.hoisted(() => ({
  error: vi.fn(),
  normalize: vi.fn(),
}));

vi.mock('@/logger/utils/createLogger', () => ({
  createLogger: () => ({
    error: mocks.error,
  }),
}));

vi.mock('@/common/utils/normalizeReactError', () => ({
  normalizeReactError: mocks.normalize,
}));

vi.mock('@/common/components/ErrorPage/ErrorPage', () => ({
  ErrorPage: () => <div data-testid="error-page" />,
}));

describe('ErrorBoundary', () => {
  it('renders fallback on error', () => {
    const Throw = () => {
      throw new Error('boom');
    };

    render(
      <ErrorBoundary>
        <Throw />
      </ErrorBoundary>,
    );

    expect(mocks.error).toHaveBeenCalled();
  });
});
