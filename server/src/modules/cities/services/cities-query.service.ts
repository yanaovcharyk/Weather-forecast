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
import { LogMethod } from '@logger/decorators/log-method.decorator';

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

  @LogMethod({
    shouldLogResult: true,
  })
  async getCities(params: GetCitiesParams): Promise<CityOutput[]> {
    const { userId } = params;

    const cities = await this.cityRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    return cities.map(mapToOutput);
  }

  @LogMethod({
    shouldLogArguments: true,
  })
  async getCitiesPaginated(
    params: GetCitiesPaginatedParams,
  ): Promise<CitiesConnection> {
    const { userId, query } = params;

    const qb = this.cityRepository
      .createQueryBuilder('city')
      .where('city.userId = :userId', { userId });

    if (query.showPinnedOnly) {
      this.logger.debug('Filtering pinned cities only');
      qb.andWhere('city.isPinned = true');
    }

    const { sortBy, sortOrder } = this.applySorting({ qb, query });

    this.applyCursor({
      qb,
      query,
      sortBy,
      sortOrder,
    });

    const limit = query.pagination.limit;

    this.applyPagination({
      qb,
      limit,
    });

    const cities = await qb.getMany();

    return this.toConnection({
      cities,
      limit,
      sortBy,
    });
  }

  private applySorting(params: ApplySortingParams): ApplySorting {
    const { qb, query } = params;

    const sortBy = query.sorting?.sortBy ?? CitySortField.CREATED_AT;

    const sortOrder = query.sorting?.sortOrder ?? SortOrder.DESC;

    SORT_CONFIG[sortBy].orderBy(qb, sortOrder);

    return {
      sortBy,
      sortOrder,
    };
  }

  private applyCursor(params: ApplyCursorParams): void {
    const { qb, query, sortBy, sortOrder } = params;

    if (!query.pagination.cursor) {
      return;
    }

    const decoded = decodeCursor<{
      value: unknown;
      id: number;
    }>(query.pagination.cursor);

    const cursorQuery =
      sortOrder === SortOrder.ASC
        ? SORT_CONFIG[sortBy].cursor.asc
        : SORT_CONFIG[sortBy].cursor.desc;

    this.logger.debug('Applying decoded cursor', {
      decoded,
    });

    qb.andWhere(cursorQuery, {
      value: decoded.value,
      id: decoded.id,
    });
  }

  @LogMethod()
  private applyPagination(params: ApplyPaginationParams): void {
    const { qb, limit } = params;

    qb.take(limit + 1);
  }

  private toConnection(params: ToConnectionParams): CitiesConnection {
    const { cities, limit, sortBy } = params;

    const getCursorValue = CITY_CURSOR_VALUES[sortBy];

    return buildConnection({
      entities: cities,
      limit,
      mapEntityToNode: mapToOutput,
      getCursorValue,
    });
  }
}
