import { renderHook, act } from '@testing-library/react';
import { useLazyQuery } from '@apollo/client/react';
import { vi } from 'vitest';

import { useCitySearch } from './useCitySearch';
import { createQueryResult } from '@/common/testing/factories';

vi.mock('@apollo/client/react');

describe('useCitySearch', () => {
  const executeSearch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    vi.mocked(useLazyQuery).mockReturnValue([
      executeSearch,
      createQueryResult(),
    ] as never);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns empty city options', () => {
    const { result } = renderHook(() => useCitySearch());

    expect(result.current.cityOptions).toEqual([]);
  });

  it('maps city options', () => {
    vi.mocked(useLazyQuery).mockReturnValue([
      executeSearch,
      createQueryResult({
        data: {
          getCitySuggestions: [
            {
              name: 'Kyiv',
              country: 'UA',
              lat: 50,
              lon: 30,
            },
          ],
        },
      }),
    ] as never);

    const { result } = renderHook(() => useCitySearch());

    expect(result.current.cityOptions).toEqual([
      {
        label: 'Kyiv, UA',
        value: JSON.stringify({
          cityName: 'Kyiv',
          lat: 50,
          lon: 30,
        }),
      },
    ]);
  });

  it('does not search when query too short', () => {
    const { result } = renderHook(() => useCitySearch());

    act(() => {
      result.current.handleSearchCities('k');
      vi.runAllTimers();
    });

    expect(executeSearch).not.toHaveBeenCalled();
  });

  it('normalizes query and searches after debounce', () => {
    const { result } = renderHook(() => useCitySearch());

    act(() => {
      result.current.handleSearchCities('Kyiv');
    });

    expect(executeSearch).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(executeSearch).toHaveBeenCalledWith({
      variables: {
        input: {
          query: 'kyiv',
        },
      },
    });
  });

  it('cancels previous search', () => {
    const { result } = renderHook(() => useCitySearch());

    act(() => {
      result.current.handleSearchCities('Ky');
      result.current.handleSearchCities('Kyiv');
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(executeSearch).toHaveBeenCalledTimes(1);
  });
});
