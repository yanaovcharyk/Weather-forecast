import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CityEntity } from '../entities/city.entity';
import { CitiesConnection, CityOutput } from '../dto';
import { mapToOutput } from '../mappers/city.mapper';
import {
  CITY_CURSOR_VALUES,
  CitySortField,
  SORT_CONFIG,
} from '../city-query.config';
import { SortOrder } from '@shared/constants';
import { buildConnection } from '@shared/utils/build-connection';
import { decodeCursor } from '@shared/utils/decode-cursor';
import {
  ApplyCursorParams,
  ApplyPaginationParams,
  ApplySortingParams,
  ApplySorting,
  GetCitiesPaginatedParams,
  GetCitiesParams,
  ToConnectionParams,
} from '../types';
import { AppLoggerService } from '@logger/services';

@Injectable()
export class CitiesQueryService {
  private readonly logger;

  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
    loggerService: AppLoggerService,
  ) {
    this.logger = loggerService.child(CitiesQueryService.name);
  }

  async getCities(params: GetCitiesParams): Promise<CityOutput[]> {
    const { userId } = params;

    this.logger.info('getCities called');

    const cities = await this.cityRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    this.logger.debug('Fetched cities', { count: cities.length });

    return cities.map(mapToOutput);
  }

  async getCitiesPaginated(
    params: GetCitiesPaginatedParams,
  ): Promise<CitiesConnection> {
    const { userId, query } = params;

    this.logger.info('getCitiesPaginated called', {
      pagination: query.pagination,
      sorting: query.sorting,
      showPinnedOnly: query.showPinnedOnly,
    });

    const qb = this.cityRepository
      .createQueryBuilder('city')
      .where('city.userId = :userId', { userId });

    if (query.showPinnedOnly) {
      this.logger.debug('Filtering pinned cities only');
      qb.andWhere('city.isPinned = true');
    }

    const { sortBy, sortOrder } = this.applySorting({ qb, query });
    this.applyCursor({ qb, query, sortBy, sortOrder });

    const limit = query.pagination.limit;
    this.applyPagination({ qb, limit });

    const cities = await qb.getMany();

    this.logger.debug('Query returned cities', { count: cities.length });

    return this.toConnection({ cities, limit, sortBy });
  }

  private applySorting(params: ApplySortingParams): ApplySorting {
    const { qb, query } = params;

    const sortBy = query.sorting?.sortBy ?? CitySortField.CREATED_AT;
    const sortOrder = query.sorting?.sortOrder ?? SortOrder.DESC;

    this.logger.debug('Applying sorting', { sortBy, sortOrder });

    SORT_CONFIG[sortBy].orderBy(qb, sortOrder);

    return { sortBy, sortOrder };
  }

  private applyCursor(params: ApplyCursorParams): void {
    const { qb, query, sortBy, sortOrder } = params;

    if (!query.pagination.cursor) {
      this.logger.debug('No cursor provided, skipping cursor filter');
      return;
    }

    const decoded = decodeCursor<{ value: unknown; id: number }>(
      query.pagination.cursor,
    );

    const cursorQuery =
      sortOrder === SortOrder.ASC
        ? SORT_CONFIG[sortBy].cursor.asc
        : SORT_CONFIG[sortBy].cursor.desc;

    this.logger.debug('Applying cursor', {
      cursor: query.pagination.cursor,
      decoded,
      sortBy,
      sortOrder,
    });

    qb.andWhere(cursorQuery, { value: decoded.value, id: decoded.id });
  }

  private applyPagination(params: ApplyPaginationParams): void {
    const { qb, limit } = params;

    this.logger.debug('Applying pagination', { limit });

    qb.take(limit + 1);
  }

  private toConnection(params: ToConnectionParams): CitiesConnection {
    const { cities, limit, sortBy } = params;

    this.logger.debug('Building connection object', {
      returned: cities.length,
      limit,
      sortBy,
    });

    const getCursorValue = CITY_CURSOR_VALUES[sortBy];

    return buildConnection({
      entities: cities,
      limit,
      mapEntityToNode: mapToOutput,
      getCursorValue,
    });
  }
}
