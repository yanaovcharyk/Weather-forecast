import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LoggerProvider } from './LoggerProvider';
import { useRouteTracking } from '@/logger/hooks/useRouteTracking';
import { useSessionTracking } from '@/logger/hooks/useSessionTracking';

vi.mock('@/logger/hooks/useRouteTracking', () => ({
  useRouteTracking: vi.fn(),
}));

vi.mock('@/logger/hooks/useSessionTracking', () => ({
  useSessionTracking: vi.fn(),
}));

describe('LoggerProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('tracks session before route changes', () => {
    const calls: string[] = [];

    vi.mocked(useSessionTracking).mockImplementation(() => {
      calls.push('session');
    });

    vi.mocked(useRouteTracking).mockImplementation(() => {
      calls.push('route');
    });

    render(
      <LoggerProvider>
        <div>Child content</div>
      </LoggerProvider>,
    );

    expect(calls).toEqual(['session', 'route']);
  });

  it('renders children', () => {
    render(
      <LoggerProvider>
        <div>Child content</div>
      </LoggerProvider>,
    );

    expect(screen.getByText('Child content')).toBeInTheDocument();
  });
});
