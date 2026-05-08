import { createCursorHandler } from '../../shared/query/builders/create-cursor-handler';
import { createEqualsFilterHandler, createLikeFilterHandler } from '../../shared/query/builders/create-filter-handler';
import { createSortHandler } from '../../shared/query/builders/create-sort-handler';
import { FilterOperator } from '../../shared/query/enums/filter-operator.enum';
import { CityEntity } from './entities';
import { CitySortField } from './services/cities.service';

export const CITY_SORT_HANDLERS = {
  city: createSortHandler('city.city', 'city.id'),
  createdAt: createSortHandler('city.createdAt', 'city.id'),
  isPinned: createSortHandler('city.isPinned', 'city.id'),
};

export const CITY_CURSOR_HANDLERS = {
  city: createCursorHandler('city.city', 'city.id'),
  createdAt: createCursorHandler('city.createdAt', 'city.id'),
  isPinned: createCursorHandler('city.isPinned', 'city.id'),
};

export const CITY_FILTER_HANDLERS = {
  city: {
    [FilterOperator.LIKE]: createLikeFilterHandler('city.city'),
  },
  isPinned: {
    [FilterOperator.EQ]: createEqualsFilterHandler('city.isPinned'),
  },
};

export const CITY_CURSOR_VALUES: Record<CitySortField, (city: CityEntity) => unknown> = {
  city: (city) => city.city,
  createdAt: (city) => city.createdAt,
  isPinned: (city) => city.isPinned,
};

