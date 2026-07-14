import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LoggerError } from './LoggerError';
import { normalizeReactError } from '@/common/utils/normalizeReactError';

const mocks = vi.hoisted(() => ({
  loggerError: vi.fn(),
}));

vi.mock('@/logger/utils/createLogger', () => ({
  createLogger: vi.fn(() => ({
    error: mocks.loggerError,
  })),
}));

vi.mock('@/common/utils/normalizeReactError', () => ({
  normalizeReactError: vi.fn(() => ({
    normalized: true,
  })),
}));

describe('LoggerError', () => {
  const setup = ({
    children = <div>Content</div>,
    onError = vi.fn(),
  }: {
    children?: React.ReactNode;
    onError?: () => void;
  } = {}) => {
    render(<LoggerError onError={onError}>{children}</LoggerError>);

    return {
      onError,
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children', () => {
    setup();

    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('logs render error', () => {
    const error = new Error('Render failed');

    const BrokenComponent = () => {
      throw error;
    };

    setup({
      children: <BrokenComponent />,
    });

    expect(normalizeReactError).toHaveBeenCalledWith(error, expect.any(Object));

    expect(mocks.loggerError).toHaveBeenCalledWith('react.render.crash', {
      error: {
        normalized: true,
      },
    });
  });

  it('normalizes non-error thrown values', () => {
    const BrokenComponent = () => {
      throw 'Render failed';
    };

    setup({
      children: <BrokenComponent />,
    });

    expect(normalizeReactError).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Render failed',
      }),
      expect.any(Object),
    );
  });

  it('calls onError when render fails', () => {
    const BrokenComponent = () => {
      throw new Error('Render failed');
    };

    const { onError } = setup({
      children: <BrokenComponent />,
    });

    expect(onError).toHaveBeenCalledTimes(1);
  });

  it('does not require onError callback', () => {
    const BrokenComponent = () => {
      throw new Error('Render failed');
    };

    expect(() =>
      setup({
        children: <BrokenComponent />,
        onError: undefined,
      }),
    ).not.toThrow();
  });
});
