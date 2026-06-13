import { IDailyWeather, IHourlyWeather, IOpenWeatherCurrent, IOpenWeatherForecast, IWeatherCurrent, IOpenWeatherForecastItem, IWeatherPreviewOutput } from '@weather/interfaces';
import { calculateAverage, formatUnixTime, groupForecastByDate } from '../utils';

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
  }
};

export function mapHourlyForecast(forecastList: IOpenWeatherForecast['list'], timezone: number): IHourlyWeather[] {
  return forecastList.slice(0, 9).map((item) => ({
    time: formatUnixTime(item.dt, timezone),
    temp: Math.round(item.main.temp),
    feelsLike: Math.round(item.main.feels_like),
    icon: item.weather[0].icon,
  }));
}

export function mapDailyForecast(forecastList: IOpenWeatherForecast['list']): IDailyWeather[] {
  const grouped = groupForecastByDate(forecastList);

  return Object.entries(grouped)
    .slice(1, 4)
    .map(([date, items]) => ({
      date,
      min: Math.round(Math.min(...items.map((i) => i.main.temp))),
      max: Math.round(Math.max(...items.map((i) => i.main.temp))),
      description: items[0].weather[0].description,
      icon: items[0].weather[0].icon,
      humidity: calculateAverage(items.map((i) => i.main.humidity)),
      pressure: calculateAverage(items.map((i) => i.main.pressure)),
      clouds: calculateAverage(items.map((i) => i.clouds.all)),
      windSpeed: calculateAverage(items.map((i) => i.wind.speed)),
      pop: Math.round(calculateAverage(items.map((i) => i.pop ?? 0)) * 100),
      feelsLike: calculateAverage(items.map((i) => i.main.feels_like)),
    }));
}

export function mapTodayTemperatureRange(
  forecast: IOpenWeatherForecastItem[],
): ITodayTemperatureRange {
  const today = new Date().toISOString().split('T')[0];

  const todayForecasts = forecast.filter((item) =>
    item.dt_txt.startsWith(today),
  );

  return {
    min: Math.round(
      Math.min(...todayForecasts.map((item) => item.main.temp_min)),
    ),
    max: Math.round(
      Math.max(...todayForecasts.map((item) => item.main.temp_max)),
    ),
  };
}

export function mapWeatherPreview(list: IOpenWeatherForecastItem[]): IWeatherPreviewOutput {
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
