import { Injectable } from '@nestjs/common';
import {
  ICitySuggestion,
  IGetWeatherInput,
  IWeatherDetails,
  IWeatherPreviewOutput,
} from '@weather/interfaces';
import { LogMethod } from '@logger/decorators';
import { OpenWeatherApiService } from './open-weather-api.service';
import { mapCurrentWeather, mapDailyForecast, mapHourlyForecast } from '../utils/weather-mappers';

@Injectable()
export class WeatherService {
  constructor(private readonly weatherApi: OpenWeatherApiService) {}

  @LogMethod()
  async searchCities(query: string): Promise<ICitySuggestion[]> {
    return this.weatherApi.searchCities(query);
  }

  @LogMethod()
  async getWeatherDetails(coordinates: IGetWeatherInput): Promise<IWeatherDetails> {
    const [current, forecast] = await Promise.all([
      this.weatherApi.getCurrentWeather(coordinates),
      this.weatherApi.getForecast(coordinates),
    ]);

    const currentWeather = mapCurrentWeather(current, forecast.city?.timezone ?? 0);
    const hourlyForecast = mapHourlyForecast(forecast.list, forecast.city?.timezone ?? 0);
    const dailySummaries = mapDailyForecast(forecast.list);

    return {
      coordinates,
      current: currentWeather,
      hourly: hourlyForecast,
      daily: dailySummaries,
      meta: {
        timezone: forecast.city?.timezone?.toString?.() ?? '',
      },
    };
  }

  @LogMethod()
  async getWeatherPreview(coordinates: IGetWeatherInput): Promise<IWeatherPreviewOutput> {
    const weatherDetails = await this.getWeatherDetails(coordinates);

    return {
      temperature: weatherDetails.current.temp,
      description: weatherDetails.current.description,
      next3DaysTemperature: weatherDetails.daily.map((d) => d.max),
      next3DaysDescription: weatherDetails.daily.map((d) => d.description),
    };
  }
}
