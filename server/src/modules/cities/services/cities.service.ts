import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CityEntity } from '../entities/city.entity';
import { mapToOutput } from '../mappers/city.mapper';
import { AppLoggerService } from '@logger/services';
import { AddCityOutput, CityOutput } from '../dto';
import { AddCityParams, CityByIdParams, UserIdParams } from '../types';

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

  async getCityById(params: CityByIdParams): Promise<CityOutput> {
    const { userId, id } = params;

    this.logger.info('getCityById called');
    this.logger.debug('getCityById params', { id });

    const city = await this.findCityOrFail({ userId, id });

    this.logger.debug('getCityById succeeded', { id: city.id });

    return mapToOutput(city);
  }

  async addCity(params: AddCityParams): Promise<AddCityOutput> {
    const { userId, input } = params;

    this.logger.info('addCity called');
    this.logger.debug('addCity params', {
      city: input.city,
      lat: input.lat,
      lon: input.lon,
    });

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

  async removeCity(params: CityByIdParams): Promise<CityOutput> {
    const { userId, id } = params;

    this.logger.info('removeCity called');
    this.logger.debug('removeCity params', { id });

    const city = await this.findCityOrFail({ userId, id });
    const result = mapToOutput(city);

    await this.cityRepository.remove(city);

    this.logger.info('removeCity: city removed', { id });

    return result;
  }

  async removeAllCities(params: UserIdParams): Promise<void> {
    const { userId } = params;

    this.logger.info('removeAllCities called');

    const result = await this.cityRepository.delete({ userId });

    this.logger.info('removeAllCities: cities removed', {
      affected: result.affected ?? 0,
    });
  }

  async togglePinned(params: CityByIdParams): Promise<CityOutput> {
    const { userId, id } = params;

    this.logger.info('togglePinned called');
    this.logger.debug('togglePinned params', { id });

    const city = await this.findCityOrFail({ userId, id });

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
    const { userId, id } = params;

    this.logger.debug('findCityOrFail called', { id });

    const city = await this.cityRepository.findOne({
      where: { id, userId },
    });

    if (!city) {
      this.logger.warn('findCityOrFail: city not found', { id });
      throw new NotFoundException('City not found');
    }

    this.logger.debug('findCityOrFail: city found', { id: city.id });

    return city;
  }
}
