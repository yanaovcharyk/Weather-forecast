import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from '@logger/config';
import { AppLoggerService } from './services/app-logger.service';
import { LoggerContextService } from './services/logger-context.service';
import { GraphqlContextInterceptor } from './interceptors/graphql-context.interceptor';
import { ClientLogsResolver } from './resolvers/client-logs.resolver';
import { ClientLoggerService } from './services/client-logger.service';

@Global()
@Module({
  imports: [
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: winstonConfig,
    }),
  ],

  providers: [
    AppLoggerService,
    LoggerContextService,
    ClientLogsResolver,
    ClientLoggerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: GraphqlContextInterceptor,
    },
  ],

  exports: [AppLoggerService, LoggerContextService],
})
export class LoggerModule {}
