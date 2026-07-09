export enum LogLevel {
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
  Debug = 'debug',
}

export type LogMetadata = Record<string, unknown>;

export interface ILoggerContext {
  requestId?: string;
  userId?: string;
  sessionId?: string;
  route?: string;
}

export interface IClientLogRecord extends ILoggerContext {
  timestamp: string;
  level: LogLevel;
  message: string;
  metadata?: JsonValue;
}

export type SerializedClientLogRecord = Omit<IClientLogRecord, 'metadata'> & {
  metadata?: string;
};

export interface ISendLogsGraphQLRequestBody {
  query: string;
  variables: {
    input: SerializedClientLogRecord[];
  };
}

export type JsonPrimitive = string | number | boolean | null;

export type JsonValue =
  | JsonPrimitive
  | JsonValue[]
  | { [key: string]: JsonValue };

export const DEFAULT_FIELDS_TO_MASK = [
  'password',
  'token',
  'accessToken',
  'refreshToken',
  'authorization',
  'cookie',
  'set-cookie',
  'secret',
  'apiKey',
] as const;

export type ClientErrorLog = {
  module: string;
  requestId: string;
  operationName: string;
  executionTimeMs: number;
  error: {
    name?: string;
    message: string;
    stack?: string;
    code?: string;
  };
  variables?: unknown;
};

export interface ILoggerTransport {
  send(logRecords: IClientLogRecord[]): Promise<void>;
  sendOnPageClose(logRecords: IClientLogRecord[]): void;
}
