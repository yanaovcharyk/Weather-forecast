import { ConfigService } from '@nestjs/config';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

import { AllExceptionsFilter } from '@logger/filter/all-exceptions.filter';
import { AppLoggerService } from '@logger/services/app-logger.service';
import { GraphqlAuthExceptionFilter } from '@shared/filters/graphql-auth-exception.filter';
import { IAppConfig } from '@shared/types';
import { validationPipeConfig } from '@shared/config';

export function setupApp(
  app: INestApplication,
  config: ConfigService<IAppConfig>,
) {
  const logger = app.get(AppLoggerService);
  const appConfig = config.getOrThrow('app', { infer: true });

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
