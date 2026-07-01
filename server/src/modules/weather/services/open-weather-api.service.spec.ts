import { throwError, of } from 'rxjs';
import { BadGatewayException } from '@nestjs/common';
import {
  currentWeatherFixture,
  forecastFixture,
  kyivCoordinatesFixture,
} from '@weather/testing/fixtures';
import { mockAxiosResponse } from '@weather/testing/mocks/axios-response.mock';
import {
  createOpenWeatherApiContext,
  OpenWeatherApiTestContext,
} from '@weather/testing/contexts';

import {
  WEATHER_URL_ENDPOINT,
  FORECAST_URL_ENDPOINT,
} from '@weather/constants/open-weather.constants';

describe('OpenWeatherApiService', () => {
  let ctx: OpenWeatherApiTestContext;

  beforeEach(async () => {
    ctx = await createOpenWeatherApiContext();
  });

  it('getCurrentWeather should call weather API with coordinates', async () => {
    ctx.httpService.get.mockReturnValue(
      of(mockAxiosResponse(currentWeatherFixture)),
    );

    const result = await ctx.service.getCurrentWeather(kyivCoordinatesFixture);

    expect(ctx.httpService.get).toHaveBeenCalledWith(
      `${ctx.weatherConfig.baseUrl}${WEATHER_URL_ENDPOINT}`,
      expect.any(Object),
    );

    expect(result).toEqual(currentWeatherFixture);
  });

  it('getForecast should call forecast API with coordinates', async () => {
    ctx.httpService.get.mockReturnValue(of(mockAxiosResponse(forecastFixture)));

    const result = await ctx.service.getForecast(kyivCoordinatesFixture);

    expect(ctx.httpService.get).toHaveBeenCalledWith(
      `${ctx.weatherConfig.baseUrl}${FORECAST_URL_ENDPOINT}`,
      expect.any(Object),
    );

    expect(result).toEqual(forecastFixture);
  });

  it('getForecast should throw clear error for invalid OpenWeather API key', async () => {
    ctx.httpService.get.mockReturnValue(
      throwError(() => ({
        isAxiosError: true,
        response: {
          status: 401,
        },
      })),
    );

    await expect(
      ctx.service.getForecast(kyivCoordinatesFixture),
    ).rejects.toThrow(BadGatewayException);

    await expect(
      ctx.service.getForecast(kyivCoordinatesFixture),
    ).rejects.toThrow('Check OPENWEATHER_API_KEY');
  });

  it('getForecast should rethrow non-auth OpenWeather errors', async () => {
    const openWeatherError = new Error('OpenWeather is unavailable');

    ctx.httpService.get.mockReturnValue(throwError(() => openWeatherError));

    await expect(ctx.service.getForecast(kyivCoordinatesFixture)).rejects.toBe(
      openWeatherError,
    );
  });
});
