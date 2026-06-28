import { IWeatherPreviewOutput } from '@weather/interfaces';

export interface ICityOutput {
  id: string;
  cityName: string;
  lat: number;
  lon: number;
  isPinned: boolean;
  weather?: IWeatherPreviewOutput | null;
}
