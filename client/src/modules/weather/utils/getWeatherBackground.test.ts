import { describe, it, expect } from 'vitest';
import { getWeatherBackground } from './getWeatherBackground';

describe('getWeatherBackground', () => {
  it('should return default background when no description', () => {
    expect(getWeatherBackground()).toBe('/images/weather/default.webp');
  });

  it('should match clear weather', () => {
    expect(getWeatherBackground('clear sky')).toBe(
      '/images/weather/clear.webp',
    );
  });

  it('should be case insensitive', () => {
    expect(getWeatherBackground('CLEAR SKY')).toBe(
      '/images/weather/clear.webp',
    );
  });

  it('should match few clouds', () => {
    expect(getWeatherBackground('few clouds')).toBe(
      '/images/weather/few-clouds.webp',
    );
  });

  it('should match drizzle / light rain', () => {
    expect(getWeatherBackground('light rain')).toBe(
      '/images/weather/drizzle.webp',
    );
  });

  it('should match mist group', () => {
    expect(getWeatherBackground('fog and haze outside')).toBe(
      '/images/weather/mist.webp',
    );
  });

  it('should return default when no match', () => {
    expect(getWeatherBackground('alien weather')).toBe(
      '/images/weather/default.webp',
    );
  });

  it('should match broken clouds specifically', () => {
    expect(getWeatherBackground('broken clouds')).toBe(
      '/images/weather/broken-clouds.webp',
    );
  });
});
