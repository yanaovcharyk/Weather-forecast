import { CitiesResolver } from '@cities/resolvers/cities.resolver';
import {
  CitiesService,
  CitiesQueryService,
  OpenWeatherCityApiService,
} from '@cities/services';
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
    getSavedCity: jest.fn(),
    addSavedCity: jest.fn(),
    removeSavedCity: jest.fn(),
    removeAllSavedCities: jest.fn(),
    updateSavedCity: jest.fn(),
  };
}

export function createOpenWeatherCityApiMock() {
  return {
    getCitySuggestions: jest.fn(),
  };
}

export function createCitiesQueryServiceMock() {
  return {
    getSavedCities: jest.fn(),
    getSavedCitiesPaginated: jest.fn(),
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
  openWeatherCityApi: ReturnType<typeof createOpenWeatherCityApiMock>;
  weatherService: ReturnType<typeof createWeatherServiceMock>;
  logger: ReturnType<typeof createLoggerMock>;
};

export async function createCitiesResolverContext(): Promise<CitiesResolverTestContext> {
  const citiesService = createCitiesServiceMock();
  const citiesQueryService = createCitiesQueryServiceMock();
  const openWeatherCityApi = createOpenWeatherCityApiMock();
  const weatherService = createWeatherServiceMock();
  const logger = createLoggerMock();

  const resolver = await createContext(CitiesResolver, [
    { provide: CitiesService, useValue: citiesService },
    { provide: CitiesQueryService, useValue: citiesQueryService },
    { provide: OpenWeatherCityApiService, useValue: openWeatherCityApi },
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
    openWeatherCityApi,
    weatherService,
    logger,
  };
}
