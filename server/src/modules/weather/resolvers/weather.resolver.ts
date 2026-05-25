import { Resolver, Query, Args } from '@nestjs/graphql';
import { WeatherService } from '../services';
import {
  WeatherDetailsOutput,
  CitySuggestion,
  GetWeatherInput,
  CitySearchInput,
} from '../dto';
import { AppLoggerService } from '@logger/services';
import { LogResolver } from '@shared/logging';

@Resolver()
export class WeatherResolver {
  private readonly logger;
  constructor(
    private readonly weatherService: WeatherService,
    loggerService: AppLoggerService,
  ) {
    this.logger = loggerService.child(WeatherResolver.name);
  }

  @Query(() => [CitySuggestion])
  @LogResolver()
  async searchCities(@Args('input') input: CitySearchInput) {
    return this.weatherService.searchCities(input.query);
  }

  @Query(() => WeatherDetailsOutput)
  @LogResolver()
  async getWeatherDetails(@Args('input') input: GetWeatherInput) {
    return this.weatherService.getWeatherDetails(input);
  }
}
