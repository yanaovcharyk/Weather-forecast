import { loggerContext } from '@/logger/context/LoggerContextStore';
import {
  DEFAULT_FIELDS_TO_MASK,
  LogLevel,
  type IClientLogRecord,
  type LogMetadata,
} from '@/logger/types';

import { loggerQueue } from './LoggerQueueService';
import { loggerRateLimiter } from './LoggerRateLimiter';
import { sanitizeForLogging } from '@/logger/utils/sanitizeForLogging';
import { OperationLogger } from './OperationLogger';
import { config } from '@/common/config';
import { shouldLog } from '@/logger/config/shouldLog';

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

  operation(event: string, metadata?: LogMetadata): OperationLogger {
    return new OperationLogger(this, event, metadata);
  }

  info(message: string, metadata?: LogMetadata): void {
    this.createAndDispatchLogRecord(LogLevel.Info, message, metadata);
  }

  warn(message: string, metadata?: LogMetadata): void {
    this.createAndDispatchLogRecord(LogLevel.Warn, message, metadata);
  }

  error(message: string, metadata?: LogMetadata): void {
    this.createAndDispatchLogRecord(LogLevel.Error, message, metadata);
  }

  debug(message: string, metadata?: LogMetadata): void {
    this.createAndDispatchLogRecord(LogLevel.Debug, message, metadata);
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

    if (config.isLoggerConsole) {
      this.printLogToBrowserConsole(logRecord);
    }
  }

  private printLogToBrowserConsole(logRecord: IClientLogRecord): void {
    switch (logRecord.level) {
      case LogLevel.Info:
        console.info(logRecord);
        return;

      case LogLevel.Warn:
        console.warn(logRecord);
        return;

      case LogLevel.Error:
        console.error(logRecord);
        return;

      case LogLevel.Debug:
        console.debug(logRecord);
        return;
    }
  }
}

export const logger = new Logger();
