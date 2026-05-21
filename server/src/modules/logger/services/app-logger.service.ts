import { Injectable, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import {
  LoggerContextService,
} from './logger-context.service';

type LogMeta = Record<string, unknown>;

@Injectable()
export class AppLoggerService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
    private readonly contextService: LoggerContextService,
  ) {}

  child(context: string): AppLoggerService {
    const childLogger = this.logger.child({
      context,
    });

    return new AppLoggerService(
      childLogger,
      this.contextService,
    );
  }

  info(message: string, meta?: LogMeta) {
    this.write('info', message, meta);
  }

  debug(message: string, meta?: LogMeta) {
    this.write('debug', message, meta);
  }

  warn(message: string, meta?: LogMeta) {
    this.write('warn', message, meta);
  }

  error(
    message: string,
    error?: Error,
    meta?: LogMeta,
  ) {
    this.write('error', message, {
      ...(meta ?? {}),
      error: error?.message,
      stack: error?.stack,
    });
  }

  setContext(partial: Partial<any>) {
    this.contextService.set(partial);
  }

  private write(
    level: string,
    message: string,
    meta?: LogMeta,
  ) {
    this.logger.log(level, message, {
      ...this.contextService.get(),
      ...(meta ?? {}),
    });
  }
}
