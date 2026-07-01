import { CitiesService } from '@cities/services/cities.service';
import { OpenWeatherCityApiService } from '@cities/services';
import { CityEntity } from '@cities/entities';
import { AppLoggerService } from '@logger/services';
import { getRepositoryToken } from '@nestjs/typeorm';

import { createLoggerMock } from '@shared/testing/mocks/logger.mock';
import { createContext } from '@shared/testing/utils/create-context';

import { createCityRepositoryMock } from '@cities/testing/mocks/city-repository.mock';

export type CitiesServiceTestContext = {
  service: CitiesService;
  repo: ReturnType<typeof createCityRepositoryMock>;
  openWeatherCityApi: { getCitySuggestions: jest.Mock };
  logger: ReturnType<typeof createLoggerMock>;
};

export async function createCitiesServiceContext(): Promise<CitiesServiceTestContext> {
  const repo = createCityRepositoryMock();
  const openWeatherCityApi = {
    getCitySuggestions: jest.fn(),
  };
  const logger = createLoggerMock();

  const service = await createContext(CitiesService, [
    {
      provide: getRepositoryToken(CityEntity),
      useValue: repo,
    },
    {
      provide: OpenWeatherCityApiService,
      useValue: openWeatherCityApi,
    },
    {
      provide: AppLoggerService,
      useValue: logger,
    },
  ]);

  return {
    service,
    repo,
    openWeatherCityApi,
    logger,
  };
}
