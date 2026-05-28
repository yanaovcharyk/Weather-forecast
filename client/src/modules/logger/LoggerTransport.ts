import { GRAPHQL_ENDPOINT } from './constants';

import type {
  ClientLogRecord,
  SerializedClientLogRecord,
  SendLogsGraphQLRequestBody,
} from './types';

/**
 * Відповідає за network transport логів.
 */
export class LoggerTransport {
  /**
   * Перетворює internal log model
   * у transport DTO.
   */
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

  /**
   * Відправка логів через fetch.
   */
  async send(logRecords: ClientLogRecord[]): Promise<void> {
    if (logRecords.length === 0) {
      return;
    }

    const serializedLogs = this.serializeLogsForTransport(logRecords);

    const graphqlRequestBody: SendLogsGraphQLRequestBody = {
      query: `
          mutation SendClientLogs(
            $input: [ClientLogInput!]!
          ) {
            sendClientLogs(input: $input)
          }
        `,

      variables: {
        input: serializedLogs,
      },
    };

    try {
      await fetch(GRAPHQL_ENDPOINT, {
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

  /**
   * Відправка логів при закритті сторінки.
   */
  sendOnPageClose(logRecords: ClientLogRecord[]): void {
    if (logRecords.length === 0) {
      return;
    }

    const serializedLogs = this.serializeLogsForTransport(logRecords);

    const graphqlRequestBody: SendLogsGraphQLRequestBody = {
      query: `
          mutation SendClientLogs(
            $input: [ClientLogInput!]!
          ) {
            sendClientLogs(input: $input)
          }
        `,

      variables: {
        input: serializedLogs,
      },
    };

    navigator.sendBeacon(GRAPHQL_ENDPOINT, JSON.stringify(graphqlRequestBody));
  }
}
