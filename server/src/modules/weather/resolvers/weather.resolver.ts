import { Resolver, Query, Args } from '@nestjs/graphql';
import { WeatherService } from '../services';
import {
  WeatherOutput,
  WeatherDetailsOutput,
  CitySuggestion,
  GetWeatherInput,
  CitySearchInput,
} from '../dto';

@Resolver()
export class WeatherResolver {
  constructor(private readonly weatherService: WeatherService) {}

  @Query(() => [CitySuggestion])
  async searchCities(@Args('input') input: CitySearchInput) {
    return this.weatherService.searchCities(input.query);
  }

  @Query(() => WeatherDetailsOutput)
  async getWeatherDetails(@Args('input') input: GetWeatherInput) {
    return this.weatherService.getWeatherDetails(input);
  }
}
