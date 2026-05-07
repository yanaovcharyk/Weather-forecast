import { Injectable } from '@nestjs/common';
import {
  ObjectLiteral,
  SelectQueryBuilder,
} from 'typeorm';
import { SortOrder } from '../types';


export type SortHandler<T extends ObjectLiteral> = (
  qb: SelectQueryBuilder<T>,
  order: SortOrder,
) => SelectQueryBuilder<T>;

@Injectable()
export class SortingService {
  applySorting<T extends ObjectLiteral>({
    qb,
    handlers,
    sortBy,
    sortOrder,
  }: {
    qb: SelectQueryBuilder<T>;

    handlers: Record<string, SortHandler<T>>;

    sortBy: string;

    sortOrder: SortOrder;
  }) {
    const handler = handlers[sortBy];

    if (!handler) {
      throw new Error(`Invalid sortBy: ${sortBy}`);
    }

    return handler(qb, sortOrder);
  }
}
