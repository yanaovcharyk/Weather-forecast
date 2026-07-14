import { WeatherCondition } from '@weather/enums';

export interface IWeatherCurrent {
  temp: number;
  min: number;
  max: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  description: string;
  icon: string;
  iconUrl: string;
  condition: WeatherCondition;
  sunrise: string;
  sunset: string;
}
