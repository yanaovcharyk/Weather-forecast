export interface IDailyWeather {
  date: string;
  min: number;
  max: number;
  description: string;
  icon: string;
  humidity: number;
  pressure: number;
  clouds: number;
  windSpeed: number;
  pop: number;
  feelsLike: number;
}
