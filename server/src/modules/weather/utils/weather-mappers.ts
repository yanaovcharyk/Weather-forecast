import {
  IDailyWeather,
  IHourlyWeather,
  IOpenWeatherCurrent,
  IOpenWeatherForecast,
  IWeatherCurrent,
  IOpenWeatherForecastItem,
  IWeatherPreviewOutput,
} from '@weather/interfaces';
import {
  calculateAverage,
  formatUnixTime,
  groupForecastByDate,
} from '../utils';

export interface ITodayTemperatureRange {
  min: number;
  max: number;
}

export function mapCurrentWeather(
  current: IOpenWeatherCurrent,
  forecast: IOpenWeatherForecastItem[],
  timezone: number,
): IWeatherCurrent {
  const { min, max } = mapTodayTemperatureRange(forecast);

  return {
    temp: Math.round(current.main.temp),
    min,
    max,
    feelsLike: Math.round(current.main.feels_like),
    humidity: current.main.humidity,
    windSpeed: current.wind.speed,
    pressure: current.main.pressure,
    description: current.weather[0].description,
    icon: current.weather[0].icon,
    sunrise: formatUnixTime(current.sys.sunrise, timezone),
    sunset: formatUnixTime(current.sys.sunset, timezone),
  };
}

export function mapHourlyForecast(
  forecastList: IOpenWeatherForecast['list'],
  timezone: number,
): IHourlyWeather[] {
  return forecastList.slice(0, 9).map((item) => ({
    time: formatUnixTime(item.dt, timezone),
    temp: Math.round(item.main.temp),
    feelsLike: Math.round(item.main.feels_like),
    icon: item.weather[0].icon,
  }));
}

export function mapDailyForecast(
  forecastList: IOpenWeatherForecast['list'],
): IDailyWeather[] {
  const groupedForecastByDay = groupForecastByDate(forecastList);

  return Object.entries(groupedForecastByDay)
    .slice(1, 4)
    .map(([date, items]) => {
      const stats = items.reduce(
        (acc, item) => {
          acc.min = Math.min(acc.min, item.main.temp);
          acc.max = Math.max(acc.max, item.main.temp);

          acc.humidity += item.main.humidity;
          acc.pressure += item.main.pressure;
          acc.clouds += item.clouds.all;
          acc.windSpeed += item.wind.speed;
          acc.pop += item.pop ?? 0;
          acc.feelsLike += item.main.feels_like;

          return acc;
        },
        {
          min: Infinity,
          max: -Infinity,
          humidity: 0,
          pressure: 0,
          clouds: 0,
          windSpeed: 0,
          pop: 0,
          feelsLike: 0,
        },
      );

      const count = items.length;

      return {
        date,
        min: Math.round(stats.min),
        max: Math.round(stats.max),
        description: items[0].weather[0].description,
        icon: items[0].weather[0].icon,
        humidity: stats.humidity / count,
        pressure: stats.pressure / count,
        clouds: stats.clouds / count,
        windSpeed: stats.windSpeed / count,
        pop: Math.round((stats.pop / count) * 100),
        feelsLike: stats.feelsLike / count,
      };
    });
}

export function mapTodayTemperatureRange(
  forecast: IOpenWeatherForecastItem[],
): ITodayTemperatureRange {
  const today = new Date().toISOString().split('T')[0];

  let min = Infinity;
  let max = -Infinity;
  let foundToday = false;

  for (const item of forecast) {
    const isToday = item.dt_txt.startsWith(today);

    if (isToday) {
      foundToday = true;
      min = Math.min(min, item.main.temp_min);
      max = Math.max(max, item.main.temp_max);
    }
  }

  if (foundToday) {
    return {
      min: Math.round(min),
      max: Math.round(max),
    };
  }

  min = Infinity;
  max = -Infinity;

  for (const item of forecast) {
    min = Math.min(min, item.main.temp);
    max = Math.max(max, item.main.temp);
  }

  return {
    min: Math.round(min),
    max: Math.round(max),
  };
}

export function mapWeatherPreview(
  list: IOpenWeatherForecastItem[],
): IWeatherPreviewOutput {
  const currentLike = list[0];

  const daily = mapDailyForecast(list);

  const { min, max } = mapTodayTemperatureRange(list);

  return {
    temperature: Math.round(currentLike.main.temp),
    min,
    max,
    description: currentLike.weather?.[0]?.description ?? '',
    next3Days: daily.map((day) => ({
      min: day.min,
      max: day.max,
      description: day.description,
    })),
  };
}
