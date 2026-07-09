import { renderHook } from '@testing-library/react';

import { useCityActions } from '@/weather/hooks/useCityActions';

export const setupCityActions = () => {
  const { result, unmount } = renderHook(() => useCityActions());

  return {
    result,

    handleAddCity: result.current.handleAddCity,

    handleRemoveCity: result.current.handleRemoveCity,

    handleTogglePinned: result.current.handleTogglePinned,

    handleDeleteAllCities: result.current.handleDeleteAllCities,

    unmount,
  };
};
