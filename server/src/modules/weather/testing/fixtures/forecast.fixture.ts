export const forecastFixture = {
  city: { timezone: 0 },
  list: [
    {
      dt: 1000,
      dt_txt: '2026-06-10 12:00:00',
      main: { temp: 20, temp_min: 10, temp_max: 25, feels_like: 19, humidity: 60, pressure: 1012 },
      weather: [{ description: 'Sunny', icon: '01d' }],
      clouds: { all: 10 },
      wind: { speed: 5 },
      pop: 0.1,
    },
    {
      dt: 2000,
      dt_txt: '2026-06-10 15:00:00',
      main: { temp: 22, temp_min: 10, temp_max: 25, feels_like: 21, humidity: 55, pressure: 1010 },
      weather: [{ description: 'Cloudy', icon: '02d' }],
      clouds: { all: 30 },
      wind: { speed: 3 },
      pop: 0.3,
    },
    {
      dt: 3000,
      dt_txt: '2026-06-11 09:00:00',
      main: { temp: 18, temp_min: 10, temp_max: 25, feels_like: 17, humidity: 70, pressure: 1015 },
      weather: [{ description: 'Rain', icon: '10d' }],
      clouds: { all: 80 },
      wind: { speed: 6 },
      pop: 0.5,
    },
    {
      dt: 4000,
      dt_txt: '2026-06-11 12:00:00',
      main: { temp: 19, temp_min: 10, temp_max: 25, feels_like: 18, humidity: 65, pressure: 1013 },
      weather: [{ description: 'Rain', icon: '10d' }],
      clouds: { all: 70 },
      wind: { speed: 5 },
      pop: 0.4,
    },
    {
      dt: 5000,
      dt_txt: '2026-06-12 09:00:00',
      main: { temp: 25, temp_min: 10, temp_max: 25, feels_like: 24, humidity: 50, pressure: 1020 },
      weather: [{ description: 'Clear', icon: '01d' }],
      clouds: { all: 20 },
      wind: { speed: 4 },
      pop: 0.2,
    },
    {
      dt: 6000,
      dt_txt: '2026-06-12 12:00:00',
      main: { temp: 27, temp_min: 10, temp_max: 25, feels_like: 26, humidity: 45, pressure: 1022 },
      weather: [{ description: 'Clear', icon: '01d' }],
      clouds: { all: 10 },
      wind: { speed: 3 },
      pop: 0.1,
    },
    {
      dt: 7000,
      dt_txt: '2026-06-13 09:00:00',
      main: { temp: 30, temp_min: 10, temp_max: 25, feels_like: 29, humidity: 40, pressure: 1025 },
      weather: [{ description: 'Hot', icon: '01d' }],
      clouds: { all: 5 },
      wind: { speed: 2 },
      pop: 0.8,
    },
    {
      dt: 8000,
      dt_txt: '2026-06-13 12:00:00',
      main: { temp: 32, temp_min: 10, temp_max: 25, feels_like: 31, humidity: 35, pressure: 1027 },
      weather: [{ description: 'Hot', icon: '01d' }],
      clouds: { all: 0 },
      wind: { speed: 2 },
      pop: 0.9,
    },
    {
      dt: 9000,
      dt_txt: '2026-06-14 12:00:00',
      main: { temp: 28, temp_min: 10, temp_max: 25, feels_like: 27, humidity: 45, pressure: 1023 },
      weather: [{ description: 'Cloudy', icon: '02d' }],
      clouds: { all: 40 },
      wind: { speed: 3 },
      pop: 0.3,
    },
  ],
};


export const forecastWithTimezoneFixture = {
    city: {
      timezone: 7200,
    },
    list: [
      {
        dt: 1000,
        dt_txt: '2026-06-10 12:00:00',
        main: {
          temp: 20,
          feels_like: 19,
          humidity: 60,
          pressure: 1012,
        },
        weather: [
          {
            description: 'Sunny',
            icon: '01d',
          },
        ],
        clouds: {
          all: 10,
        },
        wind: {
          speed: 5,
        },
        pop: 0.1,
      },
    ],
};

export const forecastWithoutListFixture = {
    city: {
      timezone: 0,
    },
    list: undefined,
};

export const forecastTimezoneZeroFixture = {
    city: {
      timezone: 0,
    },
    list: [
      {
        dt: 1000,
        dt_txt: '2026-06-10 12:00:00',
        main: {
          temp: 20,
          temp_min: 10,
          temp_max: 25,
          feels_like: 19,
          humidity: 60,
          pressure: 1012,
        },
        weather: [
          {
            description: 'Sunny',
            icon: '01d',
          },
        ],
        clouds: {
          all: 10,
        },
        wind: {
          speed: 5,
        },
        pop: 0,
      },
    ],
};

export const aggregationForecastFixture = {
    city: {},
    list: [
      {
        dt: 1000,
        dt_txt: '2026-06-10 12:00:00',
        main: {
          temp: 20,
          temp_min: 10,
          temp_max: 25,
          feels_like: 19,
          humidity: 60,
          pressure: 1000,
        },
        weather: [{ description: 'Sunny', icon: '01d' }],
        clouds: { all: 10 },
        wind: { speed: 3 },
      },
      {
        dt: 2000,
        dt_txt: '2026-06-11 12:00:00',
        main: {
          temp: 10,
          temp_min: 10,
          temp_max: 25,
          feels_like: 8,
          humidity: 80,
          pressure: 1005,
        },
        weather: [{ description: 'Rain', icon: '10d' }],
        clouds: { all: 80 },
        wind: { speed: 7 },
      },
      {
        dt: 3000,
        dt_txt: '2026-06-11 15:00:00',
        main: {
          temp: 14,
          temp_min: 10,
          temp_max: 25,
          feels_like: 12,
          humidity: 60,
          pressure: 1015,
        },
        weather: [{ description: 'Rain', icon: '10d' }],
        clouds: { all: 60 },
        wind: { speed: 5 },
      },
      {
        dt: 4000,
        dt_txt: '2026-06-12 12:00:00',
        main: {
          temp: 22,
          temp_min: 10,
          temp_max: 25,
          feels_like: 21,
          humidity: 50,
          pressure: 1020,
        },
        weather: [{ description: 'Cloudy', icon: '02d' }],
        clouds: { all: 30 },
        wind: { speed: 4 },
        pop: 0.5,
      },
      {
        dt: 5000,
        dt_txt: '2026-06-13 12:00:00',
        main: {
          temp: 30,
          temp_min: 10,
          temp_max: 25,
          feels_like: 29,
          humidity: 40,
          pressure: 1025,
        },
        weather: [{ description: 'Hot', icon: '01d' }],
        clouds: { all: 5 },
        wind: { speed: 2 },
        pop: 0.8,
      },
    ],
};

export const aggregatedDailyForecastFixture = {
  date: '2026-06-11',
  min: 10,
  max: 14,
  description: 'Rain',
  icon: '10d',
  humidity: 70,
  pressure: 1010,
  clouds: 70,
  windSpeed: 6,
  feelsLike: 10,
  pop: 0,
};
