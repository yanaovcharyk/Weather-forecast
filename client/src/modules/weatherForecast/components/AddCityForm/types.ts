export interface City {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export interface SearchCitiesData {
  searchCities: City[];
}

export interface SearchCitiesVars {
  query: string;
}

export interface AddCityFormProps {
  onSubmit: (city: string) => Promise<void> | void;
  disabled?: boolean;
}
