import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CityEntity } from './entities';
import { CitiesResolver } from './resolvers';
import { CitiesService } from './services';
import { WeatherModule } from '../weather/weather.module';
import { AuthModule } from '../auth';
import { CitiesQueryService } from './services/cities-query.service';

@Module({
  imports: [TypeOrmModule.forFeature([CityEntity]), WeatherModule, AuthModule],
  providers: [
    CitiesResolver,
    CitiesService,
    CitiesQueryService,
  ],
})
export class CitiesModule {}
