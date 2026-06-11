import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AppLoggerService } from '@logger/services';
import { CoordinatesParams } from '@weather/types';
import {
  ICitySuggestion,
  IDailyWeather,
  IOpenWeatherCurrent,
  IOpenWeatherForecast,
  IOpenWeatherForecastItem,
  IWeatherDetails,
  IWeatherPreview,
} from '@weather/interfaces';
import { LogMethod } from '@logger/decorators';

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

  @LogMethod()
  async searchCities(query: string): Promise<ICitySuggestion[]> {
    const { apiKey } = this.weatherConfig;
    const { baseUrl } = this.geoConfig;

    const response = await firstValueFrom(
      this.httpService.get<ICitySuggestion[]>(`${baseUrl}/direct`, {
        params: {
          q: query,
          limit: 5,
          appid: apiKey,
        },
      }),
    );

    return response.data.map((city: ICitySuggestion) => ({
      name: city.name,
      country: city.country,
      lat: city.lat,
      lon: city.lon,
    }));
  }

  @LogMethod()
  async getWeatherDetails({
    lat,
    lon,
  }: CoordinatesParams): Promise<IWeatherDetails> {
    const { apiKey, weatherBaseUrl } = this.weatherConfig;

    const [currentRes, forecastRes] = await Promise.all([
      firstValueFrom(
        this.httpService.get<IOpenWeatherCurrent>(`${weatherBaseUrl}/weather`, {
          params: { lat, lon, appid: apiKey, units: 'metric' },
        }),
      ),
      firstValueFrom(
        this.httpService.get<IOpenWeatherForecast>(
          `${weatherBaseUrl}/forecast`,
          {
            params: { lat, lon, appid: apiKey, units: 'metric' },
          },
        ),
      ),
    ]);

    const current: IOpenWeatherCurrent = currentRes.data;
    const forecast: IOpenWeatherForecast = forecastRes.data;

    const timezone = forecast.city?.timezone ?? 0;

    const formatTime = (unix: number) =>
      new Date((unix + timezone) * 1000).toISOString().slice(11, 16);

    const hourly = forecast.list
      .slice(0, 9)
      .map((item: IOpenWeatherForecastItem) => ({
        time: formatTime(item.dt),
        temp: Math.round(item.main.temp),
        feelsLike: Math.round(item.main.feels_like),
        icon: item.weather[0].icon,
      }));

    const daysMap: Record<string, IOpenWeatherForecastItem[]> = {};

    forecast.list.forEach((item: IOpenWeatherForecastItem) => {
      const date = item.dt_txt.split(' ')[0];
      if (!daysMap[date]) daysMap[date] = [];
      daysMap[date].push(item);
    });

    const entries = Object.entries(daysMap) as Array<
      [string, IOpenWeatherForecastItem[]]
    >;

    const daily = entries.slice(1, 4).map(([date, items]) => {
      const temps = items.map((i: IOpenWeatherForecastItem) => i.main.temp);
      const feels = items.map((i: IOpenWeatherForecastItem) => i.main.feels_like);
      const humidity = items.map((i: IOpenWeatherForecastItem) => i.main.humidity);
      const pressure = items.map((i: IOpenWeatherForecastItem) => i.main.pressure);
      const clouds = items.map((i: IOpenWeatherForecastItem) => i.clouds.all);
      const wind = items.map((i: IOpenWeatherForecastItem) => i.wind.speed);
      const pop = items.map((i: IOpenWeatherForecastItem) => i.pop ?? 0);

      return {
        date,
        min: Math.round(Math.min(...temps)),
        max: Math.round(Math.max(...temps)),
        description: items[0].weather[0].description,
        icon: items[0].weather[0].icon,
        humidity: Math.round(
          humidity.reduce((a: number, b: number) => a + b, 0) / humidity.length,
        ),
        pressure: Math.round(
          pressure.reduce((a: number, b: number) => a + b, 0) / pressure.length,
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

  @LogMethod()
  async getWeatherPreview({
    lat,
    lon,
  }: CoordinatesParams): Promise<IWeatherPreview> {
    const full = await this.getWeatherDetails({ lat, lon });

    return {
      temperature: full.current.temp,
      description: full.current.description,
      next3DaysTemperature: full.daily.map((d: IDailyWeather) => d.max),
      next3DaysDescription: full.daily.map((d: IDailyWeather) => d.description),
    };
  }
}
