import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { OpenWeatherApiService } from '@weather/services/open-weather-api.service';
import { AppLoggerService } from '@logger/services';
import { createLoggerMock } from '@test/mocks/logger.mock';

export function createHttpServiceMock() {
  return { get: jest.fn() };
}

export type OpenWeatherApiTestContext = {
  service: OpenWeatherApiService;
  httpService: ReturnType<typeof createHttpServiceMock>;
  logger: ReturnType<typeof createLoggerMock>;
};

export async function createOpenWeatherApiContext(): Promise<OpenWeatherApiTestContext> {
  const httpService = createHttpServiceMock();
  const logger = createLoggerMock();

  const module: TestingModule = await Test.createTestingModule({
    providers: [
      OpenWeatherApiService,
      { provide: HttpService, useValue: httpService },
      {
        provide: 'WEATHER_CONFIG',
        useValue: { apiKey: 'test-key', baseUrl: 'http://weather' },
      },
      {
        provide: 'GEO_CONFIG',
        useValue: { baseUrl: 'http://geo' },
      },
      { provide: AppLoggerService, useValue: { child: jest.fn().mockReturnValue(logger) } },
    ],
  }).compile();

  return {
    service: module.get(OpenWeatherApiService),
    httpService,
    logger,
  };
}
