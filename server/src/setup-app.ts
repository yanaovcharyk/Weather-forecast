import { ConfigService } from '@nestjs/config';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

import { GraphqlAuthExceptionFilter } from '@auth/filters';
import { validationPipeConfig } from '@config/index';
import { getRequiredConfig } from '@config/config-service.util';
import { AllExceptionsFilter } from '@logger/filters';
import { AppLoggerService } from '@logger/services';
import { IAppConfig } from '@shared/types';

export function setupApp(
  app: INestApplication,
  config: ConfigService<IAppConfig>,
) {
  const logger = app.get(AppLoggerService);
  const appConfig = getRequiredConfig(config, 'app');

  app.setGlobalPrefix(appConfig.prefix);

  app.use(cookieParser());

  if (appConfig.cors) {
    app.enableCors({
      origin: appConfig.corsOrigin,
      credentials: true,
    });
  }

  app.useGlobalPipes(new ValidationPipe(validationPipeConfig));
  app.useGlobalFilters(
    new GraphqlAuthExceptionFilter(),
    new AllExceptionsFilter(logger),
  );

  app.enableShutdownHooks();
}
