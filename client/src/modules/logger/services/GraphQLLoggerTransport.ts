import { print } from 'graphql';

import type {
  IClientLogRecord,
  ISerializedClientLogRecord,
  ISendLogsGraphQLRequestBody,
  ILoggerTransport,
} from '../types';
import { SEND_CLIENT_LOGS_MUTATION } from '../api/loggerApi';
import { ENV } from '../../../config/env';

export class GraphQLLoggerTransport implements ILoggerTransport {
  private serializeLogsForTransport(
    logRecords: IClientLogRecord[],
  ): ISerializedClientLogRecord[] {
    return logRecords.map(({ metadata, ...rest }) => ({
      ...rest,

      metadata: metadata !== undefined ? JSON.stringify(metadata) : undefined,
    }));
  }

  private createRequestBody(
    logRecords: IClientLogRecord[],
  ): ISendLogsGraphQLRequestBody {
    return {
      query: print(SEND_CLIENT_LOGS_MUTATION),

      variables: {
        input: this.serializeLogsForTransport(logRecords),
      },
    };
  }

  async send(logRecords: IClientLogRecord[]): Promise<void> {
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

  sendOnPageClose(logRecords: IClientLogRecord[]): void {
    if (logRecords.length === 0) {
      return;
    }

    const graphqlRequestBody = this.createRequestBody(logRecords);

    navigator.sendBeacon(ENV.loggerApiUrl, JSON.stringify(graphqlRequestBody));
  }
}
