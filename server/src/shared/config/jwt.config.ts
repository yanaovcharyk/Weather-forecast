import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { IAppConfig } from '../types/app.config';

export const jwtConfig = (
  config: ConfigService<IAppConfig>,
): JwtModuleOptions => ({
  secret: config.get('jwt.accessSecret', { infer: true }),
  signOptions: {
    expiresIn: config.get('jwt.accessExpires', { infer: true }),
  },
});
