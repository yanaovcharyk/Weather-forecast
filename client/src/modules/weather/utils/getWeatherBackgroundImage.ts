import { WeatherCondition } from '@/weather/types';

const defaultWeatherBackgroundImage = '/images/weather/default.webp';

const weatherConditionBackgrounds: Record<WeatherCondition, string> = {
  [WeatherCondition.CLEAR]: '/images/weather/clear.webp',
  [WeatherCondition.FEW_CLOUDS]: '/images/weather/few-clouds.webp',
  [WeatherCondition.SCATTERED_CLOUDS]: '/images/weather/scattered-clouds.webp',
  [WeatherCondition.BROKEN_CLOUDS]: '/images/weather/broken-clouds.webp',
  [WeatherCondition.OVERCAST]: '/images/weather/overcast.webp',
  [WeatherCondition.DRIZZLE]: '/images/weather/drizzle.webp',
  [WeatherCondition.RAIN]: '/images/weather/rain.webp',
  [WeatherCondition.THUNDERSTORM]: '/images/weather/storm.webp',
  [WeatherCondition.SNOW]: '/images/weather/snow.webp',
  [WeatherCondition.SLEET]: '/images/weather/sleet.webp',
  [WeatherCondition.MIST]: '/images/weather/mist.webp',
  [WeatherCondition.DUST]: '/images/weather/dust.webp',
  [WeatherCondition.TORNADO]: '/images/weather/tornado.webp',
  [WeatherCondition.WIND]: '/images/weather/wind.webp',
  [WeatherCondition.UNKNOWN]: defaultWeatherBackgroundImage,
};

export const getWeatherBackgroundImage = (
  condition?: WeatherCondition,
): string => {
  if (!condition) {
    return defaultWeatherBackgroundImage;
  }

  return (
    weatherConditionBackgrounds[condition] ?? defaultWeatherBackgroundImage
  );
};
