import { renderHook } from '@testing-library/react';

import { useCityActions } from '@/weatherForecast/hooks/useCityActions';
import type { CityActionsContext } from '@/weatherForecast/testing/contexts/cityActions.context';

export const setupCityActions = (ctx: CityActionsContext) => {
  const { result } = renderHook(() =>
    useCityActions({
      showSuccessNotification: ctx.showSuccessNotification,

      showErrorNotification: ctx.showErrorNotification,

      showInfoNotification: ctx.showInfoNotification,
    }),
  );

  return {
    result,

    handleAddCity: result.current.handleAddCity,

    handleRemoveCity: result.current.handleRemoveCity,

    handleTogglePinned: result.current.handleTogglePinned,

    handleDeleteAllCities: result.current.handleDeleteAllCities,
  };
};
