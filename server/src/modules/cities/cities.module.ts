import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CityEntity } from './entities';
import { CitiesResolver } from './resolvers';
import { CitiesService } from './services';
import { WeatherModule } from '../weather/weather.module';
import { AuthModule } from '../auth';
import { QueryModule } from '../../shared/query/query.module';

@Module({
  imports: [TypeOrmModule.forFeature([CityEntity]), WeatherModule, AuthModule, QueryModule],
  providers: [
    CitiesResolver,
    CitiesService,
  ],
})
export class CitiesModule {}
