import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { RouteLoggerProvider } from './RouteLoggerProvider';
import { useRouteTracking } from '@/logger/hooks/useRouteTracking';

vi.mock('@/logger/hooks/useRouteTracking', () => ({
  useRouteTracking: vi.fn(),
}));

describe('RouteLoggerProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls useRouteTracking', () => {
    render(
      <RouteLoggerProvider>
        <div>Child content</div>
      </RouteLoggerProvider>,
    );

    expect(useRouteTracking).toHaveBeenCalledTimes(1);
  });

  it('renders children', () => {
    render(
      <RouteLoggerProvider>
        <div>Child content</div>
      </RouteLoggerProvider>,
    );

    expect(screen.getByText('Child content')).toBeInTheDocument();
  });
});
