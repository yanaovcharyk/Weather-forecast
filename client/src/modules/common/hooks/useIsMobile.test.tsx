import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

vi.mock('antd', () => ({
  Grid: {
    useBreakpoint: vi.fn(),
  },
}));

import { Grid } from 'antd';
import { useIsMobile } from './useIsMobile';

describe('useIsMobile', () => {
  it('returns true for mobile', () => {
    vi.mocked(Grid.useBreakpoint).mockReturnValue({
      md: false,
    });

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
  });

  it('returns false for desktop', () => {
    vi.mocked(Grid.useBreakpoint).mockReturnValue({
      md: true,
    });

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });
});
