export interface IRemoveCityVariables {
  id: string;
}

export interface IRemoveCityMutation {
  removeCity: {
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
  citiesPaginated: {
    edges: CityEdge[];
    pageInfo: PageInfo;
  };
};

export type SortingState = {
  sortBy: 'createdAt' | 'cityName';
  sortOrder: 'ASC' | 'DESC';
};

export type DisabledStates = {
  sorting: boolean;
  pinnedFilter: boolean;
  deleteAll: boolean;
};
