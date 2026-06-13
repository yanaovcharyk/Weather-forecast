export interface IOpenWeatherCurrent {
  main: {
    temp: number;
    feels_like: number;
    temp_min: number,
    temp_max: number,
    humidity: number;
    pressure: number;
  };

  wind: {
    speed: number;
  };

  weather: {
    description: string;
    icon: string;
  }[];

  sys: {
    sunrise: number;
    sunset: number;
  };
}
export interface IOpenWeatherForecastItem {
  dt: number;

  dt_txt: string;

  main: {
    temp: number;
    temp_min: number,
    temp_max: number,
    feels_like: number;
    humidity: number;
    pressure: number;
  };

  weather: {
    description: string;
    icon: string;
  }[];

  clouds: {
    all: number;
  };

  wind: {
    speed: number;
  };

  pop?: number;
}

export interface IOpenWeatherForecast {
  city?: {
    timezone?: number;
  };

  list: IOpenWeatherForecastItem[];
}
