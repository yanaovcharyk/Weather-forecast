import { WeatherOutput } from '@weather/dto/weather.output';

export interface ICityWithWeather {
  id: string;
  city: string;
  weather: WeatherOutput | null;
}
