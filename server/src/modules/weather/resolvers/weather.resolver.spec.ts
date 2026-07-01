import {
  createWeatherResolverContext,
  WeatherResolverTestContext,
} from '@weather/testing/contexts';

describe('WeatherResolver', () => {
  let ctx: WeatherResolverTestContext;

  beforeEach(async () => {
    ctx = await createWeatherResolverContext();
  });

  it('getWeatherDetails should call weatherService.getWeatherDetails', async () => {
    const expected = {
      coordinates: { lat: 50, lon: 30 },
      current: { temp: 20, description: 'Sunny' },
      hourly: [],
      daily: [],
      meta: { timezone: '0' },
    };
    ctx.weatherService.getWeatherDetails.mockResolvedValue(expected);

    const result = await ctx.resolver.getWeatherDetails({ lat: 50, lon: 30 });

    expect(ctx.weatherService.getWeatherDetails).toHaveBeenCalledWith({
      lat: 50,
      lon: 30,
    });
    expect(result).toEqual(expected);
  });
});
