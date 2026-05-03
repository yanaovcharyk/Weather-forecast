import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { WeatherService } from '../../weather/services/weather.service';
import { CityEntity } from '../entities/city.entity';
import { ICityOutput } from '../interfaces/city.interface';
import { AddCityInput } from '../dto/add-city.input';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
    private readonly weatherService: WeatherService,
  ) {}

  async getCities(userId: string): Promise<ICityOutput[]> {
    const cities = await this.cityRepository.find({
      where: { userId },
      order: {
        createdAt: 'DESC',
      },
    });

    return cities.map((city) => ({
      id: city.id,
      city: city.city,
      lat: city.lat,
      lon: city.lon,
    }));
  }

  async addCity(userId: string, input: AddCityInput): Promise<ICityOutput> {
    const entity = this.cityRepository.create({
      userId,
      city: input.city,
      lat: input.lat,
      lon: input.lon,
    });

    const saved = await this.cityRepository.save(entity);

    return {
      id: saved.id,
      city: saved.city,
      lat: saved.lat,
      lon: saved.lon,
    };
  }

  async removeCity(userId: string, id: number): Promise<ICityOutput> {
    const city = await this.cityRepository.findOne({
      where: { id, userId },
    });

    if (!city) {
      throw new NotFoundException('City not found');
    }

    const result: ICityOutput = {
      id: city.id,
      city: city.city,
      lat: city.lat,
      lon: city.lon,
    };

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

    return {
      id: city.id,
      city: city.city,
      lat: city.lat,
      lon: city.lon,
    };
  }
}
