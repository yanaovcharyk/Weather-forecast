import { useSearchParams } from 'react-router-dom';

import type { CityActionsContext } from '@/weather/testing/contexts/cityActions.context';

import { useAddCity, useRemoveCity } from '@/weather/hooks';
import { useRemoveAllCities } from '@/weather/hooks/useRemoveAllCities';
import { useTogglePinned } from '@/weather/hooks/useTogglePinned';
import { useSavedCityLookup } from '@/weather/hooks/useSavedCityLookup';

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

  vi.mocked(useSavedCityLookup).mockReturnValue({
    getSavedCity: ctx.getSavedCity,
  });

  ctx.searchParams.get = vi.fn().mockReturnValue(overrides?.existingId ?? null);

  vi.mocked(useSearchParams).mockReturnValue([
    ctx.searchParams,
    ctx.setSearchParams,
  ]);
};
