import {
  Resolver,
  Query,
  Mutation,
  Args,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CitiesService, CitiesQueryService } from '@cities/services';
import { WeatherService } from '@weather/services';
import { WeatherOutput } from '@weather/dto';
import { AccessJwtGuard } from '@auth/guards';
import {
  CitiesConnection,
  CitiesQueryInput,
  AddCityInput,
  UpdateCityInput,
  CityOutput,
} from '@cities/dto';
import { AppLoggerService } from '@logger/services';
import { LogResolver } from '@logger/index';
import { CurrentUser } from '@auth/decorators';
import { ICurrentUser } from '@auth/interfaces';
import {
  graphqlIdType,
  graphqlListType,
  graphqlType,
} from '@graphql/type-functions';

const cityOutputType = graphqlType(CityOutput);
const cityOutputListType = graphqlListType(CityOutput);
const citiesConnectionType = graphqlType(CitiesConnection);
const weatherOutputType = graphqlType(WeatherOutput);
const booleanType = graphqlType(Boolean);

@Resolver(cityOutputType)
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
  @Query(cityOutputListType)
  @LogResolver()
  async cities(@CurrentUser() user: ICurrentUser): Promise<CityOutput[]> {
    return this.citiesQueryService.getCities({
      userId: user.id,
    });
  }

  @UseGuards(AccessJwtGuard)
  @Query(citiesConnectionType)
  @LogResolver()
  async citiesPaginated(
    @CurrentUser() user: ICurrentUser,
    @Args('query') query: CitiesQueryInput,
  ): Promise<CitiesConnection> {
    return this.citiesQueryService.getCitiesPaginated({
      userId: user.id,
      query,
    });
  }

  @UseGuards(AccessJwtGuard)
  @Query(cityOutputType)
  @LogResolver()
  async city(
    @CurrentUser() user: ICurrentUser,
    @Args('id', { type: graphqlIdType }) id: string,
  ): Promise<CityOutput> {
    return this.citiesService.getCityById({
      userId: user.id,
      id,
    });
  }

  @UseGuards(AccessJwtGuard)
  @Query(cityOutputType, { nullable: true })
  @LogResolver()
  async cityByName(
    @CurrentUser() user: ICurrentUser,
    @Args('cityName') cityName: string,
  ): Promise<CityOutput | null> {
    return this.citiesService.getCityByName({
      userId: user.id,
      cityName,
    });
  }

  @UseGuards(AccessJwtGuard)
  @Mutation(cityOutputType)
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
  @Mutation(cityOutputType)
  @LogResolver()
  async removeCity(
    @CurrentUser() user: ICurrentUser,
    @Args('id', { type: graphqlIdType }) id: string,
  ): Promise<CityOutput> {
    return this.citiesService.removeCity({
      userId: user.id,
      id,
    });
  }

  @UseGuards(AccessJwtGuard)
  @Mutation(booleanType)
  @LogResolver()
  async removeAllCities(@CurrentUser() user: ICurrentUser): Promise<boolean> {
    await this.citiesService.removeAllCities({
      userId: user.id,
    });

    return true;
  }

  @UseGuards(AccessJwtGuard)
  @Mutation(cityOutputType)
  @LogResolver()
  async updateCity(
    @CurrentUser() user: ICurrentUser,
    @Args('id', { type: graphqlIdType }) id: string,
    @Args('input') input: UpdateCityInput,
  ): Promise<CityOutput> {
    return this.citiesService.updateCity({
      userId: user.id,
      id,
      input,
    });
  }

  @ResolveField(weatherOutputType, { nullable: true })
  @LogResolver()
  async weather(@Parent() city: CityOutput) {
    return this.weatherService.getWeatherPreview({
      lat: city.lat,
      lon: city.lon,
    });
  }
}
