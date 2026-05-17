import { WeatherOutput } from '@weather/dto/weather.output';

export interface ICityWithWeather {
  id: number;
  city: string;
  weather: WeatherOutput | null;
}
