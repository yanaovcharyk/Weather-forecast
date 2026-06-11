import { CitiesQueryService } from '@cities/services/cities-query.service';
import { CityEntity } from '@cities/entities';
import { AppLoggerService } from '@logger/services';
import { createLoggerMock } from '@test/mocks/logger.mock';
import { createContext } from '@test/utils/create-context';
import { createCityRepositoryMock } from '../mocks/city-repository.mock';
import { getRepositoryToken } from '@nestjs/typeorm';

export type CitiesQueryServiceTestContext = {
  service: CitiesQueryService;
  repo: ReturnType<typeof createCityRepositoryMock>;
  logger: ReturnType<typeof createLoggerMock>;
};

export async function createCitiesQueryServiceContext(): Promise<CitiesQueryServiceTestContext> {
  const repo = createCityRepositoryMock();
  const logger = createLoggerMock();

  const service = await createContext(CitiesQueryService, [
    { 
      provide: AppLoggerService,
      useValue: logger },
    {
      provide: getRepositoryToken(CityEntity),
      useValue: repo,
    },
  ]);

  return { service, repo, logger };
}

