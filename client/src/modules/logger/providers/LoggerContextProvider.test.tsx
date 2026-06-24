import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LoggerContextProvider } from './LoggerContextProvider';
import { loggerContext } from '@/logger/context/LoggerContextStore';

vi.mock('@/logger/context/LoggerContextStore', () => ({
  loggerContext: {
    get: vi.fn(),
    set: vi.fn(),
    clear: vi.fn(),
  },
}));

describe('LoggerContextProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.stubGlobal('crypto', {
      randomUUID: vi.fn(() => 'session-id'),
    });

    vi.mocked(loggerContext.get).mockReturnValue({});
  });

  it('stores generated session id on mount', () => {
    render(
      <LoggerContextProvider>
        <div>content</div>
      </LoggerContextProvider>,
    );

    expect(loggerContext.set).toHaveBeenCalledWith({
      sessionId: 'session-id',
    });
  });

  it('updates logger context after popstate event', () => {
    render(
      <LoggerContextProvider>
        <div>content</div>
      </LoggerContextProvider>,
    );

    window.dispatchEvent(new PopStateEvent('popstate'));

    expect(loggerContext.set).toHaveBeenCalledTimes(2);
  });

  it('clears logger context on unmount', () => {
    const { unmount } = render(
      <LoggerContextProvider>
        <div>content</div>
      </LoggerContextProvider>,
    );

    unmount();

    expect(loggerContext.clear).toHaveBeenCalled();
  });

  it('renders children', () => {
    const { getByText } = render(
      <LoggerContextProvider>
        <div>Application content</div>
      </LoggerContextProvider>,
    );

    expect(getByText('Application content')).toBeInTheDocument();
  });
});
