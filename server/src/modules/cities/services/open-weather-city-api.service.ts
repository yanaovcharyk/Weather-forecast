import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { isAxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import {
  CITY_SEARCH_URL_ENDPOINT,
  OPEN_WEATHER_CITY_SEARCH_LIMIT,
} from '@cities/constants';
import { ICitySuggestion } from '@cities/interfaces';
import { ICityOpenWeatherConfig } from '@cities/config';

@Injectable()
export class OpenWeatherCityApiService {
  constructor(
    private readonly http: HttpService,
    @Inject('CITY_OPEN_WEATHER_CONFIG')
    private readonly openWeatherConfig: ICityOpenWeatherConfig,
  ) {}

  private get baseParams() {
    return {
      appid: this.openWeatherConfig.apiKey,
    };
  }

  async getCitySuggestions(query: string): Promise<ICitySuggestion[]> {
    try {
      const { data } = await firstValueFrom(
        this.http.get<ICitySuggestion[]>(
          `${this.openWeatherConfig.geoBaseUrl}${CITY_SEARCH_URL_ENDPOINT}`,
          {
            params: {
              ...this.baseParams,
              q: query,
              limit: OPEN_WEATHER_CITY_SEARCH_LIMIT,
            },
          },
        ),
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
}
