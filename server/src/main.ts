import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupApp } from './setup-app';
import { IAppConfig } from './shared/types';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService<IAppConfig>);

  setupApp(app, config);

  await app.listen(config.getOrThrow('port', { infer: true }));
}

bootstrap();
