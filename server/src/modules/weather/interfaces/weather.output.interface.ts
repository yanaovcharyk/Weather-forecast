export interface IWeatherOutput {
  city: string;
  temperature: number;
  description: string;
  next3DaysTemperature: number[];
  next3DaysDescription: string[];
}
