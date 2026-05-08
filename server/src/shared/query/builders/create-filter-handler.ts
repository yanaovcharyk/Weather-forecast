import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

export const createEqualsFilterHandler =
  <T extends ObjectLiteral>(
    column: string,
  ) =>
  (
    qb: SelectQueryBuilder<T>,
    value: unknown,
  ) => {
    qb.andWhere(
      `${column} = :filterValue`,
      {
        filterValue: value,
      },
    );

    return qb;
  };

export const createLikeFilterHandler =
  <T extends ObjectLiteral>(
    column: string,
  ) =>
  (
    qb: SelectQueryBuilder<T>,
    value: string,
  ) => {
    qb.andWhere(
      `${column} ILIKE :filterValue`,
      {
        filterValue: `%${value}%`,
      },
    );

    return qb;
  };
  