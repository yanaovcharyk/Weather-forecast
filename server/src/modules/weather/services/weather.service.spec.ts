import { createWeatherServiceContext, WeatherServiceTestContext } from '@test/weather/contexts/weather-service.context';
import { currentWeatherFixture } from '@test/weather/fixtures/current-weather.fixture';
import { forecastFixture } from '@test/weather/fixtures/forecast.fixture';
import { weatherDetailsFixture } from '@test/weather/fixtures/weather-details.fixture';
import { weatherPreviewFixture } from '@test/weather/fixtures/weather-preview.fixture';
import { kyivCoordinatesFixture } from '@test/weather/fixtures/kyiv-coordinates.fixture';

describe('WeatherService', () => {
  let ctx: WeatherServiceTestContext;

  beforeEach(async () => {
    ctx = await createWeatherServiceContext();
  });

  it('getWeatherDetails should aggregate current and forecast data', async () => {
    ctx.weatherApi.getCurrentWeather.mockResolvedValue(currentWeatherFixture);
    ctx.weatherApi.getForecast.mockResolvedValue(forecastFixture);

    const result = await ctx.service.getWeatherDetails(kyivCoordinatesFixture);

    expect(ctx.weatherApi.getCurrentWeather).toHaveBeenCalledWith(kyivCoordinatesFixture);
    expect(ctx.weatherApi.getForecast).toHaveBeenCalledWith(kyivCoordinatesFixture);
    expect(result.current.temp).toBeDefined();
    expect(result.hourly.length).toBeGreaterThan(0);
    expect(result.daily.length).toBeGreaterThan(0);
  });

  it('getWeatherPreview should return simplified data', async () => {
    jest.spyOn(ctx.service, 'getWeatherDetails').mockResolvedValue(weatherDetailsFixture);

    const result = await ctx.service.getWeatherPreview(kyivCoordinatesFixture);

    expect(result).toEqual(weatherPreviewFixture);
  });
});

