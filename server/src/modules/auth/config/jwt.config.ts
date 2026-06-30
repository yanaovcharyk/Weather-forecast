import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { JwtConfigKey } from '@auth/constants';
import { getRequiredConfig } from '@config/config-service.util';
import { IAppConfig } from '@shared/types';

export const jwtConfig = (
  config: ConfigService<IAppConfig>,
): JwtModuleOptions => ({
  secret: getRequiredConfig(config, JwtConfigKey.ACCESS_SECRET),
  signOptions: {
    expiresIn: getRequiredConfig(config, JwtConfigKey.ACCESS_EXPIRES),
  },
});
