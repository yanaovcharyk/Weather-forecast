import { loggerContext } from '@/logger/context/LoggerContextStore';
import {
  DEFAULT_FIELDS_TO_MASK,
  type IClientLogRecord,
  type LogLevel,
  type LogMetadata,
} from '@/logger/types';

import { loggerQueue } from './LoggerQueueService';
import { loggerRateLimiter } from './LoggerRateLimiter';
import { sanitizeForLogging } from '@/logger/utils/sanitizeForLogging';
import { LoggerOperation } from './LoggerOperation';
import { config } from '@/common/config';
import { shouldLog } from '@/logger/utils/shouldLog';

export class Logger {
  private readonly defaultMetadata: LogMetadata;

  constructor(defaultMetadata: LogMetadata = {}) {
    this.defaultMetadata = defaultMetadata;
  }

  child(metadata: LogMetadata): Logger {
    return new Logger({
      ...this.defaultMetadata,
      ...metadata,
    });
  }

  operation(event: string, metadata?: LogMetadata): LoggerOperation {
    return new LoggerOperation(this, event, metadata);
  }

  info(message: string, metadata?: LogMetadata): void {
    this.createAndDispatchLogRecord('info', message, metadata);
  }

  warn(message: string, metadata?: LogMetadata): void {
    this.createAndDispatchLogRecord('warn', message, metadata);
  }

  error(message: string, metadata?: LogMetadata): void {
    this.createAndDispatchLogRecord('error', message, metadata);
  }

  debug(message: string, metadata?: LogMetadata): void {
    this.createAndDispatchLogRecord('debug', message, metadata);
  }

  private createAndDispatchLogRecord(
    level: LogLevel,
    message: string,
    metadata?: LogMetadata,
  ): void {
    if (!shouldLog(level)) {
      return;
    }

    loggerRateLimiter.registerLogEvent();

    const currentLoggerContext = loggerContext.get();

    const mergedMetadata = {
      ...this.defaultMetadata,
      ...metadata,
    };

    const sanitizedMetadata = sanitizeForLogging(
      mergedMetadata,
      DEFAULT_FIELDS_TO_MASK,
    );

    const logRecord: IClientLogRecord = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...currentLoggerContext,
      metadata: sanitizedMetadata,
    };

    loggerQueue.addLog(logRecord);

    if (config.loggerConsole === 'true') {
      this.printLogToBrowserConsole(logRecord);
    }
  }

  private printLogToBrowserConsole(logRecord: IClientLogRecord): void {
    switch (logRecord.level) {
      case 'info':
        console.info(logRecord);
        return;

      case 'warn':
        console.warn(logRecord);
        return;

      case 'error':
        console.error(logRecord);
        return;

      case 'debug':
        console.debug(logRecord);
        return;
    }
  }
}

export const logger = new Logger();
