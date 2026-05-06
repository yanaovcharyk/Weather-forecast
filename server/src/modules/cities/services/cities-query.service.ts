import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { CityEntity } from '../entities/city.entity';
import {
  SortableCityField,
  SortOrder,
} from '../dto/cities-sorting.input';

@Injectable()
export class CitiesQueryService {
  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
  ) {}

  buildBaseQuery(userId: string): SelectQueryBuilder<CityEntity> {
    return this.cityRepository
      .createQueryBuilder('city')
      .where('city.userId = :userId', { userId });
  }

  applySorting(
    citiesQueryBuilder: SelectQueryBuilder<CityEntity>,
    sortBy: SortableCityField,
    sortOrder: SortOrder,
  ) {
    citiesQueryBuilder.orderBy(`city.${sortBy}`, sortOrder)
      .addOrderBy('city.id', sortOrder);

    return citiesQueryBuilder;
  }

  applyLimit(
    citiesQueryBuilder: SelectQueryBuilder<CityEntity>,
    limit: number,
  ) {
    citiesQueryBuilder.limit(limit);
    return citiesQueryBuilder;
  }
}
