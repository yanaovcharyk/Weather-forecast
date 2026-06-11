import { CitiesService } from '@cities/services/cities.service';
import { CityEntity } from '@cities/entities';
import { AppLoggerService } from '@logger/services';
import { getRepositoryToken } from '@nestjs/typeorm';

import { createLoggerMock } from '@test/mocks/logger.mock';
import { createContext } from '@test/utils/create-context';

import { createCityRepositoryMock } from '../mocks/city-repository.mock';

export type CitiesServiceTestContext = {
  service: CitiesService;
  repo: ReturnType<typeof createCityRepositoryMock>;
  logger: ReturnType<typeof createLoggerMock>;
};

export async function createCitiesServiceContext(): Promise<CitiesServiceTestContext> {
  const repo = createCityRepositoryMock();
  const logger = createLoggerMock();

  const service = await createContext(CitiesService, [
    {
      provide: getRepositoryToken(CityEntity),
      useValue: repo,
    },
    {
      provide: AppLoggerService,
      useValue: logger,
    },
  ]);

  return {
    service,
    repo,
    logger,
  };
}
