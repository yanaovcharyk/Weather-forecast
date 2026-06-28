import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useSearchParams } from 'react-router-dom';

import { useSortingParams } from './useSortingParams';
import { createRouterMocks } from '@/common/testing/mocks/router.mock';

vi.mock('react-router-dom');

describe('useSortingParams', () => {
  const router = createRouterMocks();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams(),
      router.setSearchParams,
    ] as never);
  });

  it('returns default values', () => {
    const { result } = renderHook(() => useSortingParams());

    expect(result.current.sorting).toEqual({
      sortBy: 'createdAt',
      sortOrder: 'DESC',
    });

    expect(result.current.showPinnedOnly).toBe(false);
  });

  it('updates sorting', () => {
    const { result } = renderHook(() => useSortingParams());

    act(() => {
      result.current.setSorting({
        sortBy: 'cityName',
        sortOrder: 'ASC',
      });
    });

    expect(result.current.sorting).toEqual({
      sortBy: 'cityName',
      sortOrder: 'ASC',
    });
  });

  it('updates pinned filter', () => {
    const { result } = renderHook(() => useSortingParams());

    act(() => {
      result.current.setShowPinnedOnly(true);
    });

    expect(result.current.showPinnedOnly).toBe(true);
  });

  it('syncs params', () => {
    renderHook(() => useSortingParams());

    expect(router.setSearchParams).toHaveBeenCalled();
  });
});
