import { IWeatherCurrent } from './weather-current.interface';
import { IHourlyWeather } from './hourly-weather.interface';
import { IDailyWeather } from './daily-weather.interface';
import { IWeatherMeta } from './weather-meta.interface';
import { IGetWeatherInput } from './get-weather.input.interface';

export interface IWeatherDetails {
  coordinates: IGetWeatherInput;
  current: IWeatherCurrent;
  hourly: IHourlyWeather[];
  daily: IDailyWeather[];
  meta?: IWeatherMeta;
}
