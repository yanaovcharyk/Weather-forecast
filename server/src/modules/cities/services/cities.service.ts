import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GraphQLError } from 'graphql/error';

import { WeatherService } from '../../weather/services/weather.service';
import { CityEntity } from '../entities/city.entity';
import { ICityOutput } from '../interfaces/city.interface';
import { AddCityInput } from '../dto/add-city.input';
import { CitiesPaginationInput } from '../dto/cities-pagination.input';
import { CitiesConnection } from '../dto/cities-connection.output';
import {
  CitiesSortingInput,
  SortableCityField,
  SortOrder,
} from '../dto/cities-sorting.input';

import {
  applyCursorPagination,
  buildPaginatedResponse,
} from '../utils/cities-pagination.util';
import { mapToOutput } from '../mappers/city.mapper';
import { CitiesQueryService } from './cities-query.service';
@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
    private readonly weatherService: WeatherService,
    private readonly citiesQueryService: CitiesQueryService,
  ) {}

  async getCities(userId: string): Promise<ICityOutput[]> {
    const cities = await this.cityRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    return cities.map(mapToOutput);
  }

  async addCity(userId: string, input: AddCityInput): Promise<ICityOutput> {
    const exists = await this.cityRepository.findOne({
      where: {
        userId,
        city: input.city,
      },
    });

    if (exists) {
      throw new GraphQLError('City already exists', {
        extensions: { code: 'CITY_EXISTS' },
      });
    }

    const city = this.cityRepository.create({
      userId,
      city: input.city,
      lat: input.lat,
      lon: input.lon,
    });

    try {
      const saved = await this.cityRepository.save(city);
      return mapToOutput(saved);
    } catch (error: any) {
      if (error.code === '23505') {
        throw new GraphQLError('City already exists', {
          extensions: { code: 'CITY_EXISTS' },
        });
      }
      throw error;
    }
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
    await this.cityRepository.delete({ userId });
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

  async getCitiesWithCursorPaginationAndSorting(
    userId: string,
    pagination: CitiesPaginationInput,
    sorting?: CitiesSortingInput,
  ): Promise<CitiesConnection> {
    const { limit, cursor } = pagination;

    const sortBy = sorting?.sortBy ?? SortableCityField.CREATED_AT;
    const sortOrder = sorting?.sortOrder ?? SortOrder.DESC;

    const citiesQueryBuilder = this.citiesQueryService.buildBaseQuery(userId);

    applyCursorPagination(citiesQueryBuilder, cursor, sortBy, sortOrder);

    this.citiesQueryService.applySorting(citiesQueryBuilder, sortBy, sortOrder);
    this.citiesQueryService.applyLimit(citiesQueryBuilder, limit + 1);

    const cities = await citiesQueryBuilder.getMany();

    return buildPaginatedResponse(cities, limit, sortBy);
  }
}
