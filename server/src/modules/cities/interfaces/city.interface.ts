export interface ICityOutput {
  id: number;
  city: string;
  lat: number;
  lon: number;

  weather?: {
    city: string;
    temperature: number;
    description: string;
    next3DaysTemperature: number[];
    next3DaysDescription: string[];
  };
}
