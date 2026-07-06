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

  it('getCitySuggestions should call open weather city api', async () => {
    const expected = [
      { name: 'Kyiv', country: 'UA', lat: 50, lon: 30 },
      { name: 'Lviv', country: 'UA', lat: 49, lon: 24 },
    ];
    ctx.openWeatherCityApi.getCitySuggestions.mockResolvedValue(expected);

    const result = await ctx.resolver.getCitySuggestions({ query: 'Kyiv' });

    expect(ctx.openWeatherCityApi.getCitySuggestions).toHaveBeenCalledWith('Kyiv');
    expect(result).toEqual(expected);
  });

  it('getSavedCities should call getSavedCities with userId', async () => {
    ctx.citiesQueryService.getSavedCities.mockResolvedValue([
      { id: '1', cityName: 'Kyiv', lat: 50, lon: 30, isPinned: false },
    ]);

    const result = await ctx.resolver.getSavedCities(user);

    expect(ctx.citiesQueryService.getSavedCities).toHaveBeenCalledWith({
      userId: 'u1',
    });
    expect(result).toEqual([
      { id: '1', cityName: 'Kyiv', lat: 50, lon: 30, isPinned: false },
    ]);
  });

  it('should propagate error from getSavedCities', async () => {
    ctx.citiesQueryService.getSavedCities.mockRejectedValue(new Error('fail'));

    await expect(ctx.resolver.getSavedCities(user)).rejects.toThrow('fail');
  });

  it('getSavedCitiesPaginated should call getSavedCitiesPaginated', async () => {
    const query = { limit: 10, cursor: null };

    const response = {
      nodes: [],
      pageInfo: { hasNextPage: false, endCursor: null },
    };

    ctx.citiesQueryService.getSavedCitiesPaginated.mockResolvedValue(response);

    const result = await ctx.resolver.getSavedCitiesPaginated(
      user,
      query as any,
    );

    expect(ctx.citiesQueryService.getSavedCitiesPaginated).toHaveBeenCalledWith({
      userId: 'u1',
      query,
    });

    expect(result).toEqual(response);
  });

  it('should propagate error from getSavedCitiesPaginated', async () => {
    ctx.citiesQueryService.getSavedCitiesPaginated.mockRejectedValue(
      new Error('fail'),
    );

    await expect(
      ctx.resolver.getSavedCitiesPaginated(user, {} as any),
    ).rejects.toThrow('fail');
  });

  it('getSavedCity should call getSavedCity with userId and id', async () => {
    const city = {
      id: '1',
      cityName: 'Kyiv',
      lat: 50,
      lon: 30,
      isPinned: false,
    };
    ctx.citiesService.getSavedCity.mockResolvedValue(city);

    const result = await ctx.resolver.getSavedCity(user, '1');

    expect(ctx.citiesService.getSavedCity).toHaveBeenCalledWith({
      userId: 'u1',
      id: '1',
    });
    expect(result).toEqual(city);
  });

  it('getSavedCity should call getSavedCity with userId and cityName', async () => {
    const city = {
      id: '2',
      cityName: 'Lviv',
      lat: 49,
      lon: 24,
      isPinned: false,
    };
    ctx.citiesService.getSavedCity.mockResolvedValue(city);

    const result = await ctx.resolver.getSavedCity(user, undefined, 'Lviv');

    expect(ctx.citiesService.getSavedCity).toHaveBeenCalledWith({
      userId: 'u1',
      cityName: 'Lviv',
    });

    expect(result).toEqual(city);
  });

  it('getSavedCity should return null', async () => {
    ctx.citiesService.getSavedCity.mockResolvedValue(null);

    const result = await ctx.resolver.getSavedCity(user, undefined, 'Unknown');

    expect(result).toBeNull();
  });

  it('should propagate error from getSavedCity', async () => {
    ctx.citiesService.getSavedCity.mockRejectedValue(new Error('fail'));

    await expect(
      ctx.resolver.getSavedCity(user, undefined, 'X'),
    ).rejects.toThrow('fail');
  });

  it('getSavedCity should reject missing lookup args', async () => {
    await expect(
      ctx.resolver.getSavedCity(user, undefined, undefined),
    ).rejects.toThrow('City id or name is required');
  });

  it('addSavedCity should call service.addSavedCity', async () => {
    const city = {
      id: '3',
      cityName: 'Odesa',
      lat: 46,
      lon: 30,
      isPinned: false,
    };
    ctx.citiesService.addSavedCity.mockResolvedValue(city);

    const result = await ctx.resolver.addSavedCity(user, {
      cityName: 'Odesa',
      lat: 46,
      lon: 30,
    });

    expect(ctx.citiesService.addSavedCity).toHaveBeenCalledWith({
      userId: 'u1',
      input: { cityName: 'Odesa', lat: 46, lon: 30 },
    });

    expect(result).toEqual(city);
  });

  it('should propagate error from addSavedCity', async () => {
    ctx.citiesService.addSavedCity.mockRejectedValue(new Error('fail'));

    await expect(
      ctx.resolver.addSavedCity(user, { cityName: 'Odesa', lat: 46, lon: 30 }),
    ).rejects.toThrow('fail');
  });

  it('removeSavedCity should call service.removeSavedCity', async () => {
    const city = {
      id: '4',
      cityName: 'Dnipro',
      lat: 48,
      lon: 35,
      isPinned: false,
    };
    ctx.citiesService.removeSavedCity.mockResolvedValue(city);

    const result = await ctx.resolver.removeSavedCity(user, '4');

    expect(ctx.citiesService.removeSavedCity).toHaveBeenCalledWith({
      userId: 'u1',
      id: '4',
    });

    expect(result).toEqual(city);
  });

  it('should propagate error from removeSavedCity', async () => {
    ctx.citiesService.removeSavedCity.mockRejectedValue(new Error('fail'));

    await expect(ctx.resolver.removeSavedCity(user, '4')).rejects.toThrow(
      'fail',
    );
  });

  it('removeAllSavedCities should return true', async () => {
    ctx.citiesService.removeAllSavedCities.mockResolvedValue(undefined);

    const result = await ctx.resolver.removeAllSavedCities(user);

    expect(ctx.citiesService.removeAllSavedCities).toHaveBeenCalledWith({
      userId: 'u1',
    });

    expect(result).toBe(true);
  });

  it('should propagate error from removeAllSavedCities', async () => {
    ctx.citiesService.removeAllSavedCities.mockRejectedValue(new Error('fail'));

    await expect(ctx.resolver.removeAllSavedCities(user)).rejects.toThrow(
      'fail',
    );
  });

  it('updateSavedCity should call service.updateSavedCity', async () => {
    const city = {
      id: '5',
      cityName: 'Kharkiv',
      lat: 50,
      lon: 36,
      isPinned: true,
    };
    const input = { isPinned: true };
    ctx.citiesService.updateSavedCity.mockResolvedValue(city);

    const result = await ctx.resolver.updateSavedCity(user, '5', input);

    expect(ctx.citiesService.updateSavedCity).toHaveBeenCalledWith({
      userId: 'u1',
      id: '5',
      input,
    });

    expect(result).toEqual(city);
  });

  it('should propagate error from updateSavedCity', async () => {
    ctx.citiesService.updateSavedCity.mockRejectedValue(new Error('fail'));

    await expect(
      ctx.resolver.updateSavedCity(user, '5', { isPinned: true }),
    ).rejects.toThrow('fail');
  });

  it('weather should call weatherService.getWeatherPreview', async () => {
    const city = {
      id: '6',
      cityName: 'Sumy',
      lat: 50,
      lon: 30,
      isPinned: false,
    };

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
      cityName: 'Test',
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
        cityName: 'Test',
        lat: 10,
        lon: 20,
      } as any),
    ).rejects.toThrow('fail');
  });
});
