import { BadGatewayException } from '@nestjs/common';
import { of, throwError } from 'rxjs';

import {
  CITY_SEARCH_URL_ENDPOINT,
  OPEN_WEATHER_CITY_SEARCH_LIMIT,
} from '@cities/constants';
import {
  createOpenWeatherCityApiContext,
  OpenWeatherCityApiTestContext,
} from '@cities/testing/contexts/open-weather-city-api.context';
import { searchCitiesResponseFixture } from '@cities/testing/fixtures';

describe('OpenWeatherCityApiService', () => {
  let ctx: OpenWeatherCityApiTestContext;

  beforeEach(async () => {
    ctx = await createOpenWeatherCityApiContext();
  });

  it('searchCities should call geo API with query', async () => {
    ctx.httpService.get.mockReturnValue(of(searchCitiesResponseFixture));

    const result = await ctx.service.searchCities('Kyiv');

    expect(ctx.httpService.get).toHaveBeenCalledWith(
      `${ctx.openWeatherConfig.geoBaseUrl}${CITY_SEARCH_URL_ENDPOINT}`,
      expect.objectContaining({
        params: expect.objectContaining({
          appid: ctx.openWeatherConfig.apiKey,
          q: 'Kyiv',
          limit: OPEN_WEATHER_CITY_SEARCH_LIMIT,
        }),
      }),
    );

    expect(result).toEqual(searchCitiesResponseFixture.data);
  });

  it('searchCities should throw clear error for invalid OpenWeather API key', async () => {
    ctx.httpService.get.mockReturnValue(
      throwError(() => ({
        isAxiosError: true,
        response: {
          status: 401,
        },
      })),
    );

    await expect(ctx.service.searchCities('Kyiv')).rejects.toThrow(
      BadGatewayException,
    );

    await expect(ctx.service.searchCities('Kyiv')).rejects.toThrow(
      'Check OPENWEATHER_API_KEY',
    );
  });

  it('searchCities should rethrow non-auth OpenWeather errors', async () => {
    const openWeatherError = new Error('OpenWeather is unavailable');

    ctx.httpService.get.mockReturnValue(throwError(() => openWeatherError));

    await expect(ctx.service.searchCities('Kyiv')).rejects.toBe(
      openWeatherError,
    );
  });
});
