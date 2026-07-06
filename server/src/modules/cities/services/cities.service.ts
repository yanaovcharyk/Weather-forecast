import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CityEntity } from '@cities/entities';
import { AppLoggerService } from '@logger/services';
import {
  AddSavedCityParams,
  CityByIdParams,
  SavedCityLookupParams,
  UpdateSavedCityParams,
  UserIdParams,
} from '@cities/types';
import { ICityOutput } from '@cities/interfaces';
import { LogMethod } from '@logger/decorators';
import { removeUndefined } from '@shared/utils';

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
  async getSavedCity(
    params: SavedCityLookupParams,
  ): Promise<ICityOutput | null> {
    const { userId, ...lookupParams } = params;

    return this.cityRepository.findOne({
      where: {
        userId,
        ...lookupParams,
      },
    });
  }

  @LogMethod()
  async addSavedCity(params: AddSavedCityParams): Promise<ICityOutput> {
    const { userId, input } = params;
    const cityName = input.cityName.trim();

    const exists = await this.cityRepository.findOne({
      where: {
        userId,
        lat: input.lat,
        lon: input.lon,
      },
    });

    if (exists) {
      return exists;
    }

    const city = this.cityRepository.create({
      userId,
      cityName,
      lat: input.lat,
      lon: input.lon,
    });

    return this.cityRepository.save(city);
  }

  @LogMethod()
  async removeSavedCity(params: CityByIdParams): Promise<ICityOutput> {
    const city = await this.cityRepository.findOne({
      where: {
        id: params.id,
        userId: params.userId,
      },
    });

    if (!city) {
      this.logger.warn('City not found', { id: params.id });
      throw new NotFoundException('City not found');
    }

    const removedCity = { ...city };
    await this.cityRepository.remove(city);

    return removedCity;
  }

  @LogMethod()
  async removeAllSavedCities(params: UserIdParams): Promise<void> {
    const result = await this.cityRepository.delete({
      userId: params.userId,
    });

    this.logger.info('removeAllSavedCities: cities removed', {
      affected: result.affected ?? 0,
    });
  }

  @LogMethod()
  async updateSavedCity(params: UpdateSavedCityParams): Promise<ICityOutput> {
    const updates = removeUndefined(params.input);
    const updatedFields = Object.keys(updates);

    if (updatedFields.length === 0) {
      throw new BadRequestException('No city fields provided for update');
    }

    const result = await this.cityRepository.update(
      {
        id: params.id,
        userId: params.userId,
      },
      updates,
    );

    if (result.affected === 0) {
      this.logger.warn('City not found', { id: params.id });
      throw new NotFoundException('City not found');
    }

    this.logger.info('updateSavedCity: city updated', {
      id: params.id,
      fields: updatedFields,
      current: updates,
    });

    return this.getSavedCityOrFail(params);
  }

  private async getSavedCityOrFail(
    params: CityByIdParams,
  ): Promise<ICityOutput> {
    const city = await this.getSavedCity({
      userId: params.userId,
      id: params.id,
    });

    if (!city) {
      this.logger.warn('City not found', { id: params.id });
      throw new NotFoundException('City not found');
    }

    return city;
  }
}
