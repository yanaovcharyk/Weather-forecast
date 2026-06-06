import { ConfigService } from '@nestjs/config';
import { IAppConfig } from '@shared/types';
import { StringValue } from 'ms';

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
  const jwt = config.get('jwt', {
    infer: true,
  })!;

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