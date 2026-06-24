import { useQuery } from '@apollo/client/react';
import { useParams } from 'react-router-dom';
import type { Mock } from 'vitest';

import type { CityWeatherContext } from '@/weatherDetails/test/contexts/cityWeather.context';
import { createQueryResult } from '@/test/factories';

export const setupCityWeatherRuntime = (
  ctx: CityWeatherContext,
  overrides?: Partial<CityWeatherContext>,
) => {
  const state = {
    ...ctx,
    ...overrides,
  };

  vi.mocked(useParams).mockReturnValue({
    id: state.id,
  });

  let callCount = 0;

  const mockedUseQuery = useQuery as unknown as Mock;

  mockedUseQuery.mockImplementation(() => {
    callCount++;

    if (callCount === 1) {
      return createQueryResult({
        data: state.cityData,
        loading: state.cityLoading,
        error: state.cityError,
      });
    }

    return createQueryResult({
      data: state.weatherData,
      loading: state.weatherLoading,
      error: state.weatherError,
    });
  });
};
