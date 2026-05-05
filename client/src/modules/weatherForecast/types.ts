export interface RemoveCityVariables {
  id: number;
}

export interface RemoveCityMutation {
  removeCity: {
    id: number;
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
  id: number;
  city: string;
  lat: number;
  lon: number;
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

export type CitiesPaginatedVariables = {
  pagination: {
    limit: number;
    cursor?: string;
  };
  sorting?: {
    sortBy?: 'city' | 'createdAt';
    sortOrder?: 'ASC' | 'DESC';
  };
};
