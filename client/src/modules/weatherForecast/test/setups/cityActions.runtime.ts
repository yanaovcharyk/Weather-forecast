import { useSearchParams } from 'react-router-dom';

import type { CityActionsContext } from '../contexts/cityActions.context';

import { useAddCity, useRemoveCity } from '../../hooks';
import { useRemoveAllCities } from '../../hooks/useRemoveAllCities';
import { useTogglePinned } from '../../hooks/useTogglePinned';
import { useCityByName } from '../../hooks/useCityByName';

export const setupCityActionsRuntime = (
  ctx: CityActionsContext,
  overrides?: {
    existingId?: string;
  },
) => {
  vi.mocked(useAddCity).mockReturnValue({
    addCity: ctx.addCity,
    loading: ctx.loading,
  });

  vi.mocked(useRemoveCity).mockReturnValue({
    removeCity: ctx.removeCity,
    loading: ctx.loading,
    error: ctx.error,
  });

  vi.mocked(useRemoveAllCities).mockReturnValue({
    removeAllCities: ctx.removeAllCities,
    loading: ctx.loading,
  });

  vi.mocked(useTogglePinned).mockReturnValue({
    togglePinned: ctx.togglePinned,
    loading: ctx.loading,
  });

  vi.mocked(useCityByName).mockReturnValue({
    getCityByName: ctx.getCityByName,
  });

  ctx.searchParams.get = vi.fn().mockReturnValue(overrides?.existingId ?? null);

  vi.mocked(useSearchParams).mockReturnValue([
    ctx.searchParams,
    ctx.setSearchParams,
  ]);
};
