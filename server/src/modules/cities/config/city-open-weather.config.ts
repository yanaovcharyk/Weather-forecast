import { ConfigService } from '@nestjs/config';

import { getRequiredConfig } from '@config/config-service.util';
import { IAppConfig } from '@shared/types';

export interface ICityOpenWeatherConfig {
  apiKey: string;
  geoBaseUrl: string;
}

export const cityOpenWeatherConfig = (
  config: ConfigService<IAppConfig>,
): ICityOpenWeatherConfig => ({
  apiKey: getRequiredConfig(config, 'weatherApi.key'),
  geoBaseUrl: getRequiredConfig(config, 'geoApi.baseUrl'),
});
