import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CityEntity } from '../entities/city.entity';
import { ICityOutput } from '../interfaces/city.interface';
import { CitiesConnection, CitiesQueryInput } from '../dto';
import { mapToOutput } from '../mappers/city.mapper';
import {
  CITY_CURSOR_VALUES,
  CitySortField,
  SORT_CONFIG,
} from '../city-query.config';
import { SortOrder } from '@shared/constants';
import { buildConnection } from '@shared/utils/build-connection';
import { decodeCursor } from '@shared/utils/decode-cursor';

@Injectable()
export class CitiesQueryService {
  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
  ) {}

  async getCities(userId: string): Promise<ICityOutput[]> {
    const cities = await this.cityRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
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

    if (query.showPinnedOnly) qb.andWhere('city.isPinned = true');

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
  ): { sortBy: CitySortField; sortOrder: SortOrder } {
    const sortBy = query.sorting?.sortBy ?? CitySortField.CREATED_AT;
    const sortOrder = query.sorting?.sortOrder ?? SortOrder.DESC;
    SORT_CONFIG[sortBy].orderBy(qb, sortOrder);
    return { sortBy, sortOrder };
  }

  private applyCursor(
    qb: SelectQueryBuilder<CityEntity>,
    query: CitiesQueryInput,
    sortBy: CitySortField,
    sortOrder: SortOrder,
  ): void {
    if (!query.pagination.cursor) return;

    const decoded = decodeCursor<{ value: unknown; id: number }>(
      query.pagination.cursor,
    );
    const cursorQuery =
      sortOrder === SortOrder.ASC
        ? SORT_CONFIG[sortBy].cursor.asc
        : SORT_CONFIG[sortBy].cursor.desc;

    qb.andWhere(cursorQuery, { value: decoded.value, id: decoded.id });
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
