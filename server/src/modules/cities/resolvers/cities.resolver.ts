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
  CitySearchInput,
  CitySuggestion,
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
const citySuggestionListType = graphqlListType(CitySuggestion);
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
  @Query(citySuggestionListType)
  @LogResolver()
  async getCitySuggestions(@Args('input') input: CitySearchInput) {
    return this.citiesService.getCitySuggestions(input.query);
  }

  @UseGuards(AccessJwtGuard)
  @Query(cityOutputListType)
  @LogResolver()
  async getSavedCities(
    @CurrentUser() user: ICurrentUser,
  ): Promise<CityOutput[]> {
    return this.citiesQueryService.getSavedCities({
      userId: user.id,
    });
  }

  @UseGuards(AccessJwtGuard)
  @Query(citiesConnectionType)
  @LogResolver()
  async getSavedCitiesPaginated(
    @CurrentUser() user: ICurrentUser,
    @Args('query') query: CitiesQueryInput,
  ): Promise<CitiesConnection> {
    return this.citiesQueryService.getSavedCitiesPaginated({
      userId: user.id,
      query,
    });
  }

  @UseGuards(AccessJwtGuard)
  @Query(cityOutputType)
  @LogResolver()
  async getCityById(
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
  async getSavedCityByName(
    @CurrentUser() user: ICurrentUser,
    @Args('cityName') cityName: string,
  ): Promise<CityOutput | null> {
    return this.citiesService.getSavedCityByName({
      userId: user.id,
      cityName,
    });
  }

  @UseGuards(AccessJwtGuard)
  @Mutation(cityOutputType)
  @LogResolver()
  async addSavedCity(
    @CurrentUser() user: ICurrentUser,
    @Args('input') input: AddCityInput,
  ) {
    return this.citiesService.addSavedCity({
      userId: user.id,
      input,
    });
  }

  @UseGuards(AccessJwtGuard)
  @Mutation(cityOutputType)
  @LogResolver()
  async removeSavedCity(
    @CurrentUser() user: ICurrentUser,
    @Args('id', { type: graphqlIdType }) id: string,
  ): Promise<CityOutput> {
    return this.citiesService.removeSavedCity({
      userId: user.id,
      id,
    });
  }

  @UseGuards(AccessJwtGuard)
  @Mutation(booleanType)
  @LogResolver()
  async removeAllSavedCities(
    @CurrentUser() user: ICurrentUser,
  ): Promise<boolean> {
    await this.citiesService.removeAllSavedCities({
      userId: user.id,
    });

    return true;
  }

  @UseGuards(AccessJwtGuard)
  @Mutation(cityOutputType)
  @LogResolver()
  async updateSavedCity(
    @CurrentUser() user: ICurrentUser,
    @Args('id', { type: graphqlIdType }) id: string,
    @Args('input') input: UpdateCityInput,
  ): Promise<CityOutput> {
    return this.citiesService.updateSavedCity({
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
