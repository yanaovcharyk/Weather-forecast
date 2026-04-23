import { ConfigService } from "@nestjs/config";
import { createValidationPipe } from "./shared/utils/create-validation-pipe.util";
import { INestApplication } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { GraphqlAuthExceptionFilter } from "./shared/filters/graphql-auth-exception.filter";


export function setupApp(app: INestApplication, config: ConfigService) {
  app.setGlobalPrefix(config.get('app.prefix') ?? 'api');

  app.use(cookieParser());

  if (config.get('app.cors')) {
    app.enableCors({
      origin: 'http://localhost:5173',
      credentials: true,
    });
  }

  app.useGlobalPipes(createValidationPipe());
  app.useGlobalFilters(new GraphqlAuthExceptionFilter());
  // app.useGlobalFilters(createHttpExceptionFilter());

  app.enableShutdownHooks();
}
