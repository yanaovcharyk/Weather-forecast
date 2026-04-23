import { useLazyQuery } from '@apollo/client/react';
import { useRef } from 'react';

import { SEARCH_CITIES } from '../api';
import type {
  SearchCitiesData,
  SearchCitiesVars,
} from '../components/AddCityForm/types';

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
        variables: { query },
      });
    }, DEBOUNCE_DELAY_MS);
  };

  const isSearchQueryTooShort = (query: string) => {
    return query.trim().length < MIN_SEARCH_LENGTH;
  };

  const requestCitySearch = (inputValue: string) => {
    const query = inputValue.trim();

    cancelPreviousSearch();

    if (isSearchQueryTooShort(query)) {
      return;
    }

    scheduleSearchRequest(query);
  };

  return {
    data,
    loading,
    handleSearch: requestCitySearch,
  };
};
