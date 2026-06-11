import { Observable, of } from 'rxjs';
import {
  createWeatherServiceContext,
  WeatherServiceTestContext,
} from '../../test/weather/contexts/weather-service.context';

describe('WeatherService', () => {
  let ctx: WeatherServiceTestContext;

  beforeEach(async () => {
    ctx = await createWeatherServiceContext();
  });

  it('searchCities should call httpService.get and map response', async () => {
    const mockResponse = {
      data: [
        { name: 'Kyiv', country: 'UA', lat: 50, lon: 30 },
        { name: 'Lviv', country: 'UA', lat: 49, lon: 24 },
      ],
    };

    ctx.httpService.get.mockReturnValue(of(mockResponse));

    const result = await ctx.service.searchCities('Kyiv');

    expect(ctx.httpService.get).toHaveBeenCalledWith('http://geo/direct', {
      params: {
        q: 'Kyiv',
        limit: 5,
        appid: 'test-key',
      },
    });

    expect(result).toEqual([
      { name: 'Kyiv', country: 'UA', lat: 50, lon: 30 },
      { name: 'Lviv', country: 'UA', lat: 49, lon: 24 },
    ]);

    expect(ctx.logger.info).toHaveBeenCalledWith(
      'searchCities: API response received',
      {
        durationMs: expect.any(Number),
        count: 2,
      },
    );
  });

  it('searchCities should log count 0 when data is undefined', async () => {
    ctx.httpService.get.mockReturnValue(
      of({
        data: undefined,
      }),
    );

    await expect(ctx.service.searchCities('Kyiv')).rejects.toThrow();

    expect(ctx.logger.info).toHaveBeenCalledWith(
      'searchCities: API response received',
      {
        durationMs: expect.any(Number),
        count: 0,
      },
    );
  });

  it('getWeatherDetails should call httpService.get twice and return structured data', async () => {
    const currentRes = {
      data: {
        main: {
          temp: 20,
          feels_like: 19,
          humidity: 60,
          pressure: 1012,
        },
        wind: { speed: 5 },
        weather: [{ description: 'Sunny', icon: '01d' }],
        sys: { sunrise: 1000, sunset: 2000 },
      },
    };

    const forecastRes = {
      data: {
        city: { timezone: 0 },
        list: [
          {
            dt: 1000,
            dt_txt: '2026-06-10 12:00:00',
            main: {
              temp: 20,
              feels_like: 19,
              humidity: 60,
              pressure: 1012,
            },
            weather: [{ description: 'Sunny', icon: '01d' }],
            clouds: { all: 10 },
            wind: { speed: 5 },
            pop: 0.1,
          },
        ],
      },
    };

    ctx.httpService.get
      .mockReturnValueOnce(of(currentRes))
      .mockReturnValueOnce(of(forecastRes));

    const result = await ctx.service.getWeatherDetails({
      lat: 50,
      lon: 30,
    });

    expect(ctx.httpService.get).toHaveBeenCalledTimes(2);
    expect(result.current.temp).toBe(20);
    expect(result.hourly.length).toBeGreaterThanOrEqual(1);
    expect(result.daily.length).toBeGreaterThanOrEqual(0);

    expect(ctx.logger.info).toHaveBeenCalledWith(
      'getWeatherDetails: API responses received',
      {
        durationMs: expect.any(Number),
        forecastItems: 1,
      },
    );
  });

  it('getWeatherDetails should log forecastItems 0 when list is undefined', async () => {
    const currentRes = {
      data: {
        main: {
          temp: 20,
          feels_like: 19,
          humidity: 60,
          pressure: 1012,
        },
        wind: { speed: 5 },
        weather: [{ description: 'Sunny', icon: '01d' }],
        sys: {
          sunrise: 1000,
          sunset: 2000,
        },
      },
    };

    const forecastRes = {
      data: {
        city: {
          timezone: 0,
        },
        list: undefined,
      },
    };

    ctx.httpService.get
      .mockReturnValueOnce(of(currentRes))
      .mockReturnValueOnce(of(forecastRes));

    await expect(
      ctx.service.getWeatherDetails({
        lat: 50,
        lon: 30,
      }),
    ).rejects.toThrow();

    expect(ctx.logger.info).toHaveBeenCalledWith(
      'getWeatherDetails: API responses received',
      {
        durationMs: expect.any(Number),
        forecastItems: 0,
      },
    );
  });

  it('getWeatherDetails should aggregate daily forecast and handle missing timezone/pop', async () => {
    const currentRes = {
      data: {
        main: {
          temp: 21,
          feels_like: 20,
          humidity: 55,
          pressure: 1010,
        },
        wind: { speed: 4 },
        weather: [{ description: 'Clear', icon: '01d' }],
        sys: {
          sunrise: 1000,
          sunset: 2000,
        },
      },
    };

    const forecastRes = {
      data: {
        city: {},
        list: [
          {
            dt: 1000,
            dt_txt: '2026-06-10 12:00:00',
            main: {
              temp: 20,
              feels_like: 19,
              humidity: 60,
              pressure: 1000,
            },
            weather: [{ description: 'Sunny', icon: '01d' }],
            clouds: { all: 10 },
            wind: { speed: 3 },
          },
          {
            dt: 2000,
            dt_txt: '2026-06-11 12:00:00',
            main: {
              temp: 10,
              feels_like: 8,
              humidity: 80,
              pressure: 1005,
            },
            weather: [{ description: 'Rain', icon: '10d' }],
            clouds: { all: 80 },
            wind: { speed: 7 },
          },
          {
            dt: 3000,
            dt_txt: '2026-06-11 15:00:00',
            main: {
              temp: 14,
              feels_like: 12,
              humidity: 60,
              pressure: 1015,
            },
            weather: [{ description: 'Rain', icon: '10d' }],
            clouds: { all: 60 },
            wind: { speed: 5 },
          },
          {
            dt: 4000,
            dt_txt: '2026-06-12 12:00:00',
            main: {
              temp: 22,
              feels_like: 21,
              humidity: 50,
              pressure: 1020,
            },
            weather: [{ description: 'Cloudy', icon: '02d' }],
            clouds: { all: 30 },
            wind: { speed: 4 },
            pop: 0.5,
          },
          {
            dt: 5000,
            dt_txt: '2026-06-13 12:00:00',
            main: {
              temp: 30,
              feels_like: 29,
              humidity: 40,
              pressure: 1025,
            },
            weather: [{ description: 'Hot', icon: '01d' }],
            clouds: { all: 5 },
            wind: { speed: 2 },
            pop: 0.8,
          },
        ],
      },
    };

    ctx.httpService.get
      .mockReturnValueOnce(of(currentRes))
      .mockReturnValueOnce(of(forecastRes));

    const result = await ctx.service.getWeatherDetails({
      lat: 50,
      lon: 30,
    });

    expect(result.meta?.timezone).toBe('');

    expect(result.daily).toHaveLength(3);

    expect(result.daily[0]).toMatchObject({
      date: '2026-06-11',
      min: 10,
      max: 14,
      description: 'Rain',
      icon: '10d',
      humidity: 70,
      pressure: 1010,
      clouds: 70,
      windSpeed: 6,
      feelsLike: 10,
      pop: 0,
    });

    expect(result.daily[1].pop).toBe(50);
    expect(result.daily[2].pop).toBe(80);

    expect(ctx.logger.info).toHaveBeenCalledWith(
      'getWeatherDetails: processed forecast',
      {
        hourlyCount: 5,
        dailyCount: 3,
      },
    );
  });

  it('getWeatherPreview should call getWeatherDetails and return simplified data', async () => {
    const mockDetails = {
      coordinates: { lat: 50, lon: 30 },
      current: {
        temp: 20,
        description: 'Sunny',
      },
      daily: [
        { max: 22, description: 'Clear' },
        { max: 23, description: 'Cloudy' },
        { max: 24, description: 'Rain' },
      ],
    };

    jest
      .spyOn(ctx.service, 'getWeatherDetails')
      .mockResolvedValue(mockDetails as any);

    const result = await ctx.service.getWeatherPreview({
      lat: 50,
      lon: 30,
    });

    expect(ctx.service.getWeatherDetails).toHaveBeenCalledWith({
      lat: 50,
      lon: 30,
    });

    expect(result).toEqual({
      temperature: 20,
      description: 'Sunny',
      next3DaysTemperature: [22, 23, 24],
      next3DaysDescription: ['Clear', 'Cloudy', 'Rain'],
    });

    expect(ctx.logger.info).toHaveBeenCalledWith(
      'getWeatherPreview: processed',
    );
  });

  it('getWeatherDetails should return timezone string', async () => {
    const currentRes = {
      data: {
        main: {
          temp: 20,
          feels_like: 19,
          humidity: 60,
          pressure: 1012,
        },
        wind: { speed: 5 },
        weather: [{ description: 'Sunny', icon: '01d' }],
        sys: {
          sunrise: 1000,
          sunset: 2000,
        },
      },
    };

    const forecastRes = {
      data: {
        city: {
          timezone: 7200,
        },
        list: [
          {
            dt: 1000,
            dt_txt: '2026-06-10 12:00:00',
            main: {
              temp: 20,
              feels_like: 19,
              humidity: 60,
              pressure: 1012,
            },
            weather: [{ description: 'Sunny', icon: '01d' }],
            clouds: { all: 10 },
            wind: { speed: 5 },
            pop: 0.1,
          },
        ],
      },
    };

    ctx.httpService.get
      .mockReturnValueOnce(of(currentRes))
      .mockReturnValueOnce(of(forecastRes));

    const result = await ctx.service.getWeatherDetails({
      lat: 50,
      lon: 30,
    });

    expect(result.meta?.timezone).toBe('7200');
  });

  it('searchCities should handle empty response array', async () => {
    ctx.httpService.get.mockReturnValue(
      of({
        data: [],
      }),
    );

    const result = await ctx.service.searchCities('Unknown');

    expect(result).toEqual([]);

    expect(ctx.logger.info).toHaveBeenCalledWith(
      'searchCities: API response received',
      {
        durationMs: expect.any(Number),
        count: 0,
      },
    );
  });

  it('getWeatherDetails should handle empty forecast list and timezone 0', async () => {
    const currentRes = {
      data: {
        main: {
          temp: 20,
          feels_like: 18,
          humidity: 50,
          pressure: 1000,
        },
        wind: {
          speed: 3,
        },
        weather: [
          {
            description: 'Clear',
            icon: '01d',
          },
        ],
        sys: {
          sunrise: 1000,
          sunset: 2000,
        },
      },
    };

    const forecastRes = {
      data: {
        city: {
          timezone: 0,
        },
        list: [
          {
            dt: 1000,
            dt_txt: '2026-06-10 12:00:00',
            main: {
              temp: 20,
              feels_like: 19,
              humidity: 60,
              pressure: 1012,
            },
            weather: [
              {
                description: 'Sunny',
                icon: '01d',
              },
            ],
            clouds: {
              all: 10,
            },
            wind: {
              speed: 5,
            },
            pop: 0,
          },
        ],
      },
    };

    ctx.httpService.get
      .mockReturnValueOnce(of(currentRes))
      .mockReturnValueOnce(of(forecastRes));

    const result = await ctx.service.getWeatherDetails({
      lat: 50,
      lon: 30,
    });

    expect(result.meta).toEqual({
      timezone: '0',
    });

    expect(ctx.logger.info).toHaveBeenCalledWith(
      'getWeatherDetails: API responses received',
      {
        durationMs: expect.any(Number),
        forecastItems: 1,
      },
    );
  });
});
