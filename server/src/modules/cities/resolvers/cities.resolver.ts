import {
  Resolver,
  Query,
  Mutation,
  Args,
  Parent,
  ResolveField,
  ID,
} from '@nestjs/graphql';
import { UseGuards, UsePipes } from '@nestjs/common';
import { CitiesService, CitiesQueryService } from '../services';
import { WeatherService } from '@weather/services/weather.service';
import { WeatherOutput } from '@weather/dto';
import { AccessJwtGuard } from '@auth/guards';
import {
  CitiesConnection,
  CitiesQueryInput,
  AddCityOutput,
  AddCityInput,
  CityOutput,
} from '../dto';
import { createValidationPipe } from '@shared/utils';
import { AppLoggerService, LoggerContextService } from '@logger/services';
import { LogResolver } from '@shared/logging';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { ICurrentUser } from '../../auth/interfaces/user-context.interface';

@Resolver(() => CityOutput)
export class CitiesResolver {
  private readonly logger;

  constructor(
    private readonly citiesService: CitiesService,
    private readonly citiesQueryService: CitiesQueryService,
    private readonly weatherService: WeatherService,
    loggerService: AppLoggerService,
    private readonly loggerContext: LoggerContextService,
  ) {
    this.logger = loggerService.child(CitiesResolver.name);
  }

  @UseGuards(AccessJwtGuard)
  @Query(() => [CityOutput])
  @LogResolver()
  async cities(@CurrentUser() user: ICurrentUser): Promise<CityOutput[]> {
    return this.citiesQueryService.getCities({
      userId: user.id,
    });
  }

  @UseGuards(AccessJwtGuard)
  @Query(() => CitiesConnection)
  @UsePipes(createValidationPipe())
  @LogResolver()
  async citiesPaginated(
    @CurrentUser() user: ICurrentUser,
    @Args('query', { type: () => CitiesQueryInput }) query: CitiesQueryInput,
  ): Promise<CitiesConnection> {
    return this.citiesQueryService.getCitiesPaginated({
      userId: user.id,
      query,
    });
  }

  @UseGuards(AccessJwtGuard)
  @Query(() => CityOutput)
  @LogResolver()
  async city(
    @CurrentUser() user: ICurrentUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<CityOutput> {
    return this.citiesService.getCityById({
      userId: user.id,
      id,
    });
  }

  @UseGuards(AccessJwtGuard)
  @Mutation(() => AddCityOutput)
  @LogResolver()
  async addCity(
    @CurrentUser() user: ICurrentUser,
    @Args('input') input: AddCityInput,
  ) {
    return this.citiesService.addCity({
      userId: user.id,
      input,
    });
  }

  @UseGuards(AccessJwtGuard)
  @Mutation(() => CityOutput)
  @LogResolver()
  async removeCity(
    @CurrentUser() user: ICurrentUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<CityOutput> {
    return this.citiesService.removeCity({
      userId: user.id,
      id,
    });
  }

  @UseGuards(AccessJwtGuard)
  @Mutation(() => Boolean)
  @LogResolver()
  async removeAllCities(@CurrentUser() user: ICurrentUser): Promise<boolean> {
    await this.citiesService.removeAllCities({
      userId: user.id,
    });

    return true;
  }

  @UseGuards(AccessJwtGuard)
  @Mutation(() => CityOutput)
  @LogResolver()
  async togglePinnedCity(
    @CurrentUser() user: ICurrentUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<CityOutput> {
    return this.citiesService.togglePinned({
      userId: user.id,
      id,
    });
  }

  @ResolveField(() => WeatherOutput, { nullable: true })
  @LogResolver()
  async weather(@Parent() city: CityOutput) {
    this.loggerContext.printContext('CITY_RESOLVER_WEATHER');

    return this.weatherService.getWeatherPreview({
      lat: city.lat,
      lon: city.lon,
    });
  }
}
