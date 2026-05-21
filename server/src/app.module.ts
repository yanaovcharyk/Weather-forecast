import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { AuthModule } from './modules/auth/auth.module';
import { CitiesModule } from './modules/cities/cities.module';
import { WeatherModule } from './modules/weather/weather.module';
import { graphqlConfig } from './shared/config/graphql.config';
import { DatabaseModule } from './modules/database/database.module';
import { AppHealthController } from './app.controller';
import { AppConfigModule } from './shared/config/config.module';
import { LoggerModule } from './modules/logger/logger.module';

@Module({
  imports: [
    AppConfigModule,
    LoggerModule,
    GraphQLModule.forRoot(graphqlConfig),
    DatabaseModule.forRoot(),
    AuthModule,
    CitiesModule,
    WeatherModule,
  ],
  controllers: [AppHealthController],
  providers: [],
})
export class AppModule {}
