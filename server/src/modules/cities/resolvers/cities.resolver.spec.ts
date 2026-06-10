import {
  CitiesResolverTestContext,
  createCitiesResolverContext,
} from '../../test/cities/contexts/cities-resolver.context';

describe('CitiesResolver', () => {
  let ctx: CitiesResolverTestContext;
  const user = { id: 'u1' };

  beforeEach(async () => {
    ctx = await createCitiesResolverContext();
  });

  it('cities should call getCities with userId', async () => {
    ctx.citiesQueryService.getCities.mockResolvedValue([
      { id: '1', city: 'Kyiv', lat: 50, lon: 30, isPinned: false },
    ]);

    const result = await ctx.resolver.cities(user);

    expect(ctx.citiesQueryService.getCities).toHaveBeenCalledWith({ userId: 'u1' });
    expect(result).toEqual([
      { id: '1', city: 'Kyiv', lat: 50, lon: 30, isPinned: false },
    ]);
  });

  it('city should call getCityById with userId and id', async () => {
    const city = { id: '1', city: 'Kyiv', lat: 50, lon: 30, isPinned: false };
    ctx.citiesService.getCityById.mockResolvedValue(city);

    const result = await ctx.resolver.city(user, '1');

    expect(ctx.citiesService.getCityById).toHaveBeenCalledWith({ userId: 'u1', id: '1' });
    expect(result).toEqual(city);
  });

  it('cityByName should call getCityByName', async () => {
    const city = { id: '2', city: 'Lviv', lat: 49, lon: 24, isPinned: false };
    ctx.citiesService.getCityByName.mockResolvedValue(city);

    const result = await ctx.resolver.cityByName(user, 'Lviv');

    expect(ctx.citiesService.getCityByName).toHaveBeenCalledWith({ userId: 'u1', city: 'Lviv' });
    expect(result).toEqual(city);
  });

  it('addCity should call service.addCity', async () => {
    const city = { id: '3', city: 'Odesa', lat: 46, lon: 30, isPinned: false };
    ctx.citiesService.addCity.mockResolvedValue(city);

    const result = await ctx.resolver.addCity(user, { city: 'Odesa', lat: 46, lon: 30 });

    expect(ctx.citiesService.addCity).toHaveBeenCalledWith({
      userId: 'u1',
      input: { city: 'Odesa', lat: 46, lon: 30 },
    });
    expect(result).toEqual(city);
  });

  it('removeCity should call service.removeCity', async () => {
    const city = { id: '4', city: 'Dnipro', lat: 48, lon: 35, isPinned: false };
    ctx.citiesService.removeCity.mockResolvedValue(city);

    const result = await ctx.resolver.removeCity(user, '4');

    expect(ctx.citiesService.removeCity).toHaveBeenCalledWith({ userId: 'u1', id: '4' });
    expect(result).toEqual(city);
  });

  it('removeAllCities should call service.removeAllCities and return true', async () => {
    ctx.citiesService.removeAllCities.mockResolvedValue(undefined);

    const result = await ctx.resolver.removeAllCities(user);

    expect(ctx.citiesService.removeAllCities).toHaveBeenCalledWith({ userId: 'u1' });
    expect(result).toBe(true);
  });

  it('togglePinnedCity should call service.togglePinned', async () => {
    const city = { id: '5', city: 'Kharkiv', lat: 50, lon: 36, isPinned: true };
    ctx.citiesService.togglePinned.mockResolvedValue(city);

    const result = await ctx.resolver.togglePinnedCity(user, '5');

    expect(ctx.citiesService.togglePinned).toHaveBeenCalledWith({ userId: 'u1', id: '5' });
    expect(result).toEqual(city);
  });

  it('weather should call weatherService.getWeatherPreview', async () => {
    const city = { id: '6', city: 'Sumy', lat: 50, lon: 30, isPinned: false };
    const weather = {
      temperature: 20,
      description: 'Sunny',
      next3DaysTemperature: [21, 22, 23],
      next3DaysDescription: ['Clear', 'Cloudy', 'Rain'],
    };
    ctx.weatherService.getWeatherPreview.mockResolvedValue(weather);

    const result = await ctx.resolver.weather(city);

    expect(ctx.weatherService.getWeatherPreview).toHaveBeenCalledWith({ lat: 50, lon: 30 });
    expect(result).toEqual(weather);
  });
});

