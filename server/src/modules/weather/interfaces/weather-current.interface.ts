export interface IWeatherCurrent {
  temp: number;
  min: number;
  max: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  description: string;
  icon: string;
  sunrise: string;
  sunset: string;
}
