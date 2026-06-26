import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { JwtConfigKey } from '@auth/constants';
import { IAppConfig } from '@shared/types';

export const jwtConfig = (
  config: ConfigService<IAppConfig>,
): JwtModuleOptions => ({
  secret: config.get(JwtConfigKey.ACCESS_SECRET, { infer: true }),
  signOptions: {
    expiresIn: config.get(JwtConfigKey.ACCESS_EXPIRES, { infer: true }),
  },
});
