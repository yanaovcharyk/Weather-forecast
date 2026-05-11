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
import { UseGuards, UsePipes } from '@nestjs/common';
import { CitiesService } from '../services';
import { AddCityInput, CityOutput } from '../dto';
import { ICityOutput, GQLContext } from '../interfaces';
import { WeatherOutput } from '../../weather/dto';
import { AccessJwtGuard } from '../../auth/guards';
import { CitiesConnection } from '../dto/cities-connection.output';
import { CitiesQueryInput } from '../dto/cities-query.input';
import { AddCityResult } from '../dto/add-city.result';
import { createValidationPipe } from '../../../shared/utils/create-validation-pipe.util';

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
  @Mutation(() => AddCityResult)
  async addCity(
    @Context() ctx: GQLContext,
    @Args('input')
    input: AddCityInput,
  ) {
    const userId = ctx.req.user.userId;
    return this.citiesService.addCity(userId, input);
  }

  @UseGuards(AccessJwtGuard)
  @Mutation(() => CityOutput)
  async removeCity(
    @Context() ctx: GQLContext,
    @Args('id', { type: () => Int })
    id: number,
  ): Promise<ICityOutput> {
    const userId = ctx.req.user.userId;

    return this.citiesService.removeCity(userId, id);
  }

  @UseGuards(AccessJwtGuard)
  @Query(() => CityOutput)
  async city(
    @Context() ctx: GQLContext,
    @Args('id', {
      type: () => Int,
    })
    id: number,
  ): Promise<ICityOutput> {
    const userId = ctx.req.user.userId;

    return this.citiesService.getCityById(userId, id);
  }

  @ResolveField(() => WeatherOutput, {
    nullable: true,
  })
  async weather(@Parent() city: CityOutput) {
    return this.citiesService.getWeatherForCity(city.lat, city.lon);
  }

  @UseGuards(AccessJwtGuard)
  @UsePipes(createValidationPipe())
  @Query(() => CitiesConnection)
  async citiesPaginated(
    @Context() ctx: GQLContext,
    @Args('query', { type: () => CitiesQueryInput })
    query: CitiesQueryInput,
  ): Promise<CitiesConnection> {
    const userId = ctx.req.user.userId;
    return this.citiesService.getCitiesPaginated(userId, query);
  }

  @UseGuards(AccessJwtGuard)
  @Mutation(() => Boolean)
  async removeAllCities(@Context() ctx: GQLContext): Promise<boolean> {
    const userId = ctx.req.user.userId;
    await this.citiesService.removeAllCities(userId);
    return true;
  }

  @UseGuards(AccessJwtGuard)
  @Mutation(() => CityOutput)
  async togglePinnedCity(
    @Context() ctx: GQLContext,
    @Args('id', { type: () => Int })
    id: number,
  ): Promise<ICityOutput> {
    const userId = ctx.req.user.userId;

    return this.citiesService.togglePinned(userId, id);
  }
}
