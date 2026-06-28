import {
  KyivCity,
  LvivCity,
  OdesaCity,
} from './city.fixture';

export const CitiesListFixture = [
  KyivCity,
];

export const PaginatedKyivConnectionFixture = {
  edges: [
    {
      node: KyivCity,
      cursor: 'cursor-1',
    },
  ],
  pageInfo: {
    hasNextPage: false,
    endCursor: 'cursor-1',
  },
};

export const PaginatedLvivConnectionFixture = {
  edges: [
    {
      node: LvivCity,
      cursor: 'cursor-2',
    },
  ],
  pageInfo: {
    hasNextPage: false,
    endCursor: 'cursor-2',
  },
};

export const PaginatedOdesaConnectionFixture = {
  edges: [
    {
      node: OdesaCity,
      cursor: 'cursor-3',
    },
  ],
  pageInfo: {
    hasNextPage: false,
    endCursor: 'cursor-3',
  },
};

export const DecodedCursorFixture = {
  value: 'Kyiv',
  id: '1',
};
