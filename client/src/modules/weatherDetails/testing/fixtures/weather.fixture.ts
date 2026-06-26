import type {
  CurrentWeather,
  DailyWeather,
  HourlyWeather,
  WeatherDetails,
} from '@/weatherDetails/types';

export const createCurrentWeather = (
  overrides: Partial<CurrentWeather> = {},
): CurrentWeather => ({
  temp: 20,
  min: 15,
  max: 25,
  feelsLike: 18,
  humidity: 70,
  windSpeed: 4,
  pressure: 1012,
  description: 'Clear sky',
  icon: '01d',
  sunrise: '06:00',
  sunset: '20:00',
  ...overrides,
});

export const createDailyWeather = (
  overrides: Partial<DailyWeather> = {},
): DailyWeather => ({
  date: '2026-06-24',
  min: 15,
  max: 25,
  description: 'Sunny',
  icon: '01d',
  humidity: 70,
  pressure: 1012,
  clouds: 10,
  windSpeed: 4,
  pop: 0.1,
  feelsLike: 18,
  ...overrides,
});

export const createHourlyWeather = (
  overrides: Partial<HourlyWeather> = {},
): HourlyWeather => ({
  time: '12:00',
  temp: 20,
  feelsLike: 18,
  icon: '01d',
  ...overrides,
});

export const createWeather = (
  overrides: Partial<WeatherDetails> = {},
): WeatherDetails => ({
  city: 'Kyiv',
  lat: 50.45,
  lon: 30.52,
  current: createCurrentWeather(),
  daily: [createDailyWeather()],
  hourly: [createHourlyWeather()],
  meta: {
    timezone: 'Europe/Kyiv',
  },
  ...overrides,
});
