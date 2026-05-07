import { SelectQueryBuilder } from 'typeorm';
import { CityEntity } from '../entities/city.entity';
import { SortOrder } from '../../sorting/types';

export const CITY_SORT_HANDLERS = {
  city: (
    qb: SelectQueryBuilder<CityEntity>,
    order: SortOrder,
  ) => {
    qb.orderBy('city.city', order)
      .addOrderBy('city.id', order);

    return qb;
  },

  createdAt: (
    qb: SelectQueryBuilder<CityEntity>,
    order: SortOrder,
  ) => {
    qb.orderBy('city.createdAt', order)
      .addOrderBy('city.id', order);

    return qb;
  },
};
