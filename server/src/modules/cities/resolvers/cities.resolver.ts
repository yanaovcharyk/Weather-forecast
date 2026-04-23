import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
  Int,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { CitiesService } from '../services';
import { AddCityInput, CityOutput } from '../dto';
import { ICityOutput, GQLContext } from '../interfaces';
import { WeatherOutput } from '../../weather/dto';
import { AccessJwtGuard } from '../../auth/guards';
import { WeatherService } from '../../weather/services/weather.service';
import { CreateCityParams } from '../dto/add-city.input';

@Resolver(() => CityOutput)
export class CitiesResolver {
  constructor(
    private readonly citiesService: CitiesService,
    private readonly weatherService: WeatherService,
  ) {}

  @UseGuards(AccessJwtGuard)
  @Query(() => [CityOutput])
  async cities(@Context() ctx: GQLContext): Promise<ICityOutput[]> {
    const userId = ctx.req.user.userId;
    return this.citiesService.getCities(userId);
  }

  @UseGuards(AccessJwtGuard)
  @Mutation(() => CityOutput)
  async addCity(
    @Context() ctx: GQLContext,
    @Args('input') input: AddCityInput,
  ): Promise<ICityOutput> {
    const userId = ctx.req.user.userId;

    const cities = await this.weatherService.searchCities(input.city);

    const geo = cities[0];

    if (!geo) {
      throw new Error('City not found');
    }

    const cityData: CreateCityParams = {
      city: geo.name,
      lat: geo.lat,
      lon: geo.lon,
    };

    return this.citiesService.addCity(userId, cityData);
  }

  @UseGuards(AccessJwtGuard)
  @Mutation(() => CityOutput)
  async removeCity(
    @Context() ctx: GQLContext,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<ICityOutput> {
    const userId = ctx.req.user.userId;
    return this.citiesService.removeCity(userId, id);
  }

  @ResolveField(() => WeatherOutput, { nullable: true })
  async weather(@Parent() city: CityOutput) {
    return this.citiesService.getWeatherForCity(city.id);
  }
}
