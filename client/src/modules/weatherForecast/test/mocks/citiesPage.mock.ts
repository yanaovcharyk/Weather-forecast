import { vi } from 'vitest';

import type {
  useCitiesPaginated,
  useCityActions,
  useSortingParams,
} from '@/weatherForecast/hooks';

type SortingParamsResult = ReturnType<typeof useSortingParams>;
type CityActionsResult = ReturnType<typeof useCityActions>;
type CitiesPaginatedResult = ReturnType<typeof useCitiesPaginated>;

export const createSortingParamsResult = (
  overrides: Partial<SortingParamsResult> = {},
): SortingParamsResult => ({
  sorting: {
    sortBy: 'city',
    sortOrder: 'ASC',
  },
  setSorting: vi.fn(),
  showPinnedOnly: false,
  setShowPinnedOnly: vi.fn(),
  ...overrides,
});

export const createCityActionsResult = (
  overrides: Partial<CityActionsResult> = {},
): CityActionsResult => ({
  handleAddCity: vi.fn(),
  handleRemoveCity: vi.fn(),
  handleTogglePinned: vi.fn(),
  handleDeleteAllCities: vi.fn(),
  isAddingCity: false,
  currentlyRemovingCityId: null,
  currentlySelectedCity: null,
  setCurrentlySelectedCity: vi.fn(),
  ...overrides,
});

export const createCitiesPaginatedResult = (
  overrides: Partial<CitiesPaginatedResult> = {},
): CitiesPaginatedResult => ({
  cities: [],
  loading: false,
  loadMore: vi.fn(),
  hasNext: false,
  ...overrides,
});
