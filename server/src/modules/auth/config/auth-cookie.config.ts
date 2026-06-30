import { ConfigService } from '@nestjs/config';
import { getRequiredConfig } from '@config/config-service.util';
import { IAppConfig } from '@shared/types';

export const authCookieConfig = (
  config: ConfigService<IAppConfig>,
) => {
  const cookieConfig = getRequiredConfig(config, 'auth.cookie');

  return {
    httpOnly: cookieConfig.httpOnly,
    secure: cookieConfig.secure,
    sameSite: cookieConfig.sameSite,
    path: cookieConfig.path,
  };
};
