import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WeatherResolver } from './resolvers';
import { WeatherService } from './services';
import { ConfigService } from '@nestjs/config';
import { geoConfig, weatherConfig } from '@shared/config/weather.config';
import { AuthModule } from '../auth';

@Module({
  imports: [HttpModule, AuthModule],
  providers: [
    WeatherResolver, 
    WeatherService,

    {
      provide: 'WEATHER_CONFIG',
      inject: [ConfigService],
      useFactory: weatherConfig,
    },

    {
      provide: 'GEO_CONFIG',
      inject: [ConfigService],
      useFactory: geoConfig,
    },
  ],
  exports: [WeatherService],
})
export class WeatherModule {}
