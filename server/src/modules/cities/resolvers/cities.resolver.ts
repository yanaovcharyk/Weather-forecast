import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
  Parent,
  ResolveField,
  ID,
} from '@nestjs/graphql';
import { UseGuards, UsePipes } from '@nestjs/common';
import { CitiesService, CitiesQueryService } from '../services';
import { WeatherService } from '@weather/services/weather.service';
import { ICityOutput, GQLContext } from '../interfaces';
import { WeatherOutput } from '@weather/dto';
import { AccessJwtGuard } from '@auth/guards';
import {
  CitiesConnection,
  CitiesQueryInput,
  AddCityOutput,
  AddCityInput,
  CityOutput,
} from '../dto';
import { createValidationPipe } from '@shared/utils/create-validation-pipe.util';

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
    return this.citiesQueryService.getCities(ctx.req.user.userId);
  }

  @UseGuards(AccessJwtGuard)
  @Query(() => CitiesConnection)
  @UsePipes(createValidationPipe())
  async citiesPaginated(
    @Context() ctx: GQLContext,
    @Args('query', { type: () => CitiesQueryInput }) query: CitiesQueryInput,
  ): Promise<CitiesConnection> {
    return this.citiesQueryService.getCitiesPaginated(
      ctx.req.user.userId,
      query,
    );
  }

  @UseGuards(AccessJwtGuard)
  @Query(() => CityOutput)
  async city(
    @Context() ctx: GQLContext,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<ICityOutput> {
    return this.citiesService.getCityById(ctx.req.user.userId, id);
  }

  @UseGuards(AccessJwtGuard)
  @Mutation(() => AddCityOutput)
  async addCity(
    @Context() ctx: GQLContext,
    @Args('input') input: AddCityInput,
  ) {
    return this.citiesService.addCity(ctx.req.user.userId, input);
  }

  @UseGuards(AccessJwtGuard)
  @Mutation(() => CityOutput)
  async removeCity(
    @Context() ctx: GQLContext,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<ICityOutput> {
    return this.citiesService.removeCity(ctx.req.user.userId, id);
  }

  @UseGuards(AccessJwtGuard)
  @Mutation(() => Boolean)
  async removeAllCities(@Context() ctx: GQLContext): Promise<boolean> {
    await this.citiesService.removeAllCities(ctx.req.user.userId);
    return true;
  }

  @UseGuards(AccessJwtGuard)
  @Mutation(() => CityOutput)
  async togglePinnedCity(
    @Context() ctx: GQLContext,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<ICityOutput> {
    return this.citiesService.togglePinned(ctx.req.user.userId, id);
  }

  @ResolveField(() => WeatherOutput, { nullable: true })
  async weather(@Parent() city: CityOutput) {
    return this.weatherService.getWeatherPreview({
      lat: city.lat,
      lon: city.lon,
    });
  }
}
