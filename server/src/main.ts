import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupApp } from './setup-app';
import { IAppConfig } from './shared/types';
import { getRequiredConfig } from './modules/config/config-service.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService<IAppConfig>);

  setupApp(app, config);

  await app.listen(getRequiredConfig(config, 'port'));
}

bootstrap();
