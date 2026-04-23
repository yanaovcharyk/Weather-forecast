import { Resolver, Query, Args } from '@nestjs/graphql';
import { WeatherService } from '../services';
import { WeatherOutput } from '../dto';
import { CitySuggestion } from '../dto/city-suggestion.dto';
import { IWeatherOutput } from '../interfaces';

@Resolver()
export class WeatherResolver {
  constructor(private readonly weatherService: WeatherService) {}

  @Query(() => [CitySuggestion])
  async searchCities(
    @Args('query') query: string,
  ): Promise<CitySuggestion[]> {
    return this.weatherService.searchCities(query);
  }

  @Query(() => WeatherOutput)
  async getWeather(
    @Args('lat') lat: number,
    @Args('lon') lon: number,
  ): Promise<IWeatherOutput> {
    return this.weatherService.getWeather({ lat, lon });
  }
}
