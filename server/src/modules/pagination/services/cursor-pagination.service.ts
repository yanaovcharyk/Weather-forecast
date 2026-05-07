import { Injectable } from '@nestjs/common';
import {
  ObjectLiteral,
  SelectQueryBuilder,
} from 'typeorm';
import { SortOrder } from '../../sorting/types';


export type CursorHandler<T extends ObjectLiteral> = (
  qb: SelectQueryBuilder<T>,
  value: unknown,
  id: number,
) => SelectQueryBuilder<T>;

@Injectable()
export class CursorPaginationService {
  applyPagination<T extends ObjectLiteral>({
    qb,
    cursor,
    sortBy,
    sortOrder,
    handlers,
  }: {
    qb: SelectQueryBuilder<T>;

    cursor?: string;

    sortBy: string;

    sortOrder: SortOrder;

    handlers: Record<
      string,
      Record<SortOrder, CursorHandler<T>>
    >;
  }) {
    if (!cursor) return;

    const decoded = JSON.parse(
      Buffer.from(cursor, 'base64').toString(),
    ) as {
      value: unknown;
      id: number;
    };

    const handler =
      handlers[sortBy]?.[sortOrder];

    if (!handler) {
      throw new Error(
        `Invalid cursor handler for ${sortBy} ${sortOrder}`,
      );
    }

    return handler(
      qb,
      decoded.value,
      decoded.id,
    );
  }
}
