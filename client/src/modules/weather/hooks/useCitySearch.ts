import { useLazyQuery } from '@apollo/client/react';
import { useRef } from 'react';

import { createDebouncedSearch } from '@/common/utils';
import { GET_CITY_SUGGESTIONS } from '@/weather/graphql';
import type {
  CitySuggestion,
  CitySuggestionsData,
  CitySuggestionsVars,
  SelectedCity,
} from '@/weather/types';
import { normalizeCityName } from '@/weather/utils';

const SEARCH_DELAY_MS = 300;
const MIN_QUERY_LENGTH = 3;

const mapToSelectedCity = (city: CitySuggestion): SelectedCity => ({
  cityName: city.name,
  lat: city.lat,
  lon: city.lon,
});

export const useCitySearch = () => {
  const debouncedSearchRef = useRef(
    createDebouncedSearch({
      delay: SEARCH_DELAY_MS,
      minQueryLength: MIN_QUERY_LENGTH,
    }),
  );

  const [searchCitiesQuery, { data, loading }] = useLazyQuery<
    CitySuggestionsData,
    CitySuggestionsVars
  >(GET_CITY_SUGGESTIONS, {
    fetchPolicy: 'no-cache',
  });

  const fetchCitySuggestions = (query: string): void => {
    void searchCitiesQuery({
      variables: {
        input: {
          query,
        },
      },
    });
  };

  const handleSearchCities = (input: string): void => {
    const query = normalizeCityName(input);

    debouncedSearchRef.current(fetchCitySuggestions, query);
  };

  const cityOptions =
    data?.getCitySuggestions.map((city) => ({
      label: `${city.name}, ${city.country}`,
      value: JSON.stringify(mapToSelectedCity(city)),
    })) ?? [];

  return {
    loading,
    handleSearchCities,
    cityOptions,
  };
};
