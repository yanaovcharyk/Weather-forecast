import { SelectQueryBuilder } from 'typeorm';

import { CityEntity } from '../entities/city.entity';

export const CITY_CURSOR_HANDLERS = {
  city: {
    ASC: (
      qb: SelectQueryBuilder<CityEntity>,
      value: unknown,
      id: number,
    ) => {
      qb.andWhere(
        `
          city.city > :value

          OR (
            city.city = :value
            AND city.id > :id
          )
        `,
        {
          value,
          id,
        },
      );

      return qb;
    },

    DESC: (
      qb: SelectQueryBuilder<CityEntity>,
      value: unknown,
      id: number,
    ) => {
      qb.andWhere(
        `
          city.city < :value

          OR (
            city.city = :value
            AND city.id < :id
          )
        `,
        {
          value,
          id,
        },
      );

      return qb;
    },
  },

  createdAt: {
    ASC: (
      qb: SelectQueryBuilder<CityEntity>,
      value: unknown,
      id: number,
    ) => {
      qb.andWhere(
        `
          city.createdAt > :value

          OR (
            city.createdAt = :value
            AND city.id > :id
          )
        `,
        {
          value,
          id,
        },
      );

      return qb;
    },

    DESC: (
      qb: SelectQueryBuilder<CityEntity>,
      value: unknown,
      id: number,
    ) => {
      qb.andWhere(
        `
          city.createdAt < :value

          OR (
            city.createdAt = :value
            AND city.id < :id
          )
        `,
        {
          value,
          id,
        },
      );

      return qb;
    },
  },
};
