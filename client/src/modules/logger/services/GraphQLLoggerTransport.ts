import type {
  IClientLogRecord,
  ISerializedClientLogRecord,
  ISendLogsGraphQLRequestBody,
  ILoggerTransport,
} from '@/logger/types';
import { SEND_CLIENT_LOGS_MUTATION_STRING } from '@/logger/graphql';
import { config } from '@/common/config';

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
      query: SEND_CLIENT_LOGS_MUTATION_STRING,

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

    const response = await fetch(config.loggerApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(graphqlRequestBody),
    });

    if (!response.ok) {
      throw new Error(`Failed to send logs: ${response.status}`);
    }
  }

  sendOnPageClose(logRecords: IClientLogRecord[]): void {
    if (logRecords.length === 0) {
      return;
    }

    const graphqlRequestBody = this.createRequestBody(logRecords);

    navigator.sendBeacon(
      config.loggerApiUrl,
      JSON.stringify(graphqlRequestBody),
    );
  }
}
