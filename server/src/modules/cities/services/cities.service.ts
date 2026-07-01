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
  SavedCityByNameParams,
  UpdateSavedCityParams,
  UserIdParams,
} from '@cities/types';
import { ICityOutput, ICitySuggestion } from '@cities/interfaces';
import { LogMethod } from '@logger/decorators';
import { removeUndefined } from '@shared/utils';
import { OpenWeatherCityApiService } from './open-weather-city-api.service';

@Injectable()
export class CitiesService {
  private readonly logger;

  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
    private readonly openWeatherCityApi: OpenWeatherCityApiService,
    loggerService: AppLoggerService,
  ) {
    this.logger = loggerService.child(CitiesService.name);
  }

  @LogMethod()
  async getCitySuggestions(query: string): Promise<ICitySuggestion[]> {
    return this.openWeatherCityApi.getCitySuggestions(query);
  }

  @LogMethod()
  async getCityById(params: CityByIdParams): Promise<ICityOutput> {
    const city = await this.findSavedCityOrFail(params);
    return city;
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
  async getSavedCityByName(
    params: SavedCityByNameParams,
  ): Promise<ICityOutput | null> {
    return this.cityRepository.findOne({
      where: {
        userId: params.userId,
        cityName: params.cityName,
      },
    });
  }

  @LogMethod()
  async removeSavedCity(params: CityByIdParams): Promise<ICityOutput> {
    const city = await this.findSavedCityOrFail(params);
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

    return this.findSavedCityOrFail(params);
  }

  private async findSavedCityOrFail(
    params: CityByIdParams,
  ): Promise<CityEntity> {
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
