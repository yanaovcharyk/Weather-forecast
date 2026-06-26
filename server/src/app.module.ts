import { Module } from '@nestjs/common';

import { AuthModule } from '@auth/index';
import { CitiesModule } from '@cities/index';
import { AppConfigModule } from '@config/index';
import { DatabaseModule } from '@database/index';
import { AppGraphqlModule } from '@graphql/index';
import { LoggerModule } from '@logger/index';
import { WeatherModule } from '@weather/index';

import { AppHealthController } from './app.controller';

@Module({
  imports: [
    AppConfigModule,
    LoggerModule,
    AppGraphqlModule,
    DatabaseModule.forRoot(),

    AuthModule,
    CitiesModule,
    WeatherModule,
  ],
  controllers: [AppHealthController],
  providers: [],
})
export class AppModule {}
