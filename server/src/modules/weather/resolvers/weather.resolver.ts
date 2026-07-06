import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { WeatherService } from '@weather/services';
import { WeatherDetailsOutput, GetWeatherInput } from '@weather/dto';
import { AppLoggerService } from '@logger/services';
import { LogResolver } from '@logger/index';
import { AccessJwtGuard } from '@auth/guards';

@Resolver()
export class WeatherResolver {
  private readonly logger;
  constructor(
    private readonly weatherService: WeatherService,
    loggerService: AppLoggerService,
  ) {
    this.logger = loggerService.child(WeatherResolver.name);
  }

  @UseGuards(AccessJwtGuard)
  @Query(() => WeatherDetailsOutput)
  @LogResolver()
  async getWeatherDetails(
    @Args('input') input: GetWeatherInput,
  ): Promise<WeatherDetailsOutput> {
    return this.weatherService.getWeatherDetails(input);
  }
}
