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
import { WeatherCondition } from '@weather/enums';

import {
  calculateAverageBy,
  formatUnixTime,
  groupForecastByDate,
} from '@weather/utils';

import { getRoundedMinMax } from './get-rounded-min-max.util';
import { getTemperatureRange } from './get-temperature-range.util';

type WeatherConditionMapping = {
  keywords: string[];
  condition: WeatherCondition;
};

const openWeatherIconBaseUrl = 'https://openweathermap.org/img/wn';

const openWeatherConditionMappings: WeatherConditionMapping[] = [
  {
    keywords: ['clear', 'sunny'],
    condition: WeatherCondition.CLEAR,
  },
  {
    keywords: ['few clouds'],
    condition: WeatherCondition.FEW_CLOUDS,
  },
  {
    keywords: ['scattered'],
    condition: WeatherCondition.SCATTERED_CLOUDS,
  },
  {
    keywords: ['broken'],
    condition: WeatherCondition.BROKEN_CLOUDS,
  },
  { keywords: ['overcast'], condition: WeatherCondition.OVERCAST },
  {
    keywords: ['drizzle'],
    condition: WeatherCondition.DRIZZLE,
  },
  { keywords: ['rain'], condition: WeatherCondition.RAIN },
  { keywords: ['thunderstorm'], condition: WeatherCondition.THUNDERSTORM },
  { keywords: ['snow'], condition: WeatherCondition.SNOW },
  { keywords: ['sleet'], condition: WeatherCondition.SLEET },
  {
    keywords: ['mist', 'fog', 'haze', 'smoke'],
    condition: WeatherCondition.MIST,
  },
  {
    keywords: ['dust', 'sand', 'ash'],
    condition: WeatherCondition.DUST,
  },
  { keywords: ['tornado'], condition: WeatherCondition.TORNADO },
  { keywords: ['squall'], condition: WeatherCondition.WIND },
];

export const mapOpenWeatherCondition = (
  description?: string,
): WeatherCondition => {
  if (!description) {
    return WeatherCondition.UNKNOWN;
  }

  const normalizedDescription = description.toLowerCase();

  const mapping = openWeatherConditionMappings.find(({ keywords }) =>
    keywords.some((keyword) => normalizedDescription.includes(keyword)),
  );

  return mapping?.condition ?? WeatherCondition.UNKNOWN;
};

export const mapOpenWeatherIconUrl = (
  icon?: string,
  size: 'regular' | 'large' = 'regular',
): string => {
  if (!icon) {
    return '';
  }

  const sizeSuffix = size === 'large' ? '@2x' : '';

  return `${openWeatherIconBaseUrl}/${icon}${sizeSuffix}.png`;
};

export function mapCurrentWeather(
  current: IOpenWeatherCurrent,
  forecast: IOpenWeatherForecastItem[],
  timezone: number,
): IWeatherCurrent {
  const { min, max } = mapTodayTemperatureRange(forecast);
  const description = current.weather[0].description;

  const weather: IWeatherCurrent = {
    temp: Math.round(current.main.temp),
    min,
    max,
    feelsLike: Math.round(current.main.feels_like),
    humidity: current.main.humidity,
    windSpeed: Math.round(current.wind.speed),
    pressure: current.main.pressure,
    description,
    icon: current.weather[0].icon,
    iconUrl: mapOpenWeatherIconUrl(current.weather[0].icon, 'large'),
    condition: mapOpenWeatherCondition(description),
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
      iconUrl: mapOpenWeatherIconUrl(item.weather[0].icon),
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
      const pop = calculateAverageBy(items, (item) => (item.pop ?? 0) * 100);
      const dailyWeather: IDailyWeather = {
        date,
        min,
        max,
        description: items[0].weather[0].description,
        icon: items[0].weather[0].icon,
        iconUrl: mapOpenWeatherIconUrl(items[0].weather[0].icon),
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
  const description = currentLike.weather?.[0]?.description ?? '';

  const next3Days = dailyForecast.map((day) => ({
    min: day.min,
    max: day.max,
    description: day.description,
  }));

  const preview: IWeatherPreviewOutput = {
    temperature: Math.round(currentLike.main.temp),
    min,
    max,
    description,
    condition: mapOpenWeatherCondition(description),
    next3Days,
  };

  return preview;
}
