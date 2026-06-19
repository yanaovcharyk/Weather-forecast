import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useSearchParams } from 'react-router-dom';

import { useSortingParams } from './useSortingParams';

vi.mock('react-router-dom');

describe('useSortingParams', () => {
  const setParams = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams(),
      setParams,
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
        sortBy: 'city',
        sortOrder: 'ASC',
      });
    });

    expect(result.current.sorting).toEqual({
      sortBy: 'city',
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

    expect(setParams).toHaveBeenCalled();
  });
});
