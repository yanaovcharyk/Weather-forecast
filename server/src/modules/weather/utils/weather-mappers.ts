import {
  IDailyWeather,
  IHourlyWeather,
  IOpenWeatherCurrent,
  IOpenWeatherForecast,
  IWeatherCurrent,
  IOpenWeatherForecastItem,
  IWeatherPreviewOutput,
  ITodayTemperatureRange,
} from '@weather/interfaces';

import {
  calculateAverageBy,
  formatUnixTime,
  groupForecastByDate,
} from '@weather/utils';

import { getRoundedMinMax } from './get-rounded-min-max.util';
import { getTemperatureRange } from './get-temperature-range.util';

export function mapCurrentWeather(
  current: IOpenWeatherCurrent,
  forecast: IOpenWeatherForecastItem[],
  timezone: number,
): IWeatherCurrent {
  const { min, max } = mapTodayTemperatureRange(forecast);

  const weather: IWeatherCurrent = {
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

  return weather;
}

export function mapHourlyForecast(
  forecastList: IOpenWeatherForecast['list'],
  timezone: number,
): IHourlyWeather[] {
  return forecastList.slice(0, 9).map((item) => {
    const hourlyWeather: IHourlyWeather = {
      time: formatUnixTime(item.dt, timezone),
      temp: Math.round(item.main.temp),
      feelsLike: Math.round(item.main.feels_like),
      icon: item.weather[0].icon,
    };

    return hourlyWeather;
  });
}

export function mapDailyForecast(
  forecastList: IOpenWeatherForecast['list'],
): IDailyWeather[] {
  const groupedForecastByDay = groupForecastByDate(forecastList);

  return Object.entries(groupedForecastByDay)
    .slice(1, 4)
    .map(([date, items]) => {
      const { min, max } = getRoundedMinMax(items, (item) => item.main.temp);
      const humidity = calculateAverageBy(items, (item) => item.main.humidity);
      const pressure = calculateAverageBy(items, (item) => item.main.pressure);
      const clouds = calculateAverageBy(items, (item) => item.clouds.all);
      const windSpeed = calculateAverageBy(items, (item) => item.wind.speed);
      const feelsLike = calculateAverageBy(
        items,
        (item) => item.main.feels_like,
      );
      const pop = Math.round(
        calculateAverageBy(items, (item) => item.pop ?? 0) * 100,
      );
      const dailyWeather: IDailyWeather = {
        date,
        min,
        max,
        description: items[0].weather[0].description,
        icon: items[0].weather[0].icon,
        humidity,
        pressure,
        clouds,
        windSpeed,
        feelsLike,
        pop,
      };

      return dailyWeather;
    });
}

export function mapTodayTemperatureRange(
  forecast: IOpenWeatherForecastItem[],
): ITodayTemperatureRange {
  const today = new Date().toISOString().split('T')[0];

  const todayItems = forecast.filter((item) => item.dt_txt.startsWith(today));

  const temperatureRange = todayItems.length
    ? getTemperatureRange(
        todayItems,
        (item) => item.main.temp_min,
        (item) => item.main.temp_max,
      )
    : getRoundedMinMax(forecast, (item) => item.main.temp);

  return temperatureRange;
}

export function mapWeatherPreview(
  list: IOpenWeatherForecastItem[],
): IWeatherPreviewOutput {
  const currentLike = list[0];

  const dailyForecast = mapDailyForecast(list);

  const { min, max } = mapTodayTemperatureRange(list);

  const next3Days = dailyForecast.map((day) => ({
    min: day.min,
    max: day.max,
    description: day.description,
  }));

  const preview: IWeatherPreviewOutput = {
    temperature: Math.round(currentLike.main.temp),
    min,
    max,
    description: currentLike.weather?.[0]?.description ?? '',
    next3Days,
  };

  return preview;
}
