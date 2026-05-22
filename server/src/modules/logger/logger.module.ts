import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './logger.config';
import { AppLoggerService } from './services/app-logger.service';
import { LoggerContextService } from './services/logger-context.service';
import { GraphqlContextInterceptor } from './graphql-context.interceptor';


@Global()
@Module({
  imports: [WinstonModule.forRoot(winstonConfig)],

  providers: [
    AppLoggerService,
    LoggerContextService,
    {
      provide: APP_INTERCEPTOR,
      useClass: GraphqlContextInterceptor,
    },
  ],

  exports: [AppLoggerService, LoggerContextService],
})
export class LoggerModule {}
