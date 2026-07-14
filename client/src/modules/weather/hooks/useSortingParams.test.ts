import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { useSearchParams } from 'react-router-dom';

import { useSortingParams } from './useSortingParams';
import { createRouterMocks } from '@/common/testing/mocks/router.mock';
import { CitySortField, CitySortOrder } from '@/weather/types';

vi.mock('react-router-dom');

describe('useSortingParams', () => {
  const router = createRouterMocks();

  const setup = ({
    searchParams = '',
  }: {
    searchParams?: string;
  } = {}) => {
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams(searchParams),
      router.setSearchParams,
    ] as never);

    return renderHook(() => useSortingParams());
  };

  const getUpdatedParams = () => {
    const updatedParams = vi.mocked(router.setSearchParams).mock.calls[0]?.[0];

    expect(updatedParams).toBeInstanceOf(URLSearchParams);

    return updatedParams as URLSearchParams;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns default values', () => {
    const { result } = setup();

    expect(result.current.sorting).toEqual({
      sortBy: CitySortField.CreatedAt,
      sortOrder: CitySortOrder.Desc,
    });

    expect(result.current.showPinnedOnly).toBe(false);
  });

  it('returns valid values from search params', () => {
    const { result } = setup({
      searchParams: `sortBy=${CitySortField.CityName}&sortOrder=${CitySortOrder.Asc}&showPinnedOnly=true`,
    });

    expect(result.current.sorting).toEqual({
      sortBy: CitySortField.CityName,
      sortOrder: CitySortOrder.Asc,
    });

    expect(result.current.showPinnedOnly).toBe(true);
  });

  it('updates sorting', () => {
    const { result } = setup();

    act(() => {
      result.current.setSorting({
        sortBy: CitySortField.CityName,
        sortOrder: CitySortOrder.Asc,
      });
    });

    const updatedParams = getUpdatedParams();

    expect(updatedParams.get('sortBy')).toBe(CitySortField.CityName);
    expect(updatedParams.get('sortOrder')).toBe(CitySortOrder.Asc);
    expect(updatedParams.get('showPinnedOnly')).toBe('false');
  });

  it('updates sorting with updater callback', () => {
    const { result } = setup();

    act(() => {
      result.current.setSorting((currentSorting) => ({
        ...currentSorting,
        sortOrder: CitySortOrder.Asc,
      }));
    });

    const updatedParams = getUpdatedParams();

    expect(updatedParams.get('sortBy')).toBe(CitySortField.CreatedAt);
    expect(updatedParams.get('sortOrder')).toBe(CitySortOrder.Asc);
  });

  it('updates pinned filter', () => {
    const { result } = setup();

    act(() => {
      result.current.setShowPinnedOnly(true);
    });

    const updatedParams = getUpdatedParams();

    expect(updatedParams.get('sortBy')).toBe(CitySortField.CreatedAt);
    expect(updatedParams.get('sortOrder')).toBe(CitySortOrder.Desc);
    expect(updatedParams.get('showPinnedOnly')).toBe('true');
  });

  it('does not rewrite params on mount', () => {
    setup();

    expect(router.setSearchParams).not.toHaveBeenCalled();
  });
});
