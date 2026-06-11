export const forecastFixture = {
  data: {
    city: {
      timezone: 0,
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
  },
};

export const forecastWithTimezoneFixture = {
  data: {
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
  },
};

export const forecastWithoutListFixture = {
  data: {
    city: {
      timezone: 0,
    },
    list: undefined,
  },
};

export const forecastTimezoneZeroFixture = {
  data: {
    city: {
      timezone: 0,
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
        pop: 0,
      },
    ],
  },
};

export const aggregationForecastFixture = {
  data: {
    city: {},
    list: [
      {
        dt: 1000,
        dt_txt: '2026-06-10 12:00:00',
        main: {
          temp: 20,
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
  },
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
