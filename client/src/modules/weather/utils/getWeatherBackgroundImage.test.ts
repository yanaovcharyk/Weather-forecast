import { WeatherCondition } from '@/weather/types';
import { getWeatherBackgroundImage } from './getWeatherBackgroundImage';

describe('getWeatherBackgroundImage', () => {
  it('maps semantic weather conditions to background images', () => {
    expect(getWeatherBackgroundImage(WeatherCondition.CLEAR)).toBe(
      '/images/weather/clear.webp',
    );
    expect(getWeatherBackgroundImage(WeatherCondition.RAIN)).toBe(
      '/images/weather/rain.webp',
    );
    expect(getWeatherBackgroundImage(WeatherCondition.MIST)).toBe(
      '/images/weather/mist.webp',
    );
  });

  it('returns default background for missing or unknown condition', () => {
    expect(getWeatherBackgroundImage()).toBe('/images/weather/default.webp');
    expect(getWeatherBackgroundImage(WeatherCondition.UNKNOWN)).toBe(
      '/images/weather/default.webp',
    );
    expect(getWeatherBackgroundImage('not-real' as WeatherCondition)).toBe(
      '/images/weather/default.webp',
    );
  });
});
