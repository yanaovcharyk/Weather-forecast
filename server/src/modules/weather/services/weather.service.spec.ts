import { of } from 'rxjs';
import { createWeatherServiceContext, WeatherServiceTestContext } from '../../test/weather/contexts/weather-service.context';

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
      params: { q: 'Kyiv', limit: 5, appid: 'test-key' },
    });
    expect(result).toEqual([
      { name: 'Kyiv', country: 'UA', lat: 50, lon: 30 },
      { name: 'Lviv', country: 'UA', lat: 49, lon: 24 },
    ]);
    expect(ctx.logger.info).toHaveBeenCalledWith('searchCities: API response received', {
      durationMs: expect.any(Number),
      count: 2,
    });
  });

  it('getWeatherDetails should call httpService.get twice and return structured data', async () => {
    const currentRes = {
      data: {
        main: { temp: 20, feels_like: 19, humidity: 60, pressure: 1012 },
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
            main: { temp: 20, feels_like: 19, humidity: 60, pressure: 1012 },
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

    const result = await ctx.service.getWeatherDetails({ lat: 50, lon: 30 });

    expect(ctx.httpService.get).toHaveBeenCalledTimes(2);
    expect(result.current.temp).toBe(20);
    expect(result.hourly.length).toBeGreaterThanOrEqual(1);
    expect(result.daily.length).toBeGreaterThanOrEqual(0);
    expect(ctx.logger.info).toHaveBeenCalledWith('getWeatherDetails: API responses received', {
      durationMs: expect.any(Number),
      forecastItems: 1,
    });
  });

  it('getWeatherPreview should call getWeatherDetails and return simplified data', async () => {
    const mockDetails = {
      coordinates: { lat: 50, lon: 30 },
      current: { temp: 20, description: 'Sunny' },
      daily: [
        { max: 22, description: 'Clear' },
        { max: 23, description: 'Cloudy' },
        { max: 24, description: 'Rain' },
      ],
    };
    jest.spyOn(ctx.service, 'getWeatherDetails').mockResolvedValue(mockDetails as any);

    const result = await ctx.service.getWeatherPreview({ lat: 50, lon: 30 });

    expect(ctx.service.getWeatherDetails).toHaveBeenCalledWith({ lat: 50, lon: 30 });
    expect(result).toEqual({
      temperature: 20,
      description: 'Sunny',
      next3DaysTemperature: [22, 23, 24],
      next3DaysDescription: ['Clear', 'Cloudy', 'Rain'],
    });
    expect(ctx.logger.info).toHaveBeenCalledWith('getWeatherPreview: processed');
  });
});
