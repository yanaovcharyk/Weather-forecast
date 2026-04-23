export interface IOpenWeatherCurrent {
  name: string;
  main: { temp: number };
  weather: { description: string }[];
}

export interface IOpenWeatherForecastItem {
  main: { temp: number };
  weather: { description: string }[];
}

export interface IOpenWeatherForecast {
  list: IOpenWeatherForecastItem[];
}
