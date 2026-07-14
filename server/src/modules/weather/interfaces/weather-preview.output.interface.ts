import { WeatherCondition } from '@weather/enums';

export interface IWeatherPreviewDay {
  min: number;
  max: number;
  description: string;
}
export interface IWeatherPreviewOutput {
  temperature: number;
  min: number;
  max: number;
  description: string;
  condition: WeatherCondition;
  next3Days: IWeatherPreviewDay[];
}
