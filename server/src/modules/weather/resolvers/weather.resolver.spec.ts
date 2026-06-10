import { createWeatherResolverContext, WeatherResolverTestContext } from "../../test/weather/contexts/weather-resolver.context";

describe('WeatherResolver', () => {
  let ctx: WeatherResolverTestContext;

  beforeEach(async () => {
    ctx = await createWeatherResolverContext();
  });

  it('searchCities should call weatherService.searchCities', async () => {
    const expected = [
      { name: 'Kyiv', country: 'UA', lat: 50, lon: 30 },
      { name: 'Lviv', country: 'UA', lat: 49, lon: 24 },
    ];
    ctx.weatherService.searchCities.mockResolvedValue(expected);

    const result = await ctx.resolver.searchCities({ query: 'Kyiv' });

    expect(ctx.weatherService.searchCities).toHaveBeenCalledWith('Kyiv');
    expect(result).toEqual(expected);
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

    expect(ctx.weatherService.getWeatherDetails).toHaveBeenCalledWith({ lat: 50, lon: 30 });
    expect(result).toEqual(expected);
  });
});
