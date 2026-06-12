export interface IWeatherPreviewOutput {
  temperature: number;
  description: string;
  next3DaysTemperature: number[];
  next3DaysDescription: string[];
}
