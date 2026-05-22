import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AppLoggerService } from '@logger/services';
import { CoordinatesParams } from '../types';
import { ICitySuggestion, IWeatherCurrent, IWeatherDetails, IWeatherPreview } from '../interfaces';

@Injectable()
export class WeatherService {
  private readonly logger;

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
    loggerService: AppLoggerService,
  ) {
    this.logger = loggerService.child(WeatherService.name);
  }

  async searchCities(query: string): Promise<ICitySuggestion> {
    this.logger.info('searchCities called');
    this.logger.debug('searchCities params', { query });

    const { apiKey } = this.weatherConfig;
    const { baseUrl } = this.geoConfig;

    const start = Date.now();

    const response = await firstValueFrom(
      this.httpService.get(`${baseUrl}/direct`, {
        params: {
          q: query,
          limit: 5,
          appid: apiKey,
        },
      }),
    );

    const duration = Date.now() - start;

    this.logger.debug('searchCities API response received', {
      durationMs: duration,
      count: response.data?.length ?? 0,
    });

    const cities = response.data;

    return cities.map((city: any) => ({
      name: city.name,
      country: city.country,
      lat: city.lat,
      lon: city.lon,
    }));
  }

  async getWeatherDetails({ lat, lon }: CoordinatesParams): Promise<IWeatherDetails> {
    this.logger.info('getWeatherDetails called');
    this.logger.debug('getWeatherDetails params', { lat, lon });

    const { apiKey, weatherBaseUrl } = this.weatherConfig;

    const start = Date.now();

    const [currentRes, forecastRes] = await Promise.all([
      firstValueFrom(
        this.httpService.get(`${weatherBaseUrl}/weather`, {
          params: { lat, lon, appid: apiKey, units: 'metric' },
        }),
      ),
      firstValueFrom(
        this.httpService.get(`${weatherBaseUrl}/forecast`, {
          params: { lat, lon, appid: apiKey, units: 'metric' },
        }),
      ),
    ]);

    const duration = Date.now() - start;

    this.logger.debug('getWeatherDetails API responses received', {
      durationMs: duration,
      forecastItems: forecastRes.data?.list?.length ?? 0,
    });

    const current = currentRes.data;
    const forecast = forecastRes.data;

    const timezone = forecast.city?.timezone ?? 0;
    const formatTime = (unix: number) =>
      new Date((unix + timezone) * 1000).toISOString().slice(11, 16);

    const hourly = forecast.list.slice(0, 9).map((item: any) => ({
      time: formatTime(item.dt),
      temp: Math.round(item.main.temp),
      feelsLike: Math.round(item.main.feels_like),
      icon: item.weather[0].icon,
    }));

    const daysMap: Record<string, any[]> = {};

    forecast.list.forEach((item: any) => {
      const date = item.dt_txt.split(' ')[0];
      if (!daysMap[date]) daysMap[date] = [];
      daysMap[date].push(item);
    });

    const daily = Object.entries(daysMap)
      .slice(1, 4)
      .map(([date, items]: any) => {
        const temps = items.map((i: any) => i.main.temp);
        const feels = items.map((i: any) => i.main.feels_like);
        const humidity = items.map((i: any) => i.main.humidity);
        const pressure = items.map((i: any) => i.main.pressure);
        const clouds = items.map((i: any) => i.clouds.all);
        const wind = items.map((i: any) => i.wind.speed);
        const pop = items.map((i: any) => i.pop ?? 0);

        return {
          date,
          min: Math.round(Math.min(...temps)),
          max: Math.round(Math.max(...temps)),
          description: items[0].weather[0].description,
          icon: items[0].weather[0].icon,

          humidity: Math.round(
            humidity.reduce((a: number, b: number) => a + b, 0) /
              humidity.length,
          ),
          pressure: Math.round(
            pressure.reduce((a: number, b: number) => a + b, 0) /
              pressure.length,
          ),
          clouds: Math.round(
            clouds.reduce((a: number, b: number) => a + b, 0) / clouds.length,
          ),
          windSpeed: Math.round(
            wind.reduce((a: number, b: number) => a + b, 0) / wind.length,
          ),
          pop: Math.round(
            (pop.reduce((a: number, b: number) => a + b, 0) / pop.length) * 100,
          ),
          feelsLike: Math.round(
            feels.reduce((a: number, b: number) => a + b, 0) / feels.length,
          ),
        };
      });

    this.logger.debug('getWeatherDetails processed forecast', {
      hourlyCount: hourly.length,
      dailyCount: daily.length,
    });

    return {
      coordinates: { lat, lon },
      current: {
        temp: Math.round(current.main.temp),
        feelsLike: Math.round(current.main.feels_like),
        humidity: current.main.humidity,
        windSpeed: current.wind.speed,
        pressure: current.main.pressure,
        description: current.weather[0].description,
        icon: current.weather[0].icon,
        sunrise: formatTime(current.sys.sunrise),
        sunset: formatTime(current.sys.sunset),
      },
      hourly,
      daily,
      meta: {
        timezone: forecast.city?.timezone?.toString?.() ?? '',
      },
    };
  }

  async getWeatherPreview({ lat, lon }: CoordinatesParams): Promise<IWeatherPreview> {
    this.logger.info('getWeatherPreview called');
    this.logger.debug('getWeatherPreview params', { lat, lon });

    const full = await this.getWeatherDetails({ lat, lon });

    this.logger.debug('getWeatherPreview processed');

    return {
      temperature: full.current.temp,
      description: full.current.description,
      next3DaysTemperature: full.daily.map((d) => d.max),
      next3DaysDescription: full.daily.map((d) => d.description),
    };
  }
}
