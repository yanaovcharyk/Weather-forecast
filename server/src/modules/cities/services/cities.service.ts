import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

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
import { GraphQLError } from 'graphql/error';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
    private readonly weatherService: WeatherService,
  ) {}

  private applyCursorPagination(
    citiesQueryBuilder: SelectQueryBuilder<CityEntity>,
    cursor: string | undefined,
    sortBy: SortableCityField,
    sortOrder: SortOrder,
  ) {
    if (!cursor) return;

    const { value, id } = JSON.parse(Buffer.from(cursor, 'base64').toString());

    citiesQueryBuilder.andWhere(
      `(city.${sortBy}, city.id) ${
        sortOrder === 'DESC' ? '<' : '>'
      } (:value, :id)`,
      { value, id },
    );
  }

  private buildPaginatedResponse(
    entities: CityEntity[],
    limit: number,
    sortBy: SortableCityField,
  ): CitiesConnection {
    const hasNextPage = entities.length > limit;
    const sliced = entities.slice(0, limit);

    return {
      edges: sliced.map((city) => ({
        node: this.mapToOutput(city),
        cursor: this.encodeCursor(city, sortBy),
      })),
      pageInfo: {
        hasNextPage,
        endCursor: sliced.length
          ? this.encodeCursor(sliced[sliced.length - 1], sortBy)
          : undefined,
      },
    };
  }

  private encodeCursor(city: CityEntity, sortBy: SortableCityField): string {
    return Buffer.from(
      JSON.stringify({
        value: city[sortBy],
        id: city.id,
      }),
    ).toString('base64');
  }

  private mapToOutput(city: CityEntity): ICityOutput {
    return {
      id: city.id,
      city: city.city,
      lat: city.lat,
      lon: city.lon,
    };
  }

  async getCities(userId: string): Promise<ICityOutput[]> {
    const cities = await this.cityRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    return cities.map(this.mapToOutput);
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
        extensions: {
          code: 'CITY_EXISTS',
        },
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
      return this.mapToOutput(saved);
    } catch (error: any) {
      if (error.code === '23505') {
        throw new GraphQLError('City already exists', {
          extensions: {
            code: 'CITY_EXISTS',
          },
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

    const result = this.mapToOutput(city);

    await this.cityRepository.remove(city);

    return result;
  }

  async getWeatherForCity(lat: number, lon: number) {
    return this.weatherService.getWeatherPreview({
      lat,
      lon,
    });
  }

  async getCityById(userId: string, id: number): Promise<ICityOutput> {
    const city = await this.cityRepository.findOne({
      where: { id, userId },
    });

    if (!city) {
      throw new NotFoundException('City not found');
    }

    return this.mapToOutput(city);
  }

  async getCitiesWithCursorPaginationAndSorting(
    userId: string,
    pagination: CitiesPaginationInput,
    sorting?: CitiesSortingInput,
  ): Promise<CitiesConnection> {
    const { limit, cursor } = pagination;

    const sortBy = sorting?.sortBy ?? SortableCityField.CREATED_AT;
    const sortOrder = sorting?.sortOrder ?? SortOrder.DESC;

    const citiesQueryBuilder = this.cityRepository
      .createQueryBuilder('city')
      .where('city.userId = :userId', { userId });

    this.applyCursorPagination(citiesQueryBuilder, cursor, sortBy, sortOrder);

    citiesQueryBuilder.orderBy(`city.${sortBy}`, sortOrder)
      .addOrderBy('city.id', sortOrder)
      .limit(limit + 1);

    const cities = await citiesQueryBuilder.getMany();

    return this.buildPaginatedResponse(cities, limit, sortBy);
  }

  async removeAllCities(userId: string): Promise<void> {
    await this.cityRepository.delete({ userId });
  }
}
