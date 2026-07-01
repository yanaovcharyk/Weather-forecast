export interface CitySuggestion {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export interface CitySuggestionsData {
  getCitySuggestions: CitySuggestion[];
}

export interface CitySuggestionsVars {
  input: {
    query: string;
  };
}

export type CitySelectValue = {
  lat: number;
  lon: number;
  name: string;
};

export interface AddCityFormProps {
  onSubmit: (
    lat: number,
    lon: number,
    cityName: string,
  ) => Promise<void> | void;
  disabled?: boolean;
}
