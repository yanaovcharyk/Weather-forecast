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
  AddCityParams,
  CityByIdParams,
  CityByNameParams,
  UpdateCityParams,
  UserIdParams,
} from '@cities/types';
import { ICityOutput } from '@cities/interfaces';
import { LogMethod } from '@logger/decorators';
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
    return city;
  }

  @LogMethod()
  async addCity(params: AddCityParams): Promise<ICityOutput> {
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
  async getCityByName(params: CityByNameParams): Promise<ICityOutput | null> {
    return this.cityRepository.findOne({
      where: {
        userId: params.userId,
        cityName: params.cityName,
      },
    });
  }

  @LogMethod()
  async removeCity(params: CityByIdParams): Promise<ICityOutput> {
    const city = await this.findCityOrFail(params);
    const removedCity = { ...city };
    await this.cityRepository.remove(city);

    return removedCity;
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
  async updateCity(params: UpdateCityParams): Promise<ICityOutput> {
    const city = await this.findCityOrFail(params);
    const updates = this.getCityUpdates(params.input);

    if (!Object.keys(updates).length) {
      throw new BadRequestException('No city fields provided for update');
    }

    const updatedFields = Object.keys(updates) as (keyof typeof updates)[];
    const previous = Object.fromEntries(
      updatedFields.map((field) => [field, city[field]]),
    );

    Object.assign(city, updates);

    const saved = await this.cityRepository.save(city);

    this.logger.info('updateCity: city updated', {
      id: saved.id,
      fields: updatedFields,
      previous,
      current: updates,
    });

    return saved;
  }

  private getCityUpdates(
    input: UpdateCityParams['input'],
  ): Partial<Pick<CityEntity, 'cityName' | 'lat' | 'lon' | 'isPinned'>> {
    return {
      ...(input.cityName !== undefined ? { cityName: input.cityName } : {}),
      ...(input.lat !== undefined ? { lat: input.lat } : {}),
      ...(input.lon !== undefined ? { lon: input.lon } : {}),
      ...(input.isPinned !== undefined ? { isPinned: input.isPinned } : {}),
    };
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
