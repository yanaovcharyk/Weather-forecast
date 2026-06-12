import {
  currentWeatherFixture,
  currentWeatherTimezoneZeroFixture,
} from '@test/weather/fixtures/current-weather.fixture';
import {
  forecastFixture,
  forecastTimezoneZeroFixture,
} from '@test/weather/fixtures/forecast.fixture';
import {
  mapCurrentWeather,
  mapDailyForecast,
  mapHourlyForecast,
} from './weather-mappers';

describe('Weather Mappers', () => {
  it('mapCurrentWeather should map fields correctly', () => {
    const result = mapCurrentWeather(currentWeatherFixture, 7200);
    expect(result.temp).toBe(Math.round(currentWeatherFixture.main.temp));
    expect(result.sunrise).toBeDefined();
    expect(result.sunset).toBeDefined();
  });

  it('mapHourlyForecast should map first 9 items', () => {
    const result = mapHourlyForecast(forecastFixture.list, 7200);
    expect(result).toHaveLength(9);
    expect(result[0]).toHaveProperty('time');
    expect(result[0]).toHaveProperty('temp');
  });

  it('mapDailyForecast should aggregate by date', () => {
    const result = mapDailyForecast(forecastFixture.list);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty('date');
    expect(result[0]).toHaveProperty('min');
    expect(result[0]).toHaveProperty('max');
  });

  it('mapDailyForecast should handle timezone 0 and empty list', () => {
    const result = mapDailyForecast(forecastTimezoneZeroFixture.list);
    expect(Array.isArray(result)).toBe(true);
  });

  it('mapCurrentWeather should handle timezone 0', () => {
    const result = mapCurrentWeather(currentWeatherTimezoneZeroFixture, 0);
    expect(result.sunrise).toBeDefined();
    expect(result.sunset).toBeDefined();
  });

  it('mapDailyForecast should handle missing pop values (fallback to 0)', () => {
    const listWithoutPop = forecastFixture.list.map(({ pop, ...rest }) => rest);

    const result = mapDailyForecast(listWithoutPop);

    expect(result[0].pop).toBeDefined();
    expect(typeof result[0].pop).toBe('number');
  });
});
