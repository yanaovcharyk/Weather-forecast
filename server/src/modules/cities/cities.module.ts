import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CityEntity } from './entities';
import { CitiesResolver } from './resolvers';
import { CitiesService } from './services';
import { WeatherModule } from '../weather/weather.module';
import { AuthModule } from '../auth';
import { CitiesQueryService } from './services/cities-query.service';
import { SortingModule } from '../sorting/sorting.module';
import { PaginationModule } from '../pagination/pagination.module';

@Module({
  imports: [TypeOrmModule.forFeature([CityEntity]), WeatherModule, AuthModule, PaginationModule, SortingModule],
  providers: [
    CitiesResolver,
    CitiesService,
    CitiesQueryService,
  ],
})
export class CitiesModule {}
