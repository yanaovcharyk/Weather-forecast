import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  IOpenWeatherCurrent,
  IOpenWeatherForecast,
  ICitySuggestion,
  IGetWeatherInput,
} from '@weather/interfaces';
import {
  OPEN_WEATHER_CITY_SEARCH_LIMIT,
  OPEN_WEATHER_UNITS,
} from '@weather/constants';
import { IGeoConfig, IWeatherConfig } from '@shared/config/weather.config';
import {
  CITY_SEARCH_URL_ENDPOINT,
  FORECAST_URL_ENDPOINT,
  WEATHER_URL_ENDPOINT,
} from '@weather/constants/open-weather.constants';

@Injectable()
export class OpenWeatherApiService {
  constructor(
    private readonly http: HttpService,
    @Inject('WEATHER_CONFIG')
    private readonly weatherConfig: IWeatherConfig,
    @Inject('GEO_CONFIG')
    private readonly geoConfig: IGeoConfig,
  ) {}

  private get baseParams() {
    return {
      appid: this.weatherConfig.apiKey,
      units: OPEN_WEATHER_UNITS,
    };
  }

  private async get<T>(url: string, params: Record<string, any>): Promise<T> {
    const { data } = await firstValueFrom(
      this.http.get<T>(url, { params: { ...this.baseParams, ...params } }),
    );
    return data;
  }

  private async getWeather<T>(
    endpoint: string,
    coordinates: IGetWeatherInput,
  ): Promise<T> {
    return this.get<T>(`${this.weatherConfig.baseUrl}${endpoint}`, coordinates);
  }

  async searchCities(query: string): Promise<ICitySuggestion[]> {
    return this.get<ICitySuggestion[]>(
      `${this.geoConfig.baseUrl}${CITY_SEARCH_URL_ENDPOINT}`,
      { q: query, limit: OPEN_WEATHER_CITY_SEARCH_LIMIT },
    );
  }

  async getCurrentWeather(
    coordinates: IGetWeatherInput,
  ): Promise<IOpenWeatherCurrent> {
    return this.getWeather<IOpenWeatherCurrent>(
      WEATHER_URL_ENDPOINT,
      coordinates,
    );
  }

  async getForecast(
    coordinates: IGetWeatherInput,
  ): Promise<IOpenWeatherForecast> {
    return this.getWeather<IOpenWeatherForecast>(
      FORECAST_URL_ENDPOINT,
      coordinates,
    );
  }
}
