import { SelectQueryBuilder } from 'typeorm';
import { CityEntity } from './entities';
import { SortOrder } from '@shared/constants';

export enum CitySortField {
  CITY = 'city',
  CREATED_AT = 'createdAt',
  IS_PINNED = 'isPinned',
}

export const CITY_CURSOR_VALUES: Record<
  CitySortField,
  (city: CityEntity) => unknown
> = {
  [CitySortField.CITY]: (city) => city.city,
  [CitySortField.CREATED_AT]: (city) => city.createdAt,
  [CitySortField.IS_PINNED]: (city) => city.isPinned,
};

export type SortConfig = {
  orderBy: (qb: SelectQueryBuilder<CityEntity>, sortOrder: SortOrder) => void;
  cursor: { asc: string; desc: string };
};

export const SORT_CONFIG: Record<CitySortField, SortConfig> = {
  [CitySortField.CITY]: {
    orderBy: (qb, sortOrder) => {
      qb.orderBy('city.city', sortOrder);
      qb.addOrderBy('city.id', sortOrder);
    },
    cursor: {
      asc: '(city.city, city.id) > (:value, :id)',
      desc: '(city.city, city.id) < (:value, :id)',
    },
  },

  [CitySortField.IS_PINNED]: {
    orderBy: (qb, sortOrder) => {
      qb.orderBy('city.isPinned', sortOrder);
      qb.addOrderBy('city.id', sortOrder);
    },
    cursor: {
      asc: '(city.isPinned, city.id) > (:value, :id)',
      desc: '(city.isPinned, city.id) < (:value, :id)',
    },
  },

  [CitySortField.CREATED_AT]: {
    orderBy: (qb, sortOrder) => {
      qb.orderBy('city.createdAt', sortOrder);
      qb.addOrderBy('city.id', sortOrder);
    },
    cursor: {
      asc: '(city.createdAt, city.id) > (:value, :id)',
      desc: '(city.createdAt, city.id) < (:value, :id)',
    },
  },
};
