import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WeatherService } from '../../weather/services/weather.service';
import { CityEntity } from '../entities/city.entity';
import { ICityOutput } from '../interfaces/city.interface';
import { AddCityInput } from '../dto/add-city.input';
import { CitiesConnection } from '../dto/cities-connection.output';
import { CitiesQueryInput } from '../dto/cities-query.input';
import { mapToOutput } from '../mappers/city.mapper';
import { Base64CursorService } from '../../../shared/query/services/base64-cursor.service';

import {
  CITY_CURSOR_HANDLERS,
  CITY_CURSOR_VALUES,
  CITY_SORT_HANDLERS,
} from '../city-query.config';

import { buildConnection } from '../../../shared/query/builders/build-connection';
import { SortOrder } from '../../../shared/query/enums/sort-order.enum';

export type CitySortField = 'city' | 'createdAt' | 'isPinned';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
    private readonly weatherService: WeatherService,
    private readonly cursorService: Base64CursorService,
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

  async getCitiesPaginated(
    userId: string,
    query: CitiesQueryInput,
  ): Promise<CitiesConnection> {
    const qb = this.cityRepository
      .createQueryBuilder('city')
      .where('city.userId = :userId', { userId });

    const sortBy: CitySortField = query.sorting?.sortBy ?? 'createdAt';
    const sortOrder = query.sorting?.sortOrder ?? SortOrder.DESC;

    const sortHandler = CITY_SORT_HANDLERS[sortBy];
    sortHandler(qb, sortOrder);

    const limit = query.pagination.limit;

    if (query.pagination.cursor) {
      const decoded = this.cursorService.decode(query.pagination.cursor) as {
        value: unknown;
        id: number;
      };

      const cursorHandler = CITY_CURSOR_HANDLERS[sortBy];
      cursorHandler(qb, decoded.value, decoded.id, sortOrder);
    }

    qb.take(limit + 1);

    const cities = await qb.getMany();

    const getCursorValue = CITY_CURSOR_VALUES[sortBy];

    return buildConnection({
      entities: cities,
      first: limit,
      mapNode: mapToOutput,
      getCursorValue,
      encodeCursor: (payload: { value: unknown; id: number }) =>
        this.cursorService.encode(payload),
    });
  }
}
