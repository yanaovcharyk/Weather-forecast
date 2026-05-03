import { Resolver, Query, Args } from '@nestjs/graphql';
import { WeatherService } from '../services';
import { WeatherOutput } from '../dto';
import { CitySuggestion } from '../dto/city-suggestion.dto';
import { WeatherDetailsOutput } from '../dto/weather-details.dto';
import { GetWeatherInput } from '../dto/get-weather.input';
import { CitySearchInput } from '../dto/city-search.input';

@Resolver()
export class WeatherResolver {
  constructor(private readonly weatherService: WeatherService) {}

  @Query(() => [CitySuggestion])
  async searchCities(
    @Args('input') input: CitySearchInput,
  ) {
    return this.weatherService.searchCities(input.query);
  }

  @Query(() => WeatherOutput)
  async getWeather(
    @Args('input') input: GetWeatherInput,
  ) {
    return this.weatherService.getWeatherPreview(input);
  }

  @Query(() => WeatherDetailsOutput)
  async getWeatherDetails(
    @Args('input') input: GetWeatherInput,
  ) {
    return this.weatherService.getWeatherDetails(input);
  }
}
