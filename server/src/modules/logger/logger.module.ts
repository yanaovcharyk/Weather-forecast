import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from '../../shared/config/logger.config';
import { AppLoggerService } from './services/app-logger.service';
import { LoggerContextService } from './services/logger-context.service';
import { GraphqlContextInterceptor } from './interceptors/graphql-context.interceptor';
import { ClientLogsResolver } from './resolvers/client-logs.resolver';
import { ClientLoggerService } from './services/client-logger.service';

@Global()
@Module({
  imports: [WinstonModule.forRoot(winstonConfig)],

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
