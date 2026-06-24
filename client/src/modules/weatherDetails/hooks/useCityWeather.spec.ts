import {
  CITY_RESPONSE,
  WEATHER_RESPONSE,
} from '@/weatherForecast/test/fixtures/city.fixture';
import {
  createCityWeatherContext,
  type CityWeatherContext,
} from '@/weatherDetails/test/contexts/cityWeather.context';
import { setupCityWeatherRuntime } from '@/weatherDetails/test/setups/cityWeather.runtime';
import { setupCityWeather } from '@/weatherDetails/test/setups/cityWeather.setup';

vi.mock('@apollo/client/react');

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom',
    );

  return {
    ...actual,
    useParams: vi.fn(),
  };
});

describe('useCityWeather', () => {
  let ctx: CityWeatherContext;

  beforeEach(() => {
    ctx = createCityWeatherContext();

    setupCityWeatherRuntime(ctx);
  });

  it('returns loading state', () => {
    setupCityWeatherRuntime(ctx, {
      cityLoading: true,
    });

    const { result } = setupCityWeather();

    expect(result.current.loading).toBe(true);
  });

  it('returns city and weather data', () => {
    setupCityWeatherRuntime(ctx, {
      cityData: CITY_RESPONSE,
      weatherData: WEATHER_RESPONSE,
    });

    const { result } = setupCityWeather();

    expect(result.current.city).toBe(CITY_RESPONSE.city.city);

    expect(result.current.weather).toEqual(WEATHER_RESPONSE.getWeatherDetails);
  });

  it('returns city error', () => {
    const error = new Error('City error');

    setupCityWeatherRuntime(ctx, {
      cityError: error,
    });

    const { result } = setupCityWeather();

    expect(result.current.error).toBe(error);
  });

  it('returns weather error', () => {
    const error = new Error('Weather error');

    setupCityWeatherRuntime(ctx, {
      weatherError: error,
    });

    const { result } = setupCityWeather();

    expect(result.current.error).toBe(error);
  });

  it('returns undefined city when no data', () => {
    const { result } = setupCityWeather();

    expect(result.current.city).toBeUndefined();
  });
});
