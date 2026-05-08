export interface Weather {
  temperature: number;
  description: string;
  next3DaysTemperature: number[];
  next3DaysDescription: string[];
}

export interface City {
  id: number;
  city: string;
  lat: number;
  lon: number;
  weather?: Weather | null;
}

export interface CitiesQuery {
  cities: City[];
}

export type AddCityMutation = {
  addCity: {
    ok: boolean;
    code?: string | null;
    city?: City | null;
    existingCity?: City | null;
  };
};

export interface GraphQLFormattedError {
  message: string;
  extensions?: {
    code?: string;
    [key: string]: unknown;
  };
}

export interface GraphQLResponse<T> {
  data?: T;
  errors?: GraphQLFormattedError[];
}
