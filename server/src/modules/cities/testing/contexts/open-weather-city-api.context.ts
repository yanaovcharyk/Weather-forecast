import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { OpenWeatherCityApiService } from '@cities/services';

export function createHttpServiceMock() {
  return {
    get: jest.fn(),
  };
}

export const cityOpenWeatherConfigMock = {
  apiKey: 'test-key',
  geoBaseUrl: 'http://geo',
};

export type OpenWeatherCityApiTestContext = {
  service: OpenWeatherCityApiService;
  httpService: ReturnType<typeof createHttpServiceMock>;
  openWeatherConfig: typeof cityOpenWeatherConfigMock;
};

export async function createOpenWeatherCityApiContext(): Promise<OpenWeatherCityApiTestContext> {
  const httpService = createHttpServiceMock();

  const module: TestingModule = await Test.createTestingModule({
    providers: [
      OpenWeatherCityApiService,
      {
        provide: HttpService,
        useValue: httpService,
      },
      {
        provide: 'CITY_OPEN_WEATHER_CONFIG',
        useValue: cityOpenWeatherConfigMock,
      },
    ],
  }).compile();

  return {
    service: module.get(OpenWeatherCityApiService),
    httpService,
    openWeatherConfig: cityOpenWeatherConfigMock,
  };
}
