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
import { CitiesConnection } from '../dto/cities-connection.output';
import { CitiesPaginationInput } from '../dto/cities-pagination.input';
import { CitiesSortingInput } from '../dto/cities-sorting.input';

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

  @UseGuards(AccessJwtGuard)
  @Query(() => CityOutput)
  async city(
    @Context() ctx: GQLContext,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<ICityOutput> {
    const userId = ctx.req.user.userId;
    return this.citiesService.getCityById(userId, id);
  }

  @ResolveField(() => WeatherOutput, { nullable: true })
  async weather(@Parent() city: CityOutput) {
    return this.citiesService.getWeatherForCity(city.lat, city.lon);
  }

  @UseGuards(AccessJwtGuard)
  @Query(() => CitiesConnection)
  async citiesPaginated(
    @Context() ctx: GQLContext,
    @Args('pagination') pagination: CitiesPaginationInput,
    @Args('sorting', { nullable: true }) sorting?: CitiesSortingInput,
  ) {
    const userId = ctx.req.user.userId;

    return this.citiesService.getCitiesWithCursorPaginationAndSorting(
      userId,
      pagination,
      sorting,
    );
  }

  @UseGuards(AccessJwtGuard)
  @Mutation(() => Boolean)
  async removeAllCities(@Context() ctx: GQLContext): Promise<boolean> {
    const userId = ctx.req.user.userId;
    await this.citiesService.removeAllCities(userId);
    return true;
  }
}
