import {
  CitiesResolverTestContext,
  createCitiesResolverContext,
} from '@cities/testing/contexts/cities-resolver.context';

describe('CitiesResolver', () => {
  let ctx: CitiesResolverTestContext;
  const user = { id: 'u1' };

  beforeEach(async () => {
    ctx = await createCitiesResolverContext();
    jest.clearAllMocks();
  });

  // it('should initialize child logger', () => {
  //   expect(ctx.logger.child).toHaveBeenCalledWith('CitiesResolver');
  // });

  it('cities should call getCities with userId', async () => {
    ctx.citiesQueryService.getCities.mockResolvedValue([
      { id: '1', city: 'Kyiv', lat: 50, lon: 30, isPinned: false },
    ]);

    const result = await ctx.resolver.cities(user);

    expect(ctx.citiesQueryService.getCities).toHaveBeenCalledWith({
      userId: 'u1',
    });
    expect(result).toEqual([
      { id: '1', city: 'Kyiv', lat: 50, lon: 30, isPinned: false },
    ]);
  });

  it('should propagate error from cities', async () => {
    ctx.citiesQueryService.getCities.mockRejectedValue(new Error('fail'));

    await expect(ctx.resolver.cities(user)).rejects.toThrow('fail');
  });

  it('citiesPaginated should call getCitiesPaginated', async () => {
    const query = { limit: 10, cursor: null };

    const response = {
      nodes: [],
      pageInfo: { hasNextPage: false, endCursor: null },
    };

    ctx.citiesQueryService.getCitiesPaginated.mockResolvedValue(response);

    const result = await ctx.resolver.citiesPaginated(user, query as any);

    expect(ctx.citiesQueryService.getCitiesPaginated).toHaveBeenCalledWith({
      userId: 'u1',
      query,
    });

    expect(result).toEqual(response);
  });

  it('should propagate error from citiesPaginated', async () => {
    ctx.citiesQueryService.getCitiesPaginated.mockRejectedValue(
      new Error('fail'),
    );

    await expect(ctx.resolver.citiesPaginated(user, {} as any)).rejects.toThrow(
      'fail',
    );
  });

  it('city should call getCityById with userId and id', async () => {
    const city = { id: '1', city: 'Kyiv', lat: 50, lon: 30, isPinned: false };
    ctx.citiesService.getCityById.mockResolvedValue(city);

    const result = await ctx.resolver.city(user, '1');

    expect(ctx.citiesService.getCityById).toHaveBeenCalledWith({
      userId: 'u1',
      id: '1',
    });
    expect(result).toEqual(city);
  });

  it('should propagate error from city', async () => {
    ctx.citiesService.getCityById.mockRejectedValue(new Error('fail'));

    await expect(ctx.resolver.city(user, '1')).rejects.toThrow('fail');
  });

  it('cityByName should call getCityByName', async () => {
    const city = { id: '2', city: 'Lviv', lat: 49, lon: 24, isPinned: false };
    ctx.citiesService.getCityByName.mockResolvedValue(city);

    const result = await ctx.resolver.cityByName(user, 'Lviv');

    expect(ctx.citiesService.getCityByName).toHaveBeenCalledWith({
      userId: 'u1',
      city: 'Lviv',
    });

    expect(result).toEqual(city);
  });

  it('cityByName should return null', async () => {
    ctx.citiesService.getCityByName.mockResolvedValue(null);

    const result = await ctx.resolver.cityByName(user, 'Unknown');

    expect(result).toBeNull();
  });

  it('should propagate error from cityByName', async () => {
    ctx.citiesService.getCityByName.mockRejectedValue(new Error('fail'));

    await expect(ctx.resolver.cityByName(user, 'X')).rejects.toThrow('fail');
  });

  it('addCity should call service.addCity', async () => {
    const city = { id: '3', city: 'Odesa', lat: 46, lon: 30, isPinned: false };
    ctx.citiesService.addCity.mockResolvedValue(city);

    const result = await ctx.resolver.addCity(user, {
      city: 'Odesa',
      lat: 46,
      lon: 30,
    });

    expect(ctx.citiesService.addCity).toHaveBeenCalledWith({
      userId: 'u1',
      input: { city: 'Odesa', lat: 46, lon: 30 },
    });

    expect(result).toEqual(city);
  });

  it('should propagate error from addCity', async () => {
    ctx.citiesService.addCity.mockRejectedValue(new Error('fail'));

    await expect(
      ctx.resolver.addCity(user, { city: 'Odesa', lat: 46, lon: 30 }),
    ).rejects.toThrow('fail');
  });

  it('removeCity should call service.removeCity', async () => {
    const city = { id: '4', city: 'Dnipro', lat: 48, lon: 35, isPinned: false };
    ctx.citiesService.removeCity.mockResolvedValue(city);

    const result = await ctx.resolver.removeCity(user, '4');

    expect(ctx.citiesService.removeCity).toHaveBeenCalledWith({
      userId: 'u1',
      id: '4',
    });

    expect(result).toEqual(city);
  });

  it('should propagate error from removeCity', async () => {
    ctx.citiesService.removeCity.mockRejectedValue(new Error('fail'));

    await expect(ctx.resolver.removeCity(user, '4')).rejects.toThrow('fail');
  });

  it('removeAllCities should return true', async () => {
    ctx.citiesService.removeAllCities.mockResolvedValue(undefined);

    const result = await ctx.resolver.removeAllCities(user);

    expect(ctx.citiesService.removeAllCities).toHaveBeenCalledWith({
      userId: 'u1',
    });

    expect(result).toBe(true);
  });

  it('should propagate error from removeAllCities', async () => {
    ctx.citiesService.removeAllCities.mockRejectedValue(new Error('fail'));

    await expect(ctx.resolver.removeAllCities(user)).rejects.toThrow('fail');
  });

  it('togglePinnedCity should call service.togglePinned', async () => {
    const city = { id: '5', city: 'Kharkiv', lat: 50, lon: 36, isPinned: true };
    ctx.citiesService.togglePinned.mockResolvedValue(city);

    const result = await ctx.resolver.togglePinnedCity(user, '5');

    expect(ctx.citiesService.togglePinned).toHaveBeenCalledWith({
      userId: 'u1',
      id: '5',
    });

    expect(result).toEqual(city);
  });

  it('should propagate error from togglePinnedCity', async () => {
    ctx.citiesService.togglePinned.mockRejectedValue(new Error('fail'));

    await expect(ctx.resolver.togglePinnedCity(user, '5')).rejects.toThrow(
      'fail',
    );
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

    expect(ctx.weatherService.getWeatherPreview).toHaveBeenCalledWith({
      lat: 50,
      lon: 30,
    });

    expect(result).toEqual(weather);
  });

  it('weather should handle null response', async () => {
    ctx.weatherService.getWeatherPreview.mockResolvedValue(null);

    const result = await ctx.resolver.weather({
      id: 'x',
      city: 'Test',
      lat: 10,
      lon: 20,
    } as any);

    expect(result).toBeNull();
  });

  it('should propagate error from weather', async () => {
    ctx.weatherService.getWeatherPreview.mockRejectedValue(new Error('fail'));

    await expect(
      ctx.resolver.weather({
        id: 'x',
        city: 'Test',
        lat: 10,
        lon: 20,
      } as any),
    ).rejects.toThrow('fail');
  });
});
