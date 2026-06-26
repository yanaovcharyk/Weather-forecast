import { Module } from '@nestjs/common';

import { AuthModule } from '@auth/index';
import { CitiesModule } from '@cities/index';
import { DatabaseModule } from '@database/index';
import { LoggerModule } from '@logger/index';
import { AppConfigModule } from '@shared/config';
import { AppGraphqlModule } from '@shared/graphql';
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
