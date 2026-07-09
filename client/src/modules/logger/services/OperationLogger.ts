import { normalizeError } from '@/logger/utils/normalizeError';
import { type LogMetadata } from '@/logger/types';
import type { Logger } from './LoggerService';

export class OperationLogger {
  private readonly startedAt = performance.now();

  private readonly logger: Logger;
  private readonly event: string;
  private readonly metadata?: LogMetadata;

  constructor(logger: Logger, event: string, metadata?: LogMetadata) {
    this.logger = logger;
    this.event = event;
    this.metadata = metadata;

    this.logger.info(`${event}.started`, metadata);
  }

  success(metadata?: LogMetadata): void {
    this.logger.info(`${this.event}.completed`, {
      ...this.metadata,
      ...metadata,
      durationMs: Math.round(performance.now() - this.startedAt),
    });
  }

  fail(error: unknown, metadata?: LogMetadata): void {
    this.logger.error(`${this.event}.failed`, {
      ...this.metadata,
      ...metadata,
      durationMs: Math.round(performance.now() - this.startedAt),
      error: normalizeError(error),
    });
  }

  warn(message: string, metadata?: LogMetadata): void {
    this.logger.warn(message, {
      ...this.metadata,
      ...metadata,
    });
  }
}
