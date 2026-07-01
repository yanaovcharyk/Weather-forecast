import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from '@weather/services/weather.service';
import { OpenWeatherApiService } from '@weather/services/open-weather-api.service';
import { createLoggerMock } from '@shared/testing/mocks/logger.mock';
import { AppLoggerService } from '@logger/services';

export function createWeatherApiMock() {
  return {
    getCurrentWeather: jest.fn(),
    getForecast: jest.fn(),
  };
}

export type WeatherServiceTestContext = {
  service: WeatherService;
  weatherApi: ReturnType<typeof createWeatherApiMock>;
  logger: ReturnType<typeof createLoggerMock>;
};

export async function createWeatherServiceContext(): Promise<WeatherServiceTestContext> {
  const weatherApi = createWeatherApiMock();
  const logger = createLoggerMock();

  const module: TestingModule = await Test.createTestingModule({
    providers: [
      WeatherService,
      { provide: OpenWeatherApiService, useValue: weatherApi },
      {
        provide: AppLoggerService,
        useValue: { child: jest.fn().mockReturnValue(logger) },
      },
    ],
  }).compile();

  return {
    service: module.get(WeatherService),
    weatherApi,
    logger,
  };
}
