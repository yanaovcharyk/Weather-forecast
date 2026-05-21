import { ConfigService } from '@nestjs/config';
import { createValidationPipe } from './shared/utils/create-validation-pipe.util';
import { INestApplication } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { GraphqlAuthExceptionFilter } from './shared/filters/graphql-auth-exception.filter';
import { AppLoggerService } from './modules/logger/services/app-logger.service';
import { AllExceptionsFilter } from './modules/logger/filter/all-exceptions.filter';

export function setupApp(app: INestApplication, config: ConfigService) {
  const logger = app.get(AppLoggerService);

  app.setGlobalPrefix(config.get('app.prefix') ?? 'api');

  app.use(cookieParser());

  if (config.get('app.cors')) {
    app.enableCors({
      origin: 'http://localhost:5173',
      credentials: true,
    });
  }

  app.useGlobalPipes(createValidationPipe());
  app.useGlobalFilters(
    new GraphqlAuthExceptionFilter(),
    new AllExceptionsFilter(logger),
  );
  // app.useGlobalFilters(createHttpExceptionFilter());

  app.enableShutdownHooks();
}
