import type { City } from '@/weatherForecast/types';

export const CITY_FIXTURE: City = {
  id: '1',
  cityName: 'Kyiv',
  lat: 50.45,
  lon: 30.52,
  isPinned: false,
};

export const EXISTING_CITY_FIXTURE: City = {
  id: '2',
  cityName: 'Lviv',
  lat: 49.84,
  lon: 24.03,
  isPinned: true,
};

export const CITY_RESPONSE = {
  getSavedCity: {
    id: '1',
    cityName: 'Kyiv',
    lat: 50.45,
    lon: 30.52,
  },
};

export const WEATHER_RESPONSE = {
  getWeatherDetails: {
    cityName: 'Kyiv',
    lat: 50.45,
    lon: 30.52,

    current: {
      temp: 24,
      min: 20,
      max: 26,
      feelsLike: 25,
      humidity: 80,
      windSpeed: 4,
      pressure: 1015,
      description: 'Sunny',
      icon: '01d',
      sunrise: '06:01',
      sunset: '21:14',
    },

    daily: [
      {
        date: '2026-06-19',
        min: 18,
        max: 26,
        description: 'Sunny',
        icon: '01d',
        humidity: 75,
        pressure: 1014,
        clouds: 10,
        windSpeed: 3,
        pop: 0,
        feelsLike: 25,
      },
    ],

    hourly: [
      {
        time: '12:00',
        temp: 25,
        feelsLike: 26,
        icon: '01d',
      },
    ],

    meta: {
      timezone: 'Europe/Kyiv',
    },
  },
};
