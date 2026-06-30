import { ConfigService } from '@nestjs/config';

import { getRequiredConfig } from '@config/config-service.util';
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
  apiKey: getRequiredConfig(config, 'weatherApi.key'),
  baseUrl: getRequiredConfig(config, 'weatherApi.baseUrl'),
});

export const geoConfig = (
  config: ConfigService<IAppConfig>,
): IGeoConfig => ({
  baseUrl: getRequiredConfig(config, 'geoApi.baseUrl'),
});
