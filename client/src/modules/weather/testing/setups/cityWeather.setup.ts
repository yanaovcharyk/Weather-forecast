import { renderHook } from '@testing-library/react';
import { useCityWeather } from '@/weather/hooks/useCityWeather';

export const setupCityWeather = () => {
  const { result } = renderHook(() => useCityWeather());

  return {
    result,
  };
};
