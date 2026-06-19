import { renderHook, act } from '@testing-library/react';
import { useLazyQuery } from '@apollo/client/react';
import { vi } from 'vitest';

import { useCitySearch } from './useCitySearch';
import { CityService } from '../services/CityService';

vi.mock('@apollo/client/react');

describe('useCitySearch', () => {
  const executeSearch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    vi.mocked(useLazyQuery).mockReturnValue([
      executeSearch,
      {
        loading: false,
        data: undefined,
      },
    ] as never);

    vi.spyOn(CityService, 'normalizeCityName').mockImplementation((v) =>
      v.trim(),
    );
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
      {
        loading: false,
        data: {
          searchCities: [
            {
              name: 'Kyiv',
              country: 'UA',
              lat: 50,
              lon: 30,
            },
          ],
        },
      },
    ] as never);

    const { result } = renderHook(() => useCitySearch());

    expect(result.current.cityOptions).toEqual([
      {
        label: 'Kyiv, UA',
        value: JSON.stringify({
          lat: 50,
          lon: 30,
          name: 'Kyiv',
        }),
      },
    ]);
  });

  it('does not search when query too short', () => {
    const { result } = renderHook(() => useCitySearch());

    act(() => {
      result.current.handleSearch('k');
      vi.runAllTimers();
    });

    expect(executeSearch).not.toHaveBeenCalled();
  });

  it('searches after debounce', () => {
    const { result } = renderHook(() => useCitySearch());

    act(() => {
      result.current.handleSearch('Kyiv');
    });

    expect(executeSearch).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(executeSearch).toHaveBeenCalledWith({
      variables: {
        input: {
          query: 'Kyiv',
        },
      },
    });
  });

  it('cancels previous search', () => {
    const { result } = renderHook(() => useCitySearch());

    act(() => {
      result.current.handleSearch('Ky');
      result.current.handleSearch('Kyiv');
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(executeSearch).toHaveBeenCalledTimes(1);
  });
});
