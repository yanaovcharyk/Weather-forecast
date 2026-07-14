import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { useCitySearch } from './useCitySearch';
import { mockApolloLazyQuery } from '@/common/testing/mocks/apollo.mock';

describe('useCitySearch', () => {
  const executeSearch = vi.fn();

  const setup = () => {
    const { result } = renderHook(() => useCitySearch());

    const search = (query: string) => {
      act(() => {
        result.current.handleSearchCities(query);
      });
    };

    const flushDebounce = () => {
      act(() => {
        vi.advanceTimersByTime(300);
      });
    };

    return {
      result,
      search,
      flushDebounce,
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    mockApolloLazyQuery({
      execute: executeSearch,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns empty city options', () => {
    const { result } = setup();

    expect(result.current.cityOptions).toEqual([]);
  });

  it('maps city options', () => {
    mockApolloLazyQuery({
      execute: executeSearch,
      result: {
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
      },
    });

    const { result } = setup();

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
    const { search, flushDebounce } = setup();

    search('k');
    flushDebounce();

    expect(executeSearch).not.toHaveBeenCalled();
  });

  it('normalizes query and searches after debounce', () => {
    const { search, flushDebounce } = setup();

    search('Kyiv');

    expect(executeSearch).not.toHaveBeenCalled();

    flushDebounce();

    expect(executeSearch).toHaveBeenCalledWith({
      variables: {
        input: {
          query: 'kyiv',
        },
      },
    });
  });

  it('cancels previous search', () => {
    const { search, flushDebounce } = setup();

    search('Kyiv');
    search('Kyiv');

    flushDebounce();

    expect(executeSearch).toHaveBeenCalledTimes(1);
  });

  it('clears pending search when next query is too short', () => {
    const { search, flushDebounce } = setup();

    search('Kyiv');
    search('Ky');

    flushDebounce();

    expect(executeSearch).not.toHaveBeenCalled();
  });
});
