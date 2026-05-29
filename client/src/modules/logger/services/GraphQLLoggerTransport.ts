import { print } from 'graphql';

import type {
  ClientLogRecord,
  SerializedClientLogRecord,
  SendLogsGraphQLRequestBody,
  ILoggerTransport,
} from '../types';
import { SEND_CLIENT_LOGS_MUTATION } from '../api/loggerApi';
import { ENV } from '../../../config/env';

export class GraphQLLoggerTransport implements ILoggerTransport {
  private serializeLogsForTransport(
    logRecords: ClientLogRecord[],
  ): SerializedClientLogRecord[] {
    return logRecords.map(
      (logRecord): SerializedClientLogRecord => ({
        timestamp: logRecord.timestamp,
        level: logRecord.level,
        message: logRecord.message,
        requestId: logRecord.requestId,
        userId: logRecord.userId,
        sessionId: logRecord.sessionId,
        route: logRecord.route,
        metadata:
          logRecord.metadata !== undefined
            ? JSON.stringify(logRecord.metadata)
            : undefined,
      }),
    );
  }

  private createRequestBody(
    logRecords: ClientLogRecord[],
  ): SendLogsGraphQLRequestBody {
    return {
      query: print(SEND_CLIENT_LOGS_MUTATION),

      variables: {
        input: this.serializeLogsForTransport(logRecords),
      },
    };
  }

  async send(logRecords: ClientLogRecord[]): Promise<void> {
    if (logRecords.length === 0) {
      return;
    }

    const graphqlRequestBody = this.createRequestBody(logRecords);

    try {
      await fetch(ENV.loggerApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(graphqlRequestBody),
      });
    } catch (networkError: unknown) {
      console.error('Failed to send logs', networkError);
    }
  }

  sendOnPageClose(logRecords: ClientLogRecord[]): void {
    if (logRecords.length === 0) {
      return;
    }

    const graphqlRequestBody = this.createRequestBody(logRecords);

    navigator.sendBeacon(ENV.loggerApiUrl, JSON.stringify(graphqlRequestBody));
  }
}
