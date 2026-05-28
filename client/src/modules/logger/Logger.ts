import { loggerContext } from './LoggerContextStore';

import type { ClientLogRecord, LogLevel, LogMetadata } from './types';

import { loggerQueue } from './LoggerQueue';

import { loggerRateLimiter } from './LoggerRateLimiter';

/**
 * Головний logger application layer.
 */
class Logger {
  /**
   * Info log.
   */
  info(message: string, metadata?: LogMetadata): void {
    this.createAndDispatchLogRecord('info', message, metadata);
  }

  /**
   * Warning log.
   */
  warn(message: string, metadata?: LogMetadata): void {
    this.createAndDispatchLogRecord('warn', message, metadata);
  }

  /**
   * Error log.
   */
  error(message: string, metadata?: LogMetadata): void {
    this.createAndDispatchLogRecord('error', message, metadata);
  }

  /**
   * Debug log.
   */
  debug(message: string, metadata?: LogMetadata): void {
    this.createAndDispatchLogRecord('debug', message, metadata);
  }

  /**
   * Створює log record
   * та відправляє його у queue.
   */
  private createAndDispatchLogRecord(
    level: LogLevel,

    message: string,

    metadata?: LogMetadata,
  ): void {
    /**
     * Panic protection.
     */
    loggerRateLimiter.registerLogEvent();

    /**
     * Current logger context.
     */
    const currentLoggerContext = loggerContext.get();

    /**
     * Complete structured log record.
     */
    const logRecord: ClientLogRecord = {
      timestamp: new Date().toISOString(),

      level,

      message,

      requestId: currentLoggerContext.requestId,

      userId: currentLoggerContext.userId,

      sessionId: currentLoggerContext.sessionId,

      route: currentLoggerContext.route,

      metadata,
    };

    /**
     * Add log to queue.
     */
    loggerQueue.addLogRecord(logRecord);

    /**
     * Mirror log into browser console.
     */
    this.printLogToBrowserConsole(logRecord);
  }

  /**
   * Console output helper.
   */
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

/**
 * Shared singleton logger instance.
 */
export const logger = new Logger();
