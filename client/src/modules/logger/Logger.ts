import { loggerContext } from './context/LoggerContextStore';
import {
  DEFAULT_FIELDS_TO_MASK,
  type ClientLogRecord,
  type LogLevel,
  type LogMetadata,
} from './types';
import { loggerQueue } from './pipeline/LoggerQueue';
import { loggerRateLimiter } from './guards/LoggerRateLimiter';
import { safeSerialize } from './utils/safe-serialize';

class Logger {
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
    loggerRateLimiter.registerLogEvent();

    const currentLoggerContext = loggerContext.get();

    const sanitizedMetadata = safeSerialize(metadata, DEFAULT_FIELDS_TO_MASK);

    const logRecord: ClientLogRecord = {
      timestamp: new Date().toISOString(),
      level,
      message,
      requestId: currentLoggerContext.requestId,
      userId: currentLoggerContext.userId,
      sessionId: currentLoggerContext.sessionId,
      route: currentLoggerContext.route,
      metadata: sanitizedMetadata,
    };

    loggerQueue.addLogRecord(logRecord);
    this.printLogToBrowserConsole(logRecord);
  }

  private printLogToBrowserConsole(logRecord: ClientLogRecord): void {
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
