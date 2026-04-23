import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { WeatherService } from '../../weather/services/weather.service';
import { CityEntity } from '../entities/city.entity';
import { ICityOutput } from '../interfaces/city.interface';
import { CreateCityParams } from '../dto/add-city.input';
@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
    private readonly weatherService: WeatherService,
  ) {}

  async getCities(userId: string): Promise<ICityOutput[]> {
    const cities = await this.cityRepository.find({ where: { userId } });

    return cities.map((city) => ({
      id: city.id,
      city: city.city,
    }));
  }

  async addCity(userId: string, input: CreateCityParams): Promise<ICityOutput> {
    const entity = this.cityRepository.create({
      ...input,
      userId,
    });

    const saved = await this.cityRepository.save(entity);

    return {
      id: saved.id,
      city: saved.city,
    };
  }

  async removeCity(userId: string, id: number): Promise<ICityOutput> {
    const city = await this.cityRepository.findOne({
      where: { id, userId },
    });

    if (!city) throw new NotFoundException('City not found');

    const result = {
      id: city.id,
      city: city.city,
    };

    await this.cityRepository.remove(city);

    return result;
  }

  async getWeatherForCity(cityId: number) {
    const city = await this.cityRepository.findOne({
      where: { id: cityId },
    });

    if (!city) throw new NotFoundException('City not found');

    if (city.lat == null || city.lon == null) {
      throw new NotFoundException('City has no coordinates');
    }

    return this.weatherService.getWeather({
      lat: city.lat,
      lon: city.lon,
    });
  }
}
