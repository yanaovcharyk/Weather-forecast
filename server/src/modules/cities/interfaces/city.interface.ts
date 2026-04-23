export interface ICityOutput {
  id: number;
  city: string;
  weather?: {
    city: string;
    temperature: number;
    description: string;
    next3DaysTemperature: number[];
    next3DaysDescription: string[];
  };
}
