import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { isAxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import {
  IOpenWeatherCurrent,
  IOpenWeatherForecast,
  IGetWeatherInput,
} from '@weather/interfaces';
import { OPEN_WEATHER_UNITS } from '@weather/constants';
import { IWeatherConfig } from '@weather/config';
import {
  FORECAST_URL_ENDPOINT,
  WEATHER_URL_ENDPOINT,
} from '@weather/constants/open-weather.constants';

@Injectable()
export class OpenWeatherApiService {
  constructor(
    private readonly http: HttpService,
    @Inject('WEATHER_CONFIG')
    private readonly weatherConfig: IWeatherConfig,
  ) {}

  private get baseParams() {
    return {
      appid: this.weatherConfig.apiKey,
      units: OPEN_WEATHER_UNITS,
    };
  }

  private async get<T>(url: string, params: Record<string, any>): Promise<T> {
    try {
      const { data } = await firstValueFrom(
        this.http.get<T>(url, { params: { ...this.baseParams, ...params } }),
      );

      return data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        throw new BadGatewayException(
          'OpenWeather API rejected the request. Check OPENWEATHER_API_KEY.',
        );
      }

      throw error;
    }
  }

  private async getWeather<T>(
    endpoint: string,
    coordinates: IGetWeatherInput,
  ): Promise<T> {
    return this.get<T>(`${this.weatherConfig.baseUrl}${endpoint}`, coordinates);
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
