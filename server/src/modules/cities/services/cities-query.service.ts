import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CityEntity } from '../entities/city.entity';
import { ICityOutput } from '../interfaces/city.interface';
import { CitiesConnection } from '../dto/cities-connection.output';
import { CitiesQueryInput } from '../dto/cities-query.input';
import { mapToOutput } from '../mappers/city.mapper';
import { CITY_CURSOR_VALUES, CitySortField } from '../city-query.config';
import { SortOrder } from '../../../shared/query/sorting/sort-order.enum';
import { decodeCursor } from '../../../shared/query/pagination/cursor/decode-cursor';
import { buildConnection } from '../../../shared/query/pagination/build-connection';

@Injectable()
export class CitiesQueryService {
  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
  ) {}

  async getCities(userId: string): Promise<ICityOutput[]> {
    const cities = await this.cityRepository.find({
      where: { userId },
      order: {
        createdAt: 'DESC',
      },
    });

    return cities.map(mapToOutput);
  }

  async getCitiesPaginated(
    userId: string,
    query: CitiesQueryInput,
  ): Promise<CitiesConnection> {
    const qb = this.cityRepository
      .createQueryBuilder('city')
      .where('city.userId = :userId', { userId });

    if (query.showPinnedOnly) {
      qb.andWhere('city.isPinned = true');
    }

    const { sortBy, sortOrder } = this.applySorting(qb, query);

    this.applyCursor(qb, query, sortBy, sortOrder);

    const limit = query.pagination.limit;

    this.applyPagination(qb, limit);

    const cities = await qb.getMany();

    return this.toConnection(cities, limit, sortBy);
  }

  private applySorting(
    qb: SelectQueryBuilder<CityEntity>,
    query: CitiesQueryInput,
  ): {
    sortBy: CitySortField;
    sortOrder: SortOrder;
  } {
    const sortBy =
      query.sorting?.sortBy ?? CitySortField.CREATED_AT;

    const sortOrder =
      query.sorting?.sortOrder ?? SortOrder.DESC;

    switch (sortBy) {
      case CitySortField.CITY:
        qb.orderBy('city.city', sortOrder);
        qb.addOrderBy('city.id', sortOrder);
        break;

      case CitySortField.IS_PINNED:
        qb.orderBy('city.isPinned', sortOrder);
        qb.addOrderBy('city.id', sortOrder);
        break;

      case CitySortField.CREATED_AT:
      default:
        qb.orderBy('city.createdAt', sortOrder);
        qb.addOrderBy('city.id', sortOrder);
        break;
    }

    return { sortBy, sortOrder };
  }

  private applyCursor(
    qb: SelectQueryBuilder<CityEntity>,
    query: CitiesQueryInput,
    sortBy: CitySortField,
    sortOrder: SortOrder,
  ): void {
    if (!query.pagination.cursor) {
      return;
    }

    const decoded = decodeCursor<{
      value: unknown;
      id: number;
    }>(query.pagination.cursor);

    switch (sortBy) {
      case CitySortField.CITY:
        if (sortOrder === SortOrder.ASC) {
          qb.andWhere(
            '(city.city, city.id) > (:value, :id)',
            {
              value: decoded.value,
              id: decoded.id,
            },
          );
        } else {
          qb.andWhere(
            '(city.city, city.id) < (:value, :id)',
            {
              value: decoded.value,
              id: decoded.id,
            },
          );
        }
        break;

      case CitySortField.IS_PINNED:
        if (sortOrder === SortOrder.ASC) {
          qb.andWhere(
            '(city.isPinned, city.id) > (:value, :id)',
            {
              value: decoded.value,
              id: decoded.id,
            },
          );
        } else {
          qb.andWhere(
            '(city.isPinned, city.id) < (:value, :id)',
            {
              value: decoded.value,
              id: decoded.id,
            },
          );
        }
        break;

      case CitySortField.CREATED_AT:
      default:
        if (sortOrder === SortOrder.ASC) {
          qb.andWhere(
            '(city.createdAt, city.id) > (:value, :id)',
            {
              value: decoded.value,
              id: decoded.id,
            },
          );
        } else {
          qb.andWhere(
            '(city.createdAt, city.id) < (:value, :id)',
            {
              value: decoded.value,
              id: decoded.id,
            },
          );
        }
        break;
    }
  }

  private applyPagination(
    qb: SelectQueryBuilder<CityEntity>,
    limit: number,
  ): void {
    qb.take(limit + 1);
  }

  private toConnection(
    cities: CityEntity[],
    limit: number,
    sortBy: CitySortField,
  ): CitiesConnection {
    const getCursorValue = CITY_CURSOR_VALUES[sortBy];

    return buildConnection({
      entities: cities,
      limit,
      mapEntityToNode: mapToOutput,
      getCursorValue,
    });
  }
}
