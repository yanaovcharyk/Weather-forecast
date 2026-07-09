import { useLazyQuery } from '@apollo/client/react';
import { useRef } from 'react';

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
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [searchCitiesQuery, { data, loading }] = useLazyQuery<
    CitySuggestionsData,
    CitySuggestionsVars
  >(GET_CITY_SUGGESTIONS, {
    fetchPolicy: 'no-cache',
  });

  const fetchCitySuggestions = (query: string) =>
    searchCitiesQuery({
      variables: {
        input: {
          query,
        },
      },
    });

  const handleSearchCities = (input: string) => {
    const query = normalizeCityName(input);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (query.length < MIN_QUERY_LENGTH) {
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchCitySuggestions(query);
    }, SEARCH_DELAY_MS);
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
