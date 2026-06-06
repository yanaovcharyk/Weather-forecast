import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CityEntity } from '../entities/city.entity';
import { mapToOutput } from '../mappers/city.mapper';
import { AppLoggerService } from '@logger/services';
import { AddCityParams, CityByIdParams, UserIdParams } from '../types';
import { ICityOutput } from '../interfaces/city.output.interface';
import { IAddCityOutput } from '../interfaces/add-city.output.interface';
import { LogMethod } from '../../logger/decorators/log-method.decorator';

@Injectable()
export class CitiesService {
  private readonly logger;

  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
    loggerService: AppLoggerService,
  ) {
    this.logger = loggerService.child(CitiesService.name);
  }

  @LogMethod()
  async getCityById(params: CityByIdParams): Promise<ICityOutput> {
    const city = await this.findCityOrFail(params);
    return mapToOutput(city);
  }

  @LogMethod()
  async addCity(params: AddCityParams): Promise<IAddCityOutput> {
    const { userId, input } = params;

    const exists = await this.cityRepository.findOne({
      where: { userId, city: input.city },
    });

    if (exists) {
      this.logger.info('addCity: city already exists', {
        existingCityId: exists.id,
        city: exists.city,
      });

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

    this.logger.info('addCity: city created', {
      id: saved.id,
      city: saved.city,
    });

    return {
      ok: true,
      code: null,
      city: mapToOutput(saved),
      existingCity: null,
    };
  }

  @LogMethod()
  async removeCity(params: CityByIdParams): Promise<ICityOutput> {
    const city = await this.findCityOrFail(params);

    const result = mapToOutput(city);

    await this.cityRepository.remove(city);

    this.logger.info('removeCity: city removed', {
      id: city.id,
    });

    return result;
  }

  @LogMethod()
  async removeAllCities(params: UserIdParams): Promise<void> {
    const result = await this.cityRepository.delete({
      userId: params.userId,
    });

    this.logger.info('removeAllCities: cities removed', {
      affected: result.affected ?? 0,
    });
  }

  @LogMethod()
  async togglePinned(params: CityByIdParams): Promise<ICityOutput> {
    const city = await this.findCityOrFail(params);

    const previous = city.isPinned;
    city.isPinned = !city.isPinned;

    const saved = await this.cityRepository.save(city);

    this.logger.info('togglePinned: pinned state updated', {
      id: saved.id,
      previous,
      current: saved.isPinned,
    });

    return mapToOutput(saved);
  }

  private async findCityOrFail(params: CityByIdParams): Promise<CityEntity> {
    const city = await this.cityRepository.findOne({
      where: { id: params.id, userId: params.userId },
    });

    if (!city) {
      this.logger.warn('City not found', { id: params.id });
      throw new NotFoundException('City not found');
    }

    return city;
  }
}
