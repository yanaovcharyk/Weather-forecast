import { Injectable } from '@nestjs/common';
import {
  IGetWeatherInput,
  IWeatherDetails,
  IWeatherPreviewOutput,
} from '@weather/interfaces';
import { LogMethod } from '@logger/decorators';
import { OpenWeatherApiService } from './open-weather-api.service';
import {
  mapCurrentWeather,
  mapDailyForecast,
  mapHourlyForecast,
  mapWeatherPreview,
} from '@weather/utils/weather-mappers';

@Injectable()
export class WeatherService {
  constructor(private readonly weatherApi: OpenWeatherApiService) {}

  @LogMethod()
  async getWeatherDetails(
    coordinates: IGetWeatherInput,
  ): Promise<IWeatherDetails> {
    const [current, forecast] = await Promise.all([
      this.weatherApi.getCurrentWeather(coordinates),
      this.weatherApi.getForecast(coordinates),
    ]);

    const currentWeather = mapCurrentWeather(
      current,
      forecast.list,
      forecast.city?.timezone ?? 0,
    );
    const hourlyForecast = mapHourlyForecast(
      forecast.list,
      forecast.city?.timezone ?? 0,
    );
    const dailySummaries = mapDailyForecast(forecast.list);

    const weatherDetails = {
      coordinates,
      current: currentWeather,
      hourly: hourlyForecast,
      daily: dailySummaries,
      meta: {
        timezone: forecast.city?.timezone?.toString?.() ?? '',
      },
    };

    return weatherDetails;
  }

  @LogMethod()
  async getWeatherPreview(
    coordinates: IGetWeatherInput,
  ): Promise<IWeatherPreviewOutput> {
    const forecast = await this.weatherApi.getForecast(coordinates);

    return mapWeatherPreview(forecast.list);
  }
}
