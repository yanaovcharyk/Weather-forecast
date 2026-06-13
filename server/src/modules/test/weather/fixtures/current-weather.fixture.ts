import { IOpenWeatherCurrent } from "../../../weather/interfaces";

export const currentWeatherFixture: IOpenWeatherCurrent = {
    main: {
      temp: 20,
      temp_min: 10,
      temp_max: 25,
      feels_like: 19,
      humidity: 60,
      pressure: 1012,
    },
    wind: {
      speed: 5,
    },
    weather: [
      {
        description: 'Sunny',
        icon: '01d',
      },
    ],
    sys: {
      sunrise: 1000,
      sunset: 2000,
    },
}

export const currentWeatherAlternativeFixture = {
  data: {
    main: {
      temp: 21,
      feels_like: 20,
      humidity: 55,
      pressure: 1010,
    },
    wind: {
      speed: 4,
    },
    weather: [
      {
        description: 'Clear',
        icon: '01d',
      },
    ],
    sys: {
      sunrise: 1000,
      sunset: 2000,
    },
  },
};

export const currentWeatherTimezoneZeroFixture = {
    main: {
      temp: 20,
      temp_min: 10,
      temp_max: 25,
      feels_like: 18,
      humidity: 50,
      pressure: 1000,
    },
    wind: {
      speed: 3,
    },
    weather: [
      {
        description: 'Clear',
        icon: '01d',
      },
    ],
    sys: {
      sunrise: 1000,
      sunset: 2000,
    },
};
