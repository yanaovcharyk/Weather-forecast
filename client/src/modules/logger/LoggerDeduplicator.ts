import { LOGGER_DEDUPLICATION_WINDOW_IN_MS } from './constants';

import type { ClientLogRecord } from './types';

export class LoggerDeduplicator {
  private duplicateLogCache = new Map<string, number>();
  shouldSkipLog(logRecord: ClientLogRecord): boolean {
    const currentTimestamp = Date.now();
    const logDeduplicationKey = JSON.stringify({
      level: logRecord.level,

      message: logRecord.message,
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
}

export const loggerDeduplicator = new LoggerDeduplicator();
