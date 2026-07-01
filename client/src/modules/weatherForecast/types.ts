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

export type SortingState = {
  sortBy: 'createdAt' | 'cityName';
  sortOrder: 'ASC' | 'DESC';
};

export type CitiesQuerySorting = Omit<SortingState, 'sortBy'> & {
  sortBy: 'CITY_NAME' | 'CREATED_AT';
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
