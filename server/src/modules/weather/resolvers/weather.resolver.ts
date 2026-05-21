import { Resolver, Query, Args } from '@nestjs/graphql';
import { WeatherService } from '../services';
import {
  WeatherDetailsOutput,
  CitySuggestion,
  GetWeatherInput,
  CitySearchInput,
} from '../dto';
import { AppLoggerService } from '@logger/services';

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
  async searchCities(@Args('input') input: CitySearchInput) {
    this.logger.info('searchCities query called');
    return this.weatherService.searchCities(input.query);
  }

  @Query(() => WeatherDetailsOutput)
  async getWeatherDetails(@Args('input') input: GetWeatherInput) {
    this.logger.info('getWeatherDetails query called');
    return this.weatherService.getWeatherDetails(input);
  }
}
