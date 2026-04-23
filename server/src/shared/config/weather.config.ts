import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../types/app.config';

export const weatherConfig = (config: ConfigService<AppConfig>) => ({
  apiKey: config.get('weatherApi.key', { infer: true }),
  weatherBaseUrl: config.get('weatherApi.baseUrl', { infer: true }),
});

export const geoConfig = (config: ConfigService<AppConfig>) => ({
  baseUrl: config.get('geoApi.baseUrl', { infer: true }),
});
