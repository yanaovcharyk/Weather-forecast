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

@Resolver(() => CityOutput)
export class CitiesResolver {
  constructor(private readonly citiesService: CitiesService) {}

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
  ) {
    const userId = ctx.req.user.userId;
    return this.citiesService.addCity(userId, input);
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
    return this.citiesService.getWeatherForCity(city.lat, city.lon);
  }

  @UseGuards(AccessJwtGuard)
  @Query(() => CityOutput)
  async city(
    @Context() ctx: GQLContext,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<ICityOutput> {
    const userId = ctx.req.user.userId;
    return this.citiesService.getCityById(userId, id);
  }
}
