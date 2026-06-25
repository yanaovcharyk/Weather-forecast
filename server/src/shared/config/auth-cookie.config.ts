import { ConfigService } from '@nestjs/config';
import { IAppConfig } from '@shared/types';

export const authCookieConfig = (
  config: ConfigService<IAppConfig>,
) => {
  const isProd =
    config.get('nodeEnv', {
      infer: true,
    }) === 'production';

  return {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax' as const,
    path: '/',
  };
};
