import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityEntity } from './entities';
import { CitiesResolver } from './resolvers';
import {
  CitiesService,
  CitiesQueryService,
  OpenWeatherCityApiService,
} from './services';
import { AuthModule } from '@auth/index';
import { WeatherModule } from '@weather/index';
import { cityOpenWeatherConfig } from './config';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([CityEntity]),
    WeatherModule,
    AuthModule,
  ],
  providers: [
    CitiesResolver,
    CitiesService,
    CitiesQueryService,
    OpenWeatherCityApiService,
    {
      provide: 'CITY_OPEN_WEATHER_CONFIG',
      inject: [ConfigService],
      useFactory: cityOpenWeatherConfig,
    },
  ],
})
export class CitiesModule {}
