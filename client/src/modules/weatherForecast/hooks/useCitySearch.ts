import { useLazyQuery } from '@apollo/client/react';
import { useMemo, useRef } from 'react';

import { SEARCH_CITIES } from '../graphql';
import type {
  SearchCitiesData,
  SearchCitiesVars,
} from '../components/AddCityForm/types';
import { CityService } from '../services/CityService';

const DEBOUNCE_DELAY_MS = 300;
const MIN_SEARCH_LENGTH = 2;

export const useCitySearch = () => {
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [executeCitySearch, { data, loading }] = useLazyQuery<
    SearchCitiesData,
    SearchCitiesVars
  >(SEARCH_CITIES, {
    fetchPolicy: 'no-cache',
  });

  const cancelPreviousSearch = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  };

  const scheduleSearchRequest = (query: string) => {
    debounceTimerRef.current = setTimeout(() => {
      executeCitySearch({
        variables: {
          input: {
            query,
          },
        },
      });
    }, DEBOUNCE_DELAY_MS);
  };

  const requestCitySearch = (inputValue: string) => {
    const query = CityService.normalizeCityName(inputValue);

    cancelPreviousSearch();

    if (query.length < MIN_SEARCH_LENGTH) return;

    scheduleSearchRequest(query);
  };

  const cityOptions = useMemo(() => {
    return (
      data?.searchCities?.map((city) => ({
        label: `${city.name}, ${city.country}`,

        value: JSON.stringify({
          lat: city.lat,
          lon: city.lon,
          name: city.name,
        }),
      })) ?? []
    );
  }, [data]);

  return {
    data,
    loading,
    handleSearch: requestCitySearch,
    cityOptions,
  };
};
