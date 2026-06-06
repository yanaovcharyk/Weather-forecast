import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { WeatherService } from '../services';
import {
  WeatherDetailsOutput,
  CitySuggestion,
  GetWeatherInput,
  CitySearchInput,
} from '../dto';
import { AppLoggerService } from '@logger/services';
import { LogResolver } from '@logger/index';
import { AccessJwtGuard } from '../../auth/guards';

@Resolver()
export class WeatherResolver {
  private readonly logger;
  constructor(
    private readonly weatherService: WeatherService,
    loggerService: AppLoggerService,
  ) {
    this.logger = loggerService.child(WeatherResolver.name);
  }

  @UseGuards(AccessJwtGuard)
  @Query(() => [CitySuggestion])
  @LogResolver()
  async searchCities(@Args('input') input: CitySearchInput) {
    return this.weatherService.searchCities(input.query);
  }

  @UseGuards(AccessJwtGuard)
  @Query(() => WeatherDetailsOutput)
  @LogResolver()
  async getWeatherDetails(@Args('input') input: GetWeatherInput) {
    return this.weatherService.getWeatherDetails(input);
  }
}
