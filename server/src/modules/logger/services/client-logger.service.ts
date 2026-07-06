import { Injectable } from '@nestjs/common';
import { AppLoggerService } from './app-logger.service';
import { IClientLogInput } from '@logger/types';

type ParsedMeta = Record<string, unknown>;

@Injectable()
export class ClientLoggerService {
  constructor(private readonly logger: AppLoggerService) {}

  writeLogs(logs: IClientLogInput[]): void {
    for (const log of logs) {
      this.writeLog(log);
    }
  }

  private writeLog(log: IClientLogInput): void {
    const parsedMeta = this.parseMeta(log.metadata);

    const meta = {
      source: 'client',
      requestId: log.requestId,
      clientTimestamp: log.timestamp,
      clientUserId: log.userId,
      sessionId: log.sessionId,
      route: log.route,
      ...parsedMeta,
    };

    switch (log.level) {
      case 'error':
        this.logger.error(log.message, undefined, meta);
        return;

      case 'warn':
        this.logger.warn(log.message, meta);
        return;

      case 'debug':
        this.logger.debug(log.message, meta);
        return;

      default:
        this.logger.info(log.message, meta);
    }
  }

  private parseMeta(meta?: string): ParsedMeta {
    if (meta == null) {
      return {};
    }

    try {
      const parsed = JSON.parse(meta);

      if (
        parsed == null ||
        typeof parsed !== 'object' ||
        Array.isArray(parsed)
      ) {
        return {
          invalidMeta: 'Meta is not an object',
        };
      }

      return parsed;
    } catch {
      return {
        invalidMeta: 'Failed to parse meta JSON',
      };
    }
  }
}
