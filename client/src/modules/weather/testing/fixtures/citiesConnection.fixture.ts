import type { CitiesPaginatedResponse, City } from '@/weather/types';

export const KYIV_CITY_NODE_FIXTURE: City = {
  id: '1',
  cityName: 'Kyiv',
  lat: 50.45,
  lon: 30.52,
  isPinned: false,
};

export const LVIV_CITY_NODE_FIXTURE: City = {
  id: '2',
  cityName: 'Lviv',
  lat: 49.84,
  lon: 24.03,
  isPinned: true,
};

export const createCitiesConnection = ({
  nodes = [],
  hasNextPage = false,
  endCursor,
}: {
  nodes?: City[];
  hasNextPage?: boolean;
  endCursor?: string;
} = {}): CitiesPaginatedResponse['getSavedCitiesPaginated'] => ({
  edges: nodes.map((node) => ({
    cursor: node.id,
    node,
  })),
  pageInfo: {
    hasNextPage,
    endCursor,
  },
});

export const createCitiesPaginatedResponse = (
  connection: CitiesPaginatedResponse['getSavedCitiesPaginated'],
): CitiesPaginatedResponse => ({
  getSavedCitiesPaginated: connection,
});
