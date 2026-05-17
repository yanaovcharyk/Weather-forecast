import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityEntity } from './entities';
import { CitiesResolver } from './resolvers';
import { CitiesService, CitiesQueryService } from './services';
import { WeatherModule } from '../weather/weather.module';
import { AuthModule } from '../auth';

@Module({
  imports: [TypeOrmModule.forFeature([CityEntity]), WeatherModule, AuthModule],
  providers: [
    CitiesResolver,
    CitiesService,
    CitiesQueryService,
  ],
})
export class CitiesModule {}
