import { of } from 'rxjs';
import { searchCitiesResponseFixture } from '@test/weather/fixtures/search-cities.fixture';
import { currentWeatherFixture } from '@test/weather/fixtures/current-weather.fixture';
import { forecastFixture } from '@test/weather/fixtures/forecast.fixture';
import { kyivCoordinatesFixture } from '@test/weather/fixtures/kyiv-coordinates.fixture';
import { mockAxiosResponse } from '@test/weather/mocks/axios-response.mock';
import {
  createOpenWeatherApiContext,
  OpenWeatherApiTestContext,
} from '../../test/weather/contexts/open-weather-api.context';

describe('OpenWeatherApiService', () => {
  let ctx: OpenWeatherApiTestContext;

  beforeEach(async () => {
    ctx = await createOpenWeatherApiContext();
  });

  it('searchCities should call geo API with query', async () => {
    ctx.httpService.get.mockReturnValue(of(searchCitiesResponseFixture));

    const result = await ctx.service.searchCities('Kyiv');

    expect(ctx.httpService.get).toHaveBeenCalledWith(
      'http://geo/direct',
      expect.objectContaining({
        params: expect.objectContaining({ q: 'Kyiv' }),
      }),
    );
    expect(result).toEqual(searchCitiesResponseFixture.data);
  });

  it('getCurrentWeather should call weather API with coordinates', async () => {
    ctx.httpService.get.mockReturnValue(
      of(mockAxiosResponse(currentWeatherFixture)),
    );

    const result = await ctx.service.getCurrentWeather(kyivCoordinatesFixture);

    expect(ctx.httpService.get).toHaveBeenCalledWith(
      'http://weather/weather',
      expect.any(Object),
    );
    expect(result).toEqual(currentWeatherFixture);
  });

  it('getForecast should call forecast API with coordinates', async () => {
    ctx.httpService.get.mockReturnValue(of(mockAxiosResponse(forecastFixture)));

    const result = await ctx.service.getForecast(kyivCoordinatesFixture);

    expect(ctx.httpService.get).toHaveBeenCalledWith(
      'http://weather/forecast',
      expect.any(Object),
    );
    expect(result).toEqual(forecastFixture);
  });
});
