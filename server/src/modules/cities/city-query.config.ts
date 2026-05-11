import { createCursorHandler } from '../../shared/query/pagination/create-cursor-handler';
import { createSortHandler } from '../../shared/query/sorting/create-sort-handler';
import { CityEntity } from './entities';

export enum CitySortField {
  CITY = 'city',
  CREATED_AT = 'createdAt',
  IS_PINNED = 'isPinned',
}

export enum CityQueryColumn {
  CITY = 'city.city',
  CREATED_AT = 'city.createdAt',
  IS_PINNED = 'city.isPinned',
  ID = 'city.id',
}

export const CITY_SORT_HANDLERS = {
  [CitySortField.CITY]: createSortHandler(
    CityQueryColumn.CITY,
    CityQueryColumn.ID,
  ),

  [CitySortField.CREATED_AT]: createSortHandler(
    CityQueryColumn.CREATED_AT,
    CityQueryColumn.ID,
  ),

  [CitySortField.IS_PINNED]: createSortHandler(
    CityQueryColumn.IS_PINNED,
    CityQueryColumn.ID,
  ),
};

export const CITY_CURSOR_HANDLERS = {
  [CitySortField.CITY]: createCursorHandler(
    CityQueryColumn.CITY,
    CityQueryColumn.ID,
  ),

  [CitySortField.CREATED_AT]: createCursorHandler(
    CityQueryColumn.CREATED_AT,
    CityQueryColumn.ID,
  ),

  [CitySortField.IS_PINNED]: createCursorHandler(
    CityQueryColumn.IS_PINNED,
    CityQueryColumn.ID,
  ),
};

export const CITY_CURSOR_VALUES: Record<
  CitySortField,
  (city: CityEntity) => unknown
> = {
  [CitySortField.CITY]: (city) => city.city,

  [CitySortField.CREATED_AT]: (city) => city.createdAt,

  [CitySortField.IS_PINNED]: (city) => city.isPinned,
};
