export interface IRemoveCityVariables {
  id: string;
}

export interface IRemoveCityMutation {
  removeCity: {
    id: string;
    __typename: string;
  };
}

export type Weather = {
  temperature: number;
  description: string;
  next3DaysTemperature: number[];
  next3DaysDescription: string[];
};

export type City = {
  id: string;
  city: string;
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
  sortBy: 'createdAt' | 'city';
  sortOrder: 'ASC' | 'DESC';
};

export type DisabledStates = {
  sorting: boolean;
  pinnedFilter: boolean;
  deleteAll: boolean;
};
