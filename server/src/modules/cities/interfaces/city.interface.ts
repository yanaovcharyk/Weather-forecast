export interface ICityOutput {
  id: string;
  city: string;
  lat: number;
  lon: number;
  isPinned: boolean;

  weather?: {
    city: string;
    temperature: number;
    description: string;
    next3DaysTemperature: number[];
    next3DaysDescription: string[]; 
  };
}
