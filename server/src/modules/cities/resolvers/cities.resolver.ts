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
import { GQLContext } from '../interfaces';
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
import { AppLoggerService } from '@logger/services';

@Resolver(() => CityOutput)
export class CitiesResolver {
  private readonly logger;

  constructor(
    private readonly citiesService: CitiesService,
    private readonly citiesQueryService: CitiesQueryService,
    private readonly weatherService: WeatherService,
    loggerService: AppLoggerService,
  ) {
    this.logger = loggerService.child(CitiesResolver.name);
  }

  @UseGuards(AccessJwtGuard)
  @Query(() => [CityOutput])
  async cities(@Context() ctx: GQLContext): Promise<CityOutput[]> {
    this.logger.info('cities query called');
    return this.citiesQueryService.getCities({ userId: ctx.req.user.userId });
  }

  @UseGuards(AccessJwtGuard)
  @Query(() => CitiesConnection)
  @UsePipes(createValidationPipe())
  async citiesPaginated(
    @Context() ctx: GQLContext,
    @Args('query', { type: () => CitiesQueryInput }) query: CitiesQueryInput,
  ): Promise<CitiesConnection> {
    this.logger.info('citiesPaginated query called');
    this.logger.debug('citiesPaginated args', { query });

    return this.citiesQueryService.getCitiesPaginated({
      userId: ctx.req.user.userId,
      query,
    });
  }

  @UseGuards(AccessJwtGuard)
  @Query(() => CityOutput)
  async city(
    @Context() ctx: GQLContext,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<CityOutput> {
    this.logger.info('city query called');
    this.logger.debug('city args', { id });

    return this.citiesService.getCityById({
      userId: ctx.req.user.userId,
      id,
    });
  }

  @UseGuards(AccessJwtGuard)
  @Mutation(() => AddCityOutput)
  async addCity(
    @Context() ctx: GQLContext,
    @Args('input') input: AddCityInput,
  ) {
    this.logger.info('addCity mutation called');
    this.logger.debug('addCity args', { input });

    return this.citiesService.addCity({
      userId: ctx.req.user.userId,
      input,
    });
  }

  @UseGuards(AccessJwtGuard)
  @Mutation(() => CityOutput)
  async removeCity(
    @Context() ctx: GQLContext,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<CityOutput> {
    this.logger.info('removeCity mutation called');
    this.logger.debug('removeCity args', { id });

    return this.citiesService.removeCity({
      userId: ctx.req.user.userId,
      id,
    });
  }

  @UseGuards(AccessJwtGuard)
  @Mutation(() => Boolean)
  async removeAllCities(@Context() ctx: GQLContext): Promise<boolean> {
    this.logger.info('removeAllCities mutation called');

    await this.citiesService.removeAllCities({
      userId: ctx.req.user.userId,
    });

    return true;
  }

  @UseGuards(AccessJwtGuard)
  @Mutation(() => CityOutput)
  async togglePinnedCity(
    @Context() ctx: GQLContext,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<CityOutput> {
    this.logger.info('togglePinnedCity mutation called');
    this.logger.debug('togglePinnedCity args', { id });

    return this.citiesService.togglePinned({
      userId: ctx.req.user.userId,
      id,
    });
  }

  @ResolveField(() => WeatherOutput, { nullable: true })
  async weather(@Parent() city: CityOutput) {
    this.logger.debug('weather field resolver called', {
      lat: city.lat,
      lon: city.lon,
    });

    return this.weatherService.getWeatherPreview({
      lat: city.lat,
      lon: city.lon,
    });
  }
}
