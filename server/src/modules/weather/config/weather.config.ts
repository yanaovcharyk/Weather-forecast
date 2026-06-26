import { ConfigService } from '@nestjs/config';

import { IAppConfig } from '@shared/types';

export interface IWeatherConfig {
  apiKey: string;
  baseUrl: string;
}

export interface IGeoConfig {
  baseUrl: string;
}

export const weatherConfig = (
  config: ConfigService<IAppConfig>,
): IWeatherConfig => ({
  apiKey: config.get('weatherApi.key', { infer: true })!,
  baseUrl: config.get('weatherApi.baseUrl', { infer: true })!,
});

export const geoConfig = (
  config: ConfigService<IAppConfig>,
): IGeoConfig => ({
  baseUrl: config.get('geoApi.baseUrl', { infer: true })!,
});
