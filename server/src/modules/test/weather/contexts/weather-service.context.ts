import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { WeatherService } from '@weather/services/weather.service';
import { AppLoggerService } from '@logger/services';
import { createLoggerMock } from '@test/mocks/logger.mock';

export function createHttpServiceMock() {
  return {
    get: jest.fn(),
  };
}

export type WeatherServiceTestContext = {
  service: WeatherService;
  httpService: ReturnType<typeof createHttpServiceMock>;
  logger: ReturnType<typeof createLoggerMock>;
};

export async function createWeatherServiceContext(): Promise<WeatherServiceTestContext> {
  const httpService = createHttpServiceMock();
  const logger = createLoggerMock();

  const module: TestingModule = await Test.createTestingModule({
    providers: [
      WeatherService,
      { provide: HttpService, useValue: httpService },
      {
        provide: 'WEATHER_CONFIG',
        useValue: { apiKey: 'test-key', weatherBaseUrl: 'http://weather' },
      },
      {
        provide: 'GEO_CONFIG',
        useValue: { baseUrl: 'http://geo' },
      },
      { provide: AppLoggerService, useValue: { child: jest.fn().mockReturnValue(logger) } },
    ],
  }).compile();

  return {
    service: module.get(WeatherService),
    httpService,
    logger,
  };
}
