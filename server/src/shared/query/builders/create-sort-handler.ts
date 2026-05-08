import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

import { SortOrder } from '../enums/sort-order.enum';

export const createSortHandler =
  <T extends ObjectLiteral>(
    column: string,
    idColumn: string,
  ) =>
  (
    qb: SelectQueryBuilder<T>,
    order: SortOrder,
  ) => {
    qb.orderBy(column, order);

    qb.addOrderBy(idColumn, order);

    return qb;
  };
