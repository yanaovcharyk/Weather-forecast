import { IWeatherPreviewOutput } from '@weather/interfaces';

export interface ICityOutput {
  id: string;
  city: string;
  lat: number;
  lon: number;
  isPinned: boolean;
  weather?: IWeatherPreviewOutput | null;
}
