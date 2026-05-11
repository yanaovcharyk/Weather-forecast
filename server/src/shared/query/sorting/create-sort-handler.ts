import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

import { SortOrder } from './sort-order.enum';

export const createSortHandler =
  <T extends ObjectLiteral>(primarySortBy: string, secondarySortBy: string) =>
  (qb: SelectQueryBuilder<T>, order: SortOrder) => {
    qb.orderBy(primarySortBy, order);

    qb.addOrderBy(secondarySortBy, order);

    return qb;
  };
