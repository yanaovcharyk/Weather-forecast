import { ObjectLiteral, SelectQueryBuilder, Sort } from 'typeorm';
import { SortOrder } from '../types';

export interface SortHandler<T extends ObjectLiteral> {
  (
    qb: SelectQueryBuilder<T>,
    order: SortOrder,
  ): SelectQueryBuilder<T>;
}
