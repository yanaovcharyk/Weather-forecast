import { ConfigService } from '@nestjs/config';
import { StringValue } from 'ms';

import { getRequiredConfig } from '@config/config-service.util';
import { IAppConfig } from '@shared/types';

export interface IAuthTokenConfig {
  access: {
    secret: string;
    expiresIn: StringValue;
  };
  refresh: {
    secret: string;
    expiresIn: StringValue;
  };
}

export const authTokenConfig = (
  config: ConfigService<IAppConfig>,
) => {
  const jwt = getRequiredConfig(config, 'jwt');

  return {
    access: {
      secret: jwt.accessSecret,
      expiresIn: jwt.accessExpires,
    },
    refresh: {
      secret: jwt.refreshSecret,
      expiresIn: jwt.refreshExpires,
    },
  };
};
