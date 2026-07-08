import { renderHook } from '@testing-library/react';

import { useCityActions } from '@/weather/hooks/useCityActions';
import type { CityActionsContext } from '@/weather/testing/contexts/cityActions.context';

export const setupCityActions = (ctx: CityActionsContext) => {
  const { result, unmount } = renderHook(() =>
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

    unmount,
  };
};
