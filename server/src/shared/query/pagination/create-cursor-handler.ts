import { ObjectLiteral, SelectQueryBuilder, Brackets } from 'typeorm';
import { SortOrder } from '../sorting/sort-order.enum';

export const createCursorHandler =
  <T extends ObjectLiteral>(primarySortBy: string, secondarySortBy: string) =>
  (
    queryBuilder: SelectQueryBuilder<T>,
    cursorValue: unknown,
    cursorId: number,
    sortOrder: SortOrder,
  ) => {
    const comparisonOperator = sortOrder === SortOrder.ASC ? '>' : '<';

    queryBuilder.andWhere(
      new Brackets((cursorConditionBuilder) => {
        cursorConditionBuilder.where(
          `${primarySortBy} ${comparisonOperator} :cursorValue`,
          {
            cursorValue: cursorValue,
          },
        );

        cursorConditionBuilder.orWhere(
          new Brackets((nested) => {
            nested.where(`${primarySortBy} = :cursorValue`, {
              cursorValue: cursorValue,
            });

            nested.andWhere(
              `${secondarySortBy} ${comparisonOperator} :cursorId`,
              {
                cursorId: cursorId,
              },
            );
          }),
        );
      }),
    );

    return queryBuilder;
  };
