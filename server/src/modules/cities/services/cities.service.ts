import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CityEntity } from '../entities/city.entity';
import { ICityOutput } from '../interfaces/city.interface';
import { AddCityInput } from '../dto/add-city.input';
import { mapToOutput } from '../mappers/city.mapper';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
  ) {}

  async getCityById(userId: string, id: string): Promise<ICityOutput> {
    const city = await this.findCityOrFail(userId, id);
    return mapToOutput(city);
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

  async removeCity(userId: string, id: string): Promise<ICityOutput> {
    const city = await this.findCityOrFail(userId, id);
    const result = mapToOutput(city);
    await this.cityRepository.remove(city);
    return result;
  }

  async removeAllCities(userId: string): Promise<void> {
    await this.cityRepository.delete({ userId });
  }

  async togglePinned(userId: string, id: string): Promise<ICityOutput> {
    const city = await this.findCityOrFail(userId, id);
    city.isPinned = !city.isPinned;
    const saved = await this.cityRepository.save(city);
    return mapToOutput(saved);
  }

  private async findCityOrFail(userId: string, id: string): Promise<CityEntity> {
    const city = await this.cityRepository.findOne({ where: { id, userId } });
    if (!city) throw new NotFoundException('City not found');
    return city;
  }
}
