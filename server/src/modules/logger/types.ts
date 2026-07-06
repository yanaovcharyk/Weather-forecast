import { Logger } from 'winston';

export type LoggerContext = {
  logger?: Logger;
};

export interface ILoggerContext {
  requestId?: string;
  userId?: string;
  ip?: string;
  context?: string;
}

export interface IClientLogInput {
  timestamp: string;
  level: string;
  message: string;
  requestId?: string;
  userId?: string;
  sessionId?: string;
  route?: string;
  metadata?: string;
  operationName?: string;
  variables?: string;
  path?: string;
  search?: string;
  module?: string;
  executionTimeMs?: number;
  hasErrors?: boolean;
}

export type LogMethodOptions = {
  shouldLogArguments?: boolean;
  shouldLogResult?: boolean;
  shouldLogExecutionTime?: boolean;
  fieldsToMask?: string[];
  fieldsToRemove?: string[];
};

export type SerializeHandler = {
  condition: (value: unknown) => boolean;
  handler: (value: any, sanitize: (value: unknown) => unknown) => unknown;
};

export enum SerializationPlaceholder {
  CircularReference = '[CircularReference]',
  FilteredObject = '[FilteredObject]',
  MaskedValue = '***',
}
