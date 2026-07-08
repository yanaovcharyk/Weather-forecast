import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { mockIntersectionObserver } from '@/common/testing/mocks/browser.mock';
import { useInfiniteScrollTrigger } from './useInfiniteScrollTrigger';

describe('useInfiniteScrollTrigger', () => {
  let intersectionObserver: ReturnType<typeof mockIntersectionObserver>;

  beforeEach(() => {
    intersectionObserver = mockIntersectionObserver();
  });

  it('returns a ref without observing when there is no next page', () => {
    const { result } = renderHook(() =>
      useInfiniteScrollTrigger({
        hasNextPage: false,
        onLoadMore: vi.fn(),
      }),
    );

    expect(result.current.current).toBe(null);
    expect(intersectionObserver.observe).not.toHaveBeenCalled();
  });

  it('returns early when load-more trigger is not mounted yet', () => {
    renderHook(() =>
      useInfiniteScrollTrigger({
        hasNextPage: true,
        onLoadMore: vi.fn(),
      }),
    );

    expect(intersectionObserver.observe).not.toHaveBeenCalled();
  });
});
