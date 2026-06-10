import { Test, TestingModule } from '@nestjs/testing';
import { WeatherResolver } from '@weather/resolvers/weather.resolver';
import { WeatherService } from '@weather/services';
import { AppLoggerService } from '@logger/services';
import { AccessJwtGuard } from '@auth/guards';
import { createLoggerMock } from '@test/mocks/logger.mock';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthCookieService } from '../../../auth/services';

export function createWeatherServiceMock() {
  return {
    searchCities: jest.fn(),
    getWeatherDetails: jest.fn(),
  };
}

export type WeatherResolverTestContext = {
  resolver: WeatherResolver;
  weatherService: ReturnType<typeof createWeatherServiceMock>;
  logger: ReturnType<typeof createLoggerMock>;
};

export async function createWeatherResolverContext(): Promise<WeatherResolverTestContext> {
  const weatherService = createWeatherServiceMock();
  const logger = createLoggerMock();

  const module: TestingModule = await Test.createTestingModule({
    providers: [
      WeatherResolver,
      { provide: WeatherService, useValue: weatherService },
      { provide: AppLoggerService, useValue: { child: jest.fn().mockReturnValue(logger) } },
      {
        provide: AccessJwtGuard,
        useValue: { canActivate: jest.fn().mockResolvedValue(true) },
      },
      { provide: JwtService, useValue: { verifyAsync: jest.fn() } },
      { provide: ConfigService, useValue: { get: jest.fn() } },
      { provide: AuthCookieService, useValue: { getRefreshToken: jest.fn(), getAccessToken: jest.fn() } },
    ],
  }).overrideGuard(AccessJwtGuard)
    .useValue({ canActivate: jest.fn().mockResolvedValue(true) })
    .compile();

  return {
    resolver: module.get(WeatherResolver),
    weatherService,
    logger,
  };
}
