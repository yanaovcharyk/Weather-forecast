import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WeatherService {
  constructor(
    private readonly httpService: HttpService,
    @Inject('WEATHER_CONFIG')
    private readonly weatherConfig: {
      apiKey: string;
      weatherBaseUrl: string;
    },
    @Inject('GEO_CONFIG')
    private readonly geoConfig: {
      baseUrl: string;
    },
  ) {}

  async searchCities(query: string) {
    const { apiKey } = this.weatherConfig;
    const { baseUrl } = this.geoConfig;

    const response = await firstValueFrom(
      this.httpService.get(`${baseUrl}/direct`, {
        params: {
          q: query,
          limit: 5,
          appid: apiKey,
        },
      }),
    );

    return response.data.map((city: any) => ({
      name: city.name,
      country: city.country,
      lat: city.lat,
      lon: city.lon,
    }));
  }

  async getWeather({ lat, lon }: { lat: number; lon: number }) {
    const { apiKey, weatherBaseUrl } = this.weatherConfig;

    const currentWeatherResponse = await firstValueFrom(
      this.httpService.get(`${weatherBaseUrl}/weather`, {
        params: {
          lat,
          lon,
          appid: apiKey,
          units: 'metric',
        },
      }),
    );

    const forecastWeatherResponse = await firstValueFrom(
      this.httpService.get(`${weatherBaseUrl}/forecast`, {
        params: {
          lat,
          lon,
          appid: apiKey,
          units: 'metric',
        },
      }),
    );

    const current = currentWeatherResponse.data;
    const forecast = forecastWeatherResponse.data;

    const daily = forecast.list
      .filter((_: any, i: number) => i % 8 === 0)
      .slice(1, 4);

    return {
      city: current.name,
      temperature: current.main.temp,
      description: current.weather[0].description,
      next3DaysTemperature: daily.map((d: any) => d.main.temp),
      next3DaysDescription: daily.map((d: any) => d.weather[0].description),
    };
  }
}
