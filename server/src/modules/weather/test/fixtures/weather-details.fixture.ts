import { IWeatherDetails } from "@weather/interfaces";

export const weatherDetailsFixture: IWeatherDetails = {
  coordinates: {
    lat: 50,
    lon: 30,
  },

  current: {
    temp: 20,
    min: 15,
    max: 25,
    feelsLike: 19,
    humidity: 60,
    windSpeed: 3,
    pressure: 1015,
    description: 'Sunny',
    icon: '01d',
    sunrise: '05:00',
    sunset: '20:00',
  },

  hourly: [],

  daily: [
    {
      date: '2026-06-12',
      min: 15,
      max: 22,
      description: 'Clear',
      icon: '01d',
      humidity: 60,
      pressure: 1015,
      clouds: 10,
      windSpeed: 3,
      pop: 0,
      feelsLike: 21,
    },
    {
      date: '2026-06-13',
      min: 16,
      max: 23,
      description: 'Cloudy',
      icon: '02d',
      humidity: 65,
      pressure: 1013,
      clouds: 40,
      windSpeed: 4,
      pop: 20,
      feelsLike: 22,
    },
    {
      date: '2026-06-14',
      min: 17,
      max: 24,
      description: 'Rain',
      icon: '10d',
      humidity: 80,
      pressure: 1010,
      clouds: 90,
      windSpeed: 5,
      pop: 70,
      feelsLike: 23,
    },
  ],

  meta: {
    timezone: '7200',
  },
};