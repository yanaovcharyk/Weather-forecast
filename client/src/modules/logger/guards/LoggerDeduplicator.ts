import {
  LOGGER_DEDUPLICATION_WINDOW_IN_MS,
  LOGGER_DEDUPLICATION_CLEANUP_INTERVAL_IN_MS,
} from '../constants';

import type { ClientLogRecord } from '../types';

export class LoggerDeduplicator {
  private duplicateLogCache = new Map<string, number>();

  constructor() {
    this.startCleanupScheduler();
  }

  shouldSkipLog(logRecord: ClientLogRecord): boolean {
    const currentTimestamp = Date.now();

    const logDeduplicationKey = JSON.stringify({
      level: logRecord.level,
      message: logRecord.message,
      metadata: logRecord.metadata,
    });

    const previousLogTimestamp =
      this.duplicateLogCache.get(logDeduplicationKey);

    this.duplicateLogCache.set(logDeduplicationKey, currentTimestamp);

    if (previousLogTimestamp === undefined) {
      return false;
    }

    return (
      currentTimestamp - previousLogTimestamp <
      LOGGER_DEDUPLICATION_WINDOW_IN_MS
    );
  }

  private startCleanupScheduler(): void {
    window.setInterval(() => {
      this.cleanupExpiredLogs();
    }, LOGGER_DEDUPLICATION_CLEANUP_INTERVAL_IN_MS);
  }

  private cleanupExpiredLogs(): void {
    const currentTimestamp = Date.now();

    for (const [logDeduplicationKey, logTimestamp] of this.duplicateLogCache) {
      if (
        currentTimestamp - logTimestamp >=
        LOGGER_DEDUPLICATION_WINDOW_IN_MS
      ) {
        this.duplicateLogCache.delete(logDeduplicationKey);
      }
    }
  }
}

export const loggerDeduplicator = new LoggerDeduplicator();
