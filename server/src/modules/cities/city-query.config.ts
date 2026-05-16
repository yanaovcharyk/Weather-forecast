import { CityEntity } from './entities';

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
