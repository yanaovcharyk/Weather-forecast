import { ConfigService } from '@nestjs/config';
import { IAppConfig } from '../types/app.config';

export const weatherConfig = (config: ConfigService<IAppConfig>) => ({
  apiKey: config.get('weatherApi.key', { infer: true }),
  weatherBaseUrl: config.get('weatherApi.baseUrl', { infer: true }),
});

export const geoConfig = (config: ConfigService<IAppConfig>) => ({
  baseUrl: config.get('geoApi.baseUrl', { infer: true }),
});
