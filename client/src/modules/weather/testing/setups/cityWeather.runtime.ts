import { useParams } from 'react-router-dom';

import type { CityWeatherContext } from '@/weather/testing/contexts/cityWeather.context';
import { createQueryResult } from '@/common/testing/factories';
import { useQueryMock } from '@/common/testing/mocks/apollo.mock';

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

  useQueryMock.mockImplementation(() => {
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
