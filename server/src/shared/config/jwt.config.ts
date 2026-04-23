import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { AppConfig } from '../types/app.config';

export const jwtConfig = (
  config: ConfigService<AppConfig>,
): JwtModuleOptions => ({
  secret: config.get('jwt.accessSecret', { infer: true }),
  signOptions: {
    expiresIn: config.get('jwt.accessExpires', { infer: true }),
  },
});
