export interface IWeatherPreviewDay {
  min: number;
  max: number;
  description: string;
}
export interface IWeatherPreviewOutput {
  temperature: number;
  description: string;
  next3Days: IWeatherPreviewDay[];
}


