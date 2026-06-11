import { of } from 'rxjs';
import {
  createWeatherServiceContext,
  WeatherServiceTestContext,
} from '@test/weather/contexts/weather-service.context';
import {
  searchCitiesResponseFixture,
  emptyCitiesResponseFixture,
  undefinedCitiesResponseFixture,
  mappedCitiesFixture,
} from '@test/weather/fixtures/search-cities.fixture';
import {
  currentWeatherFixture,
  currentWeatherAlternativeFixture,
  currentWeatherTimezoneZeroFixture,
} from '@test/weather/fixtures/current-weather.fixture';
import {
  forecastFixture,
  forecastWithTimezoneFixture,
  forecastWithoutListFixture,
  aggregationForecastFixture,
  forecastTimezoneZeroFixture,
  aggregatedDailyForecastFixture,
} from '@test/weather/fixtures/forecast.fixture';
import { weatherDetailsFixture } from '@test/weather/fixtures/weather-details.fixture';
import { kyivCoordinatesFixture } from '@test/weather/fixtures/kyiv-coordinates.fixture';
import { weatherPreviewFixture } from '@test/weather/fixtures/weather-preview.fixture';
import { mockAxiosResponse } from '@test/weather/mocks/axios-response.mock';

describe('WeatherService', () => {
  let ctx: WeatherServiceTestContext;

  beforeEach(async () => {
    ctx = await createWeatherServiceContext();
  });

  it('searchCities should call httpService.get and map response', async () => {
    ctx.httpService.get.mockReturnValue(of(searchCitiesResponseFixture));

    const result = await ctx.service.searchCities('Kyiv');

    expect(ctx.httpService.get).toHaveBeenCalledWith('http://geo/direct', {
      params: {
        q: 'Kyiv',
        limit: 5,
        appid: 'test-key',
      },
    });

    expect(result).toEqual(mappedCitiesFixture);
  });

  it('searchCities should log count 0 when data is undefined', async () => {
    ctx.httpService.get.mockReturnValue(of(undefinedCitiesResponseFixture));

    await expect(ctx.service.searchCities('Kyiv')).rejects.toThrow();
  });

  it('getWeatherDetails should call httpService.get twice and return structured data', async () => {
    ctx.httpService.get
      .mockReturnValueOnce(of(mockAxiosResponse(currentWeatherFixture)))
      .mockReturnValueOnce(of(forecastFixture));

    const result = await ctx.service.getWeatherDetails(kyivCoordinatesFixture);

    expect(ctx.httpService.get).toHaveBeenCalledTimes(2);
    expect(result.current.temp).toBe(20);
    expect(result.hourly.length).toBeGreaterThanOrEqual(1);
    expect(result.daily.length).toBeGreaterThanOrEqual(0);
  });

  it('getWeatherDetails should log forecastItems 0 when list is undefined', async () => {
    ctx.httpService.get
      .mockReturnValueOnce(of(mockAxiosResponse(currentWeatherFixture)))
      .mockReturnValueOnce(of(forecastWithoutListFixture));

    await expect(
      ctx.service.getWeatherDetails(kyivCoordinatesFixture),
    ).rejects.toThrow();
  });

  it('getWeatherDetails should aggregate daily forecast and handle missing timezone/pop', async () => {
    ctx.httpService.get
      .mockReturnValueOnce(of(currentWeatherAlternativeFixture))
      .mockReturnValueOnce(of(aggregationForecastFixture));

    const result = await ctx.service.getWeatherDetails(kyivCoordinatesFixture);

    expect(result.meta?.timezone).toBe('');

    expect(result.daily).toHaveLength(3);

    expect(result.daily[0]).toMatchObject(aggregatedDailyForecastFixture);

    expect(result.daily[1].pop).toBe(50);
    expect(result.daily[2].pop).toBe(80);
  });

  it('getWeatherPreview should call getWeatherDetails and return simplified data', async () => {
    jest
      .spyOn(ctx.service, 'getWeatherDetails')
      .mockResolvedValue(weatherDetailsFixture);

    const result = await ctx.service.getWeatherPreview(kyivCoordinatesFixture);

    expect(ctx.service.getWeatherDetails).toHaveBeenCalledWith(
      kyivCoordinatesFixture,
    );

    expect(result).toEqual(weatherPreviewFixture);
  });

  it('getWeatherDetails should return timezone string', async () => {
    ctx.httpService.get
      .mockReturnValueOnce(of(mockAxiosResponse(currentWeatherFixture)))
      .mockReturnValueOnce(of(forecastWithTimezoneFixture));

    const result = await ctx.service.getWeatherDetails(kyivCoordinatesFixture);

    expect(result.meta?.timezone).toBe('7200');
  });

  it('searchCities should handle empty response array', async () => {
    ctx.httpService.get.mockReturnValue(of(emptyCitiesResponseFixture));

    const result = await ctx.service.searchCities('Unknown');

    expect(result).toEqual([]);
  });

  it('getWeatherDetails should handle empty forecast list and timezone 0', async () => {
    ctx.httpService.get
      .mockReturnValueOnce(of(currentWeatherTimezoneZeroFixture))
      .mockReturnValueOnce(of(forecastTimezoneZeroFixture));

    const result = await ctx.service.getWeatherDetails(kyivCoordinatesFixture);

    expect(result.meta).toEqual({
      timezone: '0',
    });
  });
});
