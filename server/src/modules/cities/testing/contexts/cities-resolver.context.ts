import { CitiesResolver } from '@cities/resolvers/cities.resolver';
import { CitiesService, CitiesQueryService } from '@cities/services';
import { WeatherService } from '@weather/services';
import { AppLoggerService } from '@logger/services';
import { AccessJwtGuard } from '@auth/guards';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthCookieService } from '@auth/services';
import { createLoggerMock } from '@shared/testing/mocks/logger.mock';
import { createContext } from '@shared/testing/utils/create-context';

export function createCitiesServiceMock() {
  return {
    getCityById: jest.fn(),
    getCityByName: jest.fn(),
    addCity: jest.fn(),
    removeCity: jest.fn(),
    removeAllCities: jest.fn(),
    togglePinnedCity: jest.fn(),
  };
}

export function createCitiesQueryServiceMock() {
  return {
    getCities: jest.fn(),
    getCitiesPaginated: jest.fn(),
  };
}

export function createWeatherServiceMock() {
  return {
    getWeatherPreview: jest.fn(),
  };
}

export type CitiesResolverTestContext = {
  resolver: CitiesResolver;
  citiesService: ReturnType<typeof createCitiesServiceMock>;
  citiesQueryService: ReturnType<typeof createCitiesQueryServiceMock>;
  weatherService: ReturnType<typeof createWeatherServiceMock>;
  logger: ReturnType<typeof createLoggerMock>;
};

export async function createCitiesResolverContext(): Promise<CitiesResolverTestContext> {
  const citiesService = createCitiesServiceMock();
  const citiesQueryService = createCitiesQueryServiceMock();
  const weatherService = createWeatherServiceMock();
  const logger = createLoggerMock();

  const resolver = await createContext(CitiesResolver, [
    { provide: CitiesService, useValue: citiesService },
    { provide: CitiesQueryService, useValue: citiesQueryService },
    { provide: WeatherService, useValue: weatherService },
    { provide: AppLoggerService, useValue: logger },
    {
      provide: AccessJwtGuard,
      useValue: { canActivate: jest.fn().mockResolvedValue(true) },
    },
    {
      provide: JwtService,
      useValue: { verifyAsync: jest.fn() },
    },
    {
      provide: ConfigService,
      useValue: { get: jest.fn() },
    },
    {
      provide: AuthCookieService,
      useValue: {
        getRefreshToken: jest.fn(),
        getAccessToken: jest.fn(),
      },
    },
  ]);

  return {
    resolver,
    citiesService,
    citiesQueryService,
    weatherService,
    logger,
  };
}
