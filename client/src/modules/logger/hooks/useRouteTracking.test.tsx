import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useRouteTracking } from './useRouteTracking';

const mocks = vi.hoisted(() => ({
  info: vi.fn(),
  set: vi.fn(),
  get: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  useLocation: () => ({
    pathname: '/testing',
    search: '?q=1',
  }),
}));

vi.mock('@/logger/utils/createLogger', () => ({
  createLogger: () => ({
    info: mocks.info,
  }),
}));

vi.mock('@/logger/context/LoggerContextStore', () => ({
  loggerContext: {
    set: mocks.set,
    get: mocks.get,
  },
}));

describe('useRouteTracking', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.get.mockReturnValue({});
  });

  it('logs route change', () => {
    renderHook(() => useRouteTracking());

    expect(mocks.info).toHaveBeenCalledWith(
      'route.changed',
      expect.objectContaining({
        from: '/testing',
        to: '/testing',
        search: '?q=1',
      }),
    );
  });

  it('updates logger context', () => {
    renderHook(() => useRouteTracking());

    expect(mocks.set).toHaveBeenCalledWith({
      route: '/testing',
    });
  });
});
