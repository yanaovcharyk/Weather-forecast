import {
  currentWeatherFixture,
  currentWeatherTimezoneZeroFixture,
} from '@weather/test/fixtures/current-weather.fixture';
import {
  forecastFixture,
  forecastTimezoneZeroFixture,
} from '@weather/test/fixtures/forecast.fixture';
import {
  mapCurrentWeather,
  mapDailyForecast,
  mapHourlyForecast,
  mapTodayTemperatureRange,
  mapWeatherPreview,
} from './weather-mappers';
import { IOpenWeatherForecastItem } from '@weather/interfaces';

describe('Weather Mappers', () => {
  it('mapCurrentWeather should map fields correctly', () => {
    const result = mapCurrentWeather(
      currentWeatherFixture,
      forecastFixture.list,
      7200,
    );
    expect(result.temp).toBe(Math.round(currentWeatherFixture.main.temp));
    expect(result.sunrise).toBeDefined();
    expect(result.sunset).toBeDefined();
    expect(result.min).toEqual(expect.any(Number));
    expect(result.max).toEqual(expect.any(Number));
  });

  it('mapCurrentWeather should handle timezone 0', () => {
    const result = mapCurrentWeather(
      currentWeatherTimezoneZeroFixture,
      forecastTimezoneZeroFixture.list,
      0,
    );
    expect(result.sunrise).toBeDefined();
    expect(result.sunset).toBeDefined();
  });

  it('mapHourlyForecast should map first 9 items', () => {
    const result = mapHourlyForecast(forecastFixture.list, 7200);
    expect(result).toHaveLength(9);
    expect(result[0]).toHaveProperty('time');
    expect(result[0]).toHaveProperty('temp');
    expect(result[0]).toHaveProperty('feelsLike');
    expect(result[0]).toHaveProperty('icon');
  });

  it('mapDailyForecast should aggregate by date', () => {
    const result = mapDailyForecast(forecastFixture.list);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty('date');
    expect(result[0]).toHaveProperty('min');
    expect(result[0]).toHaveProperty('max');
    expect(result[0]).toHaveProperty('description');
    expect(result[0]).toHaveProperty('icon');
  });

  it('mapDailyForecast should handle timezone 0 and empty list', () => {
    const result = mapDailyForecast(forecastTimezoneZeroFixture.list);
    expect(Array.isArray(result)).toBe(true);
  });

  it('mapDailyForecast should handle missing pop values (fallback to 0)', () => {
    const listWithoutPop = forecastFixture.list.map(({ pop, ...rest }) => rest);

    const result = mapDailyForecast(listWithoutPop);

    expect(result[0].pop).toBeDefined();
    expect(typeof result[0].pop).toBe('number');
  });

  it('mapTodayTemperatureRange should return numeric min and max', () => {
    const result = mapTodayTemperatureRange(forecastFixture.list);

    expect(result.min).toEqual(expect.any(Number));
    expect(result.max).toEqual(expect.any(Number));
    expect(result.min).toBeLessThanOrEqual(result.max);
  });

  it('mapWeatherPreview should return preview with next3Days', () => {
    const result = mapWeatherPreview(forecastFixture.list);

    expect(result.temperature).toEqual(expect.any(Number));
    expect(result.min).toEqual(expect.any(Number));
    expect(result.max).toEqual(expect.any(Number));
    expect(result.description).toEqual(expect.any(String));
    expect(result.next3Days).toHaveLength(3);
    expect(result.next3Days[0]).toHaveProperty('min');
    expect(result.next3Days[0]).toHaveProperty('max');
    expect(result.next3Days[0]).toHaveProperty('description');
  });

  it('mapWeatherPreview should fallback to empty description when missing', () => {
    const listWithoutWeather = forecastFixture.list.map((item, idx) =>
      idx === 0 ? { ...item, weather: [] } : item,
    );

    const result = mapWeatherPreview(listWithoutWeather);

    expect(result.description).toBe('');
  });

  it('mapTodayTemperatureRange should use todayForecasts when data for today exists', () => {
    const today = new Date().toISOString().split('T')[0];

    const forecastWithToday: IOpenWeatherForecastItem[] = [
      {
        ...forecastFixture.list [0],
        dt_txt: `${today} 12:00:00`,
        main: {
          ...forecastFixture.list[0].main,
          temp_min: 10,
          temp_max: 20,
        },
      },
      {
        ...forecastFixture.list[1],
        dt_txt: `${today} 15:00:00`,
        main: {
          ...forecastFixture.list[1].main,
          temp_min: 5,
          temp_max: 25,
        },
      },
    ];

    const result = mapTodayTemperatureRange(forecastWithToday);

    expect(result.min).toBe(5);
    expect(result.max).toBe(25);
  });
});
