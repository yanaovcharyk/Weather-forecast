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
import { CitiesService } from '../services/cities.service';
import { CitiesQueryService } from '../services/cities-query.service';
import { WeatherService } from '../../weather/services/weather.service';
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
  constructor(
    private readonly citiesService: CitiesService,
    private readonly citiesQueryService: CitiesQueryService,
    private readonly weatherService: WeatherService,
  ) {}

  @UseGuards(AccessJwtGuard)
  @Query(() => [CityOutput])
  async cities(@Context() ctx: GQLContext): Promise<ICityOutput[]> {
    const userId = ctx.req.user.userId;

    return this.citiesQueryService.getCities(userId);
  }

  @UseGuards(AccessJwtGuard)
  @Query(() => CitiesConnection)
  @UsePipes(createValidationPipe())
  async citiesPaginated(
    @Context() ctx: GQLContext,
    @Args('query', {
      type: () => CitiesQueryInput,
    })
    query: CitiesQueryInput,
  ): Promise<CitiesConnection> {
    const userId = ctx.req.user.userId;

    return this.citiesQueryService.getCitiesPaginated(userId, query);
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
    @Args('id', {
      type: () => Int,
    })
    id: number,
  ): Promise<ICityOutput> {
    const userId = ctx.req.user.userId;

    return this.citiesService.removeCity(userId, id);
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
    @Args('id', {
      type: () => Int,
    })
    id: number,
  ): Promise<ICityOutput> {
    const userId = ctx.req.user.userId;

    return this.citiesService.togglePinned(userId, id);
  }

  @ResolveField(() => WeatherOutput, {
    nullable: true,
  })
  async weather(@Parent() city: CityOutput) {
    return this.weatherService.getWeatherPreview({
      lat: city.lat,
      lon: city.lon,
    });
  }
}
