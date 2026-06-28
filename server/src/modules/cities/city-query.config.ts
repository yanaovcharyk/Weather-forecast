import { SelectQueryBuilder } from 'typeorm';
import { CityEntity } from './entities';
import { SortOrder } from '@shared/constants';

export enum CitySortField {
  CITY_NAME = 'cityName',
  CREATED_AT = 'createdAt',
  IS_PINNED = 'isPinned',
}

export const CITY_CURSOR_VALUE_GETTERS: Record<
  CitySortField,
  (city: CityEntity) => unknown
> = {
  [CitySortField.CITY_NAME]: (city) => city.cityName,
  [CitySortField.CREATED_AT]: (city) => city.createdAt,
  [CitySortField.IS_PINNED]: (city) => city.isPinned,
};

export type CitySortConfig = {
  orderBy: (qb: SelectQueryBuilder<CityEntity>, sortOrder: SortOrder) => void;
  cursor: { asc: string; desc: string };
};

export const CITY_SORT_CONFIG: Record<CitySortField, CitySortConfig> = {
  [CitySortField.CITY_NAME]: {
    orderBy: (qb, sortOrder) => {
      qb.orderBy('city.cityName', sortOrder);
      qb.addOrderBy('city.id', sortOrder);
    },
    cursor: {
      asc: '(city.cityName, city.id) > (:value, :id)',
      desc: '(city.cityName, city.id) < (:value, :id)',
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
