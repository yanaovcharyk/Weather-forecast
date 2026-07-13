import { vi } from 'vitest';

import type { useCitiesPaginated, useSortingParams } from '@/weather/hooks';
import { CitySortField, CitySortOrder } from '@/weather/types';

type SortingParamsResult = ReturnType<typeof useSortingParams>;
type CitiesPaginatedResult = ReturnType<typeof useCitiesPaginated>;

export const createSortingParamsResult = (
  overrides: Partial<SortingParamsResult> = {},
): SortingParamsResult => ({
  sorting: {
    sortBy: CitySortField.CityName,
    sortOrder: CitySortOrder.Asc,
  },
  setSorting: vi.fn(),
  showPinnedOnly: false,
  setShowPinnedOnly: vi.fn(),
  ...overrides,
});

export const createCitiesPaginatedResult = (
  overrides: Partial<CitiesPaginatedResult> = {},
): CitiesPaginatedResult => ({
  cities: overrides.cities ?? [],
  loading: overrides.loading ?? false,
  error: overrides.error,
  loadMore:
    overrides.loadMore ?? (vi.fn() as CitiesPaginatedResult['loadMore']),
  hasNext: overrides.hasNext ?? false,
});
