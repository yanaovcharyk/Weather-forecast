import { vi } from 'vitest';

import type {
  CityEdge,
  CityNode,
} from '@/common/testing/contexts/apolloClient.context';

export const createCitiesConnection = ({
  edges = [],
  pageInfo = {},
}: {
  edges?: CityEdge[];
  pageInfo?: Record<string, unknown>;
} = {}) => ({
  __typename: 'CitiesConnection',
  edges,
  pageInfo,
});

export const createCityEdge = (id: string): CityEdge => ({
  node: {
    id,
  },
});

export const createMergeOptions = (cursor?: string) => ({
  args: {
    query: {
      pagination: cursor ? { cursor } : {},
    },
  },
  readField: vi.fn((_field: string, node: CityNode): string => node.id),
});
