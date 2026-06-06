import { WeatherOutput } from '@weather/dto';

export interface ICityWithWeather {
  id: string;
  city: string;
  weather: WeatherOutput | null;
}
