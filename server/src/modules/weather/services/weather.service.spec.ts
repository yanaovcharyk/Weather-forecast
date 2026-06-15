import {
  createWeatherServiceContext,
  WeatherServiceTestContext,
} from '@test/weather/contexts/weather-service.context';
import { currentWeatherFixture } from '@test/weather/fixtures/current-weather.fixture';
import { forecastFixture } from '@test/weather/fixtures/forecast.fixture';
import { kyivCoordinatesFixture } from '@test/weather/fixtures/kyiv-coordinates.fixture';
import { citySuggestionsFixture } from '@test/weather/fixtures/city-suggestions.fixture';
import { forecastWithoutTimezoneFixture } from '@test/weather/fixtures/forecast-without-timezone.fixture';

describe('WeatherService', () => {
  let ctx: WeatherServiceTestContext;

  beforeEach(async () => {
    ctx = await createWeatherServiceContext();
  });

  it('searchCities should delegate request to weather api', async () => {
    ctx.weatherApi.searchCities.mockResolvedValue(citySuggestionsFixture);

    const result = await ctx.service.searchCities('Kyiv');

    expect(ctx.weatherApi.searchCities).toHaveBeenCalledWith('Kyiv');
    expect(result).toEqual(citySuggestionsFixture);
  });

  it('getWeatherDetails should aggregate current and forecast data', async () => {
    ctx.weatherApi.getCurrentWeather.mockResolvedValue(currentWeatherFixture);
    ctx.weatherApi.getForecast.mockResolvedValue(forecastFixture);

    const result = await ctx.service.getWeatherDetails(
      kyivCoordinatesFixture,
    );

    expect(ctx.weatherApi.getCurrentWeather).toHaveBeenCalledWith(
      kyivCoordinatesFixture,
    );

    expect(ctx.weatherApi.getForecast).toHaveBeenCalledWith(
      kyivCoordinatesFixture,
    );

    expect(result).toMatchObject({
      coordinates: kyivCoordinatesFixture,
      meta: {
        timezone: expect.any(String),
      },
    });

    expect(result.hourly).toBeDefined();
    expect(result.daily).toBeDefined();
  });

  it('getWeatherDetails should use default timezone when forecast city timezone is missing', async () => {
    ctx.weatherApi.getCurrentWeather.mockResolvedValue(currentWeatherFixture);
    ctx.weatherApi.getForecast.mockResolvedValue(
      forecastWithoutTimezoneFixture,
    );

    const result = await ctx.service.getWeatherDetails(
      kyivCoordinatesFixture,
    );

    expect(result.meta?.timezone).toBe('');
  });

  it('getWeatherPreview should return simplified data', async () => {
    ctx.weatherApi.getForecast.mockResolvedValue(forecastFixture);

    const result = await ctx.service.getWeatherPreview(
      kyivCoordinatesFixture,
    );

    expect(ctx.weatherApi.getForecast).toHaveBeenCalledWith(
      kyivCoordinatesFixture,
    );

    expect(result).toBeDefined();
    expect(result.temperature).toEqual(expect.any(Number));
    expect(result.min).toEqual(expect.any(Number));
    expect(result.max).toEqual(expect.any(Number));
    expect(result.description).toEqual(expect.any(String));
    expect(result.next3Days).toBeDefined();
    expect(result.next3Days.length).toBeGreaterThan(0);
  });
});
