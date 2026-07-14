import { vi } from 'vitest';

import { mockIntersectionObserver } from '@/common/testing/mocks/browser.mock';
import type { City } from '@/weather/types';
import {
  CITIES_LIST_CITY_FIXTURE,
  type CitiesListRuntimeMocks,
} from '@/weather/testing/contexts/citiesList.context';
import {
  createCitiesPaginatedResult,
  createSortingParamsResult,
} from '@/weather/testing/mocks';

export const setupCitiesListRuntime = (
  mocks: CitiesListRuntimeMocks,
  {
    cities = [CITIES_LIST_CITY_FIXTURE],
  }: {
    cities?: City[];
  } = {},
) => {
  vi.clearAllMocks();

  mocks.cityCardProps.length = 0;
  mocks.searchParams = new URLSearchParams();
  mocks.useSortingParams.mockReturnValue(createSortingParamsResult());
  mocks.useCitiesPaginated.mockReturnValue(
    createCitiesPaginatedResult({
      cities,
    }),
  );

  return {
    intersectionObserver: mockIntersectionObserver(),
  };
};
