import { IWeatherOutput } from "../../weather/interfaces/weather.output.interface";

export interface ICityOutput {
  id: string;
  city: string;
  lat: number;
  lon: number;
  isPinned: boolean;
  weather?: IWeatherOutput | null;
}