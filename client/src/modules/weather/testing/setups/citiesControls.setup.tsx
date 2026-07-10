import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, type Mock } from 'vitest';

import { CitiesControls } from '@/weather/components/CitiesControlBar/CitiesControls';
import { CitySortField, CitySortOrder } from '@/weather/types';
import type { City, SortingState } from '@/weather/types';
import {
  useCitiesPaginated,
  useRemoveAllCities,
  useSortingParams,
} from '@/weather/hooks';
import { useToast } from '@/common/hooks/useToast';
import {
  CITY_FIXTURE,
  EXISTING_CITY_FIXTURE,
} from '@/weather/testing/fixtures';
import { createCitiesPaginatedResult } from '@/weather/testing/mocks';

type Sorting = SortingState;
type SortingUpdater = (previous: Sorting) => Sorting;
type SortingParamsResult = ReturnType<typeof useSortingParams>;
type RemoveAllCitiesResult = ReturnType<typeof useRemoveAllCities>;

type CitiesControlsSetupOptions = {
  sorting?: SortingState;
  setSorting?: SortingParamsResult['setSorting'];
  showPinnedOnly?: boolean;
  setShowPinnedOnly?: SortingParamsResult['setShowPinnedOnly'];
  cities?: City[];
  removeAllCities?: RemoveAllCitiesResult['removeAllCities'];
};

export const createCitiesControlsOptions = (
  overrides: CitiesControlsSetupOptions = {},
): Required<CitiesControlsSetupOptions> => ({
  sorting: {
    sortBy: CitySortField.CityName,
    sortOrder: CitySortOrder.Asc,
  },
  setSorting: vi.fn() as SortingParamsResult['setSorting'],
  showPinnedOnly: false,
  setShowPinnedOnly: vi.fn() as SortingParamsResult['setShowPinnedOnly'],
  cities: [CITY_FIXTURE, EXISTING_CITY_FIXTURE],
  removeAllCities: vi.fn().mockResolvedValue({
    ok: true,
    code: undefined,
  }) as RemoveAllCitiesResult['removeAllCities'],
  ...overrides,
});

export const setupCitiesControls = (
  overrides: CitiesControlsSetupOptions = {},
) => {
  const options = createCitiesControlsOptions(overrides);
  const user = userEvent.setup();

  vi.mocked(useSortingParams).mockReturnValue({
    sorting: options.sorting,
    setSorting: options.setSorting,
    showPinnedOnly: options.showPinnedOnly,
    setShowPinnedOnly: options.setShowPinnedOnly,
  });

  vi.mocked(useCitiesPaginated).mockReturnValue(
    createCitiesPaginatedResult({
      cities: options.cities,
    }),
  );

  vi.mocked(useRemoveAllCities).mockReturnValue({
    removeAllCities: options.removeAllCities,
    loading: false,
  });

  vi.mocked(useToast).mockReturnValue({
    toast: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  });

  render(<CitiesControls />);

  return {
    user,
    options,
    getSortSelect: () =>
      screen.getByRole('combobox', {
        name: /sort by/i,
      }),
    getSortOrderButton: () => screen.getAllByRole('button')[0],
    getPinnedCheckbox: () =>
      screen.getByRole('checkbox', {
        name: /favourites only/i,
      }),
    getDeleteAllButton: () =>
      screen.getByRole('button', {
        name: /delete all/i,
      }),
  };
};

export const getSortingUpdater = (mock: Mock): SortingUpdater =>
  mock.mock.calls[0][0] as SortingUpdater;
