import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useSessionTracking } from './useSessionTracking';
import { loggerContext } from '@/logger/context/LoggerContextStore';

vi.mock('@/logger/context/LoggerContextStore', () => ({
  loggerContext: {
    set: vi.fn(),
    clear: vi.fn(),
  },
}));

describe('useSessionTracking', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.stubGlobal('crypto', {
      randomUUID: vi.fn(() => 'session-id'),
    });
  });

  it('stores generated session id on mount', () => {
    renderHook(() => useSessionTracking());

    expect(loggerContext.set).toHaveBeenCalledWith({
      sessionId: 'session-id',
    });
  });

  it('clears logger context on unmount', () => {
    const { unmount } = renderHook(() => useSessionTracking());

    unmount();

    expect(loggerContext.clear).toHaveBeenCalled();
  });
});
