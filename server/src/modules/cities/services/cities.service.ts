import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { WeatherService } from '../../weather/services/weather.service';
import { CityEntity } from '../entities/city.entity';
import { ICityOutput } from '../interfaces/city.interface';
import { AddCityInput } from '../dto/add-city.input';
import { CitiesConnection } from '../dto/cities-connection.output';
import { CitiesQueryInput } from '../dto/cities-query.input';
import { mapToOutput } from '../mappers/city.mapper';

import {
  CITY_CURSOR_HANDLERS,
  CITY_CURSOR_VALUES,
  CITY_SORT_HANDLERS,
  CitySortField,
} from '../city-query.config';

import { SortOrder } from '../../../shared/query/sorting/sort-order.enum';
import { decodeCursor } from '../../../shared/query/pagination/cursor/decode-cursor';
import { buildConnection } from '../../../shared/query/pagination/build-connection';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
    private readonly weatherService: WeatherService,
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

  async getCityById(userId: string, id: number): Promise<ICityOutput> {
    const city = await this.cityRepository.findOne({
      where: { id, userId },
    });

    if (!city) {
      throw new NotFoundException('City not found');
    }

    return mapToOutput(city);
  }

  async getWeatherForCity(lat: number, lon: number) {
    return this.weatherService.getWeatherPreview({ lat, lon });
  }

  async addCity(userId: string, input: AddCityInput) {
    const exists = await this.cityRepository.findOne({
      where: { userId, city: input.city },
    });

    if (exists) {
      return {
        ok: false,
        code: 'CITY_EXISTS',
        existingCity: mapToOutput(exists),
        city: null,
      };
    }

    const city = this.cityRepository.create({
      userId,
      city: input.city,
      lat: input.lat,
      lon: input.lon,
    });

    const saved = await this.cityRepository.save(city);

    return {
      ok: true,
      code: null,
      city: mapToOutput(saved),
      existingCity: null,
    };
  }

  async removeCity(userId: string, id: number): Promise<ICityOutput> {
    const city = await this.cityRepository.findOne({
      where: { id, userId },
    });

    if (!city) {
      throw new NotFoundException('City not found');
    }

    const result = mapToOutput(city);

    await this.cityRepository.remove(city);

    return result;
  }

  async removeAllCities(userId: string): Promise<void> {
    await this.cityRepository.delete({
      userId,
    });
  }

  async getCitiesPaginated(
    userId: string,
    query: CitiesQueryInput,
  ): Promise<CitiesConnection> {
    const queryBuilder = this.cityRepository
      .createQueryBuilder('city')
      .where('city.userId = :userId', { userId });

    const { sortBy, sortOrder } = this.applySorting(queryBuilder, query);
    this.applyCursor(queryBuilder, query, sortBy, sortOrder);
    const limit = query.pagination.limit;
    this.applyPagination(queryBuilder, limit);
    const cities = await queryBuilder.getMany();

    return this.toConnection(cities, limit, sortBy);
  }

  private applySorting(
    qb: SelectQueryBuilder<CityEntity>,
    query: CitiesQueryInput,
  ): {
    sortBy: CitySortField;
    sortOrder: SortOrder;
  } {
    const sortBy: CitySortField =
      query.sorting?.sortBy ?? CitySortField.CREATED_AT;
    const sortOrder = query.sorting?.sortOrder ?? SortOrder.DESC;
    const sortHandler = CITY_SORT_HANDLERS[sortBy];
    sortHandler(qb, sortOrder);
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

    const cursorHandler = CITY_CURSOR_HANDLERS[sortBy];
    cursorHandler(qb, decoded.value, decoded.id, sortOrder);
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
      limit: limit,
      mapEntityToNode: mapToOutput,
      getCursorValue,
    });
  }
}
