import { ObjectLiteral, SelectQueryBuilder, Brackets } from 'typeorm';

import { SortOrder } from '../enums/sort-order.enum';

export const createCursorHandler =
  <T extends ObjectLiteral>(
    column: string,
    idColumn: string,
  ) =>
  (
    qb: SelectQueryBuilder<T>,
    value: unknown,
    id: number,
    order: SortOrder,
  ) => {
    const operator =
      order === SortOrder.ASC ? '>' : '<';

    qb.andWhere(
      new Brackets((subQb) => {
        subQb.where(
          `${column} ${operator} :cursorValue`,
          {
            cursorValue: value,
          },
        );

        subQb.orWhere(
          new Brackets((nested) => {
            nested.where(
              `${column} = :cursorValue`,
              {
                cursorValue: value,
              },
            );

            nested.andWhere(
              `${idColumn} ${operator} :cursorId`,
              {
                cursorId: id,
              },
            );
          }),
        );
      }),
    );

    return qb;
  };
  