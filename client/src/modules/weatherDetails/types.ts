export type CurrentWeather = {
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
};

export type DailyWeather = {
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
};

export type HourlyWeather = {
  time: string;
  temp: number;
  feelsLike: number;
  icon: string;
};

export type WeatherMeta = {
  timezone: string;
};

export type WeatherDetails = {
  cityName: string;
  lat: number;
  lon: number;
  current: CurrentWeather;
  daily: DailyWeather[];
  hourly: HourlyWeather[];
  meta?: WeatherMeta;
};

export type GetWeatherDetailsResponse = {
  getWeatherDetails: WeatherDetails;
};

export type City = {
  id: string;
  cityName: string;
  lat: number;
  lon: number;
};

export type GetCityByIdResponse = {
  getCityById: City;
};
