export interface IRemoveCityVariables {
  id: string;
}

export interface IRemoveCityMutation {
  removeSavedCity: {
    id: string;
    __typename: string;
  };
}

export interface WeatherPreviewDay {
  min: number;
  max: number;
  description: string;
  icon: string;
}

export type Weather = {
  temperature: number;
  min: number;
  max: number;
  description: string;
  next3Days: WeatherPreviewDay[];
};

export type City = {
  id: string;
  cityName: string;
  lat: number;
  lon: number;
  isPinned: boolean;
  weather?: Weather | null;
};

export type CityEdge = {
  node: City;
  cursor: string;
};

export type PageInfo = {
  hasNextPage: boolean;
  endCursor?: string | null;
};

export type CitiesPaginatedResponse = {
  getSavedCitiesPaginated: {
    edges: CityEdge[];
    pageInfo: PageInfo;
  };
};

export enum CitySortField {
  CreatedAt = 'createdAt',
  CityName = 'cityName',
}

export enum CitySortOrder {
  Asc = 'ASC',
  Desc = 'DESC',
}

export enum CityQuerySortField {
  CreatedAt = 'CREATED_AT',
  CityName = 'CITY_NAME',
}

export enum GraphQLTypename {
  CityOutput = 'CityOutput',
  PageInfo = 'PageInfo',
  CitiesConnection = 'CitiesConnection',
}

export type SortingState = {
  sortBy: CitySortField;
  sortOrder: CitySortOrder;
};

export type CitiesQuerySorting = {
  sortBy: CityQuerySortField;
  sortOrder: CitySortOrder;
};

export type CitiesPaginatedVariables = {
  query: {
    pagination: {
      limit: number;
      cursor: string | null;
    };
    sorting: CitiesQuerySorting;
    showPinnedOnly: boolean;
  };
};

export type DisabledStates = {
  sorting: boolean;
  pinnedFilter: boolean;
  deleteAll: boolean;
};

export type CurrentWeather = {
  temp: number;
  min: number;
  max: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  description: string;
  icon: string;
  sunrise: string;
  sunset: string;
};

export type DailyWeather = {
  date: string;
  min: number;
  max: number;
  description: string;
  icon: string;
  humidity: number;
  pressure: number;
  clouds: number;
  windSpeed: number;
  pop: number;
  feelsLike: number;
};

export type HourlyWeather = {
  time: string;
  temp: number;
  feelsLike: number;
  icon: string;
};

export type WeatherMeta = {
  timezone: string;
};

export type WeatherDetails = {
  cityName: string;
  lat: number;
  lon: number;
  current: CurrentWeather;
  daily: DailyWeather[];
  hourly: HourlyWeather[];
  meta?: WeatherMeta;
};

export type GetWeatherDetailsResponse = {
  getWeatherDetails: WeatherDetails;
};

export type SavedCityDetails = Pick<City, 'id' | 'cityName' | 'lat' | 'lon'>;

export type GetSavedCityResponse = {
  getSavedCity: SavedCityDetails | null;
};

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

export type SelectedCity = Pick<City, 'cityName' | 'lat' | 'lon'>;
