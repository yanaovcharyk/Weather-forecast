import type { Weather } from '@/weatherForecast/types';

export const WEATHER_FIXTURE: Weather = {
  temperature: 20,
  description: 'Sunny',
  min: 10,
  max: 25,
  next3Days: [
    { min: 1, max: 5, description: 'Cold', icon: '13d' },
    { min: 2, max: 6, description: 'Cloudy', icon: '03d' },
    { min: 3, max: 7, description: 'Rain', icon: '10d' },
  ],
};
