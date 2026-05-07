import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import {
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

import { CityEntity } from '../entities/city.entity';

@Injectable()
export class CitiesQueryService {
  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
  ) {}

  buildBaseQuery(
    userId: string,
  ): SelectQueryBuilder<CityEntity> {
    return this.cityRepository
      .createQueryBuilder('city')
      .where(
        'city.userId = :userId',
        {
          userId,
        },
      );
  }

  applyLimit(
    qb: SelectQueryBuilder<CityEntity>,
    limit: number,
  ) {
    qb.limit(limit);

    return qb;
  }
}
