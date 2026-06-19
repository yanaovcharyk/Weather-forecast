import { renderHook } from '@testing-library/react';
import { useCityWeather } from '../../hooks/useCityWeather';

export const setupCityWeather = () => {
  const { result } = renderHook(() => useCityWeather());

  return {
    result,
  };
};
